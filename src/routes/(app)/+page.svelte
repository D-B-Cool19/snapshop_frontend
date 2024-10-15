<script lang="ts">
    import type { Item } from "$lib/types";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { addToCartApi, getItemsApi } from "$lib/api";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import { userStore } from "$lib/stores";
    import { formatCurrency } from "$lib/utils";
    import { ShoppingCart } from "lucide-svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let itemList: Item[] = [];
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
            await refresh();
        }
        catch (error: any) {
            console.error(error);
            await goto("/login");
        }
    });

    async function addCart(item: Item) {
        if (!userStore) {
            goto("/login");
            return;
        }
        try {
            await addToCartApi(item.id, 1);
            toast.success(`Added ${item?.name} to cart!`);
            goto("/cart?refresh");
        }
        catch (error: any) {
            console.error(error);
            toast.error("Failed to add to cart!");
        }
    }
</script>

<div class="flex w-full flex-1 overflow-y-hidden">
    <div class="sticky border-r bg-background left-0 top-0 w-52 max-w-md p-4 flex flex-col gap-2">
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Show only </Label>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> On sale </Label>
            </div>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Price </Label>
            <RadioGroup.Root value="option-one">
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value="option-one" id="option-one" />
                    <Label for="option-one">Up to $100</Label>
                </div>
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value="option-two" id="option-two" />
                    <Label for="option-two">$100 - $500</Label>
                </div>
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value="option-three" id="option-three" />
                    <Label for="option-three">$500 - $1000</Label>
                </div>
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value="option-four" id="option-four" />
                    <Label for="option-four">Over $1000</Label>
                </div>
            </RadioGroup.Root>
            <div class="flex gap-2 items-center">
                <Input placeholder="$100" /> - <Input placeholder="$200" />
            </div>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Color </Label>
            <div class="flex gap-2 px-1 pb-2">
                <div class="rounded-full size-6 bg-black border"></div>
                <div class="rounded-full size-6 bg-blue-500 border"></div>
                <div class="rounded-full size-6 bg-amber-500 border"></div>
                <div class="rounded-full size-6 bg-green-500 border"></div>
            </div>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Brand </Label>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> NVIDIA </Label>
            </div>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Apple </Label>
            </div>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Xiaomi </Label>
            </div>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Huawei </Label>
            </div>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Lenovo </Label>
            </div>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Product rating </Label>
            <RadioGroup.Root class="flex gap-2 items-center">
                <RadioGroup.Item value="option-four" id="option-four" />
                <div class="flex gap-0.5 items-center text-primary">
                    {#each Array.from({ length: 5 }) as _, i (i)}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    {/each}
                </div>
            </RadioGroup.Root>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Condition </Label>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> New items </Label>
            </div>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Used items </Label>
            </div>
        </div>
        <div class="rounded-lg border p-2 flex flex-col gap-3">
            <Label class="text-base font-semibold"> Shipping </Label>
            <div class="flex gap-2 items-center">
                <Checkbox />
                <Label> Free shipping </Label>
            </div>
        </div>
    </div>
    <div class="p-6 pt-4 flex-1 overflow-y-auto">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">For You</h2>
        </div>
        <div class="flex flex-wrap gap-4 mt-3">
            {#each itemList as item}
                <Card.Root class="overflow-hidden hover:border-primary transition-all p-2 w-full max-w-xs flex flex-col" on:click={() => {
                    const url = new URL($page.url);
                    url.searchParams.set("item", item.id.toString());
                    goto(`${url.pathname}?${url.searchParams.toString()}`);
                }}>
                    <img src={item.image} alt="" class="w-full h-48 object-cover rounded-lg" />
                    <Card.Content class="px-2 py-3 flex flex-col gap-2 flex-1">
                        <div class="flex">
                            <Label class="text-xl font-bold">{item.name} </Label>
                            <Label class="text-primary text-xl ml-auto"> {formatCurrency(item.price)} </Label>
                        </div>
                        <Label class="text-muted-foreground text-xs whitespace-pre-line flex-1 line-clamp-3 text-left leading-relaxed">
                            {item.description}
                        </Label>
                        <Card.Footer class="flex p-0">
                            <Button class="ml-auto" on:click={(event) => {
                                event.stopPropagation();
                                addCart(item);
                            }}>
                                <ShoppingCart class="size-5 mr-2" /> Add to cart
                            </Button>
                        </Card.Footer>
                    </Card.Content>

                </Card.Root>
            {/each}
        </div>
    </div>
</div>
