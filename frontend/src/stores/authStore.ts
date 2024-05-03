import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserRoles } from '@/types'

export const useAuthStore = defineStore('userdata', () => {
  const jwt = ref(localStorage.getItem('jwt') ?? '')
  const role = ref<UserRoles | null>((localStorage.getItem('role') as UserRoles) ?? null)

  function setJwt(_jwt: string) {
    jwt.value = _jwt
    localStorage.setItem('jwt', _jwt)
  }

  function setRole(_role: UserRoles) {
    role.value = _role
    localStorage.setItem('role', _role)
  }

  const login = (_jwt: string, _role: UserRoles) => {
    setJwt(_jwt)
    setRole(_role)
  }

  const logout = () => {
    jwt.value = ''
    role.value = null
    localStorage.removeItem('jwt')
    localStorage.removeItem('role')
  }

  return { jwt, login, logout, role }
})
