<template>
  <div class="widget-box bg-white">
    <div class="widget-header">
      <h4 class="widget-title">
        入驻代理商审批 - {{ contractForm.datas.agentCompanyBaseInfo.name }}
      </h4>
    </div>
    <div class="widget-body">
      <div
        class="widget-main"
        style="font-size: 16px;line-height: 30px;"
      >
        <div
          class="row"
          style="margin-bottom: 15px;"
        >
          <div class="col-xs-12">
            <h4 class="block green">
              合同基本信息
            </h4>
          </div>
          <div class="col-xs-12">
            申请主体：{{ contractForm.datas.agentCompanyBaseInfo.agentType === 'channel'?'渠道':'代理商' }}
          </div>
          <div class="col-xs-12">
            合同模板：{{ contractForm.datas.tplName }}
          </div>
          <div class="col-xs-12">
            试合作期：若乙方第一次代理甲方产品，则本合同前{{ contractForm.datas.agentCompanyBaseInfo.probation }}个月为试合作期
          </div>
          <template v-if="contractForm.datas.agentContract.versionStartDate">
            <div
              class="col-xs-12"
            >
              变更生效：{{ formatTime(contractForm.datas.agentContract.versionStartDate) }}
            </div>
            <div
              class="col-xs-12"
              v-if="contractForm.datas.agentContract.versionStartDate"
            >
              变更说明：{{ contractForm.datas.flowMemo }}
            </div>
          </template>
          <div
            class="col-xs-12"
            v-else
          >
            代理期限：{{ contractForm.datas.agentContract.agentStart + ' - ' +
              contractForm.datas.agentContract.agentEnd }}
          </div>
        </div>
        <div
          class="row"
          style="margin-bottom: 15px;"
        >
          <div class="col-xs-12">
            <h4 class="block green">
              代理商基本信息
            </h4>
          </div>
          <div class="col-xs-6">
              代理商联系人信息： {{ contractForm.datas.salesInfo.salesName }}
          </div>
          <div class="col-xs-6">
            代理商名称：{{ contractForm.datas.agentCompanyBaseInfo.name }}
          </div>
          <div class="col-xs-6">
            税号：{{ contractForm.datas.agentCompanyBaseInfo.taxIdcd }}
          </div>
          <div class="col-xs-6">
            代理商单位地址：{{ contractForm.datas.agentCompanyBaseInfo.registerAddr }}
          </div>
          <div class="col-xs-6">
            代理商电话：{{ contractForm.datas.agentCompanyBaseInfo.telephone }}
          </div>
          <div class="col-xs-6">
            开户名称：{{ contractForm.datas.agentCompanyBaseInfo.accountName }}
          </div>
          <div class="col-xs-6">
            开户银行：{{ contractForm.datas.agentCompanyBaseInfo.depositBank }}
          </div>
          <div class="col-xs-6">
            银行账号：{{ contractForm.datas.agentCompanyBaseInfo.accountNo }}
          </div>
        </div>
        <div class="row" style="margin-bottom: 15px;">
            <div class="col-xs-12">
                <h4 class="block green">代理商联系信息</h4>
            </div>
            <div class="col-xs-6">
                代理商联系人： {{ contractForm.datas.salesInfo.salesName }}
            </div>
            <div class="col-xs-6">
                代理商联系人电话： {{ contractForm.datas.salesInfo.mobilePhone }}
            </div>
            <div class="col-xs-6">
                代理商联系人地址： {{ contractForm.datas.salesInfo.salesAddress }}
            </div>
        </div>
        <div
          class="row"
          style="margin-bottom: 15px;"
        >
          <div class="col-xs-12">
            <h4 class="block green">
              代理推广费报价
            </h4>
          </div>
          <div
            v-for="(item, index) in contractForm.datas.agentContract.serviceCompanyFeeContentList"
            :key="index"
          >
            <div class="col-xs-12">
              落地公司：{{ item.serviceCompanyName }}
            </div>
            <div class="col-xs-12">
              报价规则：{{ item.quoteRule === 'rakeback' ? '返佣规则': '结算规则' }}
            </div>
            <div class="col-xs-12">
              代理推广费率：
              <span v-if="item.quoteFeeType === 'ratio'">固定费率结算：{{ item.feeContentMap.no[0].percent }}%</span>
              <template v-else>
                <span>分{{ item.incomeAmount }}万 - {{ item.subType === 'nonflow'?'无流水阶梯':'按流水分阶梯' }}报价</span>
                <div style="padding-left: 20px">
                  <p>(1) {{ item.incomeAmount }}万含以下<span v-if="item.subType === 'nonflow'">，实发金额*{{ item.feeContentMap.down[0].percent }}%</span></p>
                  <template v-if="item.subType === 'flow'">
                    <p
                      class="list-item"
                      v-for="(downitem, downindex) in item.feeContentMap.down"
                      :key="'downindex'+downindex"
                    >
                      {{ downindex === 0 ?'小于':downitem.startAmount+'万' + (downitem.equalsStart?'含':'') + (downindex === item.feeContentMap.down.length-1 ?'以上':'~') }}
                      <span v-if="downindex < item.feeContentMap.down.length-1">{{ downitem.endAmount }}万{{ downitem.equalsEnd?'含':'' }}</span>，
                      实发金额*{{ downitem.percent }}%
                    </p>
                  </template>
                  <p>(2) {{ item.incomeAmount }}万以上<span v-if="item.subType === 'nonflow' || item.subType === 'flow'">，实发金额*{{ item.feeContentMap.up[0].percent }}%</span></p>
                  <!-- <template v-if="item.subType === 'flow'">
                    <p
                      class="list-item"
                      v-for="(upitem, upindex) in item.feeContentMap.up"
                      :key="upindex+'upindex'"
                    >
                      {{ upindex === 0 ?'小于':upitem.startAmount+'万' + (upitem.equalsStart?'含':'') + (upindex === item.feeContentMap.up.length-1 ?'以上':'~') }}
                      <span v-if="upindex < item.feeContentMap.up.length-1">{{ upitem.endAmount }}万{{ upitem.equalsEnd?'含':'' }}</span>，
                      实发金额*{{ upitem.percent }}%
                    </p>
                  </template> -->
                </div>
              </template>
            </div>
            <div
              class="col-xs-12"
              v-if="contractForm.datas.agentContract.versionStartDate"
            >
              代理期限：{{ item.agentStart + ' - ' + item.agentEnd }}
            </div>
          </div>
        </div>
        <div
          class="row"
          style="margin-bottom: 15px;"
        >
          <div class="col-xs-12">
            <h4 class="block green">
              销售（渠道经理）联系信息
            </h4>
          </div>
          <div class="col-xs-12">
            销售姓名：{{ contractForm.datas.salesInfo.salesName }}
          </div>
          <div class="col-xs-12">
            销售联系电话：{{ contractForm.datas.salesInfo.mobilePhone }}
          </div>
          <div class="col-xs-12">
            销售地址：{{ contractForm.datas.salesInfo.salesAddress }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatTime} from 'src/plugin/utils-functions'

export default {
    name: 'ContractInfo',
    props: {
        contractForm: {
            type: Object,
            default() {
                return {}
            }
        },
        contractTplList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        getText(value, list, inputKey = 'value', outputKey = 'text') {
            if (!list.length) return;
            let obj = list.find((element) => {
                return element[inputKey] == value
            });
            if (obj) {
                return obj[outputKey];
            }
        },
        formatTime(date) {
            return formatTime(date)
        }
    }
}
</script>
<style lang="scss" scoped>
p{
    margin: 0;
    &.list-item{
        padding-left: 20px;
        font-size: 14px;
    }
}
</style>
