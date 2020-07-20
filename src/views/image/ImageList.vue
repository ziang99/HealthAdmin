<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      <el-breadcrumb-item>图片列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-upload
            :action="baseurl + '/admin/image/upload'"
            :show-file-list="false"
            :headers="tokenObj"
            :on-success="successFile"
          >
            <el-button type="primary">图片上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <!-- 图片列表 -->
      <el-table :data="imageList" border stripe :row-key="rowKey">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="图片" prop="url" align="center">
          <template v-slot="{row}">
            <el-image style="width: 100px; height: 100px" 
            :src="baseurl + row.url" fit="fill" >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{row}">
            <!-- 修改 -->
            <el-upload
              :action="baseurl + '/admin/image/update'"
              :show-file-list="false"
              :headers="tokenObj"
              :on-success="successUpdata"
              :data="{ id: row.id }"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-upload>
            <!-- 删除 -->
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="delImage(row.id)"
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
  </div>
</template>

<script>
  import { getImageList, delImage } from "network/image.js";
  export default {
    name: 'ImageList',
    data() {
      return {
        baseurl: '',
        // 获取图片列表的参数对象
        queryInfo: {
          // 搜索框关键字
          query: '',
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 2
        },
        // 总记录数
        total: 0,
        // 图片数据
        imageList: []
      }
    },
    computed: {
      tokenObj() {
        return {
          'token': window.sessionStorage.getItem('token')
        }
      }
    },
    created() {
      this.baseurl = this.baseURL
      this.getImageList()
    },
    methods: {
      // 获取管理员列表的数据
      async getImageList() {
        let res = await getImageList(this.queryInfo)
        // console.log(res)
        if (res.code !== 200) {
          this.$message.error({
            message: "信息查询失败",
            center: true,
            showClose: true
          });
        }else{
          this.imageList = res.data
          this.total = res.total
        }
      },
      // 当图片上传成功后
      successFile(response) {
        // console.log(response)
        if(response.code === 200){
          this.getImageList()
          this.$message.success({
            message: "上传成功",
            center: true,
            showClose: true
          });
        }else if(response.code === 401) {
          this.$message.error({
            message: "图片太大",
            center: true,
            showClose: true
          });
        }else if(response.code === 402) {
          this.$message.error({
            message: "格式有误",
            center: true,
            showClose: true
          });
        }else{
          this.$message.error({
            message: "上传失败",
            center: true,
            showClose: true
          });
        }
      },
      // 当图片修改成功后
      successUpdata(response) {
        if(response.code === 200){
          this.getImageList()
          this.$message.success({
            message: "修改成功",
            center: true,
            showClose: true
          });
        }else if(response.code === 401) {
          this.$message.error({
            message: "图片太大",
            center: true,
            showClose: true
          });
        }else if(response.code === 402) {
          this.$message.error({
            message: "格式有误",
            center: true,
            showClose: true
          });
        }else{
          this.$message.error({
            message: "修改失败",
            center: true,
            showClose: true
          });
        }
      },
      // 更新每页显示的条数
      handleSizeChange (newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getImageList()
      },
      // 更新切换的页数
      handleCurrentChange (newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getImageList()
      },
      // 删除图片
      async delImage(e) {
        // 弹框询问是否确认删除
        const res = await this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
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
          let res = await delImage(e)
          // console.log(res)
          if(res.code === 200){
            this.getImageList()
            this.$message.success({
              message: "图片删除成功",
              center: true,
              showClose: true
            });
          }else{
            this.$message.error({
              message: "图片删除失败",
              center: true,
              showClose: true
            });
          }
        }
      },
      // 设置每一行的key 以保证添加时的顺序
      rowKey(row) {
        return row.id
      }
    },
  }
</script>

<style scoped>
  .cell div{
    display: inline-block;
    margin-right: 10px;
  }
</style>