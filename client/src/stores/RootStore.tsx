import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";
import { AuthStore } from "./AuthStore";
import { ObjectStore } from "./ObjectStore";

export class RootStore {
  authStore: AuthStore;
  objectStore: ObjectStore;

  constructor() {
    this.authStore = new AuthStore();
    this.objectStore = new ObjectStore();

    if (this.authStore.apiKey) {
      this.objectStore.startPolling(this.authStore.apiKey);
    }
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [store] = useState(() => new RootStore());

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
};

export function useRootStore(): RootStore {
  const ctx = useContext(RootStoreContext);
  if (!ctx) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return ctx;
}

export function useStores() {
  const root = useRootStore();
  return {
    authStore: root.authStore,
    objectStore: root.objectStore,
  };
}
