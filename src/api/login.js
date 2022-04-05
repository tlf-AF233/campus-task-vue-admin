import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/api/user/v1/user/login',
    data: {
      username: loginForm.username,
      password: loginForm.password,
      roleCode: loginForm.roleCode
    },
    method: 'POST'
  })
}