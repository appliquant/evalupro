import {defineStore} from "pinia";
import {ref} from "vue";
import type {UserRoles} from "@/types";

export const useAuthStore = defineStore("userdata", () => {
    const jwt = ref(localStorage.getItem('jwt') ?? '');
    const role = ref<UserRoles | null>(localStorage.getItem("role") as UserRoles ?? null);

    function setJwt(newJwt: string) {
        jwt.value = newJwt;
        localStorage.setItem('jwt', newJwt);
    }

    function setRole(r: UserRoles) {
        role.value = r;
        localStorage.setItem('role', r);
    }

    const logout = () => {
        jwt.value = ""
        role.value = null;
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
    }

    return {jwt, setJwt, deleteJwt: logout, setRole, role}
})