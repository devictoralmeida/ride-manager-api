export interface IUserResponseDTO {
  email: string
  name: string
  id: string
  avatar: string | null
  driver_license: string
  avatar_url(): string | null
  isAdmin: boolean
}
