<script context="module" lang="ts">
    declare let ImageCapture: {
        new(videoTrack: MediaStreamTrack): {
            takePhoto(): Promise<Blob>
        }
    };
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import { isEmailAvailableApi, isUsernameAvailableApi, loginApi, registerApi, uploadFaceEmbeddingApi } from "$lib/api";
    import fig3 from "$lib/assets/image/fig3.png";
    import Camera from "$lib/components/camera.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Progress } from "$lib/components/ui/progress";
    import * as Select from "$lib/components/ui/select";
    import { token, user } from "$lib/stores";
    import { cn, flyAndScale } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import { ScanFace } from "lucide-svelte";
    import { tick } from "svelte";
    import { ArrowLeft, ArrowRight } from "svelte-radix";

    interface RegisterInfo {
        username: string
        email: string
        gender: "male" | "female" | "unknown"
        age: number | null
        password: string
        faceImg: Blob | null
    }

    let camera: Camera | null = null;
    let useCamera = false;
    let detectNumber = 0;
    let primeUserUrl: string | null = null;
    let step = 1;
    let errorMessage: string | null = null;
    const registerInfo: RegisterInfo = {
        username: "",
        email: "",
        gender: "unknown",
        age: null,
        password: "",
        faceImg: null,
    };

    async function cropBlob(blob: Blob, x: number, y: number, w: number, h: number): Promise<Blob> {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        const imageLoaded = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image"));
        });
        img.src = url;
        await imageLoaded;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            URL.revokeObjectURL(url);
            throw new Error("Failed to get 2d context");
        }
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        const croppedBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(blob => resolve(blob), blob.type);
        });
        URL.revokeObjectURL(url);
        if (!croppedBlob) {
            throw new Error("Failed to create blob from canvas");
        }
        return croppedBlob;
    }

    async function sendFaceImg(): Promise<void> {
        if (!camera)
            return;
        const imageBlob = await camera.capture();
        if (!imageBlob)
            return;
        try {
            const result = await uploadFaceEmbeddingApi(imageBlob);
            console.log("Embedding uploaded successfully:", result);
            const embeddings = result.embeddings;
            detectNumber = embeddings.length;
            if (detectNumber === 1) {
                const [x, y, w, h] = embeddings[0].xyxy;
                const size = Math.max(w, h);
                const center = [x + w / 2, y + h / 2];
                const new_x = Math.max(0, center[0] - size / 2);
                const new_y = Math.max(0, center[1] - size / 2);
                registerInfo.faceImg = await cropBlob(imageBlob, new_x, new_y, size, size);
                primeUserUrl = URL.createObjectURL(registerInfo.faceImg);
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
        detectNumber = 0;
        registerInfo.faceImg = null;
    }

    $: if (useCamera) {
        handleCameraStart();
    }
    else {
        handleCameraStop();
    }

    async function nextStep(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        if (step === 1) {
            try {
                const username = formData.get("username") as string;
                const result = await isUsernameAvailableApi(username);
                if (result.available) {
                    registerInfo.username = username;
                    step = 2;
                    errorMessage = null;
                }
                else {
                    errorMessage = "This Snap ID is already taken. Please choose another one.";
                }
            }
            catch (error) {
                errorMessage = "Failed to check Snap ID availability. Please try again later.";
            }
        }
        else if (step === 2) {
            if (!registerInfo.email) {
                errorMessage = "Email is required.";
                return;
            }
            if (registerInfo.email.length > 50) {
                errorMessage = "Email is too long.";
                return;
            }
            try {
                const result = await isEmailAvailableApi(registerInfo.email);
                if (!result.available) {
                    errorMessage = "This email is already taken. Please choose another one.";
                    return;
                }
            }
            catch (error: any) {
                errorMessage = "Failed to check email availability. Please try again later.";
                return;
            }
            step = 3;
            errorMessage = null;
        }
        else if (step === 3) {
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;
            if (password !== confirmPassword) {
                errorMessage = "Passwords do not match.";
                return;
            }
            if (password.length < 8) {
                errorMessage = "Password is too short.";
                return;
            }
            if (password.length > 50) {
                errorMessage = "Password is too long.";
                return;
            }
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
                errorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
                return;
            }
            errorMessage = null;
            step = 4;
            registerInfo.password = password;
        }
        else if (step === 4) {
            if (useCamera) {
                if (!registerInfo.faceImg) {
                    errorMessage = "Please make sure your face is clearly visible in the camera.";
                    return;
                }
            }
            errorMessage = null;
            try {
                await registerApi(
                    useCamera ? registerInfo.faceImg : null,
                    registerInfo.username,
                    registerInfo.password,
                    registerInfo.email,
                    registerInfo.age,
                    registerInfo.gender,
                );
            }
            catch (error: any) {
                errorMessage = "Failed to register. Please try again later.";
            }
        }
        else if (step === 5) {
            try {
                const result = await loginApi(registerInfo.username, registerInfo.password);
                user.set(result.user);
                token.set(result.token);
                await goto("/");
            }
            catch (error: any) {
                errorMessage = "Please check your email, Snap ID, and password.";
            }
        }
    }

    function previousStep(event: Event) {
        if (step === 4) {
            useCamera = false;
        }
        if (step > 1) {
            step -= 1;
            errorMessage = null;
        }
    }
</script>

<div class="flex w-full h-full overflow-hidden items-center justify-center">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] w-[110%]">
        <img class="w-full h-full blur-md" src={fig3} alt="" />
    </div>
    <Card.Root class="z-10 mx-auto max-w-sm shadow-lg w-full bg-card/75">
        <Card.Header>
            <Card.Title class="text-2xl">Register</Card.Title>
            <Card.Description>
                {#if step === 1}
                    Please choose a Snap ID as your login credential.
                {:else if step === 2}
                    Please complete your personal information.
                {:else if step === 3}
                    Please set your password. The password must be at least 8 characters long and must contain at least one uppercase letter, one lowercase letter, and one number.
                {:else if step === 4}
                    You can register your facial information to log in more quickly in the future and enjoy discounts while shopping. Rest assured, we will not disclose any of your personal privacy.
                {/if}
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <form class="grid gap-4" use:autoAnimate on:submit|preventDefault={nextStep} on:reset|preventDefault={previousStep}>
                {#if step !== 4}
                    <div use:autoAnimate class="grid gap-2">
                        {#if step > 1}
                            <Label for="username">Snap ID</Label>
                        {/if}
                        <Input id="username" type="username" name="username" placeholder="Snap ID" disabled={step > 1} required />
                    </div>
                {/if}
                {#if step === 2}
                    <div class="grid gap-2">
                        <Label class="required" for="email">Email <span class="text-destructive">*</span></Label>
                        <Input id="email" type="email" name="email" placeholder="m@example.com" bind:value={registerInfo.email} required />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="gender">Gender <span class="text-destructive">*</span></Label>
                            <Select.Root required selected={{
                                value: "unknown",
                                label: "Confidential",
                            }}>
                                <Select.Trigger id="gender">
                                    <Select.Value />
                                </Select.Trigger>
                                <Select.Content transition={flyAndScale}>
                                    <Select.Item value="unknown" label="Confidential">Confidential</Select.Item>
                                    <Select.Item value="male" label="Male">Male</Select.Item>
                                    <Select.Item value="female" label="Female">Female</Select.Item>
                                </Select.Content>
                                <Select.Input name="gender" bind:value={registerInfo.gender} />
                            </Select.Root>
                        </div>
                        <div class="grid gap-2">
                            <Label for="age">Age</Label>
                            <Input id="age" type="number" name="age" min={1} max={120} bind:value={registerInfo.age} />
                        </div>
                    </div>
                {/if}
                {#if step === 3}
                    <div class="grid gap-2">
                        <Label class="required" for="password">Password <span class="text-destructive">*</span></Label>
                        <Input id="password" type="password" name="password" required />
                    </div>
                    <div class="grid gap-2">
                        <Label class="required" for="confirmPassword">Confirm Password <span class="text-destructive">*</span></Label>
                        <Input id="confirmPassword" type="password" name="confirmPassword" required />
                    </div>
                {/if}
                {#if step === 4}
                    {#if useCamera}
                        <div use:autoAnimate class="relative w-full h-full flex items-center justify-center flex-col gap-4">
                            <Camera bind:this={camera} class={cn("w-52 h-52 object-cover rounded-full transition-all ring-offset-4 ring-primary ring-2", detectNumber === 1 && "ring-blue-500 ring-4", detectNumber > 1 && "ring-red-500")} />
                            <Label class={cn(detectNumber === 1 && "text-blue-500", detectNumber > 1 && "text-red-500", "transition-all")}>
                                {(() => {
                                    if (detectNumber === 1) {
                                        return "Face Detected";
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
                        <Button type="submit" disabled={useCamera && detectNumber !== 1}>
                            Register
                        </Button>
                        <Button variant="secondary" on:click={() => useCamera = false}>
                            Cancel
                        </Button>
                    {:else}
                        <div class="w-full justify-center flex">
                            <ScanFace class="size-24" />
                        </div>
                        <Button on:click={() => useCamera = true}>
                            Register with Face
                        </Button>
                        <Button variant="secondary" type="submit">
                            Skip, Register Directly
                        </Button>
                    {/if}
                {/if}
                {#if errorMessage}
                    <Label class="text-destructive"> {errorMessage} </Label>
                {/if}

                <div class="space-y-2 mt-2">
                    {#if step > 1 && step < 4}
                        <Progress bind:value={step} max={4} class="w-full" />
                    {/if}
                    <div class="flex items-center justify-between" use:autoAnimate>
                        {#if step > 1}
                            <Button type="reset" size="icon">
                                <ArrowLeft class="size-5" />
                            </Button>
                        {:else}
                            <div></div>
                        {/if}
                        {#if step > 1 && step < 4}
                            <Label> Step {step} / 4 </Label>
                        {/if}
                        {#if step < 4}
                            <Button type="submit" size="icon">
                                <ArrowRight class="size-5" />
                            </Button>
                        {:else}
                            <div></div>
                        {/if}
                    </div>
                </div>
            </form>
            <div class="mt-4 text-center text-sm">
                Already have an account?
                <a href="/login" class="underline"> Login </a>
            </div>
        </Card.Content>
    </Card.Root>
</div>
