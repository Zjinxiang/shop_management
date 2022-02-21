<template>
  <el-container class="home_box">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="@/assets/homelogo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideFold ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleFold">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          unique-opened
          active-text-color="#409EFF"
          :collapse="asideFold"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + ite.path + ''"
              v-for="ite in item.children"
              :key="ite.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ ite.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenu();
  },
  props: {},
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "el-icon-s-custom",
        103: "el-icon-s-claim",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-marketing",
      },
      asideFold: false,
    };
  },
  methods: {
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenu() {
      let { data: res } = await this.axios.get("menus");
      if (res.meta.status !== 200) return this.$message.erroe(res.meta.msg);
      this.menulist = res.data;
    },
    //侧边栏折叠
    toggleFold() {
      this.asideFold = !this.asideFold;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.home_box {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 20px;
  div {
    width: 14%;
    height: 70%;
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 100%;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle_button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
