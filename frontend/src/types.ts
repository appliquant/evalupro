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

export type Product = {
  id: string
  name: string
  brand: string
  categoryId: string
  description: string
  price: number
  image: string
}

export type Criteria = {
  id: string
  name: string
  coefficient: number
  categoryId: string
}

export type Evaluation = {
  id: string
  comment: string
  productId: string
  userId: string
  average: number
}

export type CriteriasEvaluation = {
  id: string
  evaluationId: string
  criteriaId: string
  value: number
}
