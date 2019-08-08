<template>
  <div class="invoice-table">
    <el-table border
:data="tableData" style="width: 100%">
      <el-table-column prop="customerName"
label="客户名称" width="180" />
      <el-table-column prop="companyName"
label="落地公司名称" width="180" />
      <el-table-column prop="invoiceInfo"
label="发票信息">
        <template slot-scope="scope">
          <invoice-info :info="scope.row.invoiceInfo" />
          <el-button size="small"
@click="invoiceInfoDialogShow = true">
编辑
</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="mailInfo"
label="邮寄信息">
        <template slot-scope="scope">
          <mail-info :info="scope.row.mailInfo" />
          <el-button size="small"
@click="mailInfoDialogShow = true">
编辑
</el-button>
        </template>
      </el-table-column>
    </el-table>
    <invoice-info-dialog
      :show.sync="invoiceInfoDialogShow"
      :info="invoiceInfo.invoiceInfo"
      @changeInfo="changeInvoiceInfo"
    />
    <mail-info-dialog
      :show.sync="mailInfoDialogShow"
      :info="invoiceInfo.mailInfo"
      @changeInfo="changeMailInfo"
    />
  </div>
</template>

<script>
import InvoiceInfo from "./InvoiceInfo";
import MailInfo from "./MailInfo";
import InvoiceInfoDialog from "./InvoiceInfoDialog";
import MailInfoDialog from "./MailInfoDialog";

import { invoiceApi } from "src/api";
import { get, post, importPost } from "src/store/api";

export default {
  props: {
    customCompanyId: {
      type: [Number, String]
    },
    serviceCompanyId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      invoiceInfoOrigin: {
        customerName: "王者荣耀有限公司",
        companyName: "腾讯有限公司",
        invoiceInfo: {},
        mailInfo: {}
      },
      invoiceInfoDialogShow: false,
      mailInfoDialogShow: false
    };
  },
  computed: {
    tableData() {
      return [this.invoiceInfo];
    },
    invoiceInfo() {
      const originInfo = this.invoiceInfoOrigin;
      const info = {
        customerName: originInfo.name,
        companyName: originInfo.companyName,
        invoiceInfo: {
          ...originInfo
        },
        mailInfo: {
          ...originInfo
        }
      };
      return info;
    }
  },
  components: {
    InvoiceInfo,
    MailInfo,
    InvoiceInfoDialog,
    MailInfoDialog
  },
  methods: {
    changeInvoiceInfo(info) {
      this.invoiceInfoOrigin = info;
      this.$emit("getIvoiceInfo", info);
    },
    changeMailInfo(info) {
      this.invoiceInfoOrigin = info;
      this.$emit("getIvoiceInfo", info);
    }
    // getCustomerDetail() {
    //     // 这里获取发票信息
    //     get(invoiceApi.customerDetail, {companyId: this.customCompanyId}).then(res => {
    //         this.invoiceInfoOrigin = res
    //         this.$emit('getIvoiceInfo', res) // 将信息发送到创建发票表单进行验证
    //     })
    // },
    // getServiceDetail() {
    //     // 这里获取发票信息
    //     get(invoiceApi.serviceDetail, {id: this.serviceCompanyId}).then(res => {
    //         console.log(res)
    //         this.$set(this.invoiceInfoOrigin, 'companyName', res.name)
    //     })
    // }
  },
  created() {
    // this.getCustomerDetail()
    // this.getServiceDetail()
    const detailurl =
      this.$route.query.businessType &&
      this.$route.query.businessType === "subcontract"
        ? invoiceApi.subcontractCustomerDetail
        : invoiceApi.customerDetail;
    Promise.all([
      get(detailurl, { companyId: this.customCompanyId }),
      get(invoiceApi.serviceDetail, { id: this.serviceCompanyId })
    ]).then(data => {
      data[0].companyName = data[1].name;
      console.log(data[0]);
      this.invoiceInfoOrigin = data[0];
      this.$emit("getIvoiceInfo", data[0]); // 将信息发送到创建发票表单进行验证
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
