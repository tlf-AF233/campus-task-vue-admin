<template>
  <div class="root">
    <div class="search">
      <el-input placeholder="请输入学号" v-model="studentId" clearable class="input-with-select">
        <el-button @click="searchByCollegeMajor" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="my-flex">
      <el-cascader
        style="padding-top: 10px; width: 50%"
        v-model="collegeMajorSearch"
        placeholder="请选择学院班级"
        :options="collegeMajorList"
        :props="{ checkStrictly: true, multiple: true }"
        clearable></el-cascader>

      <el-button @click="searchByCollegeMajor" class="my-btn" type="primary">开始搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="学号">
              <span>{{ props.row.studentId }}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.sex === 1 ? '男' : '女'}}</span>
            </el-form-item>
            <el-form-item label="学院">
              <span>{{ props.row.college.name }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ props.row.major.majorName }}</span>
            </el-form-item>
            <el-form-item label="班级">
              <span>{{ props.row.major.grade + "级" + props.row.major.classNo + "班"}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>\
      <el-table-column prop="studentId" label="学号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="avatarUrl" label="头像">
        <div slot-scope="scope" class="my-pic">
          <el-image
            @click="imgClick(scope.row.avatarUrl)"
            fit="scale-down"
            style="width: 100%; height: 100%"
            :src="scope.row.avatarUrl"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button @click="deleteUser(scope.row.id)" size="small" type="danger" round>删除</el-button>
          <!-- <el-button
            @click="downloadFile(scope.row.name,scope.row.imgUrl)"
            size="small"
            type="primary"
            round
          >下载</el-button> -->
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next"
      :current-page.sync="pageNum"
      :total="totalElements"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>
    
  </div>
</template>

<script>

import { getCollegeInfo } from "@/api/user"

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 6,
      pageSizes: [6, 7, 8, 9, 10],
      totalElements: 0, // task总数
      srcList: [],
      tableData: [],
      studentId: "",
      collegeMajorList: [],
      collegeMajorSearch: "",
      deleteOperation: false
    };
  },
  created: function() {
    this.getMaterialList();
  },
  mounted() {
    this.getCollegeList()
  },
  methods: {
    // 获取学院专业信息
    getCollegeList() {
      let objList = []
      getCollegeInfo().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((collegeItem, index) => {
          const collegeObj = { value: collegeItem.collegeId, label: collegeItem.name, children: [] }
          this.collegeMajorList.push(collegeObj)
      
          collegeItem.majorVoList.forEach((majorItem, majorIndex) => {
            const majorClassInfo = majorItem.grade + "级" + majorItem.majorName + majorItem.classNo + "班"
            const majorObj = { value: majorItem.id, label: majorClassInfo }
            this.collegeMajorList[index].children[majorIndex] = majorObj
          })
        })
      })
    },

    //分页大小
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
    },

    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },

   
    deleteUser(id) {
      let that = this;
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .req({
              url: "/api/user/v1/user/deleteUser?id=" + id,
              data: {},
              Headers,
              method: "DELETE"
            })
            .then(
              res => {
                console.log("res :", res);
                that.deleteOperation = true
                that.searchByCollegeMajor();
                that.$message({
                  message: "删除成功~",
                  type: "success"
                });
                
              },
              err => {
                console.log("err :", err);
              }
              
            );
            
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
        
    },
    // uploadSuccess(response, file, fileList) {
    //   let that = this;
    //   console.log(":", response);
    //   this.$message("上传成功~");
    //   this.$prompt("请输入素材名称", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //   })
    //     .then(({ value }) => {
    //       that
    //         .req({
    //           url: "addMaterial",
    //           data: {
    //             name: value,
    //             imgUrl: response.data,
    //             createDate: new Date().getTime()
    //           },
    //           method: "POST"
    //         })
    //         .then(
    //           res => {
    //             console.log("res :", res);
    //             that.getMaterialList();
    //           },
    //           err => {
    //             console.log("err :", err);
    //           }
    //         );
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消上传"
    //       });
    //     });
    // },
   
    // 下载文件

    pageChange(page) {
      this.searchByCollegeMajor(page);
    },


    searchByCollegeMajor() {
      
      let majorIdList = []
      let collegeIdList = []
      this.collegeMajorSearch.forEach((item, index) => {
        if (item.length == 2) {
          majorIdList.push(item[1])
        } else {
          collegeIdList.push(item[0])
        }
      })
      this.req({
        url: '/api/user/v1/user/search/student',
        data: {
          majorIdList: majorIdList,
          collegeIdList: collegeIdList,
          studentId: this.studentId,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        },
        Headers,
        method: "POST"
      }).then(
        res => {
          if (!this.deleteOperation) {
            if (res.data.length < 1) {
              this.$message({
                message: "查询无果~",
                type: 'success' 
              });
              return 0;
            } else {
              this.$message({
                message: "查询成功~",
                type: 'success' 
              });
            }
            
          }
          this.deleteOperation = false
          this.totalElements = res.data.totalElements;
          this.tableData = res.data.data;
        },
        err => {
          console.log("err :", err);
        }
      );
    }
  }
};
</script>

<style>

.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

.upload {
  width: 200px;
  margin: 20px;
  float: right;
}
.my-pic {
  width: 48px;
  height: 27px;
}
.search {
  width: 50%;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}
.search-by-time {
  margin-top: 20px;
}
.my-btn {
  margin-top: 10px;
  margin-left: 20px;
}
</style>