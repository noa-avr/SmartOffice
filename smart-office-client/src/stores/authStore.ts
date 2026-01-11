import { makeAutoObservable } from "mobx";

class AuthStore {
    token: string | null = null;
    role: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(token: string, role: string) {
        this.token = token;
        this.role = role;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
    }

    logout() {
        this.token = null;
        this.role = null;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    get isAdmin() {
        return this.role === "Admin";
    }
}

export const authStore = new AuthStore();