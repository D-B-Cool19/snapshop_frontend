<script lang="ts">
    import { goto } from "$app/navigation";
    import { loginApi, loginWithFaceApi, uploadFaceEmbeddingApi } from "$lib/api";
    import fig3 from "$lib/assets/image/fig2.png";
    import Camera from "$lib/components/camera.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { token as tokenStore, user as userStore } from "$lib/stores";
    import { cn } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import { Camera as CameraIcon, Key } from "lucide-svelte";
    import { tick } from "svelte";

    let useCamera = false;
    let detectNumber = 0;
    let camera: Camera | null = null;
    let userEmbedding: number[] | null = null;
    let errorMessage: string | null = null;
    let isLogin = false;

    async function sendFaceImg(): Promise<void> {
        if (!camera)
            return;
        const imageBlob = await camera.capture();
        if (!imageBlob)
            return;
        try {
            const result = await uploadFaceEmbeddingApi(imageBlob);
            const embeddings = result.embeddings;
            detectNumber = embeddings.length;
            if (detectNumber === 1) {
                userEmbedding = embeddings[0].faceEmbedding;
            }
            else {
                userEmbedding = null;
            }
        }
        catch (error) {
            console.error("Error uploading face image:", error);
        }
    }

    async function handleCameraStart() {
        await tick();
        await camera?.startCamera();
        camera?.bindInterval(sendFaceImg, 1000);
    }

    async function handleCameraStop() {
        console.log("Stop camera");
        camera?.stopCamera();
    }

    $: if (useCamera) {
        handleCameraStart();
        errorMessage = null;
    }
    else {
        handleCameraStop();
        errorMessage = null;
    }

    async function login(event: Event) {
        if (useCamera) {
            if (!userEmbedding) {
                errorMessage = "Please make sure your face is clearly visible in the camera.";
                return;
            }
            try {
                const result = await loginWithFaceApi(userEmbedding);
                if (result.loginInfo) {
                    const { user, token } = result.loginInfo;
                    userStore.set(user);
                    tokenStore.set(token);
                    isLogin = true;
                // await goto("/");
                }
                else if (result.similarUsers) {
                    errorMessage = "Multiple faces found. Please try again.";
                }
                else {
                    errorMessage = "No matching face found. Please try again.";
                }
            }
            catch (error: any) {
                errorMessage = "No matching face found. Please try again.";
            }
        }
        else if (!useCamera) {
            const form = event.target as HTMLFormElement;
            const formData = new FormData(form);
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            try {
                const result = await loginApi(username, password);
                userStore.set(result.user);
                tokenStore.set(result.token);
                isLogin = true;
            // await goto("/");
            }
            catch (error: any) {
                errorMessage = "Please check your email, Snap ID, and password.";
            }
        }
    }
</script>

<div class="flex w-full h-full overflow-hidden items-center justify-center">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] w-[110%]">
        <img class="w-full h-full blur-md" src={fig3} alt="" />
    </div>
    <Card.Root class="z-10 mx-auto w-full max-w-sm shadow-lg bg-card/75">
        {#if !isLogin}
            <Card.Header>
                <Card.Title class="text-2xl">
                    Login
                </Card.Title>
                <Card.Description>
                    {#if !isLogin}
                        {useCamera
                            ? "Please make sure your face is clearly visible in the camera."
                            : "Enter your email or Snap ID and password to login."}
                    {/if}
                </Card.Description>
            </Card.Header>
        {/if}
        <Card.Content>
            <div use:autoAnimate>
                {#if isLogin}
                    <div class="grid gap-8">
                        <div class="text-center text-2xl font-bold">Welcome back, {$userStore?.username}.</div>
                        <div class="w-full flex items-center justify-center">
                            <img class="w-52 h-52 object-cover rounded-full transition-all ring-offset-4 ring-green-500 ring-4" src={$userStore?.faceImgUrl} alt="" />
                        </div>
                        <Button class="w-full" on:click={() => goto("/")}> Enter </Button>
                    </div>
                {:else}
                    <form class="grid gap-4" use:autoAnimate on:submit|preventDefault={login}>
                        {#if useCamera}
                            <div use:autoAnimate class="relative w-full h-full flex items-center justify-center flex-col gap-4">
                                <Camera bind:this={camera} class={cn("w-52 h-52 object-cover rounded-full transition-all ring-offset-4 ring-primary ring-2", detectNumber === 1 && userEmbedding?.length === 512 && "ring-green-500 ring-4", (detectNumber > 1 || userEmbedding?.length !== 512) && "ring-red-500")} />
                                <Label class={cn(detectNumber === 1 && userEmbedding?.length && "text-green-500", (detectNumber > 1 || userEmbedding?.length !== 512) && "text-red-500", "transition-all")}>
                                    {(() => {
                                        if (detectNumber === 1) {
                                            if (userEmbedding?.length === 512) {
                                                return "Face Detected";
                                            }
                                            else {
                                                return "Face Embedding Not Found";
                                            }
                                        }
                                        else if (detectNumber > 1) {
                                            return "Multiple Faces Detected";
                                        }
                                        else {
                                            return "No Face Detected";
                                        }
                                    })()}
                                </Label>
                            </div>
                        {:else}
                            <div class="grid gap-2">
                                <Label for="username"> Email or Snap ID </Label>
                                <Input id="username" type="username" name="username" required />
                            </div>
                            <div class="grid gap-2">
                                <div class="flex items-center">
                                    <Label for="password">Password</Label>
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                        {/if}
                        {#if errorMessage}
                            <Label class="text-destructive"> {errorMessage} </Label>
                        {/if}
                        <Button type="submit" class="w-full" disabled={useCamera && (detectNumber !== 1 || userEmbedding?.length !== 512)}>Login</Button>
                        {#if useCamera}
                            <Button variant="outline" class="w-full space-x-2" on:click={() => useCamera = false}>
                                <Key class="size-4" />
                                <div>
                                    Login with Password
                                </div>
                            </Button>
                        {:else}
                            <Button variant="outline" class="w-full space-x-2" on:click={() => useCamera = true}>
                                <CameraIcon class="size-4" />
                                <div>
                                    Login with Camera
                                </div>
                            </Button>
                        {/if}
                    </form>
                    <div class="mt-4 text-center text-sm">
                        Don&apos;t have an account?
                        <a href="/register" class="underline"> Register </a>
                    </div>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
