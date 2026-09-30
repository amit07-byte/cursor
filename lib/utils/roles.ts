export const USER_ROLES = ["BUSINESS", "CREATOR"] as const

export type UserRole = (typeof USER_ROLES)[number]

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.some((role) => role === value)
}

export function parseUserRole(value: string | undefined): UserRole | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().toUpperCase()
  return isUserRole(normalized) ? normalized : null
}
