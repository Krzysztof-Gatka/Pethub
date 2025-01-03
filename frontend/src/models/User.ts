export interface User {
    id: number,
    email: string,
    password_hash: string,
    role: 'user' | 'shelter'
}