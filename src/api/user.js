import request from '@/utils/request'

export function getCollegeInfo() {
  return request({
    url: '/api/user/v1/college/list',
    method: 'GET'
  })
}

export function getCollegeTeacherInfo() {
  return request({
    url: '/api/user/v1/college/findCollegeAndTeacher',
    method: 'GET'
  })
}

export function getAllRoles() {
  return request({
    url: '/api/user/v1/role/list',
    method: 'GET'
  })
}

export function registerUser(registerForm) {
  return request({
    url: '/api/user/v1/user/register',
    method: 'POST',
    data: {
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      studentId: registerForm.studentId,
      collegeId: registerForm.collegeMajor[0],
      majorClassId: registerForm.collegeMajor.length < 2 ? '' : registerForm.collegeMajor[1],
      sex: registerForm.sex,
      password: registerForm.password,
      roleIdList: registerForm.roleIdList
    }
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/api/user/v1/user/space',
    method: 'POST'
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/api/user/v1/user/updatePassword',
    method: 'PUT',
    params: data
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/api/user/v1/user/update',
    method: 'put',
    data: data
  })
}