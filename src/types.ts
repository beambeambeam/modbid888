export type Role = "admin" | "member"

export type UserId = number

export type MinigameId = number

export type UserSession = {
  id: UserId
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
