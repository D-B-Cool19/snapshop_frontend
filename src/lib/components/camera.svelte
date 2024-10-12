<script context="module" lang="ts">
    declare let ImageCapture: {
        new(videoTrack: MediaStreamTrack): {
            takePhoto(): Promise<Blob>
        }
    };
</script>

<script lang="ts">
    let videoElement: HTMLVideoElement;
    let intervalId: NodeJS.Timeout;

    export async function capture() {
        if (!videoElement)
            return null;
        const videoTrack = videoElement.srcObject instanceof MediaStream ? videoElement.srcObject.getVideoTracks()[0] : null;
        if (!videoTrack)
            return null;
        const imageCapture = new ImageCapture(videoTrack);
        try {
            return await imageCapture.takePhoto();
        }
        catch (error: any) {
            console.error("拍照失败:", error);
            throw (new Error("拍照失败"));
        }
    }

    export async function startCamera() {
        if (videoElement.srcObject) {
            console.log("Camera already started");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement) {
                videoElement.srcObject = stream;
                console.log("Camera started");
            }
            else {
                console.error("videoElement is null");
            }
        }
        catch (error) {
            console.error("Error accessing camera: ", error);
        }
    }

    export function bindInterval(callback: () => void, interval: number) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(callback, interval);
    }

    export function stopCamera() {
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            clearInterval(intervalId);
        }
    }
</script>

<video bind:this={videoElement} {...$$restProps} autoplay>
    <track kind="captions" src="" />
</video>
