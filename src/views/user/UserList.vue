<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入搜索关键字" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column prop="class" label="班级"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="slotProps">
            <!-- 删除 -->
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="delUser(slotProps.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getUserList, delectUser } from "network/userList.js";
  export default {
    name: 'UserList',
    data() {
      return{
        // 获取用户列表的参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 4
        },
        // 用户数据
        userList: []
      }
    },
    created() {
      // 获取用户列表的数据
      this.getUserList()
    },
    methods: {
      // 获取用户列表的数据
      async getUserList() {
        let res = await getUserList()
        // console.log(res)
        if (res.code !== 200) {
          this.$message.error({
            message: "信息查询失败",
            center: true,
            showClose: true
          });
        }else{
          this.userList =  res.data
        }
      },
      // 点击删除按钮时
      async delUser (userId) {
        // console.log(userId)
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err => err)
        // console.log(res)
        if (res !== 'confirm') {
          return this.$message({
            type: 'info',
            message: '已取消删除操作！',
            center: true,
            showClose: true
          })
        } else {
          const res = await delectUser(userId)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除操作失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getUserList()
            this.$message({
              type: 'success',
              message: '已成功删除该用户！',
              center: true,
              showClose: true
            })
          }
        }
      },
    }

  }
</script>

<style scoped>

</style>