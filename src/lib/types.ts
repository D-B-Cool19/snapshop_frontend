export interface FaceEmbedding {
    faceEmbedding: number[]
    xyxy: [number, number, number, number]
}

export interface User {
    id: number
    email: string
    username: string
    nickname: string
    gender: "male" | "female" | "unknown"
    faceImgUrl: string
    role: number
    count: number
}

export interface UserPublic {
    id: number
    nickname: string
    faceImgUrl: string
}

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColor = "zinc" | "slate" | "orange" | "red" | "blue" | "green" | "purple" | "yellow" | "rose";

export type Token = string | null;

export interface Config {
    themeMode: ThemeMode
    themeColor: ThemeColor
    fontSize: number
}

export interface ItemDetail {
    id: number
    name: string
    description: string
    features: string
    price: number
    images: string[]
    rate: number
    reviews: number
}

export interface Item {
    id: number
    name: string
    price: number
    image: string | null
    rate: number
    description: string
}

export interface CartItem {
    id: number
    item: Item
    quantity: number
    checked: boolean
}
