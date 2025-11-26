export interface TrackedObject {
  id: string;
  x: number;
  y: number;
  direction: number;
}

export interface ApiObjectsResponse {
  serverTime: number;
  objects: TrackedObject[];
}
