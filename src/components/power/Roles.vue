<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="dialogRlies = true">添加角色</el-button>
      <el-table :data="roleslist" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级标签 -->
            <el-row
              :class="['el_row_B', index == 0 ? 'el_row_T' : '', 'vCenter']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5"
                ><el-tag
                  type="primary"
                  closable
                  @close="clearRolesById(scope.row, item.id)"
                  >{{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>

              <!-- 二三级便签 -->
              <el-col :span="19">
                <!-- 二级标签 -->
                <el-row
                  :class="[index1 == 0 ? '' : 'el_row_T', 'vCenter']"
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="clearRolesById(scope.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级便签 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      @close="clearRolesById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-help"
              @click="setRolesdialogFn(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加信息 -->
      <el-dialog
        title="添加角色"
        :visible.sync="dialogRlies"
        width="50%"
        @close="addClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addForm"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRlies = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改信息 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editClose"
      >
        <el-form
          :model="listById"
          :rules="listByIdRules"
          ref="listById"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="listById.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="listById.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRolesdialog"
        width="50%"
        @close="clearDefKeys"
      >
        <el-tree
          :data="setRoles"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer">
          <el-button @click="setRolesdialog = false">取 消</el-button>
          <el-button type="primary" @click="allowRoles">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    //获取角色列表
    this.getRoleslist();
  },
  props: {},
  data() {
    return {
      //获取角色列表
      roleslist: [],
      //添加角色对话框的显示与隐藏
      dialogRlies: false,
      //添加角色数据
      addForm: [],
      //添加角色表单验证数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加角色对话框的显示与隐藏
      editDialogVisible: false,
      //添加角色表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
      },

      //通过ID找寻的数据
      listById: {},
      //修改角色表单验证规则
      listByIdRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
      },

      //控制分配权限的显示与隐藏
      setRolesdialog: false,
      //分配权限的数据
      setRoles: [],
      //树形结构
      treeProps: {
        children: "children",
        label: "authName",
      },
      //默认选中的树的key的数组
      defKeys: [],
      //授予权限参数中的id
      roleid: "",
    };
  },
  methods: {
    //获取角色列表
    async getRoleslist() {
      let { data: res } = await this.axios.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.roleslist = res.data;
    },
    //监听新增对话框关闭
    addClose() {
      this.$refs.addForm.resetFields();
    },
    //增加用户
    addRoles() {
      //增加用户预验证
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return;
        //增加用户请求
        let { data: res } = await this.axios.post("roles", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        //隐藏对话框
        this.dialogRlies = false;
        //重新获取数据
        this.getRoleslist();
      });
    },

    //通过ID找寻数据
    async showEditDialog(id) {
      this.editDialogVisible = true;
      let { data: res } = await this.axios.get(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("查询用户失败");
      this.listById = res.data;
    },

    //监听修改对话框关闭
    editClose() {
      this.$refs.listById.resetFields();
    },

    //修改数据
    editRoles() {
      //增加用户预验证
      this.$refs.listById.validate(async (valid) => {
        if (!valid) return;
        //增加用户请求
        let { data: res } = await this.axios.put(
          `roles/${this.listById.roleId}`,
          this.listById
        );
        if (res.meta.status != 200) return this.$message.error("用户修改失败");
        this.$message.success("用户修改成功");
        //隐藏对话框
        this.editDialogVisible = false;
        //重新获取数据
        this.getRoleslist();
      });
    },

    //删除数据
    async removeRolesById(id) {
      let comfirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //点击确定返回值为confirm
      //点击取消返回值为cancel
      if (comfirmResult !== "confirm") return this.$message.info("取消了删除");

      let { data: res } = await this.axios.delete(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      else {
        this.$message.success("删除用户成功");
        this.getRoleslist();
      }
    },

    //删除权限
    async clearRolesById(a, b) {
      let clearRoles = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (clearRoles !== "confirm") return this.$message.info("用户取消了删除");

      //删除权限请求
      let { data: res } = await this.axios.delete(`roles/${a.id}/rights/${b}`);
      if (res.meta.status !== 200)
        return this.$message.error("删除用户权限失败");
      a.children = res.data;
    },

    //分配权限的请求
    async setRolesdialogFn(role) {
      this.roleid = role.id;
      //请求分配权限的数据
      let { data: res } = await this.axios.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.info("请求权限失败");
      this.setRoles = res.data;
      //通过调用递归函数获取三级菜单向数组中传值
      this.recursionFn(role, this.defKeys);
      //关闭对话框
      this.setRolesdialog = true;
    },
    //递归函数
    recursionFn(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => {
        this.recursionFn(item, arr);
      });
    },
    //关闭对话框清除defKeys数据
    clearDefKeys() {
      this.defKeys = [];
    },
    //点击确定分配权限
    async allowRoles() {
      let arrKeys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ];
      const narrKeys = arrKeys.join(",");

      //请求数据
      let { data: res } = await this.axios.post(`roles/${this.roleid}/rights`,{rids:narrKeys});
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("添加权限失败");
      this.$message.success("添加权限成功") ;
      //刷新列表
      this.getRoleslist();
      //关闭对话框
      this.setRolesdialog = false;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.el_row_T {
  border-top: 1px solid #eee;
}
.el_row_B {
  border-bottom: 1px solid #eee;
}
.vCenter {
  display: flex;
  align-items: center;
}
</style>
