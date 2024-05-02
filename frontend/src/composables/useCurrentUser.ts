import {profileService} from "@/services/profileService";
import {useAuthStore} from "@/stores/authStore";
import type {ApiResponseType} from "@/types";
import {ref} from "vue";

export const useCurrentUser = () => {
    const authStore = useAuthStore()
    const data = ref<ApiResponseType | null>(null)
    const error = ref<ApiResponseType | null>(null)

    profileService.getProfile(authStore.jwt)
        .then(res => data.value = res)
        .catch(err => error.value = err)

    return {data, error}
}