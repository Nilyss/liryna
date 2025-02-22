export interface IUser {
    id: string
    email: string
    password?: string
    firstName: string
    lastName: string
}

export interface IUserCredentials {
    email: string
    password: string
}