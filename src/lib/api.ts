import type { CartItem, FaceEmbedding, Item, ItemDetail, User, UserPublic } from "$lib/types";
import axios from "./axios";

export async function uploadFaceEmbeddingApi(image: Blob) {
    const formData = new FormData();
    formData.append("faceImg", image, "face.jpg");
    const response = await axios.post<{
        embeddings: FaceEmbedding[]
    }>("/face/embedding", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // 让 axios 知道要处理 FormData
        },
    });
    return response.data;
}

export async function loginApi(username: string, password: string) {
    const response = await axios.post<{
        user: User
        token: string
    }>("/user/login", {
        username,
        password,
    });
    return response.data;
}

export async function loginWithFaceApi(embedding: number[]) {
    const response = await axios.post<{
        similarUsers: UserPublic[] | null
        loginInfo: {
            user: User
            token: string
        } | null
    }>("/user/query", {
        embedding,
    });
    return response.data;
}

export async function registerApi(faceImg: Blob | null, username: string, password: string, email: string, age: number | null, gender: "male" | "female" | "unknown", embedding: number[] | null) {
    const formData = new FormData();
    if (faceImg)
        formData.append("faceImg", faceImg, "face.jpg");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    if (embedding)
        formData.append("embedding", JSON.stringify(embedding));
    if (age)
        formData.append("age", age.toString());
    formData.append("gender", gender);
    const response = await axios.post<{
        user: User
    }>("/user/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // 让 axios 知道要处理 FormData
        },
    });
    return response.data;
}

export async function isUsernameAvailableApi(username: string) {
    const response = await axios.get<{
        available: boolean
    }>(`/user/available/username/${username}`);
    return response.data;
}

export async function isEmailAvailableApi(email: string) {
    const response = await axios.get<{
        available: boolean
    }>(`/user/available/email/${email}`);
    return response.data;
}

export async function getUserApi() {
    const response = await axios.get<{
        user: User
    }>("/user");
    return response.data;
}

export async function getItemDetailApi(itemId: number) {
    const response = await axios.get<{
        item: ItemDetail
    }>(`/item/${itemId}`);
    return response.data;
}

export async function getItemsApi() {
    const response = await axios.get<{
        items: Item[]
    }>("/item");
    return response.data;
}

export async function addItemApi(name: string, price: number, images: Blob[], description: string, features: string) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i], `image${i}.jpg`);
    }
    formData.append("description", description);
    formData.append("features", features);
    const response = await axios.post<{
        item: Item
    }>("/item", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function updateItemApi(itemId: number, name: string, price: number, images: Blob[], description: string, features: string) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i], `image${i}.jpg`);
    }
    formData.append("description", description);
    formData.append("features", features);
    const response = await axios.put<{
        item: Item
    }>(`/item/${itemId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export async function deleteItemApi(itemId: number) {
    const response = await axios.delete<object>(`/item${itemId}`);
    return response.data;
}

export async function addToCartApi(itemId: number, quantity: number) {
    const response = await axios.post<{
        items: Item[]
    }>(`/cart/item/${itemId}`, {
        quantity,
    });
    return response.data;
}

export async function getCartItemsApi() {
    const response = await axios.get<{
        cartItems: CartItem[]
    }>(`/cart`);
    return response.data;
}

export async function deleteCartItemApi(itemId: number) {
    const response = await axios.delete<{
        items: CartItem[]
    }>(`/cart/${itemId}`);
    return response.data;
}

export async function updateCartItemApi(itemId: number, quantity: number, checked: boolean) {
    const response = await axios.put<{
        item: CartItem
    }>(`/cart/${itemId}`, {
        quantity,
        checked,
    });
    return response.data;
}

export async function checkoutApi(checkoutItems: { itemId: number, quantity: number }[], credits: number) {
    const response = await axios.post<{
        items: CartItem[]
        user: User
    }>(`/cart/checkout`, {
        checkoutItems,
        credits,
    });
    return response.data;
}

export async function authApi() {
    const response = await axios.get("/user/auth");
    return response.data;
}
