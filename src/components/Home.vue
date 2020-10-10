<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img class="user-avatar" src="../assets/aa.jpg" alt="" />
      </div>
        <span>体育后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边区域-->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--一级-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"/>
              <span>{{item.menuName}}</span>
            </template>
            <!--二级-->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu" />
                <span>{{subItem.menuName}}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体区域-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],

      // icon
      iconsObj: {
        '1': 'iconfont icon-user',
        '3': 'iconfont icon-tijikongjian'
      },
      // 菜单折叠与展开
      isCollapse: false,

      // 激活的链接地址
      activePath: ''
    }
  },

  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 获取左侧菜单列表
    async getMenuList () {
      const { data: res } = await this.$http.get('/menu/menuList')
      if (res.code !== 200) return this.$message.error(res.data.message)
      this.menuList = res.data
      console.log(res)
    },

    // 菜单折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 1;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 5px;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  margin-top: 8px;
}
</style>
