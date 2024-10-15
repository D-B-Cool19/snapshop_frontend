import type { Config, ThemeColor, Token, User } from "$lib/types";
import { writable } from "svelte/store";

function getPersistedUser(): User | null {
    if (typeof localStorage !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
}

export function getPersistedToken(): Token {
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
                // axios.defaults.headers.common.Authorization = `Bearer ${value}`;
            }
            else {
                document.cookie = "token=; Max-Age=0; path=/";
                // delete axios.defaults.headers.common.Authorization;
            }
        }
    });
    return tokenStore;
}

const themeColors: ThemeColor[] = ["zinc", "slate", "orange", "red", "blue", "green", "purple", "yellow", "rose"];

const defaultConfig: Config = {
    themeMode: "system",
    themeColor: "orange",
    fontSize: 16,
};

function listenToSystemThemeChanges(callback: (isDark: boolean) => void) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
        callback(event.matches);
    };

    callback(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
}

function updateRootClasses(config: Config) {
    const root = document.documentElement;
    root.classList.forEach((cls) => {
        if ((themeColors as string[]).includes(cls)) {
            root.classList.remove(cls);
        }
    });
    root.classList.add(config.themeColor);

    if (config.themeMode === "dark") {
        root.classList.add("dark");
    }
    else if (config.themeMode === "light") {
        root.classList.remove("dark");
    }
    else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
    }

    root.style.fontSize = `${config.fontSize}px`;
}

function getPersistedConfig(): Config {
    if (typeof localStorage !== "undefined") {
        const storedConfig = localStorage.getItem("config");
        return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
    }
    return defaultConfig;
}

function persistConfig() {
    const configStore = writable<Config>(getPersistedConfig());
    let removeListener: (() => void) | null = null;

    configStore.subscribe((config) => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("config", JSON.stringify(config));
        }
        if (typeof document !== "undefined") {
            updateRootClasses(config);

            if (config.themeMode === "system") {
                if (!removeListener) {
                    removeListener = listenToSystemThemeChanges((isDark) => {
                        configStore.update((cfg) => {
                            if (cfg.themeMode === "system") {
                                updateRootClasses(cfg);
                            }
                            return cfg;
                        });
                    });
                }
            }
            else if (removeListener) {
                removeListener();
                removeListener = null;
            }
        }
    });
    return configStore;
}

export const configStore = persistConfig();
export const userStore = persistUser();
export const tokenStore = persistToken();
