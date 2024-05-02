import type {ApiResponseType} from "@/types";

async function handleApiResponse(response: Response): Promise<ApiResponseType> {
    try {
        return await response.json() as ApiResponseType;
    } catch (e) {
        return {
            status: response.status,
            message: "Impossible de lire la réponse du serveur",
            errors: [{
                field: "general",
                message: e instanceof Error ? e.message : "Erreur lors de la lecture de la réponse du serveur"
            }]
        }
    }
}

async function signup(username: string, email: string, password: string) {
    try {
        const res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, email, password})
        });

        const data = await handleApiResponse(res);
        return data;
    } catch (e) {
        return {
            status: 500,
            message: `Impossible d'atteindre le serveur : ${e}`,
            errors: [{
                field: "network",
                message: e instanceof Error ? e.message : "Erreur lors de la communication avec le serveur"
            }]
        } as ApiResponseType
    }
}

const authService = {
    signup
}

export {authService}