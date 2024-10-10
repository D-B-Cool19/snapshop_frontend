import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('faceImg');

        if (!file || !(file instanceof Blob)) {
            return new Response('Invalid file upload', { status: 400 });
        }

        return new Response('Image received successfully', { status: 200 });
    }
    catch (error) {
        console.error(error);
        return new Response('Error processing image upload', { status: 500 });
    }
};
