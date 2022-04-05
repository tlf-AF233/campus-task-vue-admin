<template>
  <div class="root">
    <div class="search">
      <el-input placeholder="请输入课程号/教师名/课程名" v-model="courseSearchKey" clearable class="input-with-select">
        <el-button @click="searchCourse" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="my-flex">
      <el-select
        style="padding-top: 10px; width: 50%"
        v-model="collegeIdList"
        placeholder="请选择开课学院"
        multiple
        clearable>
        <el-option v-for="college in collegeList" :key="college.collegeId"
                   :label="college.name" :value="college.collegeId"> 
        </el-option>  
      </el-select>

      <el-button @click="searchCourse" class="my-btn" type="primary">开始搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
     
      <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="courseName" label="课程" show-overflow-tooltip></el-table-column>
      <el-table-column prop="courseTeacher" label="老师" show-overflow-tooltip></el-table-column>
      <el-table-column prop="collegeName" label="开课学院" show-overflow-tooltip></el-table-column>
      <el-table-column prop="studentNumber" label="人数" show-overflow-tooltip></el-table-column>
      
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button @click="deleteCourse(scope.row.courseId)" size="small" type="danger" round>结课</el-button>
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
      totalElements: 0, 
      tableData: [],
      courseSearchKey: "",
      collegeList: [],
      collegeIdList: [],
      deleteOperation: false
    };
  },
  created: function() {
    this.getCollegeList()
  },
  methods: {
    // 获取学院信息
    getCollegeList() {
      let objList = []
      getCollegeInfo().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((collegeItem, index) => {
          const collegeObj = { collegeId: collegeItem.collegeId, name: collegeItem.name }
          this.collegeList.push(collegeObj)
        })
      })
    },

    //分页大小
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
    },

   
    deleteCourse(id) {
      let that = this;
      this.$confirm("此操作将删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .req({
              url: "/api/course/v1/course/deleteCourse?id=" + id,
              data: {},
              Headers,
              method: "DELETE"
            })
            .then(
              res => {
                console.log("res :", res);
                that.deleteOperation = true
                that.searchCourse();
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
      this.searchCourse(page);
    },


    searchCourse() {
      console.log(this.courseSearchKey);
      this.req({
        url: '/api/course/v1/course/search',
        data: {
          courseSearchKey: this.courseSearchKey,
          collegeIdList: this.collegeIdList,
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


.search {
  width: 50%;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}

.my-btn {
  margin-top: 10px;
  margin-left: 20px;
}
</style>