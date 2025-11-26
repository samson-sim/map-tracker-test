import { makeAutoObservable, runInAction } from "mobx";
import type { ApiObjectsResponse, TrackedObject } from "../types";
import { fetchObjects } from "../api/client";

export type ObjectStatus = "active" | "lost" | "removed";

export interface ObjectWithMeta extends TrackedObject {
  status: ObjectStatus;
  lastSeen: number;
  lostAt?: number;
  removedAt?: number;
}

const LOST_REMOVE_MS = 5 * 60 * 1000;
const STORAGE_KEY = "objectStore_state";

export class ObjectStore {
  objects = new Map<string, ObjectWithMeta>();
  lastUpdate: number | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  pollingIntervalMs = 2000;

  private apiKey: string | null = null;
  private pollingId: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  get allObjects(): ObjectWithMeta[] {
    return Array.from(this.objects.values());
  }

  get activeObjects(): ObjectWithMeta[] {
    return this.allObjects.filter((o) => o.status === "active");
  }

  get lostObjects(): ObjectWithMeta[] {
    return this.allObjects.filter((o) => o.status === "lost");
  }

  get removedObjects(): ObjectWithMeta[] {
    return this.allObjects.filter((o) => o.status === "removed");
  }

  get visibleObjects(): ObjectWithMeta[] {
    return this.allObjects.filter((o) => o.status !== "removed");
  }

  setApiKey(key: string | null) {
    this.apiKey = key;
    if (!key) {
      this.stopPolling();
      this.reset();
    }
  }

  reset() {
    this.objects.clear();
    this.lastUpdate = null;
    this.error = null;
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      const state = {
        objects: Array.from(this.objects.entries()),
        lastUpdate: this.lastUpdate,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save objects to localStorage", e);
    }
  }

  private loadFromStorage() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        if (state.objects && Array.isArray(state.objects)) {
          this.objects = new Map(state.objects);
          this.lastUpdate = state.lastUpdate ?? null;

          this.cleanupLost();
        }
      }
    } catch (e) {
      console.warn("Failed to load objects from localStorage", e);
    }
  }

  startPolling(apiKey: string) {
    this.setApiKey(apiKey);
    this.stopPolling();

    this.loadOnce();

    this.pollingId = window.setInterval(() => {
      this.loadOnce();
      this.cleanupLost();
    }, this.pollingIntervalMs);
  }

  stopPolling() {
    if (this.pollingId !== null) {
      window.clearInterval(this.pollingId);
      this.pollingId = null;
    }
  }

  async loadOnce() {
    if (!this.apiKey) return;
    this.isLoading = true;
    this.error = null;

    try {
      const data: ApiObjectsResponse = await fetchObjects(this.apiKey);
      runInAction(() => {
        this.applySnapshot(data);
        this.isLoading = false;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.isLoading = false;
        this.error = e instanceof Error ? e.message : "Unknown error";
      });
    }
  }

  private applySnapshot(snapshot: ApiObjectsResponse) {
    const now = snapshot.serverTime ?? Date.now();
    this.lastUpdate = now;

    const incomingIds = new Set<string>();
    for (const obj of snapshot.objects) {
      incomingIds.add(obj.id);
      const existing = this.objects.get(obj.id);

      const merged: ObjectWithMeta = {
        ...(existing ?? {
          status: "active" as const,
          lastSeen: now,
        }),
        ...obj,
        status: "active",
        lastSeen: now,
        lostAt: undefined,
      };

      this.objects.set(obj.id, merged);
    }

    for (const [id, obj] of this.objects.entries()) {
      if (!incomingIds.has(id) && obj.status === "active") {
        obj.status = "lost";
        obj.lostAt = now;
        this.objects.set(id, obj);
      }
    }

    this.saveToStorage();
  }

  cleanupLost() {
    const now = Date.now();
    let changed = false;
    for (const [id, obj] of this.objects.entries()) {
      if (
        obj.status === "lost" &&
        obj.lostAt &&
        now - obj.lostAt > LOST_REMOVE_MS
      ) {
        obj.status = "removed";
        obj.removedAt = now;
        this.objects.set(id, obj);
        changed = true;
      }
    }

    if (changed) {
      this.saveToStorage();
    }
  }
}
