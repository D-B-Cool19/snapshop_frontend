<script lang="ts">
    import type { ThemeColor, ThemeMode } from "$lib/types";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Slider } from "$lib/components/ui/slider/index.js";
    import { setFontSize, setThemeColor, setThemeMode } from "$lib/config";
    import { configStore } from "$lib/stores";
    import { cn } from "$lib/utils";

    const themeMapping = {
        dark: "Dark",
        light: "Light",
        system: "System",
    };

    let theme: {
        value: ThemeMode
        label: string
    } = {
        value: $configStore.themeMode,
        label: themeMapping[$configStore.themeMode],
    };
    $: if (theme) {
        setThemeMode(theme.value);
    }

    const themeColors: ThemeColor[] = [
        "orange",
        "zinc",
        "slate",
        "red",
        "green",
        "blue",
        "purple",
        "yellow",
        "rose",
    ];

    const colorNameMapping = {
        zinc: "Zinc",
        slate: "Slate",
        orange: "Orange",
        red: "Red",
        blue: "Blue",
        green: "Green",
        purple: "Purple",
        yellow: "Yellow",
        rose: "Rose",
    };

    const colorMapping = {
        zinc: "hsl(240 5.9% 10%)",
        slate: "hsl(215.4 16.3% 46.9%)",
        orange: "hsl(24.6 95% 53.1%)",
        red: "hsl(0 72.2% 50.6%)",
        blue: "hsl(214.6 100% 50.6%)",
        green: "hsl(122.6 39.3% 49.8%)",
        purple: "hsl(281.6 100% 50.6%)",
        yellow: "hsl(48.6 100% 50.6%)",
        rose: "hsl(348.6 100% 50.6%)",
    };

    let fontSize = [$configStore.fontSize];

    $: if (fontSize) {
        setFontSize(fontSize[0]);
    }
</script>

<div class="flex w-full flex-col flex-1">
    <main
        class="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
    >
        <div class="mx-auto grid w-full max-w-6xl gap-2">
            <h1 class="text-3xl font-semibold">Settings</h1>
        </div>
        <div
            class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
        >
            <nav class="text-muted-foreground grid gap-4 text-sm"

                 data-x-chunk-container="chunk-container after:right-0">
                <a href="##" class="text-primary font-semibold"> General </a>
                <a href="##">Security</a>
                <a href="##">Integrations</a>
                <a href="##">Support</a>
                <a href="##">Organizations</a>
                <a href="##">Advanced</a>
            </nav>
            <div class="grid gap-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Adjust Theme Color</Card.Title>
                        <Card.Description>
                            Adjust the theme color for better visibility and accessibility.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <Label class="font-bold"> Theme Mode: </Label>
                            <Select.Root bind:selected={theme}>
                                <Select.Trigger class="w-[180px]">
                                    <Select.Value placeholder="Theme" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="light">Light</Select.Item>
                                    <Select.Item value="dark">Dark</Select.Item>
                                    <Select.Item value="system">System</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label class="font-bold"> Theme Color: </Label>
                            <div class="flex gap-2 flex-wrap">
                                {#each themeColors as color}
                                    <div style={`--theme-color: ${colorMapping[color]}`}>
                                        <Button size="sm" variant="outline" class={cn("w-24 gap-2", $configStore.themeColor === color && "border-primary")}
                                                on:click={() => setThemeColor(color)}>
                                            <div class="flex-shrink-0 size-5 rounded-full bg-[--theme-color]"></div>
                                            <Label> {colorNameMapping[color]} </Label>
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </Card.Content>
                </Card.Root>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Adjust Font Size</Card.Title>
                        <Card.Description>
                            Adjust the font size for better visibility and accessibility.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content>
                        <div class="w-full flex gap-4 items-center">
                            <Label class="text-sm font-bold mb-4"> Smaller </Label>
                            <div class="flex flex-col flex-1 gap-2">
                                <Slider bind:value={fontSize} min={13} max={22} step={1} />
                                <div class="w-full flex justify-between h-2">
                                    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as size}
                                        <Separator orientation="vertical" />
                                    {/each}
                                </div>
                            </div>
                            <Label class="text-xl font-bold mb-4"> Larger </Label>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    </main>
</div>
