import type { User } from "$lib/types";
import { writable } from "svelte/store";

export type Token = string | null;

function getPersistedUser(): User | null {
    if (typeof localStorage !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
}

function getPersistedToken(): Token {
    if (typeof document !== "undefined") {
        const tokenMatch = document.cookie.match(/(^| )token=([^;]+)/);
        return tokenMatch ? tokenMatch[2] : null;
    }
    return null;
}

function persistUser() {
    const userStore = writable<User | null>(getPersistedUser());
    userStore.subscribe((value) => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("user", JSON.stringify(value));
        }
    });
    return userStore;
}

function persistToken() {
    const tokenStore = writable<Token>(getPersistedToken());
    tokenStore.subscribe((value) => {
        if (typeof document !== "undefined") {
            if (value !== null) {
                document.cookie = `token=${value}; path=/; max-age=${7 * 24 * 60 * 60}; Secure; SameSite=Strict`;
            }
            else {
                document.cookie = "token=; Max-Age=0; path=/";
            }
        }
    });
    return tokenStore;
}

export const userStore = persistUser();
export const tokenStore = persistToken();
