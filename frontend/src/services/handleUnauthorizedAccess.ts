import router from "@/router";

export const handleUnauthorizedAccess = () => {
    return router.push({name: "signin"})
}