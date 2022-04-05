<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ user.name }}</div>
              </li>
              <li class="list-group-item">
                性别
                <div class="pull-right">{{ user.sex === 1 ? '男' : '女' }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item" v-if="user.studentId !== null">
                学号
                <div class="pull-right">{{ user.studentId }}</div>
              </li>
              <li class="list-group-item">
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                学院
                <div class="pull-right">{{ user.college.name }}</div>
              </li>
              <li class="list-group-item" v-if="user.major.id !== null">
                专业班级
                <div class="pull-right">{{ user.major.grade + "级" + user.major.majorName + user.major.classNo + "班" }}</div>
              </li>
              <li class="list-group-item">
                所属角色
                <div class="pull-right">{{ roleList }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleList: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleList = response.data.roleList;
      });
    }
  }
};
</script>

<style>
.text-center {
  text-align: center;
}
li {
    display: list-item;
    text-align: -webkit-match-parent;
}

.list-group {
    padding-left: 0;
    list-style: none;
}

.list-group-striped>.list-group-item {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
}

.list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0;
    font-size: 13px;
}

.pull-right {
    float: right!important;
}
</style>