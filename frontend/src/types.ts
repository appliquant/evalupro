export type ValidationError = {
  field: string
  message: string
}

export type ApiResponseType = {
  status: number
  message: string
  errors?: ValidationError[]
  data?: any
}

export enum UserRoles {
  ADMIN = 'admin',
  TESTER = 'tester',
  USER = 'user'
}

export type Category = {
  id: string
  title: string
  parentId: string | null
}