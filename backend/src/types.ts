type ValidationError = {
  /**
   * Correspond aux field du côté frontend
   */
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