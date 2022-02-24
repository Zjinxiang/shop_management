<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="警告提示的文案"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品区域 -->
      <el-row class="Paramsrow">
        <el-col>
          <span>请选择商品的分类：</span>
          <el-cascader
            v-model="value"
            :options="paramsList"
            expand-trigger="hover"
            :props="ParamsProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数页面 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close='removeTag(index,scope.row)'
                >
                  {{ item }}
                </el-tag>

                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsGetMessage(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="clearParams(scope.row.attr_id)"
                  >删除</el-button
                ></template
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性页面 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close='removeTag(index,scope.row)'
                >
                  {{ item }}
                </el-tag>

                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsGetMessage(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="clearParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加对话框 -->
      <el-dialog
        :title="'添加' + titltList"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="closeAdd"
      >
        <el-form
          :model="addRuleForm"
          :rules="addRuleFormRules"
          ref="addRuleForm"
          label-width="100px"
        >
          <el-form-item :label="titltList" prop="attr_name">
            <el-input v-model="addRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改对话框 -->
      <el-dialog
        :title="'修改' + titltList"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="closeedit"
      >
        <el-form
          :model="editRuleForm"
          :rules="editRuleFormRules"
          ref="editRuleForm"
          label-width="100px"
        >
          <el-form-item :label="titltList" prop="attr_name">
            <el-input v-model="editRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    //获取分类数据
    this.getParamsList();
  },
  props: {},
  data() {
    return {
      //分类数据列表
      paramsList: [],
      //级联选择框双向绑定的数据
      value: [],
      //级联选择框props配置
      ParamsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //页签双向绑定
      activeName: "many",
      //动态页面的数据
      manyTableDate: [],
      //静态页面的数据
      onlyTableDate: [],

      //控制添加对话框显示与隐藏
      addDialogVisible: false,
      //添加参数的表单数据对象
      addRuleForm: {
        attr_name: "",
      },
      //验证规则
      addRuleFormRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },

      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //修改参数的表单数据对象
      editRuleForm: {
        attr_name: "",
      },
      //验证规则
      editRuleFormRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    //请求分类数据
    async getParamsList() {
      let { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.paramsList = res.data;
    },
    //级联选择框数据改变函数
    handleChange() {
      if (this.value.length != 3) {
        this.value = [];
        this.$message.warning("暂无此项");
        this.manyTableDate=[]
        this.onlyTableDate=[]
        return;
      }
      this.getParamscs();
    },

    //请求获取参数列表
    async getParamscs() {
      let { data: res } = await this.axios.get(
        `categories/${this.getId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");

      res.data.forEach((item) => {
        //遍历出数据以便V-for
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];

        //防止添加按钮一改全改
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName == "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },

    //页签点击事件处理函数
    handleClick() {
      this.getParamscs();
    },

    //添加对话框关闭函数
    closeAdd() {
      this.$refs.addRuleForm.resetFields();
    },
    //发送请求，添加数据
    addParams() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.axios.post(
          `categories/${this.getId}/attributes`,
          {
            attr_name: this.addRuleForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加数据失败");
        this.$message.success("添加数据成功");
        this.getParamscs();
        this.addDialogVisible = false;
      });
    },

    //修改数据对话框显示并获取数据
    async editParamsGetMessage(id) {
      //发送请求获取数据
      let { data: res } = await this.axios.get(
        `categories/${this.getId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.editRuleForm = res.data;

      this.editDialogVisible = true;
    },
    //修改对话框关闭函数
    closeedit() {
      this.$refs.editRuleForm.resetFields();
    },
    //发送请求修改数据
    editParams() {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.axios.put(
          `categories/${this.getId}/attributes/${this.editRuleForm.attr_id}`,
          {
            attr_name: this.editRuleForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        this.getParamscs();
        this.editDialogVisible = false;
      });
    },

    //删除
    async clearParams(id) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消了删除");

      //请求数据
      let { data: res } = await this.axios.delete(
        `categories/${this.getId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除数据失败");
      this.$message.success("删除数据成功");
      this.getParamscs();
    },

    //添加按钮切换函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {

        row.inputValue = "";
        row.inputVisible = false;
        return
      }
      //输入合法
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //发送请求添加数据
      let{data:res}= await this.axios.put(`categories/${this.getId}/attributes/${row.cat_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(","),
      });
      if(res.meta.status!==200)return this.$message.error('提交参数失败')
      this.$message.success('提交参数成功')
    },
    //删除按钮
    async removeTag(index,row){
      row.attr_vals.splice(index,1)
      //发送请求添加数据
      let{data:res}= await this.axios.put(`categories/${this.getId}/attributes/${row.cat_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(","),
      });
      if(res.meta.status!==200)return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
    },
    //添加按钮出现input框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  components: {},
  computed: {
    //控制在选中三级的时候按钮才可用
    btnDisabled() {
      if (this.value.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    //获取当前选中的三级分类的ID
    getId() {
      if (this.value.length == 3) {
        return this.value[2];
      } else {
        return null;
      }
    },
    //添加对话框动态绑定标题
    titltList() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style scoped lang="less">
.Paramsrow {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 130px;
}
</style>
