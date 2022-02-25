<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        show-icon
        :closable="false"
        center=""
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="stepIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tap栏 -->
      <el-form
        :model="addruleForm"
        :rules="addruleFormRules"
        ref="addruleForm"
        label-width="100px"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="stepIndex"
          :before-leave="goToNewTag"
          @tab-click="tableClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addruleForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addruleForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addruleForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addruleForm.goods_cat"
                :options="addList"
                expand-trigger="hover"
                :props="propsList"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数渲染 -->
            <el-form-item
              v-for="(item, index) in manyDataList"
              :key="index"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, index1) in item.attr_vals"
                  :key="index1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(item, index) in onlyDataList"
              :key="index"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="removeImg"
              list-type="picture"
              :headers="headersObj"
              :on-success="successImg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addruleForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="buttonaa" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="imageUrl" alt="" class="dialogImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  created() {
    this.getAddList();
  },
  props: {},
  data() {
    //验证价格、重量、数量
    let checkNumber = (rule, value, callback) => {
      let zzNumber = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;

      if (zzNumber.test(value)) {
        return callback();
      }
      callback(new Error("请正确输入"));
    };
    return {
      //步骤条进度
      stepIndex: "0",
      //添加表单数据
      addruleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        //商品分类数据
        goods_cat: [],
        //上传图片的数据
        pics: [],
        //商品描述
        goods_introduce: "",
        //商品参数
        attrs: [],
      },
      //添加表单数据验证规则
      addruleFormRules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
      },
      //添加表单数据列表
      addList: [],

      //级联选择器的props属性
      propsList: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      //动态参数列表
      manyDataList: [],
      //静态属性列表
      onlyDataList: [],

      //请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //点击图片预览路径
      imageUrl: "",
      //图片预览对话框的显示与隐藏
      imgDialogVisible: false,
    };
  },
  methods: {
    //获取添加数据
    async getAddList() {
      let { data: res } = await this.axios.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.addList = res.data;
      console.log(this.addList);
    },

    //级联选择器数据变化触发函数
    handleChange() {
      if (this.addruleForm.goods_cat.length !== 3) {
        this.addruleForm.goods_cat = [];
      }
    },

    //前往新的标签页
    goToNewTag(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addruleForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //点击新标签页请求数据
    async tableClick() {
      if (this.stepIndex == "1") {
        let { data: res } = await this.axios.get(
          `categories/${this.getID}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态列表失败");
        //字符转分割为数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyDataList = res.data;
      } else if (this.stepIndex == "2") {
        let { data: res } = await this.axios.get(
          `categories/${this.getID}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性失败");
        this.onlyDataList = res.data;
      }
    },

    //图片预览效果
    handlePreview(file) {
      this.imageUrl = file.response.data.url;
      this.imgDialogVisible = true;
      console.log(this.imageUrl);
    },
    //图片上传成功回调函数
    successImg(response) {
      let picInfo = { pic: response.data.tmp_path };

      this.addruleForm.pics.push(picInfo);
    },
    //图片移除
    removeImg(file) {
      //找到图片临时路径
      let filePatr = file.response.data.tem_path;
      //从数组中找到索引值
      let i = this.addruleForm.pics.findIndex((x) => x.pic === filePatr);
      //删除
      this.addruleForm.pics.splice(i, 1);
    },

    //添加商品
    add() {
      this.$refs.addruleForm.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必要的表单项");

        //因为级联选择器原因要求的goods_cat值必须为数组 所以深拷贝
        let deepAddruleForm = _.cloneDeep(this.addruleForm);
        //拼接
        deepAddruleForm.goods_cat = deepAddruleForm.goods_cat.join(",");
        console.log(deepAddruleForm.goods_cat);

        //处理动态参数
        this.manyDataList.forEach((item) => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addruleForm.attrs.push(newInfo);
        });
        //处理静态属性
        this.onlyDataList.forEach((item) => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addruleForm.attrs.push(newInfo);
        });
        deepAddruleForm.attrs = this.addruleForm.attrs;

        //发送请求
        let { data: res } = await this.axios.post("goods", deepAddruleForm);
        // if(res.meta.status!==201) return this.$message.error()
        this.$message.info(res.meta.msg)
        this.$router.push('/goods')
      });
    },
  },
  components: {},
  //计算属性
  computed: {
    getID() {
      if (this.addruleForm.goods_cat.length == 3) {
        return this.addruleForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.dialogImg {
  width: 100%;
}
.buttonaa {
  margin-top: 15px;
}
</style>
