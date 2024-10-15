<script lang="ts">
    import type { CartItem } from "$lib/types";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { authApi, checkoutApi, deleteCartItemApi, getCartItemsApi, updateCartItemApi } from "$lib/api";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Table from "$lib/components/ui/table";
    import { userStore } from "$lib/stores";
    import { formatCurrency } from "$lib/utils";
    import { CircleCheck, Coins } from "lucide-svelte";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import { onMount } from "svelte";

    let itemList: CartItem[] = [];
    let checkoutSuccess = false;
    let checkoutInfo: {
        refund: number
        totalPrice: number
        discount: number
        originalPrice: number
    } | null = null;

    async function refresh() {
        try {
            const response = await getCartItemsApi();
            itemList = response.cartItems;
            const url = new URL($page.url);
            url.searchParams.delete("refresh");
            await goto(`${url.pathname}?${url.searchParams.toString()}`);
        }
        catch (error: any) {
            console.error(error);
        }
    }

    $: needRefresh = $page.url.searchParams.get("refresh");
    $: if (needRefresh !== undefined) {
        refresh();
    }
    $: checkedProducts = itemList.filter(item => item.checked);
    $: totalPrice = checkedProducts.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

    const useCredits: {
        value: number
        label: string
    } = {
        value: 0,
        label: "0",
    };
    $: useCredits.value = Math.min(useCredits.value, Math.floor(totalPrice) * 10);

    async function checkout() {
        try {
            const result = await checkoutApi(useCredits.value);
            userStore.set(result.user);
            await refresh();
            checkoutSuccess = true;
            checkoutInfo = {
                refund: result.refund,
                discount: result.discount,
                totalPrice: result.totalPrice,
                originalPrice: result.originalPrice,
            };
        // toast.success(`Checkout successful! You earned ${result.refund} credits!`);
        }
        catch (error: any) {
            console.error(error);
        }
    }

    onMount(async () => {
        try {
            await authApi();
            await refresh();
        }
        catch (error: any) {
            console.error(error);
            await goto("/login");
        }
    });

    async function deleteItem(itemId: number) {
        try {
            await deleteCartItemApi(itemId);
            await refresh();
        }
        catch (error: any) {
            console.error(error);
        }
    }

    async function updateItem(itemId: number) {
        try {
            const item = itemList.find(item => item.id === itemId);
            if (item) {
                const result = await updateCartItemApi(itemId, item.quantity, item.checked);
                item.quantity = result.item.quantity;
                item.checked = result.item.checked;
            }
        }
        catch (error: any) {
            console.error(error);
        }
    }

</script>

<div class="p-3 flex-1 flex flex-col gap-3 overflow-y-hidden">
    <Card.Root class="overflow-y-hidden flex-1 flex flex-col">
        <Card.Header>
            <Card.Title>Items</Card.Title>
            <Card.Description>
                Manage your cart items here.
            </Card.Description>
        </Card.Header>

        <Card.Content class="flex-1 flex overflow-y-auto">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="hidden w-[50px] sm:table-cell">
                            <span class="sr-only">Choose</span>
                        </Table.Head>
                        <Table.Head class="hidden w-[120px] sm:table-cell">
                            <span class="sr-only">Image</span>
                        </Table.Head>
                        <Table.Head>Name</Table.Head>
                        <!--                        <Table.Head>Stock</Table.Head> -->
                        <Table.Head>Price</Table.Head>
                        <Table.Head class="hidden md:table-cell">
                            Quantity
                        </Table.Head>
                        <Table.Head class="hidden md:table-cell">
                            Subtotal
                        </Table.Head>
                        <Table.Head class="w-[50px]">
                            <span class="sr-only">Actions</span>
                        </Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each itemList as item}
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <div class="w-5 flex justify-center">
                                    <Checkbox bind:checked={item.checked} onCheckedChange={(checked) => {
                                        if (typeof checked === "boolean") {
                                            item.checked = checked;
                                            updateItem(item.id);
                                        }
                                    }} />
                                </div>
                            </Table.Cell>
                            <Table.Cell class="hidden sm:table-cell">
                                <img src={item.item.image} alt={item.item.name} class="size-20 object-cover" />
                            </Table.Cell>
                            <Table.Cell class="font-medium ">
                                <button class="cursor-pointer hover:underline underline-offset-4 transition-all"
                                        on:click|stopPropagation={() => {
                                            const url = new URL($page.url);
                                            url.searchParams.set("item", item.item.id.toString());
                                            goto(`${url.pathname}?${url.searchParams.toString()}`);
                                        }}>
                                    {item.item.name}
                                </button>
                            </Table.Cell>
                            <Table.Cell class="text-primary">{formatCurrency(item.item.price)}</Table.Cell>
                            <Table.Cell class="hidden md:table-cell">
                                <Input type="number" class="w-20" min={1} max={1000} bind:value={item.quantity} on:change={() => {
                                    updateItem(item.id);
                                }} />
                            </Table.Cell>
                            <Table.Cell class="hidden md:table-cell text-primary">{formatCurrency(item.item.price * item.quantity)}</Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                            builders={[builder]}
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label>Actions</DropdownMenu.Label>
                                        <DropdownMenu.Item>
                                            Move to archive
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item class="text-destructive" on:click={() => deleteItem(item.id)}>Delete</DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Content>
            <div class="flex items-end flex-col md:flex-row">
                <div class="flex gap-2 flex-col">
                    <Label class="text-lg font-semibold">
                        Use <span class="text-yellow-500"> credits </span> to get discount!
                    </Label>
                    <div class="flex items-center gap-2">

                        <Coins class="size-4 text-yellow-500 " />
                        <div class="flex items-center gap-1">
                            <Input type="number" bind:value={useCredits.value} step={10} min={0} max={Math.min(Math.floor(($userStore?.count ?? 0) / 10), totalPrice) * 10} class="w-20 h-7 text-yellow-500" />
                        </div>
                        <Label class="text-sm font-semibold">
                            Credits = <span class="text-yellow-500">{formatCurrency(useCredits.value / 10)}</span>
                        </Label>
                        <Button size="icon" class="h-5 text-xs"
                                on:click={() => {
                                    useCredits.value = Math.min(Math.floor(($userStore?.count ?? 0) / 10), totalPrice) * 10;
                                }}
                        >MAX</Button>
                    </div>
                </div>
                <div class="ml-auto flex items-center">
                    <Label class="text-lg font-semibold">Total Price: </Label>
                    <div class="flex items-end">
                        {#if useCredits.value !== 0}
                            <Label class="text-lg font-bold text-primary ml-2">{formatCurrency(totalPrice)}</Label>
                            <Label class="text-lg font-bold text-yellow-500 ml-2">- {formatCurrency(useCredits.value / 10)} =</Label>
                        {/if}
                        <Label class="text-2xl font-bold text-primary ml-2">{formatCurrency(totalPrice - useCredits.value / 10)}</Label>
                    </div>
                    <Button class="ml-6" on:click={checkout}> Checkout </Button>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>

<AlertDialog.Root bind:open={checkoutSuccess}>
    <AlertDialog.Content class="!w-auto">
        <AlertDialog.Header>
            <AlertDialog.Title>Checkout successful!</AlertDialog.Title>
            <AlertDialog.Description class="whitespace-pre-line text-base flex flex-col gap-3">
                <div class="grid grid-cols-2">
                    <div>Original Price:</div><span class="text-primary">{formatCurrency(checkoutInfo?.originalPrice ?? 0)}</span>
                    <div>Discount:</div><span class="text-primary"> {formatCurrency(checkoutInfo?.discount ?? 0)}</span>
                    <div>Total Price:</div><span class="text-primary">{formatCurrency(checkoutInfo?.totalPrice ?? 0)}</span>
                </div>
                <div>
                    You earned <span class="text-yellow-500">{checkoutInfo?.refund}</span> credits for this purchase!
                </div>
            </AlertDialog.Description>
        </AlertDialog.Header>
        <div class="w-full flex justify-center">
            <CircleCheck class="size-32 text-green-500" />
        </div>
        <AlertDialog.Footer class="w-full flex !justify-center">
            <AlertDialog.Action>Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
