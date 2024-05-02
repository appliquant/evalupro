declare namespace Express {
    export interface Request {
        jwtToken?: {
            email: string
        }
    }
}