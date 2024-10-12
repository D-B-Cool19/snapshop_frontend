import type { FaceEmbedding, User, UserPublic } from "$lib/types";
import axios from "axios";

export async function uploadFaceEmbeddingApi(image: Blob) {
    const formData = new FormData();
    formData.append("faceImg", image, "face.jpg");
    const response = await axios.post<{
        embeddings: FaceEmbedding[]
    }>("/api/face/embedding", formData, {
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
    }>("/api/user/login", {
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
    }>("/api/user/query", {
        embedding,
    });
    return response.data;
}

export async function registerApi(faceImg: Blob | null, username: string, password: string, email: string, age: number | null, gender: "male" | "female" | "unknown") {
    const formData = new FormData();
    if (faceImg)
        formData.append("faceImg", faceImg, "face.jpg");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    if (age)
        formData.append("age", age.toString());
    formData.append("gender", gender);
    const response = await axios.post<{
        user: User
    }>("/api/user/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // 让 axios 知道要处理 FormData
        },
    });
    return response.data;
}

export async function isUsernameAvailableApi(username: string) {
    const response = await axios.get<{
        available: boolean
    }>(`/api/user/available/username/${username}`);
    return response.data;
}

export async function isEmailAvailableApi(email: string) {
    const response = await axios.get<{
        available: boolean
    }>(`/api/user/available/email/${email}`);
    return response.data;
}

// export async function registerApi(username: string) {
//     const response = await axios.get<{
//         available: boolean
//     }>(`/api/user/available/${username}`);
//     return response.data;
// }
