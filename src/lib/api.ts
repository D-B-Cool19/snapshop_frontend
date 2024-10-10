export interface FaceEmbedding {
    embeddings: {
        embedding: number[]
        xyxy: number[]
    }[]
}

export async function uploadFaceEmbedding(image: Blob): Promise<FaceEmbedding> {
    const formData = new FormData();
    formData.append('faceImg', image, 'face.jpg');
    try {
        const response = await fetch('/api/face/embedding', {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
