import { User } from "./user";

export interface AuthResponse {
    token: string;
    id: string;
    fullName: string;
    email: string;
    role: string;
    image: string;
}