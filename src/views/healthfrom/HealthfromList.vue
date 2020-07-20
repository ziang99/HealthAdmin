<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>健康表单管理</el-breadcrumb-item>
      <el-breadcrumb-item>健康表单列表</el-breadcrumb-item>
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
        <el-col :span="14">
          <el-tag type="info">0-否</el-tag>
          <el-tag type="info">1-是</el-tag>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="healthList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column align="center" prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="contact" label="是否接触过疑似患者" width="160"></el-table-column>
        <el-table-column align="center" prop="cold" label="是否有感冒等症状" width="160"></el-table-column>
        <el-table-column align="center" prop="symptom" label="是否有喘憋、呕吐等症状"></el-table-column>
        <el-table-column align="center" prop="dangerous" label="是否经过或逗留高风险地区"></el-table-column>
        <el-table-column align="center" prop="temperature" label="体温" width="100"></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import { getHealthFrom } from 'network/healthFrom.js'
  export default {
    name: 'HealthfromList',
    data() {
      return {
        // 健康表单数据
        healthList: [],
        // 参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 4
        },
      }
    },
    created() {
      this.getHealthFrom()
    },
    methods: {
      async getHealthFrom() {
        let res = await getHealthFrom()
        // console.log(res)
        if(res.code === 200){
          this.healthList = res.data
        }else{
          this.$message.error({
            message: "加载失败",
            center: true,
            showClose: true
          });
        }
      }
    },
  }
</script>

<style scoped>
  .el-col-14{
    text-align: right;
    height: 40px;
    line-height: 40px;
  }
  .el-tag--info{
    margin-left: 10px;
  }
</style>