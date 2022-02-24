<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row style="marginBottom: 15px">
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="goodsCateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text=""
        border
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 等级列 -->
        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作列 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="deleteCate(scope.row.cat_id)">删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="closeAddCate"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateForm"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options用来指定数据源 -->
            <el-cascader
              v-model="cateValue"
              :options="parentCateList"
              :props="cateJiLianList"
              expand-trigger="hover"
              @change="handleChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateDialog">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog
        title="编辑数据"
        :visible.sync="editCateDialogVisible"
        width="50%"
      >
        <el-form
          :model="editRuleForm"
          :rules="editRuleFormRules"
          ref="editRuleForm"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editRuleForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除 -->
    </el-card>
  </div>
</template>
      

<script>
export default {
  created() {
    this.getCateList();
  },
  props: {},
  data() {
    return {
      //商品分类列表参数
      querInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      //商品列表数据
      goodsCateList: [],
      //商品列表条数
      total: 0,

      //表格树数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        //作用域插槽渲染是否有效
        {
          label: "是否有效",
          //当前列为自定义模板列
          type: "template",
          //当前列使用的模板名称
          template: "isok",
        },
        //作用域插槽渲染等级
        {
          label: "等级",
          //当前列为自定义模板列
          type: "template",
          //当前列使用的模板名称
          template: "level",
        },
        //作用域插槽渲染操作
        {
          label: "操作",
          //当前列为自定义模板列
          type: "template",
          //当前列使用的模板名称
          template: "opt",
          width: "200",
        },
      ],

      //添加分类对话框的显示与隐藏
      addDialogVisible: false,
      //添加对话框的数据
      addCateForm: {
        cat_name: "",
        //默认为父类
        cat_pid: 0,
        //默认为一级
        cat_level: 0,
      },
      //添加对话框的数据验证
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },

      //获取的父级数据
      parentCateList: [],
      //级联选择器props数据
      cateJiLianList: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择器数据改变的数组
      cateValue: [],

      //编辑对话框的显示与隐藏
      editCateDialogVisible: false,
      //编辑对话框的数据
      editRuleForm: {
        cat_name: "",
      },
      //编辑对话框的数据验证
      editRuleFormRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
      //编辑对话框的id值
      editId: "",
    };
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.axios.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.goodsCateList = res.data.result;
      this.total = res.data.total;
    },

    //分页器
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage;
      this.getCateList();
    },

    //添加分类按钮
    showAddDialogVisible() {
      //点击获取父级分类
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    //获取父级分类
    async getParentCateList() {
      let { data: res } = await this.axios.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      this.parentCateList = res.data;
    },
    handleChange() {
      if (this.cateValue.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.cateValue[this.cateValue.length - 1];
        //父级分类的等级
        this.addCateForm.cat_level = this.cateValue.length;
        return;
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0;
        //父级分类的等级
        this.addCateForm.cat_level = 0;
      }
    },
    //点击确定添加数据
    addCateDialog() {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.axios.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) return this.$message.error("添加数据失败");
        this.$message.success("添加数据成功");
        this.getCateList();
        this.addDialogVisible = false;
      });
    },
    //添加对话框关闭重置
    closeAddCate() {
      this.$refs.addCateForm.resetFields();
      this.cateValue = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    //编辑对话框的显示与根据id获取数据
    async editCateDialog(id) {
      //请求后台获取数据
      let { data: res } = await this.axios.get(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.editRuleForm.cat_name = res.data.cat_name;
      this.editId = res.data.cat_id;

      //显示修改对话框
      this.editCateDialogVisible = true;
    },
    //发送请求修改数据
    editCate() {
      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.axios.put(
          `categories/${this.editId}`,
          this.editRuleForm
        );
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },

    //删除
    async deleteCate(id){
      let confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!='confirm') return this.$message.info('取消了删除')
        let {data:res}= await this.axios.delete(`categories/${id}`)
        if (res.meta.status !== 200) return this.$message.error("删除用户失败");
        this.$message.error("删除用户成功")
        this.getCateList();
        
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
