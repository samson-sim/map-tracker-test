import { makeAutoObservable } from "mobx";

export class AuthStore {
  apiKey: string | null = null;
  isChecking: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);

    const stored = window.localStorage.getItem("apiKey");
    if (stored) {
      this.apiKey = stored;
    }
  }

  get isAuthenticated() {
    return !!this.apiKey;
  }

  setApiKey(key: string | null) {
    this.apiKey = key;
    if (key) {
      window.localStorage.setItem("apiKey", key);
    } else {
      window.localStorage.removeItem("apiKey");
    }
  }

  setError(message: string | null) {
    this.error = message;
  }

  setIsChecking(value: boolean) {
    this.isChecking = value;
  }

  logout() {
    this.setApiKey(null);
  }
}
