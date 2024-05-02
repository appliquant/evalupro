import type {ApiResponseType} from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function handleApiResponse(response: Response): Promise<ApiResponseType> {
    try {
        return await response.json() as ApiResponseType;
    } catch (e) {
        return {
            status: response.status,
            message: "(profileService) Impossible de lire la réponse du serveur",
            errors: [{
                field: "general",
                message: e instanceof Error ? e.message : "Erreur lors de la lecture de la réponse du serveur"
            }]
        }
    }
}

const getProfile = async (token: string): Promise<ApiResponseType> => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        return await handleApiResponse(res);
    } catch (e) {
        return {
            status: 500,
            message: `Impossible d'atteindre le serveur lors de la récupération du profil : ${e}`,
            errors: [{
                field: "network",
                message: e instanceof Error ? e.message : "Erreur lors de la communication avec le serveur"
            }]
        } as ApiResponseType
    }
}

const profileService = {
    getProfile
}

export {profileService}