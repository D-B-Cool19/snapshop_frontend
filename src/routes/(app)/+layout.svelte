<script lang="ts">
    import type { ItemDetail } from "$lib/types";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { addToCartApi, getItemDetailApi, getUserApi } from "$lib/api";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { tokenStore, userStore } from "$lib/stores";
    import { cn, formatCurrency } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import {
        Aperture,
        Coins,
        House,
        LockKeyhole,
        LogIn,
        LogOut,
        Settings,
        ShoppingCart,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    const sidebarItems = [
        { label: "Home", icon: House, href: "/", roles: [0, 1] },
        { label: "Cart", icon: ShoppingCart, href: "/cart", roles: [0, 1] },
        // { label: "Order", icon: ClipboardList, href: "/order", roles: [0, 1] },
        // { label: "Profile", icon: UsersRound, href: "/profile", roles: [0, 1] },
        { label: "Setting", icon: Settings, href: "/setting", roles: [0, 1] },
        { label: "Admin", icon: LockKeyhole, href: "/admin", roles: [1] },
    ];

    let item: string | null = null;
    let itemDetail: ItemDetail | null = null;
    let quantity = 1;

    async function getItemDetail() {
        if (!item)
            return;
        try {
            itemDetail = null;
            const result = await getItemDetailApi(Number.parseInt(item));
            itemDetail = result.item;
            quantity = 1;
        }
        catch (error: any) {
            console.error(error);
        }
    }

    $: item = $page.url.searchParams.get("item");
    $: if (item) {
        getItemDetail();
    }

    function logout() {
        userStore.set(null);
        localStorage.removeItem("user");
        tokenStore.set(null);
        goto("/");
    }

    onMount(async () => {
        try {
            const result = await getUserApi();
            console.log(result);
            userStore.set(result.user);
        }
        catch (error: any) {
            console.error(error);
            logout();
        }
    });

    async function addCart() {
        if (!itemDetail)
            return;
        if (!userStore) {
            goto("/login");
            return;
        }
        try {
            await addToCartApi(itemDetail.id, quantity);
            toast.success(`Added ${itemDetail?.name} to cart!`);
            goto("/cart?refresh");
        }
        catch (error: any) {
            console.error(error);
            toast.error("Failed to add to cart!");
        }
    }
</script>

<div class="overflow-auto h-full w-full bg-secondary flex flex-col transition-all" use:autoAnimate>
    <header class="bg-background z-20 py-2 flex items-center px-4 border-b sticky top-0">
        <a href="/" class="flex items-center gap-1.5 text-primary">
            <Aperture class="size-5" strokeWidth={2.5} />
            <Label class="text-center text-xl font-bold font-sans"> SnapShop </Label>
        </a>

        <div class="flex space-x-2 ml-6">
            {#each sidebarItems as item}
                {#if item.roles.includes($userStore?.role ?? 0)}
                    <a href={item.href} class={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "gap-1.5 flex text-muted-foreground hover:text-primary hover:bg-transparent transition-all",
                        item.href === $page.url.pathname && "text-primary bg-muted hover:bg-muted",
                    )}>
                        <svelte:component this={item.icon} class="size-5" />
                        <div class="text-sm"> {item.label} </div>
                    </a>
                {/if}
            {/each}
        </div>
        <div class="ml-auto flex items-center gap-3">
            {#if $userStore}
                <Label>
                    Hello, {$userStore.username}!
                </Label>

                <Tooltip.Root openDelay={0}>
                    <Tooltip.Trigger>
                        <div class="flex gap-2 text-yellow-500 border border-yellow-500 rounded-lg p-1.5 items-center">
                            <Coins class="size-4" />
                            <Label> {$userStore.count}</Label>
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Your Credits
                    </Tooltip.Content>
                </Tooltip.Root>
                <Tooltip.Root openDelay={0}>
                    <Tooltip.Trigger>
                        <Button variant="outline" size="icon" class="size-8 text-primary" on:click={logout}>
                            <LogOut class="size-4" />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        Logout
                    </Tooltip.Content>
                </Tooltip.Root>

            {:else}
                <Label>Hello, guest!</Label>
                <Tooltip.Root openDelay={0}>
                    <Tooltip.Trigger>
                        <a href="/login" class={cn(buttonVariants({ variant: "default", size: "icon" }), "size-8")}>
                            <LogIn class="size-4" />
                        </a></Tooltip.Trigger>
                    <Tooltip.Content>
                        Login
                    </Tooltip.Content>
                </Tooltip.Root>
            {/if}
        </div>
    </header>
    <slot />

    <Dialog.Root open={item} onOpenChange={(open) => {
        if (!open) {
            const url = new URL($page.url);
            url.searchParams.delete("item");
            goto(`${url.pathname}?${url.searchParams.toString()}`);
        }
    }}
    >
        <Dialog.Content class="max-w-screen-lg h-[600px]">
            {#if itemDetail}
                <div class="flex">
                    <div class="flex-1 self-center">
                        <Carousel.Root class="w-full">
                            <Carousel.Content>
                                {#each itemDetail.images as image}
                                    <Carousel.Item>
                                        <img src={image} alt={itemDetail.name} class="w-full h-96 object-cover rounded-md" />
                                    </Carousel.Item>
                                {/each}
                            </Carousel.Content>
                            <Carousel.Previous class="left-5" />
                            <Carousel.Next class="right-5" />
                        </Carousel.Root>
                    </div>
                    <div class="flex-1 p-5 flex flex-col h-full max-h-full">
                        <Label class="text-3xl font-bold">{itemDetail.name}</Label>
                        <div class="w-full flex items-center mt-4">
                            <Label class="text-primary text-2xl font-bold flex-1">
                                {formatCurrency(itemDetail.price)}
                            </Label>

                            <div class="flex text-primary">
                                {#each Array.from({ length: 5 }) as _, i (i)}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={i < itemDetail.rate ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                {/each}
                            </div>
                            <Separator orientation="vertical" class="mx-2" />
                            <Label class="text-muted-foreground"> {itemDetail.reviews} Reviews </Label>
                        </div>
                        <Tabs.Root value="description" class="w-full mt-2 h-52 max-h-52 flex flex-col overflow-y-hidden">
                            <div class="flex">
                                <Tabs.List class="flex-grow-0 flex-shrink-0">
                                    <Tabs.Trigger value="description" class="text-xs">Description</Tabs.Trigger>
                                    <Tabs.Trigger value="features" class="text-xs">Features</Tabs.Trigger>
                                </Tabs.List>
                                <div class="flex-1"></div>
                            </div>
                            <Tabs.Content value="description" class=" mt-1 overflow-y-auto">
                                <Label class="text-xs whitespace-pre-wrap">{itemDetail.description}</Label>
                            </Tabs.Content>
                            <Tabs.Content value="features" class="mt-1 overflow-y-auto">
                                <Label class="text-xs whitespace-pre-wrap">{itemDetail.features}</Label>
                            </Tabs.Content>
                        </Tabs.Root>
                        <div class="w-full flex items-center my-4">
                            <div class="flex gap-3 items-center">
                                <Button size="icon" class="rounded-full size-8" on:click={() => {
                                    quantity = Math.max(1, quantity - 1);
                                }}>-</Button>
                                <Label class="text-primary min-w-4 text-center">{quantity}</Label>
                                <Button size="icon" class="rounded-full size-8" on:click={() => {
                                    quantity = Math.min(1000, quantity + 1);
                                }}>+</Button>
                            </div>
                            <Button size="lg" class="gap-2 font-bold ml-auto" on:click={addCart}>
                                <ShoppingCart class="size-5" />
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </div>

            {/if}
        </Dialog.Content>
    </Dialog.Root>
</div>
