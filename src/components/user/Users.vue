<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getUserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userlist" style="width: 100%" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>

        <el-table-column prop="email" label="邮箱"> </el-table-column>

        <el-table-column prop="mobile" label="电话"> </el-table-column>

        <el-table-column prop="role_name" label="角色"> </el-table-column>

        <el-table-column label="状态">
          <template v-slot="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="操作" width="180">
          <template v-slot="scope">
            <!-- {{ scope.row }} -->
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="reviseuser(scope.row.id)"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-help"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addClose"
      >
        <el-form
          :model="ruleForm"
          :rules="addrules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="reviseClose"
      >
        <el-form
          :model="reviseForm"
          :rules="reviseFormRules"
          ref="reviseFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="reviseForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="reviseForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="reviseForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="revisUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserlist();
  },
  props: {},
  data() {
    //验证邮箱
    let checkEmail = (rule, value, callback) => {
      let zzemail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

      if (zzemail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的邮箱地址"));
    };

    //验证手机号
    let checkMobile = (rule, value, callback) => {
      let zzmobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;

      if (zzmobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };

    return {
      //users请求参数参数
      queryinfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,

      //控制添加对话框的显示与隐藏
      dialogVisible: false,
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //修改对话框的数据
      reviseForm: {},

      //表单验证参数
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单验证规则
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      //修改表单验证规则
      reviseFormRules: {
        email: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取后台数据
    async getUserlist() {
      let { data: res } = await this.axios.get("/users", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    //监听每页显示多少条数据
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.getUserlist();
    },
    //监听页码值改变
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getUserlist();
    },

    //改数据库，开关
    async userStatusChange(userinfo) {
      let { data: res } = await this.axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status == 200) {
        return this.$message.success("状态修改成功");
      } else {
        this.$message.error("状态修改失败");
        userinfo.mg_state = !userinfo.mg_state;
      }
    },

    //监听增添用户关闭事件
    addClose() {
      this.$refs.ruleForm.resetFields();
    },

    //添加事件
    adduser() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return this.$message.error("添加用户失败");
        //发起添加用户的请求
        let { data: res } = await this.axios.post("users", this.ruleForm);
        console.log(res);
        if (res.meta.status != 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        //隐藏对话框
        this.dialogVisible = false;
        //重新获取数据
        this.getUserlist();
      });
    },

    //修改事件
    async reviseuser(id) {
      this.editDialogVisible = true;
      let { data: res } = await this.axios.get(`/users/${id}`);
      if (res.meta.status != 200) return this.$message.error("查询用户失败");
      this.reviseForm = res.data;
    },

    //监听修改用户关闭事件
    reviseClose() {
      this.$refs.reviseFormRef.resetFields();
    },

    //用户修改提交
    revisUserInfo() {
      this.$refs.reviseFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("用户修改失败");
        //修改用户信息的请求
        let { data: res } = await this.axios.put(
          `users/${this.reviseForm.id}`,
          {
            email: this.reviseForm.email,
            mobile: this.reviseForm.mobile,
          }
        );

        if (res.meta.status != 200) return this.$message.error("修改用户失败");
        this.$message.success("修改用户成功");
        //隐藏对话框
        this.editDialogVisible = false;
        //重新获取数据
        this.getUserlist();
      });
    },

    //通过id删除用户
    async removeUserById(id) {
      let comfirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //点击确定返回值为confirm
      //点击取消返回值为cancel
      if (comfirmResult !== 'confirm') return this.$message.info("取消了删除");

      let{data:res}= await this.axios.delete(`users/${id}`)
      if(res.meta.status!==200) return this.$message.error("删除用户失败");
      else{
        this.$message.success("删除用户成功")
        this.getUserlist()
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
