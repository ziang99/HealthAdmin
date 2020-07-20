<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加年级</el-button>
        </el-col>
      </el-row>
      <!-- 年级列表 -->
      <el-table :data="classList" border stripe>
        <el-table-column type="expand">
          <template #default="{row}">
            <el-tag 
              closable 
              v-for="item in row.childrens" :key="item.id"
              @click="updataClass(item.id)"
              @close="delClass(item.id)"
            >
              {{item.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="年级名称"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="slotProps">
            <!-- 添加 -->
            <el-tooltip class="item" popper-class="draw_share_atooltip" effect="dark" content="点击添加所属班级" placement="left-start">
              <el-button 
                type="primary" 
                icon="el-icon-plus" 
                size="mini" 
                @click="addClass(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
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

    <!-- 添加年级提示框 -->
    <el-dialog title="添加年级" :visible.sync="dialogVisible" width="40%" @close="addClose" center>
      <!-- 内容表单 -->
      <el-form :model="userForm" :rules="formRules" ref="addFormRef" label-width="100px" label-position="right" status-icon>
        <el-form-item label="年级名称" prop="name">
          <el-input v-model="userForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改年级提示框 -->
    <el-dialog title="修改年级信息" :visible.sync="updataDialog" width="40%" center @close="updataClose">
      <!-- 内容表单 -->
      <el-form :model="updataUserInfo" :rules="formRules" ref="updataFormRef" label-width="100px" label-position="right"
        status-icon>
        <el-form-item label="年级名称" prop="name">
          <el-input v-model="updataUserInfo.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="updataDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdata">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加班级提示框 -->
    <el-dialog title="添加班级" :visible.sync="addClassDialog" width="40%" @close="addClassClose" center>
      <!-- 内容表单 -->
      <el-form :model="classForm" :rules="classRules" ref="addClassRef" label-width="100px" label-position="right" status-icon>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="addClassDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddClass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改班级提示框 -->
    <el-dialog title="修改班级信息" :visible.sync="updataClassDialog" width="40%" center @close="updataClassClose">
      <!-- 内容表单 -->
      <el-form :model="updataClassInfo" :rules="classRules" ref="updataClassRef" label-width="100px" label-position="right"
        status-icon>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="updataClassInfo.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="updataClassDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdataClass">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
     getClassList,
     addGradeName, 
     getGradeName, 
     updataGrade, 
     delectGrade,
     addClassName,
     updataClass,
     getClassName,
     delectClass
  } from "network/class.js";
  export default {
    name: 'ClassList',
    data() {
      return{
        // 班级数据
        classList: [],
        // 添加年级提示框的显示与隐藏
        dialogVisible: false,
        // 添加年级的表单数据
        userForm: {
          name: "",
          pid: 0,
          level: 0
        },
        // 添加年级的表单验证规则
        formRules: {
          name: [
            { required: true, message: "请输入年级名称", trigger: "blur" },
            { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
          ]
        },
        // 要修改的那条年级信息
        updataUserInfo: {},
        // 修改年级提示框的显示与隐藏
        updataDialog: false,

        // 添加班级的对话框
        addClassDialog: false,
        // 添加班级的表单数据
        classForm: {
          name: "",
          pid: null,
          level: 1
        },
        // 添加班级的表单验证规则
        classRules: {
          name: [
            { required: true, message: "请输入班级名称", trigger: "blur" },
            { min: 2, max: 6, message: "长度在 2 到 16 个字符", trigger: "blur" }
          ]
        },
        // 修改班级提示框的显示与隐藏
        updataClassDialog: false,
        // 要修改的那条班级信息
        updataClassInfo: {},
      }
    },
    created() {
      this.getClassList()
    },
    methods: {
      // 获取班级列表的数据
      async getClassList() {
        let res = await getClassList()
        // console.log(res)
        if(res.code === 200){
          this.classList = res.data
        }else{
          this.$message.error({
            message: "信息加载失败",
            center: true,
            showClose: true
          });
        }
      },
      // 点击添加年级按钮时，打开对话框
      addUser () {
        this.dialogVisible = true
      },
      // 当添加年级对话框关闭时，重置表单
      addClose () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击确认添加按钮后，当校验整个添加表单信息都符合规则时，发起请求添加年级
      confirmAdd () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addGradeName(this.userForm)
            // console.log(res)
            if(res.code === 200){
              this.getClassList()
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
      // 点击修改年级按钮时
      async updataUser (userId) {
        // 接收到要修改的那条用户id,并根据id查询用户信息
        // console.log(userId)
        const res = await getGradeName(userId)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该年级名称失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataUserInfo = res.data
        }
        // 打开对话框
        this.updataDialog = true
      },
      // 当修改年级对话框关闭时，重置表单
      updataClose () {
        this.$refs.updataFormRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改年级信息
      confirmUpdata () {
        this.$refs.updataFormRef.validate(async state => {
          // console.log(state)
          if (state) {
            // state为true时，证明要修改提交的数据格式无误，则发起修改请求
            const res = await updataGrade(this.updataUserInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改失败!可能是该名称已存在~',
                center: true,
                showClose: true
              })
            } else {
              this.getClassList()
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
      // 点击删除年级按钮时
      async delUser (userId) {
        // console.log(userId)
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
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
          const res = await delectGrade(userId)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除操作失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getClassList()
            this.$message({
              type: 'success',
              message: '删除成功！',
              center: true,
              showClose: true
            })
          }
        }
      },

      // 打开添加班级的对话框
      addClass(e) {
        this.classForm.pid = e
        this.addClassDialog = true
      },
      // 当添加班级对话框关闭时，重置表单
      addClassClose () {
        this.$refs.addClassRef.resetFields()
      },
      // 点击确认添加按钮后，当校验整个添加表单信息都符合规则时，发起请求添加班级
      confirmAddClass () {
        this.$refs.addClassRef.validate(async valid => {
          // console.log(valid)
          if (valid) {
            const res = await addClassName(this.classForm)
            // console.log(res)
            if(res.code === 200){
              this.getClassList()
              this.addClassDialog = false
              this.$message.success({
                message: "添加成功",
                center: true,
                showClose: true
              });
            }else{
              this.$message.error({
                message: "添加失败!可能是该名称已存在~",
                center: true,
                showClose: true
              });
            }
          }
        })
      },
      // 点击修改班级弹出对话框
      async updataClass(e) {
        const res = await getClassName(e)
        // console.log(res)
        if (res.code !== 200) {
          return this.$message.error({
            message: '获取该班级名称失败!',
            center: true,
            showClose: true
          })
        } else {
          this.updataClassInfo = res.data
        }
        // 打开对话框
        this.updataClassDialog = true
      },
      // 当修改班级对话框关闭时，重置表单
      updataClassClose () {
        this.$refs.updataClassRef.resetFields()
      },
      // 点击确认修改按钮后，当校验整个修改表单信息都符合规则时，发起请求修改班级信息
      confirmUpdataClass () {
        this.$refs.updataClassRef.validate(async state => {
          // console.log(state)
          if (state) {
            // state为true时，证明要修改提交的数据格式无误，则发起修改请求
            const res = await updataClass(this.updataClassInfo)
            // console.log(res)
            if (res.code !== 200) {
              return this.$message.error({
                message: '修改失败!可能是该名称已存在~',
                center: true,
                showClose: true
              })
            } else {
              this.getClassList()
              this.updataClassDialog = false
              this.$message.success({
                message: '修改成功!',
                center: true,
                showClose: true
              })
            }
          }
        })
      },
      // 删除该班级
      async delClass(e) {
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
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
          const res = await delectClass(e)
          // console.log(res)
          if (res.code !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败！',
              center: true,
              showClose: true
            })
          } else {
            this.getClassList()
            this.$message({
              type: 'success',
              message: '删除成功！',
              center: true,
              showClose: true
            })
          }
        }
      }

    },
  }
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }
</style>