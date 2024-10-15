<script lang="ts">
    import { goto } from "$app/navigation";

    import { page } from "$app/stores";

    import { addItemApi, deleteItemApi, getItemDetailApi, getItemsApi, getUserApi, updateItemApi } from "$lib/api";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Table from "$lib/components/ui/table";
    import { Textarea } from "$lib/components/ui/textarea";
    import { type Item, type ItemDetail } from "$lib/types";

    import { formatCurrency } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import { Plus, X } from "lucide-svelte";
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let itemList: Item[] = [];
    let input: HTMLInputElement | null = null;

    async function refresh() {
        try {
            const result = await getItemsApi();
            itemList = result.items;
            itemList.sort((a, b) => a.id - b.id);
        }
        catch (error: any) {
            console.error(error);
        }
    }

    onMount(async () => {
        try {
            const result = await getUserApi();
            const user = result.user;
            if (user.role !== 1) {
                await goto("/");
            }
            await refresh();
        }
        catch (error: any) {
            console.error(error);
            await goto("/login");
        }
    });

    async function deleteItem(id: number) {
        try {
            await deleteItemApi(id);
            await refresh();
        }
        catch (error: any) {
            console.error(error);
        }
    }

    let item: string | null = null;
    let itemDetail: ItemDetail | null = null;
    let images: Blob[] = [];
    let openAddDialog = false;
    let addItem: {
        name: string
        price: number
        description: string
        features: string
    };

    async function getItemDetail() {
        if (!item)
            return;
        try {
            itemDetail = null;
            const result = await getItemDetailApi(Number.parseInt(item));
            itemDetail = result.item;
            images = [];
            for (const image of itemDetail.images) {
                images = [...images, await fetch(image).then(response => response.blob())];
            }
        }
        catch (error: any) {
            console.error(error);
        }
    }

    $: item = $page.url.searchParams.get("edit-item");
    $: if (item) {
        getItemDetail();
    }

    $: if (openAddDialog) {
        images = [];
        addItem = {
            name: "",
            price: 0,
            description: "",
            features: "",
        };
    }

    async function update() {
        if (!itemDetail)
            return;
        try {
            await updateItemApi(itemDetail.id, itemDetail.name, itemDetail.price, images, itemDetail.description, itemDetail.features);
            const url = new URL($page.url);
            url.searchParams.delete("edit-item");
            await goto(`${url.pathname}?${url.searchParams.toString()}`);
            await refresh();
            toast.success("Item updated successfully.");
        }
        catch (error: any) {
            console.error(error);
        }
    }

    async function add() {
        try {
            await addItemApi(addItem.name, addItem.price, images, addItem.description, addItem.features);
            openAddDialog = false;
            await refresh();
            toast.success("Item added successfully.");
        }
        catch (error: any) {
            console.error(error);
        }
    }

    function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            for (const file of target.files) {
                images = [...images, file];
            }
        }
    }

</script>

<div class="flex-1 flex p-3 gap-3">
    <Card.Root class="overflow-y-hidden flex-1 flex flex-col">
        <Card.Header>
            <Card.Title>Items</Card.Title>
            <Card.Description>
                Manage items visible to users.
            </Card.Description>
        </Card.Header>

        <Card.Content class="flex-1 flex overflow-y-auto">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="hidden sm:table-cell">
                            ID
                        </Table.Head>
                        <Table.Head class="hidden sm:table-cell">
                            Image
                        </Table.Head>
                        <Table.Head>Name</Table.Head>
                        <Table.Head>Price</Table.Head>
                        <Table.Head>
                            <span class="sr-only">Actions</span>
                        </Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each itemList as item}
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                {item.id}
                            </Table.Cell>
                            <Table.Cell class="hidden sm:table-cell">
                                <img src={item.image} alt={item.name} class="size-20 object-cover" />
                            </Table.Cell>
                            <Table.Cell class="font-medium ">
                                <button class="cursor-pointer hover:underline underline-offset-4 transition-all"
                                        on:click|stopPropagation={() => {
                                            const url = new URL($page.url);
                                            url.searchParams.set("item", item.id.toString());
                                            goto(`${url.pathname}?${url.searchParams.toString()}`);
                                        }}>
                                    {item.name}
                                </button>
                            </Table.Cell>
                            <Table.Cell class="text-primary">{formatCurrency(item.price)}</Table.Cell>
                            <Table.Cell class="hidden md:table-cell">
                            </Table.Cell>
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
                                        <DropdownMenu.Item on:click={() => {
                                            const url = new URL($page.url);
                                            url.searchParams.set("edit-item", item.id.toString());
                                            goto(`${url.pathname}?${url.searchParams.toString()}`);
                                        }}>
                                            Edit
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
        <Card.Footer>
            <Button
                class="w-full"
                on:click={() => openAddDialog = true}
            >
                Add Item
            </Button>
        </Card.Footer>
    </Card.Root>
    <Card.Root class="flex-1">
        <Card.Header>
            <Card.Title>User</Card.Title>
            <Card.Description>
                View user's public information.
            </Card.Description>
        </Card.Header>
    </Card.Root>
</div>

<Dialog.Root bind:open={openAddDialog}>
    <Dialog.Content class="max-w-screen-sm flex flex-col">

        <Dialog.Header>
            <Dialog.Title>Add Item</Dialog.Title>
            <Dialog.Description>
                Add a new item to the store.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex-1 flex flex-col h-full gap-4">
            <div class="flex flex-col gap-2">
                <Label class="font-bold">Item Name</Label>
                <Input bind:value={addItem.name} />
            </div>
            <div class="flex flex-col gap-2">
                <Label class="font-bold">Price</Label>
                <div class="flex gap-1 items-center">
                    <Label class="px-1 text-base font-bold">$</Label>
                    <Input type="number" min={0.01} max={1000000} step={0.01} bind:value={addItem.price} />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Description</Label>
                    <Textarea rows={6} class="resize-none" bind:value={addItem.description} />
                </div>
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Features</Label>
                    <Textarea rows={6} class="resize-none" bind:value={addItem.features} />
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <Label class="font-bold">Images</Label>
                <div class="flex gap-2 p-2 border rounded-lg flex-wrap" use:autoAnimate>
                    {#each images as image}
                        <div class="size-20 relative">
                            <img src={URL.createObjectURL(image)} alt={addItem.name} class="rounded-lg border size-20 object-cover" />
                            <Button size="icon" variant="outline" class="absolute -top-1.5 -right-1.5 rounded-full size-4"
                                    on:click={() => {
                                        images = images.filter(i => i !== image);
                                    }}>
                                <X class="size-3" />
                            </Button>
                        </div>
                    {/each}

                    <div class="h-20 w-16 flex items-center justify-center">
                        <Button size="icon" on:click={() => {
                            input?.click();
                        }}>
                            <Plus />
                        </Button>
                        <input bind:this={input} type="file" accept="image/*" multiple on:change={handleImageUpload} class="hidden" />
                    </div>
                </div>
            </div>
        </div>
        <Dialog.Footer>
            <Button on:click={add}>Add</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root open={item} onOutsideClick={() => {
    const url = new URL($page.url);
    url.searchParams.delete("edit-item");
    goto(`${url.pathname}?${url.searchParams.toString()}`);
}}
>
    <Dialog.Content class="max-w-screen-sm flex flex-col">

        <Dialog.Header>
            <Dialog.Title>Edit Item</Dialog.Title>
            <Dialog.Description>
                Edit item details.
            </Dialog.Description>
        </Dialog.Header>
        {#if itemDetail}
            <div class="flex-1 flex flex-col h-full gap-4">
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Item ID</Label>
                    <Input value={itemDetail.id} disabled />
                </div>
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Item Name</Label>
                    <Input bind:value={itemDetail.name} />
                </div>
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Price</Label>
                    <div class="flex gap-1 items-center">
                        <Label class="px-1 text-base font-bold">$</Label>
                        <Input type="number" min={0.01} max={1000000} step={0.01} bind:value={itemDetail.price} />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                        <Label class="font-bold">Description</Label>
                        <Textarea rows={6} class="resize-none" bind:value={itemDetail.description} />
                    </div>
                    <div class="flex flex-col gap-2">
                        <Label class="font-bold">Features</Label>
                        <Textarea rows={6} class="resize-none" bind:value={itemDetail.features} />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <Label class="font-bold">Images</Label>
                    <div class="flex gap-2 p-2 border rounded-lg flex-wrap" use:autoAnimate>
                        {#each images as image}
                            <div class="size-20 relative">
                                <img src={URL.createObjectURL(image)} alt={itemDetail.name} class="rounded-lg border size-20 object-cover" />
                                <Button size="icon" variant="outline" class="absolute -top-1.5 -right-1.5 rounded-full size-4"
                                        on:click={() => {
                                            images = images.filter(i => i !== image);
                                        }}>
                                    <X class="size-3" />
                                </Button>
                            </div>
                        {/each}

                        <div class="h-20 w-16 flex items-center justify-center">
                            <Button size="icon" on:click={() => {
                                input?.click();
                            }}>
                                <Plus />
                            </Button>
                            <input bind:this={input} type="file" accept="image/*" multiple on:change={handleImageUpload} class="hidden" />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog.Footer>
                <Button on:click={update}>Save</Button>
            </Dialog.Footer>
        {/if}
    </Dialog.Content>
</Dialog.Root>
