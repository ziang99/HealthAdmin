<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索关键字" v-model="queryInfo.query" clearable @clear="getAdminUserList">
            <el-button slot="append" icon="el-icon-search" @click="getAdminUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="adminuserList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="slotProps">
            <!-- 修改 -->
            <el-button 
              type="primary" 
              icon="el-icon-edit" 
              size="mini" 
              @click="updataUser(slotProps.row.id)"
            ></el-button>
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
      <!-- 分页区域 -->
      <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 8]" 
        :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加内容提示框 -->
    <el-dialog title="添加管理员" :visible.sync="dialogVisible" width="50%" @close="addClose" center>
      <!-- 内容表单 -->
      <el-form :model="userForm" :rules="formRules" ref="addFormRef" label-width="70px" label-position="right" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改内容提示框 -->
    <el-dialog title="修改管理员信息" :visible.sync="updataDialog" width="50%" center @close="updataClose">
      <!-- 内容表单 -->
      <el-form :model="updataUserInfo" :rules="formRules" ref="updataFormRef" label-width="70px" label-position="right"
        status-icon>
        <el-form-item label="用户名">
          <el-input v-model="updataUserInfo.username" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updataUserInfo.password" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="updataDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdata">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { 
    getAdminUserList, 
    addAdminUserList,
    getAdminUser,
    updataAdminUser,
    delectAdminUser
  } from "network/adminuser.js";
  export default {
    name: 'AdminUser',
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
        // 总记录数
        total: 0,
        // 管理员数据
        adminuserList: [],
        // 添加提示框的显示与隐藏
        dialogVisible: false,
        // 添加用户的表单数据
        userForm: {
          username: '',
          password: ''
        },
        // 添加用户的表单验证规则
        formRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 2, max: 9, message: "长度在 2 到 9 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 2, max: 9, message: "长度在 2 到 9 个字符", trigger: "blur" }
          ]
        },
        // 要修改的那条用户信息
        updataUserInfo: {},
        // 修改提示框的显示与隐藏
        updataDialog: false,
      }
    },
    created() {
      this.getAdminUserList()
    },
    methods: {
      // 获取管理员列表的数据
      async getAdminUserList() {
        let res = await getAdminUserList(this.queryInfo)
        // console.log(res)
        if (res.code !== 200) {
          this.$message.error({
            message: "信息查询失败",
            center: true,
            showClose: true
          });
        }else{
          this.adminuserList = res.data
          this.total = res.total
        }
      },
      // 点击添加用户按钮时，打开对话框
      addUser () {
        this.dialogVisible = true
      },
      // 当添加对话框关闭时，重置表单
      addClose () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击确认添加按钮后，当校验整个添加表单信息都符合规则时，发起请求添加用户
      confirmAdd () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addAdminUserList(this.userForm)
            // console.log(res)
            if(res.code === 200){
              this.getAdminUserList()
              this.dialogVisible = false
              this.$message.success({
                message: "添加成功",
                center: true,
                showClose: true
              });
            }else{
              this.$message.error({
                message: "添加失败!可能是该用户名已存在~",
                center: true,
                showClose: true
              });
            }
          }
        })
      },
      // 点击修改按钮时
      async updataUser (userId) {
        // 接收到要修改的那条用户id,并根据id查询用户信息
        // console.log(userId)
        const res = await getAdminUser(userId)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该管理员信息失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataUserInfo = res.data
        }
        // 打开对话框
        this.updataDialog = true
      },
      // 当修改对话框关闭时，重置表单
      updataClose () {
        this.$refs.updataFormRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改用户信息
      confirmUpdata () {
        this.$refs.updataFormRef.validate(async state => {
          // console.log(state)
          if (state) {
            // state为true时，证明要修改提交的数据格式无误，则发起修改请求
            const res = await updataAdminUser(this.updataUserInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改管理员信息失败!',
                center: true,
                showClose: true
              })
            } else {
              this.getAdminUserList()
              this.updataDialog = false
              this.$message.success({
                message: '修改管理员信息成功!',
                center: true,
                showClose: true
              })
            }
          }
        })
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
          const res = await delectAdminUser(userId)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除操作失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getAdminUserList()
            this.$message({
              type: 'success',
              message: '已成功删除该用户！',
              center: true,
              showClose: true
            })
          }
        }
      },
      // 更新每页显示的条数
      handleSizeChange (newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getAdminUserList()
      },
      // 更新切换的页数
      handleCurrentChange (newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getAdminUserList()
      },
    },
  }
</script>

<style scoped>

</style>