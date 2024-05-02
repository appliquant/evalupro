type ErrorType = {
    field: string
    message: string
}

export type ApiResponseType = {
    status: number
    message: string
    errors?: ErrorType[]
    data?: any
}

export enum UserRoles {
    ADMIN = "admin",
    TESTER = "tester",
    USER = "user"
}