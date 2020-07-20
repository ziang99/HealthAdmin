<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>阅读管理</el-breadcrumb-item>
      <el-breadcrumb-item>类目列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加类目</el-button>
        </el-col>
      </el-row>
      <!-- 类目列表 -->
      <el-table :data="readList" border stripe>
        <el-table-column type="expand">
          <template #default="{row}">
            <el-tag 
              closable 
              v-for="item in row.childrens" :key="item.id"
              @click="updataClass(item.id)"
              @close="delClass(item.id)"
            >
              {{item.content.substring(0, 24) + '...'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="content" label="类目"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="slotProps">
            <!-- 修改 -->
            <el-button 
              type="warning" 
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
    </el-card>

    <!-- 添加类目提示框 -->
    <el-dialog title="添加类目" :visible.sync="dialogVisible" width="40%" @close="addClose" center>
      <!-- 内容表单 -->
      <el-form :model="userForm" :rules="formRules" ref="addFormRef" label-width="100px" label-position="right" status-icon>
        <el-form-item label="类目名称" prop="content">
          <el-input v-model="userForm.content" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改类目提示框 -->
    <el-dialog title="修改类目信息" :visible.sync="updataDialog" width="40%" center @close="updataClose">
      <!-- 内容表单 -->
      <el-form :model="updataUserInfo" :rules="formRules" ref="updataFormRef" label-width="100px" label-position="right"
        status-icon>
        <el-form-item label="类目名称" prop="content">
          <el-input v-model="updataUserInfo.content" clearable></el-input>
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
    getReadList, 
    addReadName, 
    getReadName, 
    updataRead, 
    delectRead,
  } from 'network/readlist.js'
  export default {
    name: 'Readlist',
    data() {
      return {
        // 阅读列表数据
        readList: [],
        // 添加类目提示框的显示与隐藏
        dialogVisible: false,
        // 添加类目的表单数据
        userForm: {
          content: "",
          pid: 0,
          level: 0
        },
        // 添加类目的表单验证规则
        formRules: {
          content: [
            { required: true, message: "请输入类目名称", trigger: "blur" },
            { min: 1, max: 9, message: "长度在 1 到 9 个字符", trigger: "blur" }
          ]
        },
        // 要修改的那条年级信息
        updataUserInfo: {},
        // 修改年级提示框的显示与隐藏
        updataDialog: false,

      }
    },
    created() {
      this.getReadList()
    },
    methods: {
      async getReadList() {
        let res = await getReadList()
        // console.log(res)
        if(res.code === 200){
          this.readList = res.data
        }else{
          this.$message.error({
            message: "信息加载失败",
            center: true,
            showClose: true
          });
        }
      },
      // 点击添加类目按钮时，打开对话框
      addUser () {
        this.dialogVisible = true
      },
      // 当添加类目对话框关闭时，重置表单
      addClose () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击确认添加按钮后，当校验整个添加表单信息都符合规则时，发起请求添加类目
      confirmAdd () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addReadName(this.userForm)
            // console.log(res)
            if(res.code === 200){
              this.getReadList()
              this.dialogVisible = false
              this.$message.success({
                message: "添加成功",
                center: true,
                showClose: true
              });
            }else{
              this.$message.error({
                message: "添加失败!可能是该年级名称已存在~",
                center: true,
                showClose: true
              });
            }
          }
        })
      },
      // 点击修改类目按钮时
      async updataUser (userId) {
        // console.log(userId)
        const res = await getReadName(userId)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该类目名称失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataUserInfo = res.data
        }
        // 打开对话框
        this.updataDialog = true
      },
      // 当修改类目对话框关闭时，重置表单
      updataClose () {
        this.$refs.updataFormRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改类目信息
      confirmUpdata () {
        this.$refs.updataFormRef.validate(async state => {
          // console.log(state)
          if (state) {
            // state为true时，证明要修改提交的数据格式无误，则发起修改请求
            const res = await updataRead(this.updataUserInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改失败!可能是该类目已存在~',
                center: true,
                showClose: true
              })
            } else {
              this.getReadList()
              this.updataDialog = false
              this.$message.success({
                message: '修改成功!',
                center: true,
                showClose: true
              })
            }
          }
        })
      },
      // 点击删除类目按钮时
      async delUser (userId) {
        // console.log(userId)
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
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
          const res = await delectRead(userId)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除操作失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getReadList()
            this.$message({
              type: 'success',
              message: '删除成功！',
              center: true,
              showClose: true
            })
          }
        }
      },

    },
  }
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }
</style>