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
}

export interface UserPublic {
    id: number
    nickname: string
    faceImgUrl: string
}
