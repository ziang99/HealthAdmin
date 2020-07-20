<template>
  <el-container class="containerStyle">
    <!-- 头部区域 -->
    <el-header>
      <div class="header_left">
        <img src="~assets/img/logo.jpg">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" size="medium" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="collapse?'64px':'200px'">
        <!-- 折叠按钮 -->
        <div class="toggle_button" @click="toggleMenu">|||</div>
        <!-- 左侧边栏菜单区域 -->
        <el-menu 
          router
          :collapse="collapse"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :default-active="currentMenu"
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-submenu 
            v-for="item in menuList" :key="item.id"
            :index="item.id + ''" 
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
              v-for="cItem in item.childrens" :key="cItem.id"
              :index="cItem.path" 
              @click="keepPath(cItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{cItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { getMenuList } from 'network/home.js';
  export default {
    name: 'Home',
    data() {
      return {
        // 折叠菜单
        collapse: false,
        // 左侧菜单数据列表
        menuList: [],
        // 当前选中二级菜单的index
        currentMenu: '',
        // 一级菜单图标
        iconObj: {
          1: 'el-icon-user',
          2: 'el-icon-s-home',
          3: 'el-icon-picture-outline',
          4: 'el-icon-first-aid-kit',
          5: 'el-icon-document-checked',
          6: 'el-icon-document',
          7: 'el-icon-s-custom',
        },
      }
    },
    created () {
      this.currentMenu = window.sessionStorage.getItem('activePath') || '';
      this.getMenuList()
    },
    methods: {
      // 退出功能
      logout () {
        window.sessionStorage.clear('token')
        window.sessionStorage.clear('username')
        this.$router.replace('/login')
      },
      // 菜单的折叠与展开
      toggleMenu () {
        this.collapse = !this.collapse
      },
      // 当点击每个二级菜单时，保存路径信息到 sessionStorage
      keepPath (path) {
        window.sessionStorage.setItem('activePath', path)
        this.currentMenu = path
      },
      // 获取左侧菜单数据
      async getMenuList() {
        let res = await getMenuList()
        // console.log(res)
        if(res.code === 200){
          this.menuList = res.data
        }else{
          this.$message.error({
            message: "菜单信息加载失败",
            center: true,
            showClose: true
          });
        }
      }

    },
  }
</script>

<style scoped>
  .containerStyle {
    height: 100vh;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }
  .header_left {
    display: flex;
    align-items: center;
  }
  .header_left img {
    display: block;
    border-radius: 100%;
    box-shadow: 0 0 8px #999;
    width: 50px;
  }
  .header_left span {
    margin-left: 20px;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border: none;
  }
  .toggle_button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;    /* 光标变成小手 */
  }
</style>