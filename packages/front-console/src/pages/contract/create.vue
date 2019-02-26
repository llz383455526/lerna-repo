<template>
    <div class="bg-white p15">
        <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">基本信息</h4>
            <span class="tip" v-if="!$route.query.contractId">*客户名称和服务商名称录入后不支持修改</span>
            <el-form-item label="合同种类" prop="type" class="hide">
                <el-input v-model="contractForm.type"></el-input>
            </el-form-item>
            <el-form-item label="文件ID" class="hide">
                <input v-model="contractForm.referIds">
            </el-form-item>
            <el-form-item label="企业名称" prop="customerId" placeholder="请输入内容">
                <el-select v-model="contractForm.customerId" filterable placeholder="请选择" style="width:100%;" :disabled="$route.query.contractId ? true : false" @change="getConfig">
                    <el-option v-for="item in customerCompaniesList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyIds" placeholder="请输入内容">
                <div :class="{top_24 : i != 0}" v-for="(e, i) in contractForm.serviceCompanyIds">
                    <el-select v-model="contractForm.serviceCompanyIds[i]" filterable placeholder="请选择" style="width:100%;" @change="checkList(i)" :disabled="$route.query.contractId ? true : false">
                        <el-option v-for="item in filterList(i)" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                    </el-select>
                    <!-- <div class="item_right" v-if="!$route.query.contractId">
                        <el-button type="text" @click="addServiceCompany">添加</el-button>
                        <el-button type="text" @click="deleteServiceCompany(i)" v-if="i != 0">删除</el-button>
                    </div> -->
                </div>
            </el-form-item>
            <el-form-item label="行业类型" prop="cotractType" required>
                <el-select v-model="contractForm.cotractType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="serviceTypeList" >
                <el-checkbox-group v-model="contractForm.serviceTypeList">
                    <el-checkbox v-for="item in serviceTypes" :key="item.serviceId" :label="item.serviceId">{{item.serviceName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="结算方式" prop="settleType" required>
                <el-select v-model="contractForm.settleType" placeholder="请选择" style="width:100%;"> <!-- @change="showType" -->
                    <el-option v-for="item in options_0" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="服务费是否预收" prop="prePayType" required>
                <el-select v-model="contractForm.prePayType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in presell" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预收服务费" prop="prePayContent.fixFee" v-if="contractForm.prePayType == 1">
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="ratio" v-model="contractForm.prePayContent.serviceFeeType" @change="prveFee(1)">实发金额</el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                        <el-input v-model="prevRatio" @blur="prveFee(1)"
                                  :disabled="!(showPrev === 1)" style="width: calc(100% - 70px);">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-radio label="ratio_1" v-model="contractForm.prePayContent.serviceFeeType" @change="prveFee(2)">应发金额</el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="display: inline-block; width: 110px; color: #606266;">实发金额 / ( 1 -  </div>
                        <el-input v-model="prevRatio_1" @blur="prveFee(2)"
                                  :disabled="!(showPrev === 2)" style="width: 135px;">
                            <template slot="append">%</template>
                        </el-input>
                        <div style="display: inline-block; width: 20px; color: #606266;">) * </div>
                        <el-input v-model="prevRatio_1" @blur="prveFee(2)"
                                  :disabled="!(showPrev === 2)" style="width: 160px;">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发票类型" prop="invoiceType" required>
                <el-select v-model="contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="e in invoiceType_0" :label="e.text" :value="e.value" :key="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票类型" prop="openInvoiceType">
                <el-radio v-model="contractForm.openInvoiceType" v-for="item in invoiceType" :key="item.value" :label="item.value">{{item.text}}</el-radio>
            </el-form-item>
            <el-form-item label="服务费收费比例" prop="serviceFeeContent.fixFee">
                <el-row class="mb15" v-show="contractForm.settleType != 'each'">
                    <el-col :span="6">
                        <el-radio label="dummy" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(-1)">无</el-radio>
                    </el-col>
                </el-row>
                <el-row class="mb15" v-show="contractForm.settleType != 'each'">
                    <el-col :span="6">
                        <el-radio label="fixed" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(0)">固定金额收费
                        </el-radio>
                    </el-col>
                    <template v-if="showInputRatio == 0">
                        <el-col :span="15">
                            <el-input placeholder="请输入内容" v-model="inputFixed" @blur="calcuServiceFee(0)"
                                      :disabled="!(showInputRatio == 0)">
                                <template slot="append">元 每笔</template>
                            </el-input>
                        </el-col>
                        <el-col :span="1" style="text-align: right;">
                            <i class="el-icon-question" title="表示按照固定金额来收取服务费。计算公式：固定收费金额 = 服务费"></i>
                        </el-col>
                    </template>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="ratio" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(1)">固定比例收费<br>（实发金额）</el-radio>
                    </el-col>
                    <template v-if="showInputRatio == 1">
                        <el-col :span="15">
                            <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                            <el-input v-model="inputRatio" @blur="calcuServiceFee(1)"
                                      :disabled="!(showInputRatio == 1)" style="width: calc(100% - 70px);">
                                <template slot="append">% 每笔</template>
                            </el-input>
                        </el-col>
                        <el-col :span="1" style="text-align: right;">
                            <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                        </el-col>
                    </template>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-radio label="ratio_1" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(2)">固定比例收费<br>（应发金额）</el-radio>
                    </el-col>
                    <template v-if="showInputRatio == 2">
                        <el-col :span="15">
                        <div style="display: inline-block; width: 110px; color: #606266;">实发金额 / ( 1 -  </div>
                        <el-input v-model="inputRatio_1" @blur="calcuServiceFee(2)"
                                  :disabled="!(showInputRatio == 2)" style="width: 135px;">
                            <template slot="append">%</template>
                        </el-input>
                        <div style="display: inline-block; width: 20px; color: #606266;">) * </div>
                        <el-input v-model="inputRatio_1" @blur="calcuServiceFee(2)"
                                  :disabled="!(showInputRatio == 2)" style="width: 160px;">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                    </template>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="step" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(3)">分{{showInputRatio == 3 ? contractForm.serviceFeeContent.stepwiseList[0].endAmount : '2.8'}}万 - 无流水阶梯报价</el-radio>
                    </el-col><br>
                    <el-col :span="24" v-show="showInputRatio == 3">
                        <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                            <el-table-column label="月收入下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" class="input_100" @change="checkTable(true)">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsStart" @change="equals(scope.$index, 0)">含 
                                            <template v-if="scope.row.sequence == columnIndex - 1">
                                                以上
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="月收入上限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence != columnIndex - 1">
                                        <el-input v-model="scope.row.endAmount" class="input_100" @change="checkTable">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsEnd" @change="equals(scope.$index, 1)">含 
                                            <template v-if="!scope.row.sequence">
                                                以下
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="阶梯收费" width="270px">
                                <template slot-scope="scope">
                                    实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 3)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <el-button class="top_24" @click="addColumn" size="small" type="primary">增加阶梯</el-button> -->
                    </el-col>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="step_0" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(4)">不分2.8万 - 按流水总额阶梯报价</el-radio>
                    </el-col><br>
                    <el-col :span="24" v-show="showInputRatio == 4">
                        <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                            <el-table-column label="月总额下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="checkTable(true)">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 4)" @change="equals(scope.$index, 0)">含 
                                            <template v-if="scope.row.sequence == columnIndex - 1">
                                                以上
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="月总额上限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence != columnIndex - 1">
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="checkTable">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 4)" @change="equals(scope.$index, 1)">含 
                                            <template v-if="!scope.row.sequence">
                                                以下
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="阶梯收费" width="270px">
                                <template slot-scope="scope">
                                    实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 4)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                    </el-col>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="step_1" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(5)">分{{showInputRatio == 5 ? contractForm.serviceFeeContent.monthIncomeAmount : '2.8'}}万 - 按流水分阶梯报价</el-radio>
                    </el-col><br>
                    <el-col :span="24" v-show="showInputRatio == 5">
                        <div>
                            月收入
                            <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" @blur="checkTable">
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="contractForm.serviceFeeContent.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(0)">含</el-checkbox>
                            以下
                        </div>
                        <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                            <el-table-column label="月总额下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable(true)">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 0)">含 
                                            <template v-if="scope.row.sequence == columnIndex - 1">
                                                以上
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="月总额上限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence != columnIndex - 1">
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 1)">含 
                                            <template v-if="!scope.row.sequence">
                                                以下
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="阶梯收费" width="270px">
                                <template slot-scope="scope">
                                    实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                        <div class="top_24">
                            月收入
                            <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" @blur="checkTable">
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="contractForm.serviceFeeContent2.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(1)">含</el-checkbox>
                            以上
                        </div>
                        <el-table :data="contractForm.serviceFeeContent2.stepwiseList">
                            <el-table-column label="月总额下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable(true)">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 0, 2)">含 
                                            <template v-if="scope.row.sequence == columnIndex - 1">
                                                以上
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="月总额上限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence != columnIndex2 - 1">
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable">
                                            <template slot="append">万</template>
                                        </el-input>
                                        <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 1, 2)">含 
                                            <template v-if="!scope.row.sequence">
                                                以下
                                            </template>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <div class="center">无</div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="阶梯收费" width="270px">
                                <template slot-scope="scope">
                                    实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index, 1)" v-if="scope.$index > 1 && scope.$index == columnIndex2 - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent2.stepwiseList.length < 10" @click="addColumn(1)" size="small" type="primary">增加阶梯</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="合同起止时间" prop="startDate">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="客户类型" prop="originalType">
                <el-radio v-for="e in originalTypeList" v-model="contractForm.originalType" :key="e.value" :label="e.value" @change="getOriginalTypeName" disabled>{{e.text}}</el-radio>
            </el-form-item>
            <template v-if="contractForm.originalType == 20">
                <el-form-item label="代理商名称" prop="agentCompanyId">
                    <el-select v-model="contractForm.agentCompanyId" style="width:100%;" @change="companyChange(true)" :disabled="agentDisable" filterable>
                        <el-option v-for="e in agentList.filter(e => e.status == '10')" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="代理商分润比例" prop="agentFeeContent.serviceFeeRate">
                    <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                    <el-input v-model="contractForm.agentFeeContent.serviceFeeRate" :disabled="agentDisable" style="width: calc(100% - 70px);">
                        <template slot="append">% 每笔</template>
                    </el-input>
                </el-form-item> -->
                <el-form-item label="渠道经理" required>
                    <el-input v-model="chargeByName" disabled></el-input>
                </el-form-item>
                <el-form-item label="报价规则" prop="quoteRule">
                  <el-radio v-for="e in ruleList" :key="e.value" v-model="contractForm.quoteRule" :label="e.value">{{e.text}}</el-radio>
                  <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
                </el-form-item>
                <el-form-item label="代理推广费率" prop="check">
                  <contract-close-item @result="result" :form="contractForm" :initCheck="true" ref="contract"></contract-close-item>
                </el-form-item>
            </template>
            <el-form-item label="客户归属" prop="original">
              <el-radio v-for="e in originals" v-model="contractForm.original" :key="e.value" :label="e.value" disabled>{{e.text}}</el-radio>
            </el-form-item>
            <h4 class="ml50 mt50">合同文件</h4>
            <el-upload
                class="upload-demo ml50"
                :action=uploadUrl
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :http-request="hanldleHttpRequest"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png,.gif"
                :show-file-list=false
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="pl50 mb50">
                <el-table :data="fileList">
                    <el-table-column prop="fileName" label="文件名称"></el-table-column>
                    <el-table-column prop="createTime" label="上传时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" label="操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium"
                                       style="padding:0;">下载
                            </el-button>
                            <el-button  type="text" size="medium"
                                       style="padding:0;" @click="dialogVisible = true, downloadCode = scope.row.downloadCode, deleteKey = scope.$index">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <h4 class="ml50 mt50">关联企业</h4>
        <div class="left_50">
            <el-form size="small" :inline="true">
                <el-form-item label="企业关键词">
                    <el-input v-model="form.fullName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="form.fullName = ''">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="company.list" >
                <el-table-column label="企业名称" prop="fullName" width="300"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button :class="{gray: ishave(scope.row)}" type="text" @click="relevance(scope.row)">关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="top_24" v-show="company.total / form.pageSize > 1">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="form.pageSize"
                    :total="company.total"
                    @current-change="query"
                    :currentPage="form.page">
                </el-pagination>
            </div>
        </div>
        <h4 class="ml50 mt50" v-if="contractForm.branchs.length">关联企业名称</h4>
        <div class="flex">
            <div v-for="(e, i) in contractForm.branchs" :key="e.branchId">
                {{e.branchName}}
                <span @click="remove(e, i)"></span>
            </div>
        </div>
        <div class="footer top_24">
            <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
            <el-button @click="routerPush('/main/contract/list')">取消</el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该合同文件吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash';
    import {mapGetters} from 'vuex';
    import {get, post, formPost} from "../../store/api";
    import {baseUrl} from '../../config/address';
    import {showNotify} from '../../plugin/utils-notify';
    import fileUploader from '../../component/fileUploader'
    import { checkPhone } from '../../plugin/utils-element-validator'
    import contractCloseItem from '../../pageComponent/contractCloseItem'
    export default {
        components: {
            fileUploader,
            contractCloseItem
        },
        data() {
            var validatorSettleExp = (rule, value, callback) => {
                if (this.contractForm.settleType == 'week') {
                    if (this.contractForm.settleExp == '') {
                        callback(new Error('请选择结算日期'));
                    } else {
                        callback();
                    }
                }
                if (this.contractForm.settleType == 'month') {
                    if (this.radio == '固定日') {
                        if (this.settleExpDay) {
                            this.contractForm.settleExp = this.settleExpDay;
                            callback();
                        } else {
                            callback(new Error('请选择结算日期'));
                        }
                    }
                    if (this.radio == '范围日') {
                        if (!this.settleExpStart || !this.settleExpEnd) {
                            callback(new Error('请选择结算日期'));
                        } else if (parseInt(this.settleExpStart.replace('每月', '').replace('日', ''))
                            > parseInt(this.settleExpEnd.replace('每月', '').replace('日', ''))) {
                            callback(new Error('开始时间大于结束时间'));
                        } else if (this.settleExpStart && this.settleExpEnd) {
                            this.contractForm.settleExp = this.settleExpStart + ',' + this.settleExpEnd;
                            callback();
                        }
                    }
                }
            };
            var f2 = (rule, value, cb) => {
                if(!this.float2.test(value)) {
                    return cb('请输入正确的服务费收费（大于零且最多两位小数）')
                }
                return cb()
            }
            let f2_0 = (rule, value, cb) => {
                if(!this.float2_0.test(value)) {
                    return cb('请输入正确的服务费收费（大于零且最多两位小数）')
                }
                return cb()
            }
            return {
                rules: {
                    customerId: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    serviceCompanyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    serviceCompanyIds: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    serviceCompanyId: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    cotractType: [
                        {required: true, message: '请选择合同类型', trigger: 'blur'}
                    ],
                    serviceTypeList: [
                        {required: true, message: '请选择服务类型', trigger: 'blur'}
                    ],
                    settleType: [
                        {required: true, message: '请选择结算方式', trigger: 'blur'}
                    ],
                    settleExp: [
                        {validator: validatorSettleExp, trigger: 'blur'}
                    ],
                    invoiceType: [
                        {required: true, message: '请选择发票类型', trigger: 'blur'}
                    ],
                    'serviceFeeContent.fixFee': [
                        {type: 'number', required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    'prePayContent.fixFee': [
                        {type: 'number', required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'}
                    ],
                    openInvoiceType: [
                        {required: true, message: '请输入开票类型', trigger: 'blur'}
                    ],
                    // agentClient: [
                    //     {required: true, message: '请选择', trigger: 'blur'}
                    // ],
                    originalType: [
                      {required: true, message: '请选择客户类型', trigger: 'blur'}
                    ],
                    agentCompanyId: [
                        {required: true, message: '请选择代理商', trigger: 'blur'}
                    ],
                    'agentFeeContent.serviceFeeRate': [
                        {required: true, message: '请输入正确的服务费收费（大于或等于零且最多两位小数）', trigger: 'blur'},
                        {validator: f2_0, trigger: 'blur'}
                    ],
                    quoteRule: [
                      { required: true, message: "请选择报价规则", trigger: "blur" }
                    ],
                    original: [
                      {required: true, message: '请选择客户归属', trigger: 'blur'}
                    ],
                    check: [
                      { required: true, message: "请输入正确的结算费率（大于零且最多两位小数）", trigger: "blur" }
                    ]
                },
                // weekVisible: false,
                // monthVisible: false,
                showInputRatio: -1,
                showInputFixed: false,
                showSelectExpDay: false,
                showSelectExpStart: true,
                dialogVisible: false,
                downloadCode: '',
                formData: '',
                dateValue: '',
                uploadUrl: '',
                settleExpDay: '',
                settleExpStart: '',
                settleExpEnd: '',
                inputFixed: '',
                inputRatio: '',
                inputRatio_1: '',
                radio: '固定日',
                customerCompaniesList: [],
                serviceCompaniesList: [],
                tableData: [],
                restaurants1: [],
                restaurants2: [],
                fileList: [],
                referArr: [],
                options: [
                    {value: '每月1日', label: '每月1日'},
                    {value: '每月2日', label: '每月2日'},
                    {value: '每月3日', label: '每月3日'},
                    {value: '每月4日', label: '每月4日'},
                    {value: '每月5日', label: '每月5日'},
                    {value: '每月6日', label: '每月6日'},
                    {value: '每月7日', label: '每月7日'},
                    {value: '每月8日', label: '每月8日'},
                    {value: '每月9日', label: '每月9日'},
                    {value: '每月10日', label: '每月10日'},
                    {value: '每月11日', label: '每月11日'},
                    {value: '每月12日', label: '每月12日'},
                    {value: '每月13日', label: '每月13日'},
                    {value: '每月14日', label: '每月14日'},
                    {value: '每月15日', label: '每月15日'},
                    {value: '每月16日', label: '每月16日'},
                    {value: '每月17日', label: '每月17日'},
                    {value: '每月18日', label: '每月18日'},
                    {value: '每月19日', label: '每月19日'},
                    {value: '每月20日', label: '每月20日'},
                    {value: '每月21日', label: '每月21日'},
                    {value: '每月22日', label: '每月22日'},
                    {value: '每月23日', label: '每月23日'},
                    {value: '每月24日', label: '每月24日'},
                    {value: '每月25日', label: '每月25日'},
                    {value: '每月26日', label: '每月26日'},
                    {value: '每月27日', label: '每月27日'},
                    {value: '每月28日', label: '每月28日'},
                    {value: '每月29日', label: '每月29日'},
                    {value: '每月30日', label: '每月30日'},
                    {value: '每月31日', label: '每月31日'}
                ],
                contractForm: {
                    customerName: '',
                    customerId: '',
                    type: 'customer',
                    openInvoiceType: '',
                    branchs: [],
                    serviceTypeList: [],
                    serviceCompanyIds: [null],
                    prePayType: '',
                    prePayContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: '',
                        fixFee: 0,
                        monthIncomeAmount: 1,
                        serviceFeeRate: '',
                        serviceFeeType: 'dummy',
                        containMonthAmount: true,
                        stepwiseList: []
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    },
                    // serviceFee: '',
                    settleExp: '1',
                    // serviceFeeRate: '',
                    // shouldAmountRate: ''
                    tplAttachType: '',
                    // -----------------------
                    agentClient: '',
                    agentCompanyId: '',
                    agentCompanyName: '',
                    agentFeeContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    quoteRule: '',
                    quoteFeeContent: {
                      containIncomeAmount: '',
                      incomeAmount: '',
                      quoteFeeRate: '',
                      quoteFeeType: '',
                      serviceCompanyRateList: [
                        {
                          feeRateContent: {
                            containIncomeAmount: '',
                            incomeAmount: '',
                            quoteFeeRate: '',
                            quoteFeeType: '',
                            // stepwiseList: [  //目前用不到
                            //   {
                            //     endAmount: '',
                            //     equalsEnd: '',
                            //     equalsStart: '',
                            //     percent: '',
                            //     sequence: '',
                            //     startAmount: ''
                            //   }
                            // ]
                          },
                          serviceCompanyId: '',
                          serviceCompanyName: ''
                        }
                      ],
                      stepwiseList: [
                        {
                          endAmount: '',
                          equalsEnd: '',
                          equalsStart: '',
                          percent: '',
                          sequence: '',
                          startAmount: ''
                        }
                      ]
                    },
                    original: '',
                    originalType: '',
                    originalTypeName: ''
                },
                columnIndex: 0,
                columnIndex2: 0,
                showPrev: 1,
                prevFixed: '',
                prevRatio: '',
                prevRatio_1: '',
                // invoiceForm: {
                //     id: '',
                //     openInvoiceType: '',
                //     name: '',
                //     taxIdcd: '',
                //     addr: '',
                //     phone: '',
                //     bankName: '',
                //     bankAccount: ''
                // },
                deleteKey: '',
                invoiceType: [],
                invoiceType_0: [],
                options_0: [],
                // isInit: true,
                presell: [
                    {
                        text: '是',
                        value: '1'
                    },
                    {
                        text: '否',
                        value: '0'
                    }
                ],
                form: {
                    fullName: '',
                    page: 1,
                    pageSize: 10
                },
                company: {},
                serviceTypes: [],
                invoiceTypeList: [],
                float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                float2_0: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                agentList: [],
                chargeByName: '',
                agentDisable: false,
                originals: [],
                ruleList: [
                  {
                    text: '结算规则',
                    value: 'settle'
                  },
                  {
                    text: '返佣规则',
                    value: 'rakeback'
                  }
                ],
                originalTypeList: []
            }
        },
        // watch: {
        //   ['contractForm.agentClient'](e) {
        //     if(!e) {
        //       this.contractForm.agentCompanyId = ''
        //       this.contractForm.agentCompanyName = ''
        //       this.contractForm.agentFeeContent.serviceFeeRate = ''
        //       this.chargeByName = ''
        //     }
        //   }
        // },
        created() {
            this.uploadUrl = baseUrl + "/api/console-dlv/file/upload";
            this.getOptionServiceCompanies();
            this.getType()
            if (this.$route.query.contractId) {
                this.queryDetail(this.$route.query.contractId);
                this.queryAttachments(this.$route.query.contractId);
            }
            else {
                this.getOptionCustomerCompanies();
            }
            get('/api/contract-web/commom/option', {enumType: 'SettleType'}).then(data => {
                this.options_0 = data
            })
            get('/api/contract-web/commom/option?enumType=InvoiceType').then(data => {
                this.invoiceType_0 = data
            })
	          get('/api/contract-web/service-mgr/get-service-type-options', {}).then(result => {
                this.serviceTypes = result
            })
            get('/api/sysmgr-web/commom/option?enumType=IndustryType').then(data => {
                this.invoiceTypeList = data
            })
            get('/api/contract-web/agent-contract/agent-company-option').then(data => {
                this.agentList = data
                this.contractForm.agentCompanyId && this.companyChange(false)
            })
            get('/api/sysmgr-web/commom/option?enumType=CustomOriginal').then(data => {
              this.originals = data
            })
            get('/api/sysmgr-web/commom/option?enumType=OriginalType').then(data => {
                this.originalTypeList = data
            })
        },
        methods: {
            getConfig() {
                this.customerCompaniesList.forEach(e => {
                    if(e.companyId == this.contractForm.customerId) {
                        console.log(e)
                        this.contractForm.original = e.original
                        this.contractForm.originalType = e.originalType
                    }
                })
            },
            getOriginalTypeName() {
              this.originalTypeList.forEach(e => {
                if(this.contractForm.originalType == e.value) {
                  this.contractForm.originalTypeName = e.text
                }
              })
            },
            addServiceCompany() {
                this.contractForm.serviceCompanyIds.push(null)
            },
            deleteServiceCompany(a) {
                if(!isNaN(a)) {
                    this.contractForm.serviceCompanyIds.splice(a, 1)
                }
            },
            filterList(a) {
                if(isNaN(a)) {
                    a = 0
                }
                return this.serviceCompaniesList.filter(e => {
                    var index = this.contractForm.serviceCompanyIds.indexOf(e.companyId)
                    return index < 0 || index > a - 1
                })
            },
            checkList(a) {
                if(isNaN(a)) {
                    a = 0
                }
                var curr = this.contractForm.serviceCompanyIds[a], time = 0
                this.contractForm.serviceCompanyIds.forEach((e, i) => {
                    if(e == curr) {
                        time++
                        if(time > 1) {
                            this.contractForm.serviceCompanyIds[i] = null
                        }
                    }
                })
            },
            addColumn(a) {
                if(isNaN(a)) {
                    a = 0
                }
                var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
                if(a) {
                    stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
                }
                stepwiseList.push({
                    startAmount: stepwiseList[this.columnIndex - 1] ? stepwiseList[this.columnIndex - 1].endAmount : '',
                    equalsStart: stepwiseList[this.columnIndex - 1] ? !stepwiseList[this.columnIndex - 1].equalsEnd : false,
                    endAmount: '',
                    equalsEnd: true,
                    sequence: a ? this.columnIndex2 : this.columnIndex,
                    percent: ''
                })
                if(a) {
                    this.columnIndex2++
                }
                else {
                    this.columnIndex++
                }
            },
            deleteColumn(a, b) {
                var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
                if(b) {
                    stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
                }
                stepwiseList.splice(a, 1)
                if(b) {
                    this.columnIndex2--
                    stepwiseList[this.columnIndex2- 1].endAmount = ''
                }
                else {
                    this.columnIndex--
                    stepwiseList[this.columnIndex- 1].endAmount = ''
                }
            },
            initColumn(a) {
                if(isNaN(a)) {
                    a = 3
                }
                this.contractForm.serviceFeeContent.stepwiseList = []
                if(!this.contractForm.serviceFeeContent2) {
                    this.contractForm.serviceFeeContent2 = {}
                }
                this.contractForm.serviceFeeContent2.stepwiseList = []
                this.columnIndex = 0
                this.columnIndex2 = 0
                for(var i = 0; i < a; i++) {
                    this.addColumn()
                }
                if(this.showInputRatio == 5) {
                    for(var i = 0; i < a; i++) {
                        this.addColumn(1)
                    }
                }
            },
            amount(a, b, c, type) {
                var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList, amount = '', result = ''
                if(c) {
                    stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
                }
                if(b) {
                    stepwiseList[a + 1] && (type === true ? stepwiseList[a].endAmount = stepwiseList[a + 1].startAmount : stepwiseList[a + 1].startAmount = stepwiseList[a].endAmount)
                    amount = stepwiseList[a].endAmount
                }
                else {
                    stepwiseList[a - 1] && (type === true ? stepwiseList[a].startAmount = stepwiseList[a - 1].endAmount : stepwiseList[a - 1].endAmount = stepwiseList[a].startAmount)
                    amount = stepwiseList[a].startAmount
                }
                if(this.float2.test(amount) && stepwiseList[a].startAmount - 0 < stepwiseList[a].endAmount) {
                    result = 0
                }
                // this.contractForm.serviceFeeContent.fixFee = result
                return result
            },
            equals(a, b, c) {
                var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
                if(c) {
                    stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
                }
                if(b) {
                    stepwiseList[a + 1] && (stepwiseList[a + 1].equalsStart = !stepwiseList[a].equalsEnd)
                }
                else {
                    stepwiseList[a - 1] && (stepwiseList[a - 1].equalsEnd = !stepwiseList[a].equalsStart)
                }
            },
            equalsIncomeAmount(a) {
                if(!a) {
                    this.contractForm.serviceFeeContent2.containMonthAmount = !this.contractForm.serviceFeeContent.containMonthAmount
                }
                else {
                    this.contractForm.serviceFeeContent.containMonthAmount = !this.contractForm.serviceFeeContent2.containMonthAmount
                }
            },
            getType() {
                get('/api/sysmgr-web/commom/option?enumType=OpenInvoiceType').then(data => {
                    this.invoiceType = data
                    this.contractForm.openInvoiceType = this.invoiceType[0].value
                })
            },
            routerPush(val) {
                this.$router.push({
                    path: val,
                    query: {
                        page: this.$route.query.page
                    }
                });
            },
            result(a) {
              console.log(a)
              this.contractForm.check = a.check
              this.contractForm.quoteFeeContent = a.quoteFeeContent
            },
            submitForm(formName) {
                let url;
                if (this.$route.query.contractId) {
                    url = '/api/contract-web/contract/update-contract'
                } else {
                    url = '/api/contract-web/contract/add-contract';
                }
                let self = this;
                _.foreach(this.customerCompaniesList, function (value) {
                    if (value['companyId'] == self.contractForm.customerId) {
                        self.contractForm.customerName = value['companyName'];
                        return false;
                    } else {
                        self.contractForm.customerName = '';
                    }
                });
                this.calcuCompanyId()
                this.contractForm.referIds = this.referArr;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var err = false, contractForm = JSON.parse(JSON.stringify(this.contractForm))
                        if(contractForm.prePayContent.serviceFeeType == 'ratio_1') {
                            contractForm.prePayContent.serviceFeeType = 'ratio'
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'fixed') {
                            contractForm.serviceFeeContent.fixFee = this.Fixed(this.inputFixed)
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'ratio'){
                            contractForm.serviceFeeContent.fixFee = 0
                            contractForm.serviceFeeContent.secondType = 'real'
                            contractForm.serviceFeeContent.serviceFeeRate = this.Fixed(this.inputRatio)
                            contractForm.serviceFeeContent.discountRate = ''
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'ratio_1'){
                            contractForm.serviceFeeContent.serviceFeeType = 'ratio'
                            contractForm.serviceFeeContent.fixFee = 0
                            contractForm.serviceFeeContent.secondType = 'should'
                            contractForm.serviceFeeContent.discountRate = this.Fixed(this.inputRatio_1)
                            contractForm.serviceFeeContent.serviceFeeRate = this.Fixed(this.inputRatio_1)
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'step'){
                            contractForm.serviceFeeContent.secondType = 0
                            contractForm.serviceFeeContent.monthIncomeAmount = contractForm.serviceFeeContent.stepwiseList[0].endAmount
                            contractForm.serviceFeeContent.stepwiseList.forEach((e, i, arr) => {
                                try {
                                    e.endAmount = this.Fixed(e.endAmount)
                                    e.startAmount = this.Fixed(e.startAmount)
                                    e.percent = this.Fixed(e.percent)
                                    console.log(e.percent)
                                    console.log(e.percent < 0)
                                    console.log(e.percent >= 100)
                                    if((!e.startAmount && i != 0) || (!e.endAmount && i != arr.length - 1) || !e.percent || e.percent < 0 || e.percent >= 100) {
                                        err = true
                                    }
                                }
                                catch(err) {
                                    err = true
                                }
                            })
                            // delete this.contractForm.serviceFeeContent2
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'step_0'){
                            contractForm.serviceFeeContent.serviceFeeType = 'step'
                            contractForm.serviceFeeContent.secondType = 1
                            contractForm.serviceFeeContent.stepwiseList.forEach((e, i, arr) => {
                                try {
                                    e.endAmount = this.Fixed(e.endAmount)
                                    e.startAmount = this.Fixed(e.startAmount)
                                    e.percent = this.Fixed(e.percent)
                                    if((!e.startAmount && i != 0) || (!e.endAmount && i != arr.length - 1) || !e.percent || e.percent < 0 || e.percent >= 100) {
                                        err = true
                                    }
                                }
                                catch(err) {
                                    err = true
                                }
                            })
                            // delete this.contractForm.serviceFeeContent2
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'step_1'){
                            contractForm.serviceFeeContent.serviceFeeType = 'step'
                            contractForm.serviceFeeContent.secondType = 2
                            contractForm.serviceFeeContent.monthIncomeAmount = contractForm.serviceFeeContent.monthIncomeAmount
                            contractForm.serviceFeeContent.stepwiseList.forEach((e, i, arr) => {
                                try {
                                    e.endAmount = this.Fixed(e.endAmount)
                                    e.startAmount = this.Fixed(e.startAmount)
                                    e.percent = this.Fixed(e.percent)
                                    if((!e.startAmount && i != 0) || (!e.endAmount && i != arr.length - 1) || !e.percent || e.percent < 0 || e.percent >= 100) {
                                        err = true
                                    }
                                }
                                catch(err) {
                                    err = true
                                }
                            })
                            contractForm.serviceFeeContent2.stepwiseList.forEach((e, i, arr) => {
                                try {
                                    e.endAmount = this.Fixed(e.endAmount)
                                    e.startAmount = this.Fixed(e.startAmount)
                                    e.percent = this.Fixed(e.percent)
                                    if((!e.startAmount && i != 0) || (!e.endAmount && i != arr.length - 1) || !e.percent || e.percent < 0 || e.percent >= 100) {
                                        err = true
                                    }
                                }
                                catch(err) {
                                    err = true
                                }
                            })
                            contractForm.serviceFeeContent.monthIncomeAmount = this.Fixed(contractForm.serviceFeeContent.monthIncomeAmount)
                            contractForm.serviceFeeContent2.monthIncomeAmount = contractForm.serviceFeeContent.monthIncomeAmount
                        }
                        if(err) {
                            showNotify('error', '请正确填写服务费收费比例!')
                            this.contractForm.serviceFeeContent.fixFee = ''
                            this.$refs[formName].validateField('serviceFeeContent.fixFee')
                            return
                        }
                        if(contractForm.serviceTypeList) {
                            var serviceTypeList = []
                            contractForm.serviceTypeList.forEach(e => {
                                this.serviceTypes.forEach(ev => {
                                    if(e == ev.serviceId) {
                                        serviceTypeList.push(ev)
                                    }
                                })
                            })
                            contractForm.serviceTypeList = serviceTypeList
                        }
                        delete contractForm.prePayContent.stepwiseList //临时 需要删除
                        post(url, contractForm).then(data => {
                            showNotify('success', data);
                            this.$router.push({path: '/main/contract/list'});
                            // this.invoiceUpdate(data)
                        });
                    }else {
                        showNotify('error', '请检查输入项错误！')
                    }
                });
            },
            updateAttachment(contractId, referId) {
                let url = '/api/contract-web/contract/update-contract-attachment';
                post(url, {
                    contractId: contractId,
                    referId: referId
                }).then(data => {
                    showNotify('success', '绑定客户合同成功');
                })
            },
            showSelectExpSelect() {
                if (this.radio == '范围日') {
                    this.showSelectExpStart = false;
                    this.showSelectExpDay = true;
                } else {
                    this.showSelectExpStart = true;
                    this.showSelectExpDay = false;
                }
            },
            calcuServiceFee(a) {
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'dummy') {
                    this.contractForm.serviceFeeContent.fixFee = 0;
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'fixed') {
                    this.contractForm.serviceFeeContent.fixFee = this.float2.test(this.inputFixed) ? 0 : '';
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'ratio') {
                    console.log(this.inputRatio)
                    this.contractForm.serviceFeeContent.fixFee = (this.float2.test(this.inputRatio) && this.inputRatio <= 100) ? 0 : '';
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'ratio_1') {
                    this.contractForm.serviceFeeContent.fixFee = (this.float2.test(this.inputRatio_1) && this.inputRatio_1 <= 100) ? 0 : '';
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                    this.contractForm.serviceFeeContent.fixFee = 0;
                    this.showInputRatio = a;
                    this.initColumn(2)
                    this.contractForm.serviceFeeContent.stepwiseList[0].endAmount = 2.8
                    this.contractForm.serviceFeeContent.stepwiseList[1].startAmount = 2.8
                    this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_0') {
                    this.contractForm.serviceFeeContent.fixFee = 0;
                    this.showInputRatio = a;
                    this.initColumn()
                    this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_1') {
                    this.contractForm.serviceFeeContent.fixFee = 0;
                    this.showInputRatio = a;
                    this.initColumn()
                    this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
                }
                this.$refs['contractForm'].validateField('serviceFeeContent.fixFee')
            },
            prveFee(a) {
                if (this.contractForm.prePayContent.serviceFeeType == 'ratio') {
                    this.contractForm.prePayContent.secondType = 'real'
                    this.contractForm.prePayContent.serviceFeeRate = this.Fixed(this.prevRatio);
                    this.contractForm.prePayContent.fixFee = (this.float2.test(this.prevRatio) && this.prevRatio <= 100) ? 0 : ''
                    this.showPrev = a;
                }
                if (this.contractForm.prePayContent.serviceFeeType == 'ratio_1') {
                    this.contractForm.prePayContent.secondType = 'should'
                    this.contractForm.prePayContent.discountRate = this.Fixed(this.prevRatio_1);
                    this.contractForm.prePayContent.serviceFeeRate = this.Fixed(this.prevRatio_1);
                    this.contractForm.prePayContent.fixFee = (this.float2.test(this.prevRatio_1) && this.prevRatio_1 <= 100) ? 0 : ''
                    this.showPrev = a;
                }
                this.$refs['contractForm'].validateField('prePayContent.fixFee')
            },
            checkTable(type) {
                var results = []
                console.log(this.contractForm.serviceFeeContent2.stepwiseList)
                for(var i =0; i < this.contractForm.serviceFeeContent.stepwiseList.length; i++) {
                    for(var j = 0; j < 2; j++) {
                        (j || i) && (i + 1 < this.contractForm.serviceFeeContent.stepwiseList.length) && results.push(this.amount(i, j, 0, type))
                    }
                    var a = this.contractForm.serviceFeeContent.stepwiseList[i].percent
                    results.push((this.float2.test(a) && a <= 100) ? 0 : '')
                }
                var m = this.contractForm.serviceFeeContent.monthIncomeAmount
                results.push((this.float2.test(m) && m <= 100) ? 0 : '')
                if(this.contractForm.serviceFeeContent2.stepwiseList.length) {
                    for(var i = 0; i < this.contractForm.serviceFeeContent2.stepwiseList.length; i++) {
                        for(var j = 0; j < 2; j++) {
                           (j || i) && (i + 1 < this.contractForm.serviceFeeContent2.stepwiseList.length) && results.push(this.amount(i, j, 2, type))
                        }
                        var a = this.contractForm.serviceFeeContent2.stepwiseList[i].percent
                        results.push((this.float2.test(a) && a <= 100) ? 0 : '')
                    }
                }
                this.contractForm.serviceFeeContent.fixFee = results.indexOf('') > -1 ? '' : 0
                console.log(results)
            },
            calcuServiceFeeReverse() {
                if(this.contractForm.prePayContent.secondType == 'real') {
                    this.prevRatio = this.contractForm.prePayContent.serviceFeeRate
                }
                if(this.contractForm.prePayContent.secondType == 'should') {
                    this.prevRatio_1 = this.contractForm.prePayContent.serviceFeeRate
                    this.contractForm.prePayContent.serviceFeeType = 'ratio_1'
                    this.showPrev = 2
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'fixed') {
                    this.inputFixed = this.contractForm.serviceFeeContent.fixFee;
                    this.showInputRatio = 0;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'ratio') {
                    if(this.contractForm.serviceFeeContent.secondType == 'should') {
                        this.contractForm.serviceFeeContent.serviceFeeType = 'ratio_1'
                        this.inputRatio_1 = this.contractForm.serviceFeeContent.serviceFeeRate;
                        this.showInputRatio = 2;
                    }
                    if(this.contractForm.serviceFeeContent.secondType == 'real'){
                        this.inputRatio = this.contractForm.serviceFeeContent.serviceFeeRate;
                        this.showInputRatio = 1;
                    }
                }
                if(this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                    console.log(this.contractForm.serviceFeeContent.secondType)
                    if(this.contractForm.serviceFeeContent.secondType == '0') {
                        this.showInputRatio = 3;
                        this.contractForm.serviceFeeContent.serviceFeeType = 'step'
                    }
                    if(this.contractForm.serviceFeeContent.secondType == '1') {
                        this.showInputRatio = 4;
                        this.contractForm.serviceFeeContent.serviceFeeType = 'step_0'
                    }
                    if(this.contractForm.serviceFeeContent.secondType == '2') {
                        this.showInputRatio = 5;
                        this.contractForm.serviceFeeContent.serviceFeeType = 'step_1'
                    }
                    this.$forceUpdate()
                }
            },
            calcuCompanyId() {
                let self = this;
                _.foreach(this.serviceCompaniesList, function (value) {
                    if (value['companyName'] == self.contractForm.serviceCompanyName) {
                        self.contractForm.serviceCompanyId = value['companyId'];
                        return false;
                    } else {
                        self.contractForm.serviceCompanyId = '';
                    }
                })
            },
            calcuPhone() {
                if (!isNaN(this.contractForm.invoicePhone)) {
                    this.contractForm.invoicePhone = parseInt(this.contractForm.invoicePhone)
                }
            },
            getOptionCustomerCompanies() {
                let url = '/api/console-dlv/option/get-option-customer-companies';
                let self = this;
                get(url).then(data => {
                    self.customerCompaniesList = data;
                    _.foreach(data, function (value) {
                        self.restaurants1.push({
                            "value": value['companyName']
                        });
                    });
                    this.getConfig()
                })
            },
            getOptionServiceCompanies() {
                let url = '/api/console-dlv/option/get-option-service-companies';
                let self = this;
                get(url).then(data => {
                    self.serviceCompaniesList = data
                    _.foreach(data, function (value, key) {
                        self.restaurants2[key] = {
                            "value": value['companyName']
                        }
                    })
                })
            },
            querySearch1(queryString, cb) {
                var restaurants = this.restaurants1;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch2(queryString, cb) {
                var restaurants = this.restaurants2;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect() {
                this.calcuCompanyId();
                this.$refs['contractForm'].validateField('serviceCompanyId')
            },
            handleSuccess(file) {
                this.fileList.push(file.data);
                this.referArr.push(file.data.referId);
            },
            handleError() {
                showNotify('error', '上传失败!');
            },
            handleDownload(downloadCode) {
                window.location.href = baseUrl + '/api/contract-web/file/download'
                    + '?downloadCode=' + downloadCode;
            },
            handleDelete() {
                if (this.downloadCode) {
                    post('/api/contract-web/file/delete', {downloadCode: this.downloadCode}).then(data => {
                        // showNotify('success', data);
                        //this.queryAttachments(this.$route.query.contractId);
                        showNotify('success', '删除成功')
                        this.fileList.splice(this.deleteKey, 1)
                        this.referArr.splice(this.deleteKey, 1)
                        this.dialogVisible = false;
                    });
                }
            },
            handleBeforeUpload(file) {
                var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
                var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
                if (AllImgExt.indexOf(extName) == -1) {
                    showNotify('error', '文件类型错误');
                    return false;
                }
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);
                this.formData = formData;
            },
            hanldleHttpRequest() {
                let url = '/api/contract-web/file/upload';
                formPost(url, this.formData).then(data => {
                    this.fileList.push(data);
                    this.referArr.push(data.referId);
                    showNotify('success', '上传成功!');
                    if (this.$route.query.contractId) {
                        this.updateAttachment(this.$route.query.contractId, data.referId);
                    }
                });
            },
            handleChange() {
                if (this.dateValue) {
                    this.contractForm.startDate = this.dateValue[0];
                    this.contractForm.endDate = this.dateValue[1];
                } else {
                    this.contractForm.startDate = '';
                    this.contractForm.endDate = '';
                    this.$refs['contractForm'].validateField('startDate')
                }
            },
            handdleChangeReverse() {
                this.dateValue = [this.contractForm.startDate, this.contractForm.endDate];
            },
            queryDetail(id) {
                let url = '/api/contract-web/contract/contract-detail';
                get(url, {contractId: id}).then(data => {
                    this.contractForm = data;
                    delete this.contractForm.invoiceCompanyName
                    delete this.contractForm.invoiceTin
                    delete this.contractForm.invoiceAddress
                    delete this.contractForm.invoicePhone
                    delete this.contractForm.invoiceBank
                    delete this.contractForm.invoiceAccount
                    this.columnIndex = this.contractForm.serviceFeeContent.stepwiseList.length
                    if(this.contractForm.serviceFeeContent2) {
                        this.columnIndex2 = this.contractForm.serviceFeeContent2.stepwiseList.length
                    }
                    if(!this.contractForm.prePayContent) {
                        this.contractForm.prePayContent = {
                            discountRate: '',
                            fixFee: '',
                            secondType: 'real',
                            serviceFeeRate: '',
                            serviceFeeType: 'ratio'
                        }
                    }
                    if(!this.contractForm.serviceTypeList) {
                        this.contractForm.serviceTypeList = []
                    }
                    else {
                        var serviceTypeList = []
                        this.contractForm.serviceTypeList.forEach(e => {
                            serviceTypeList.push(e.serviceId)
                        })
                        this.contractForm.serviceTypeList = serviceTypeList
                    }
                    this.contractForm.prePayContent.fixFee = this.contractForm.prePayContent.fixFee || 0
                    this.contractForm.serviceFeeContent.fixFee = this.contractForm.serviceFeeContent.fixFee || 0
                    this.contractForm.serviceFeeContent.monthIncomeAmount = this.contractForm.serviceFeeContent.monthIncomeAmount || '2.8'
                    if(this.contractForm.serviceFeeContent2 && !this.contractForm.serviceFeeContent2.containMonthAmount && !this.contractForm.serviceFeeContent.containMonthAmount) {
                        this.contractForm.serviceFeeContent.containMonthAmount = true
                    }
                    if(!this.contractForm.agentFeeContent) {
                        this.contractForm.agentFeeContent = {
                            discountRate: '',
                            fixFee: '',
                            secondType: 'real',
                            serviceFeeRate: '',
                            serviceFeeType: 'ratio'
                        }
                    }
                    this.getOptionCustomerCompanies()
                    this.calcuServiceFeeReverse();
                    this.handdleChangeReverse();
                    // this.showType(this.contractForm.settleType);
                    this.$forceUpdate()
                    this.agentList && this.companyChange(false)
                    this.getConfig()
                    // console.log(this.contractForm)
                })
            },
            queryAttachments(id) {
                let url = '/api/contract-web/contract/contract-attachments';
                get(url, {contractId: id}).then(data => {
                    this.fileList = data;
                });
            },
            query(a) {
                if(isNaN(a)) {
                    a = 1
                }
                this.form.page = a
                post('/api/sysmgr-web/company/query-customer-company', this.form).then(data => {
                    this.company = data
                })
            },
            relevance(a) {
                !this.ishave(a) && this.contractForm.branchs.push({
                    branchId: a.id,
                    branchName: a.fullName
                })
            },
            remove(a, b) {
                // if(!a.recordId) {
                this.contractForm.branchs.splice(b, 1)
                // }
                // else {
                //     post('/api/contract-web/contract/delete-branch', {
                //         recordId: a.recordId
                //     }).then(data => {
                //         this.contractForm.branchs.splice(b, 1)
                //     })
                // }
            },
            ishave(a) {
                var arr = this.contractForm.branchs.filter(e => {
                    return a.id == e.branchId
                })

                return arr.length
            },
            Fixed(a) {
                if(a === '' || isNaN(a)) {
                    return ''
                }
                else {
                    var value = (a - 0).toFixed(2)
                    return value * 100 <= a * 100 ? value : (value - 0.01).toFixed(2)
                }
            },
            setPass(a) {
                console.log(a)
                this.contractForm.serviceFeeContent.fixFee = (this.float2.test(a) && a <= 100) ? 0 : ''
            },
            companyChange(isSel) {
                this.agentList.forEach(e => {
                    if(e.companyId == this.contractForm.agentCompanyId) {
                        if(!e.status) {
                          this.agentDisable = true
                        }
                        this.chargeByName = e.chargeByName
                        this.contractForm.agentCompanyName = e.companyName
                        if(isSel) {
                            console.log(e)
                            this.contractForm.quoteRule = e.quoteRule
                            this.contractForm.quoteFeeContent = e.quoteFeeContent
                            this.$refs.contract.init(this.contractForm)
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .demo-contractForm {
        width: 1200px;
    }

    .line {
        text-align: center;
    }
    .tip {
        color: #999;
        font-size: 14px;
        margin-left: 200px;
        padding-bottom: 10px;
        display: block;
    }
</style>

<style scoped>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }

    .el-icon-question {
        margin-left: 5px;
        color: #f56c6c;
        cursor: pointer;
    }

    .is-disabled input {
        border-color: #e4e7ed !important;
    }

    .top_24 {
        position: relative;
        margin-top: 24px;
    }

    .item_right {
        position: absolute;
        top: 0px;
        right: -120px;
        width: 100px;
    }

    .input_100 {
        width: 120px;
    }

    .center {
        text-align: center;
    }

    .footer {
        text-indent: 400px;
    }

    .left_50 {
        padding-left: 50px;
    }

    .flex {
        display: flex;
        margin-top: 24px;
        margin-left: 50px;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .flex > div {
        font-size: 14px;
        border-radius: 2px;
        background-color: #f4f4f5;
        padding: 5px 5px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    .flex span {
        float: right;
        display: inline-block;
        width: 30px;
        height: 100%;
        cursor: pointer;
        background-image: url(../../image/close.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .gray {
        filter: grayscale(1);
        cursor: not-allowed;
    }
    .el-radio__label {
        text-align: center;
        display: inline-block;
    }
    .upload-demo {
        display: inline-block;
    }
    .ml20 {
        margin-left: 20px;
    }
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
</style>
