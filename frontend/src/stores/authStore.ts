import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthStore = defineStore("userdata", () => {
    const jwt = ref(localStorage.getItem('jwt') || '');

    function setJwt(newJwt:string) {
        jwt.value = newJwt;
        localStorage.setItem('jwt', newJwt);
    }

    const deleteJwt = () => {
        jwt.value = ""
        localStorage.removeItem('jwt');
    }

    return {jwt, setJwt, deleteJwt}
})