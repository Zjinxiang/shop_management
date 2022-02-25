<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="update_time" width="220px">
          <template slot-scope="scope">
            {{ scope.row.update_time | dataFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddressEdit(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="pregress(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="closeEdit"
    >
      <el-form
        :model="addressRuleForm"
        :rules="addressRuleFormRules"
        ref="addressRuleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            :options="cityData"
            v-model="addressRuleForm.address"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailaddress">
          <el-input v-model="addressRuleForm.detailaddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看地址 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";

export default {
  created() {
    this.getOrderList();
  },
  props: {},
  data() {
    return {
      //获取订单参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //数据列表
      orderList: [],
      //总条数
      total: 0,

      //修改地址对话框的显示与隐藏
      addressDialogVisible: false,
      //对话框的数据
      addressRuleForm: {
        address: [],
        detailaddress: "",
      },
      //验证规则
      addressRuleFormRules: {
        address: [{ required: true, message: "请选择地址", trigger: "blur" }],
        detailaddress: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      //城市
      cityData,

      //ID
      getId: "",

      //物流信息
      progressVisible: false,
      //物流信息值
      progressInfo: "",
    };
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      let { data: res } = await this.axios.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },

    //分页器
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },

    //修改地址对话框
    async showAddressEdit(row) {
      //   this.$refs.addressRuleForm.validate(async (valid) => {
      //     if (!valid) return this.$message.error("添加用户失败");
      //   });
      let { data: res } = await this.axios.get(
        `orders/${row.__ob__.value.order_id}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.getId = res.data.order_id;
      console.log(this.getId);

      this.addressDialogVisible = true;
    },
    //关闭清空
    closeEdit() {
      this.$refs.addressRuleForm.resetFields();
    },
    //修改地址
    async editAddress() {
      this.$refs.addressRuleForm.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写数据");
        let { data: res } = await this.axios.get(`/kuaidi/${this.getId}`);
        if (res.meta.status !== 200) return this.$message.error("修改地址失败");
        this.$message.success("修改地址成功");
        this.addressDialogVisible = false;
      });
    },

    //物流信息
    async pregress() {
      let { data: res } = await this.axios.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败");
      this.progressInfo = res.data;
      console.log(this.progressInfo);

      this.progressVisible = true;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
