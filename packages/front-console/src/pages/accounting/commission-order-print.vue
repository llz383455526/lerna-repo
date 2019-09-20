<template>
  <div class="order-print">
    <div id="print-content">
      <div style="width: 685px;" v-if="detail">
        <h1 style="text-align: center;">返佣结算对账单</h1>
        <h3 style="text-align: center;">{{detail.agentCompanyName}}</h3>
        <p>
          <span style="display: inline-block; width: 45%;">对账单编号：{{detail.id}}</span>
          <span>落地服务商：{{detail.serviceCompanyName}}</span>
        </p>
        <div style="border: 1px solid black;">
          <div style="border-bottom: 1px solid black; padding: 5px;">
            <p style="display: inline-block; width: 45%; margin: 0.5em 0;">发放月份：{{detail.month}}</p>
            <p style="display: inline-block; width: 45%; margin: 0.5em 0;">结算方式：{{detail.currentSettleTypeText}}</p>
            <p style="display: inline-block; width: 45%; margin: 0.5em 0;">绩效费总额：{{detail.amount}}</p>
            <p style="display: inline-block; width: 45%; margin: 0.5em 0;">返佣总金额：{{detail.commissionAmount}}</p>
            <p style="display: inline-block; width: 45%; margin: 0.5em 0;">本期返佣金额：{{detail.currentCommissionAmount}}</p>
          </div>
          <div style="padding: 5px;">
            <h3>开票信息区</h3>
            <p>公司名称：{{invoiceInfo.name}}</p>
            <p>税号：{{invoiceInfo.taxIdcd}}</p>
            <p>地址、电话：{{invoiceInfo.address}} {{invoiceInfo.telephone}}</p>
            <p>银行开户名：{{invoiceInfo.bankName}}</p>
            <p>银行账号：{{invoiceInfo.bankAccount}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      required: true,
    },
  },
  computed: {
    invoiceInfo() {
      if (this.detail.invoiceInfo) {
        return this.detail.invoiceInfo
      }
      return {}
    },
  },
  methods: {
    print() {
      this.$nextTick(() => {
        let iframe = document.getElementById('print-iframe')
        if (!iframe) {
          const el = document.getElementById('print-content')
          iframe = document.createElement('iframe')
          iframe.setAttribute('id', 'print-iframe')
          iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
          document.body.appendChild(iframe)
          const doc = iframe.contentWindow.document
          doc.write(el.innerHTML)
          iframe.contentWindow.focus()
        }
        iframe.contentWindow.print()
        document.body.removeChild(iframe)
      })
    },
  },
}
</script>

<style lang="less">
#print-content {
  display: none;
}
</style>>
