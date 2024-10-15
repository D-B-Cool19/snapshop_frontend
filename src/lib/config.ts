import type { ThemeColor, ThemeMode } from "./types";
import { configStore } from "$lib/stores";

export function setThemeColor(color: ThemeColor) {
    configStore.update((config) => {
        config.themeColor = color;
        return config;
    });
}

export function setThemeMode(mode: ThemeMode) {
    configStore.update((config) => {
        config.themeMode = mode;
        return config;
    });
}

export function setFontSize(size: number) {
    configStore.update((config) => {
        config.fontSize = size;
        return config;
    });
}
