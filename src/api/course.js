import request from '@/utils/request'

// 老师查询课程
export function getMyTeachesCourse() {
  return request({
    url: '/api/course/v1/course/searchMyTeachesCourse',
    method: 'GET'
  })
}

// 查询课时
export function getLessons(courseId) {
  return request({
    url: `/api/course/v1/lesson/search?courseId=${courseId}`,
    method: 'GET'
  })
}

// 查询课程人数
export function getStudentNumber(courseId) {
  return request({
    url: `/api/course/v1/trainee/findStudentNumber?courseId=${courseId}`,
    method: 'GET',
  })
}

// 添加题目
export function addQuestion(form) {
  return request({
    url: '/api/course/v1/question/add',
    data: {
      questionId: form.questionId,
      questionName: form.questionName,
      courseId: form.courseId,
      questionType: form.questionType,
      items: JSON.stringify(form.items),
      questionAnalysis: form.questionAnalysis,
      questionAnswer: form.questionAnswer,
      score: form.score,
      difficulty: form.difficulty
    },
    method: 'POST'
  })
}
// 更新题目
export function updateQuestion(form) {
  return request({
    url: '/api/course/v1/question/update',
    data: {
      questionId: form.questionId,
      questionName: form.questionName,
      courseId: form.courseId,
      questionType: form.questionType,
      items: JSON.stringify(form.items),
      questionAnalysis: form.questionAnalysis,
      questionAnswer: form.questionAnswer,
      score: form.score,
      difficulty: form.difficulty
    },
    method: 'PUT'
  })
}

// 查询题目
export function searchQuestion(form) {
  return request({
    url: '/api/course/v1/question/search',
    data: {
      questionId: form.questionId,
      courseId: form.courseId,
      questionType: form.questionType,
      pageSize: form.pageSize,
      pageNum: form.pageNum
    },
    method: 'POST'
  })
}

// 删除题目
export function deleteQuestion(id) {
  return request({
    url: `/api/course/v1/question/delete?questionId=${id}`,
    method: 'DELETE'
  })
}


// 添加作业
export function addLearning(form) {
  return request({
    url: '/api/course/v1/learning/add',
    method: 'POST',
    data: form
  })
}

// 作业列表
export function getLearningList(form) {
  return request({
    url: `/api/course/v1/learning/list?courseId=${form.courseId}&pageNum=${form.pageNum}&pageSize=${form.pageSize}`,
    method: 'GET'
  })
}

// 作业列表
export function getLearningListByStudent(form) {
  return request({
    url: `/api/course/v1/learning/listByStudent?courseId=${form.courseId}&pageNum=${form.pageNum}&pageSize=${form.pageSize}`,
    method: 'GET'
  })
}

// 更新作业截止日期
export function updateLearningLimitDate(limitDate, learningTitle) {
  return request({
    url: `/api/course/v1/learning/updateLimitDate?limitDate=${limitDate}&learningTitle=${learningTitle}`,
    method: 'PUT'
  })
}

// 学生查看课程
export function getStudentCourses() {
  return request({
    url: '/api/course/v1/course/myCourses',
    method: 'GET'
  })
}

// 学习统计
export function getStudyNum(courseId, learningTitle) {
  return request({
    url: `/api/course/v1/workDetail/get?courseId=${courseId}&learningTitle=${learningTitle}`,
    method: 'GET'
  })
}

export function getStudyDetail(courseId, learningTitle) {
  return request({
    url: `/api/course/v1/workDetail/getUnFinishedDetail?courseId=${courseId}&learningTitle=${learningTitle}`,
    method: 'GET'
  })
}

// 排行榜TOP10
export function getTop10(courseId) {
  return request({
    url: `/api/course/v1/score/getTop10?courseId=${courseId}`,
    method: 'GET'
  })
}