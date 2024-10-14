<script lang="ts">
    import { page } from "$app/stores";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { tokenStore, userStore } from "$lib/stores";
    import { cn } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import { Aperture, CircleHelp, ClipboardList, History, House, ShoppingCart, UsersRound } from "lucide-svelte";

    const sidebarItems = [
        { label: "Home", icon: House, href: "/" },
        { label: "Cart", icon: ShoppingCart, href: "/cart" },
        { label: "History", icon: History, href: "/history" },
        { label: "Order", icon: ClipboardList, href: "/order" },
        { label: "Profile", icon: UsersRound, href: "/profile" },
        { label: "Help", icon: CircleHelp, href: "/help" },
    ];
</script>

<div class="overflow-auto h-full w-full bg-secondary" use:autoAnimate>
    <header class="bg-background py-2 flex items-center px-4 border-b">
        <div class="flex items-center gap-1.5 text-primary">
            <Aperture class="size-5" strokeWidth={2.5} />
            <Label class="text-center text-xl font-bold font-sans"> SnapShop </Label>
        </div>

        <div class="flex space-x-2 ml-6">
            {#each sidebarItems as item}
                <a href={item.href} class={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "gap-1.5 flex text-muted-foreground hover:text-primary hover:bg-transparent transition-all",
                    item.href === $page.url.pathname && "text-primary bg-muted hover:bg-muted",
                )}>
                    <svelte:component this={item.icon} class="size-5" />
                    <div class="text-sm"> {item.label} </div>
                </a>
            {/each}
        </div>
        <div class="ml-auto flex items-center gap-3">
            {#if $userStore}
                <Label>Hello, {$userStore.username}!</Label>
                <Button variant="secondary" on:click={() => {
                    userStore.set(null);
                    localStorage.removeItem("user");
                    tokenStore.set(null);
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }}> Logout </Button>
            {:else}
                <Label>Hello, guest!</Label>
                <a href="/login" class={buttonVariants({ variant: "default" })}>
                    Login
                </a>
                <a href="/register" class={buttonVariants({ variant: "secondary" })}>
                    Register
                </a>
            {/if}
        </div>
    </header>
    <slot />
</div>
