export type User = {
  id: string
  role: string
  token: string
  expiry_date?: Date
  maxAge: number
}
