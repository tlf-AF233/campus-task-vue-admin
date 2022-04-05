
const TokenKey = 'token'
const roleKey = 'role'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getRole() {
  return localStorage.getItem(roleKey)
}

export function setRole(role) {
  return localStorage.setItem(roleKey, role)
}

export function removeRole() {
  return localStorage.removeItem(roleKey)
}
