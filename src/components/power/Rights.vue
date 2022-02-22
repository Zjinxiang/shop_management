<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightslist" stripe style="width: 100%" border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    //获取权限列表
    this.getRightslist();
  },
  props: {},
  data() {
    return {
      //获取权限列表
      rightslist: [],
    };
  },
  methods: {
    //获取权限列表
    async getRightslist() {
      let { data: res } = await this.axios.get("rights/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightslist = res.data;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
