<script context="module" lang="ts">
    declare let ImageCapture: {
        new(videoTrack: MediaStreamTrack): {
            takePhoto(): Promise<Blob>
        }
    };
</script>

<script lang="ts">
    import { uploadFaceEmbedding } from "$lib/api";
    import fig4 from "$lib/assets/image/fig4.png";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { cn } from "$lib/utils";
    import autoAnimate from "@formkit/auto-animate";
    import { Camera } from "lucide-svelte";

    let videoElement: HTMLVideoElement;
    let useCamera = false;
    let intervalId: NodeJS.Timeout;
    let isDetected = false;

    function getImageDimensionsFromBlob(blob: Blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                URL.revokeObjectURL(url);
                resolve({ width, height });
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function captureFrameAsBlob(): Promise<Blob | null> {
        return new Promise((resolve, reject) => {
            if (videoElement) {
                const videoTrack = videoElement.srcObject instanceof MediaStream ? videoElement.srcObject.getVideoTracks()[0] : null;
                if (!videoTrack)
                    return resolve(null);

                const imageCapture = new ImageCapture(videoTrack);
                imageCapture.takePhoto().then(async (blob: Blob) => {
                    const size = await getImageDimensionsFromBlob(blob);
                    console.log("拍照成功:", blob, size);
                    resolve(blob);
                }).catch((error: Error) => {
                    console.error("拍照失败:", error);
                    reject(new Error("拍照失败"));
                });
            }
            else {
                resolve(null);
            }
        });
    }

    async function sendFaceImg(): Promise<void> {
        const imageBlob = await captureFrameAsBlob();
        if (!imageBlob)
            return;
        try {
            const result = await uploadFaceEmbedding(imageBlob);
            console.log("Embedding uploaded successfully:", result);
            const embeddings = result.embeddings;
            isDetected = embeddings.length > 0;
        }
        catch (error) {
            console.error("Error uploading face image:", error);
        }
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement) {
                videoElement.srcObject = stream;
                intervalId = setInterval(sendFaceImg, 1000);
            }
        }
        catch (error) {
            console.error("Error accessing camera: ", error);
        }
    };

    const stopCamera = () => {
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            clearInterval(intervalId);
        }
    };

    $: if (useCamera) {
        console.log("Starting camera");
        startCamera();
    }
    else {
        console.log("Stop camera");
        stopCamera();
    }

</script>

<div class="flex w-full h-full overflow-hidden items-center justify-center">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] w-[110%]">
        <img class="w-full h-full blur-md" src={fig4} alt="" />
    </div>
    <Card.Root class="z-10 mx-auto max-w-sm shadow-lg">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
            <Card.Description>Enter your email below to login to your account</Card.Description>
        </Card.Header>
        <Card.Content>

            <div class="grid gap-4" use:autoAnimate>
                {#if useCamera}
                    <div use:autoAnimate class="relative w-full h-full flex items-center justify-center flex-col gap-4">
                        <video bind:this={videoElement} autoplay class={cn("w-52 h-52 object-cover rounded-full transition-all ring-offset-4", isDetected ? "ring-blue-500 ring-4" : "ring-primary ring-2")}>
                            <track kind="captions" src="" />
                        </video>
                        <Label class={cn(isDetected && "text-blue-500", "transition-all")}>
                            {isDetected ? "Detecte Face" : "No Face Detected"}
                        </Label>

                        <!--                        <canvas bind:this={canvasElement} class="absolute top-0 left-0 w-full h-full"></canvas> -->
                    </div>
                {:else}
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a href="##" class="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                {/if}
                <Button type="submit" class="w-full" disabled={useCamera && !isDetected}>Login</Button>
                <Button variant="outline" class="w-full space-x-1" on:click={() => useCamera = true}>
                    <Camera class="size-5" />
                    <div>
                        Login with Camera
                    </div>
                </Button>
            </div>
            <div class="mt-4 text-center text-sm">
                Don&apos;t have an account?
                <a href="##" class="underline"> Sign up </a>
            </div>
        </Card.Content>
    </Card.Root>
</div>
