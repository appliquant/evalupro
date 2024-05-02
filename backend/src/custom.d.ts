declare namespace Express {
    export interface Request {
        jwtToken?: {
            email: string
        }
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string
        DB_HOST: string
        DB_DIALECT: string
        DB_PORT: string
        DB_NAME: string
        DB_USERNAME: string
        DB_PASSWORD: string
    }
}