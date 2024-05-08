import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserRoles } from '@/types'

export const useAuthStore = defineStore('userdata', () => {
  const jwt = ref(localStorage.getItem('jwt') ?? '')
  const role = ref<UserRoles | null>((localStorage.getItem('role') as UserRoles) ?? null)
  const userId = ref(localStorage.getItem('userId') ?? '')

  function setJwt(_jwt: string) {
    jwt.value = _jwt
    localStorage.setItem('jwt', _jwt)
  }

  function setRole(_role: UserRoles) {
    role.value = _role
    localStorage.setItem('role', _role)
  }

  function setUserId(_userId: string) {
    userId.value = _userId
    localStorage.setItem('userId', _userId)
  }

  const login = (_jwt: string, _role: UserRoles, _userId: string) => {
    setJwt(_jwt)
    setRole(_role)
    setUserId(_userId)
  }

  const logout = () => {
    jwt.value = ''
    role.value = null
    localStorage.removeItem('jwt')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
  }

  return { jwt, login, logout, role, userId }
})
