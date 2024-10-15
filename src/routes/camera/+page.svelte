<script context='module' lang='ts'>
    declare let ImageCapture: {
        new(videoTrack: MediaStreamTrack): {
            takePhoto(): Promise<Blob>
        }
    };
</script>

<script lang='ts'>
    import { type FaceEmbedding, uploadFaceEmbedding } from '$lib/api';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';

    let videoElement: HTMLVideoElement;
    // let intervalId: number;
    let canvasElement: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;
    let isEnable = false;

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement) {
                videoElement.srcObject = stream;
                isEnable = true;
            }
        }
        catch (error) {
            console.error('Error accessing camera: ', error);
        }
    };

    const stopCamera = () => {
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            isEnable = false;
        }
    };

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
                    console.log('拍照成功:', blob, size);
                    resolve(blob);
                }).catch((error: Error) => {
                    console.error('拍照失败:', error);
                    reject(new Error('拍照失败'));
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
            console.log('Embedding uploaded successfully:', result);
            if (context) {
                context.clearRect(0, 0, canvasElement.width, canvasElement.height);
            }
            drawBoundingBoxes(result.embeddings);
            toast.success('Upload Success!');
        }
        catch (error) {
            console.error('Error uploading face image:', error);
        }
    }

    function drawBoundingBoxes(embeddings: FaceEmbedding['embeddings']) {
        if (!context || !videoElement)
            return;
        const videoWidth = 1552;
        const videoHeight = 1552;

        const displayWidth = videoElement.clientWidth;
        const displayHeight = videoElement.clientHeight;
        canvasElement.width = displayWidth;
        canvasElement.height = displayHeight;

        const scaleX = displayWidth / videoWidth;
        const scaleY = displayHeight / videoHeight;
        console.log(videoWidth, displayWidth, scaleX)

        embeddings.forEach((face) => {
            console.log('Face:', face);
            const [x_min, y_min, width, height] = face.xyxy.map((coord, index) => {
                return index % 2 === 0 ? coord * scaleX : coord * scaleY;
            });
            if (context) {
                context.strokeStyle = 'red';
                context.lineWidth = 2;
                context.strokeRect(x_min, y_min, width, height);
                console.log('Drawing bounding box:', x_min, y_min, width, height);
            }
        });
    }

    onMount(() => {
        // startCamera();
        // intervalId = setInterval(sendFaceImg, 500);
        if (canvasElement && videoElement) {
            canvasElement.width = videoElement.clientWidth;
            canvasElement.height = videoElement.clientHeight;
            context = canvasElement.getContext('2d');
        }
    });

    onDestroy((): void => {
    // clearInterval(intervalId);
    });
</script>

<main class='w-full h-full flex items-center justify-center'>
    <Card.Root class='max-w-lg w-full'>
        <Card.Header>
            <Card.Title>Camera</Card.Title>
            <Card.Description>This is a camera capture.</Card.Description>
        </Card.Header>
        <Card.Content>
            <div class='relative w-full aspect-video'>
                <video bind:this={videoElement} autoplay class='absolute top-0 left-0 w-full h-full'>
                    <track kind='captions' src="" />
                </video>
                <canvas bind:this={canvasElement} class='absolute top-0 left-0 w-full h-full'></canvas>
            </div>
        </Card.Content>
        <Card.Footer class='space-x-2'>
            <Button on:click={startCamera} disabled={isEnable}>Start Camera</Button>
            <Button on:click={stopCamera} disabled={!isEnable}>Stop Camera</Button>
            <Button on:click={sendFaceImg} disabled={!isEnable}>Upload Image</Button>
        </Card.Footer>
    </Card.Root>

</main>
