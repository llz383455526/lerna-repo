<template>

    <div class="bg-white p15">
        <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">合同模板</h4>
            <el-form-item label="业务类型">
                <span>{{templateDetail.contractTypeName}}</span>
            </el-form-item>
            <el-form-item label="行业类型">
                <span>{{templateDetail.industryTypeNames}}</span>
            </el-form-item>
            <el-form-item label="备注">
                <span>{{templateDetail.remark}}</span>
            </el-form-item>

            <h4 class="ml50 mt50">合同内容</h4>
            <el-form-item label="客户从事" prop="customIndustry">
                <el-input v-model="contractForm.customIndustry" placeholder="客户是做什么的，客户企业主要从事的业务"></el-input>
            </el-form-item>
            <el-form-item label="行业类型" prop="industryType" >
                <el-select v-model="contractForm.industryType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="serviceTypeList" >
                <template slot="label">
                    <i class="el-icon-question" title="请参考《服务内容确认书》"></i>服务类型
                </template>
                <el-checkbox-group v-model="contractForm.serviceTypeList" @change="seviceTypeChange">
                    <el-checkbox v-for="item in serviceTypes" :key="item.serviceId" :label="item.serviceId">{{item.serviceName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="服务内容：">
                <div v-html="serviceContent"></div>
			</el-form-item>
            <el-form-item label="发票类目：">
                <el-button size="mini" class="mr8" v-for="item in invoiceOptions" :key="item.value">{{item.text}}</el-button>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyId" >
                <el-select v-model="contractForm.serviceCompanyId" placeholder="请选择" style="width:100%;" @change="serviceBank">
                    <el-option v-for="item in serviceList" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="法定代表人" required>
                <el-input v-model="serviceCompany.corporateName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="公司电话" >
                <el-input v-model="serviceCompany.telephone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" required>
                <el-input v-model="serviceCompany.address" :disabled="true"></el-input>
                <el-button @click="show" type="text">{{showDesc}}</el-button>
            </el-form-item>
            <div v-if="isShow">
                 <el-form-item label="服务商开户银行" >
                    {{contractForm.serviceDepositBank}}
                </el-form-item>
                <el-form-item label="服务商账户名称" >
                    {{contractForm.serviceAccountName}}
                </el-form-item>
                <el-form-item label="服务商银行账号" >
                    {{contractForm.serviceAccountNo}}
                </el-form-item>

                <h4 class="ml50 mt50">客户（甲方）法定代表人</h4>
                <el-form-item label="合摩法定代表人" >
                    {{contractForm.aygLegalPerson}}
                </el-form-item>
                <el-form-item  label="合摩电话" >
                    {{contractForm.aygContactPhone}}
                </el-form-item>
                <el-form-item label="合摩地址" >
                    {{contractForm.aygAddress}}
                </el-form-item>
            </div>
            <el-form-item label="合同期限:" prop="contractStartDate" size="small" >
                <el-date-picker
                    @change="autoFill()"
                    v-model="contractForm.contractStartDate"
                    type="date"
                    placeholder="开始日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                -
                <el-date-picker
                    @change="autoFill(1)"
                    v-model="contractForm.contractEndDate"
                    type="date"
                    placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <h4 class="ml50 mt50">合同报价</h4>
            <el-form-item label-width="110px" prop="offer">
                <!-- <el-row class="mb15" v-show="contractForm.settleType != 'each'">
                    <el-col :span="6">
                        <el-radio label="dummy" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(-1)">无</el-radio>
                    </el-col>
                </el-row> -->
                <el-row class="mb15" v-show="contractForm.settleType != 'each'">
                    <el-col :span="6">
                        <el-radio label="standard" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(0)">标准报价
                        </el-radio>
                    </el-col>
                    <template v-if="showInputRatio == 0">
                        <el-col :span="15">
                            <el-input placeholder="请输入内容" v-model="inputStandard" @blur="calcuServiceFee(0)" :disabled="!(showInputRatio == 0)">
                                <template slot="append">%</template>
                            </el-input>
                        </el-col>
                        <!-- <el-col :span="1" style="text-align: right;">
                            <i class="el-icon-question" title="表示按照固定金额来收取服务费。计算公式：固定收费金额 = 服务费"></i>
                        </el-col> -->
                    </template>
                </el-row>
                <!-- <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="ratio" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(1)">固定比例收费<br>（实发金额）</el-radio>
                    </el-col>
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
                </el-row> -->
                <!-- <el-row>
                    <el-col :span="6">
                        <el-radio label="ratio_1" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(2)">固定比例收费<br>（应发金额）</el-radio>
                    </el-col>
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
                </el-row> -->
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="step" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(3)">分2.8万 - 无流水阶梯报价</el-radio>
                    </el-col><br>
                    <el-col :span="24" v-show="showInputRatio == 3">
                        <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                            <el-table-column label="月收入下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" disabled class="input_100" @change="amount(scope.$index, 0)">
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
                                        <el-input v-model="scope.row.endAmount" disabled class="input_100" @change="amount(scope.$index, 1)">
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
                                    实发金额 * <el-input @blur="setPass(scope.row.percent)" :disabled="!(showInputRatio == 3)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                                    <!-- 每人<i class="el-icon-question" title="按每人月收入分阶梯收费"></i> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <el-button class="top_24" @click="addColumn" size="small" type="primary">增加阶梯</el-button> -->
                        <div class="top_24">
                            甲乙双方同意在结 算当日暂按
                            <el-input class="input_200" v-model="inputRate" @blur="checkInputRate">
                                <template slot="append">%</template>
                            </el-input>
                            的标准计算管理费，并在此基础上计算服务费总额。
                        </div>
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
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="amount(scope.$index, 0)">
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
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="amount(scope.$index, 1)">
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
                                    实发金额 * <el-input @blur="setPass(scope.row.percent)" :disabled="!(showInputRatio == 4)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                                    <!-- 每人<i class="el-icon-question" title="按每人月收入分阶梯收费"></i> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                        <div class="top_24">
                            甲乙双方同意在结 算当日暂按
                            <el-input class="input_200" v-model="inputRate" @blur="checkInputRate">
                                <template slot="append">%</template>
                            </el-input>
                            的标准计算管理费，并在此基础上计算服务费总额。
                        </div>
                    </el-col>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="step_1" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(5)">分2.8万 - 按流水分阶梯报价</el-radio>
                    </el-col><br>
                    <el-col :span="24" v-show="showInputRatio == 5">
                        <div>
                            月收入
                            <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" disabled>
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="contractForm.serviceFeeContent.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(0)">含</el-checkbox>
                            以下
                        </div>
                        <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                            <el-table-column label="月总额下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="amount(scope.$index, 0)">
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
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="amount(scope.$index, 1)">
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
                                    实发金额 * <el-input @blur="setPass(scope.row.percent)" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                                    <!-- 每人<i class="el-icon-question" title="按每人月收入分阶梯收费"></i> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                        <div class="top_24">
                            月收入
                            <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" disabled>
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="contractForm.serviceFeeContent2.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(1)">含</el-checkbox>
                            以上
                        </div>
                        <el-table :data="contractForm.serviceFeeContent2.stepwiseList">
                            <el-table-column label="月总额下限" width="240">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.sequence">
                                        <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="amount(scope.$index, 0, 2)">
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
                                        <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="amount(scope.$index, 1, 2)">
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
                                    实发金额 * <el-input @blur="setPass(scope.row.percent)" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                                    <!-- 每人<i class="el-icon-question" title="按每人月收入分阶梯收费"></i> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteColumn(scope.$index, 1)" v-if="scope.$index > 1 && scope.$index == columnIndex2 - 1">删除</el-button>
                                    <div class="center" v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="top_24" v-if="contractForm.serviceFeeContent2.stepwiseList.length < 10" @click="addColumn(1)" size="small" type="primary">增加阶梯</el-button>
                        <div class="top_24">
                            甲乙双方同意在结 算当日暂按
                            <el-input class="input_200" v-model="inputRate" @blur="checkInputRate">
                                <template slot="append">%</template>
                            </el-input>
                            的标准计算管理费，并在此基础上计算服务费总额。
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <h4 class="ml50 mt50">客户发放方式</h4>
            <el-form-item label="薪酬发放渠道" prop="channelTypeList">
                <el-checkbox-group v-model="contractForm.channelTypeList">
                    <el-checkbox label="A">银行</el-checkbox>
                    <el-checkbox label="B">支付宝</el-checkbox>
                    <el-checkbox label="C">微信</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <h4 class="ml50 mt50">销售联系信息</h4>
            <el-form-item label="销售姓名" prop="contractPerson" >
                <el-input v-model="contractForm.contractPerson"></el-input>
            </el-form-item>
            <el-form-item label="销售联系邮箱" prop="contractEmail" >
                <el-input v-model="contractForm.contractEmail"></el-input>
            </el-form-item>
            <el-form-item label="销售联系电话" prop="contractTel" >
                <el-input v-model="contractForm.contractTel"></el-input>
            </el-form-item>
            <el-form-item label="合同联系人地址" prop="contractAddr" >
                <el-input v-model="contractForm.contractAddr"></el-input>
            </el-form-item>
            <h4 class="ml50 mt50">客户联系信息</h4>
            <el-form-item label="商户名称（公司）" prop="customCompanyName" >
                <el-input v-model="contractForm.customCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人" prop="customLegalPerson" >
                <el-input v-model="contractForm.customLegalPerson"></el-input>
            </el-form-item>
            <el-form-item label="客户联系人姓名" prop="customCollector" >
                <el-input v-model="contractForm.customCollector"></el-input>
            </el-form-item>
            <el-form-item label="客户联系电话" prop="customCollectorPhone" >
                <el-input v-model="contractForm.customCollectorPhone"></el-input>
            </el-form-item>
            <el-form-item label="客户联系地址" prop="customCollectorAddr" >
                <el-input v-model="contractForm.customCollectorAddr"></el-input>
            </el-form-item>
            <el-form-item label="客户联系邮箱" prop="customMail1">
                <el-input v-model="contractForm.customMail1"></el-input>
            </el-form-item>

            <h4 class="ml50 mt50">客户（公司）开票信息</h4>
            <el-form-item label="发票类型" prop="invoiceType" >
                <el-select v-model="contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.ContractGenInvoiceType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="invoiceCompanyName">
                <el-input v-model="contractForm.invoiceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="customTaxIdcd" >
                <el-input v-model="contractForm.customTaxIdcd"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="customAddr" >
                <el-input v-model="contractForm.customAddr"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="customPhone" >
                <el-input v-model="contractForm.customPhone"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="customBankName" >
                <el-input v-model="contractForm.customBankName"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="customBankAccount">
                <el-input v-model="contractForm.customBankAccount"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>

    </div>

</template>

<script>
	import { post, get } from "../../store/api"
	import _ from 'lodash'
	import { showNotify } from '../../plugin/utils-notify'
    import { checkBankNo, checkPhone } from '../../plugin/utils-element-validator'
	export default {
		created() {
            this.getCompanyList()
            this.getSearchOptions()
            this.getServiceTypesOptions();
			this.contractId = this.$route.query.contractId
            if(this.contractId) {
				this.getContractDetail(this.contractId)
            }else {
	            let tplId = this.$route.query.tplId
	            this.getTemplateDetail(tplId)
            }
            this.aCompany();
            this.initColumn();
            get('/api/sysmgr-web/commom/option?enumType=IndustryType').then(data => {
                this.invoiceTypeList = data
            })
            // get('/api/contract-web/commom/option?enumType=InvoiceType').then(data => {
            //     this.invoiceTypeList = data
            // })
        },
        data() {
			return {
                isShow:false,
                showDesc:'展开',
                templateDetail: {},
                inputStandard: '',
                inputRate: '',
                showInputRatio: 0,
                inputRatio: '',
                inputRatio_1: '',
                contractForm: {
                    customIndustry: '',
                    serviceTypeList: [],
                    industryType: '',
                    offer: '1',
	                invoiceType: '',
	                invoiceTypeName: '',
	                // invoiceSubjectId: '',
	                invoiceSubjectName: '',
	                serviceCompanyId: '',
	                serviceCompanyName: '',
	                contractStartDate: '',
	                contractEndDate: '',
	                customCompanyId: 0,
	                customCompanyName: '',
	                customLegalPerson: '',
	                customCollector: '',
	                customCollectorPhone: '',
	                customCollectorAddr: '',
	                customMail1: '',
	                invoiceCompanyName: '',
	                customTaxIdcd: '',
	                customAddr: '',
	                customPhone: '',
	                customBankName: '',
	                customBankAccount: '',
                    // serviceId:'',
                    serviceAccountName:'',
                    serviceAccountNo:'',
                    serviceDepositBank:'',
                    contractPerson:'',
                    contractEmail:'',
                    contractAddr:'',
                    aygLegalPerson:'',
                    aygContactPhone:'',
                    aygAddress:'',
                    contractStartDate: '',
                    contractEndDate: '',
                    contractTel: '',
                    // standardRate: '',
                    // laddersRate: '',
                    // lv1Step1Amount: '',
                    // lv1Step1Rate: '',
                    // lv1Step2Amount1: '',
                    // lv1Step2Amount2: '',
                    // lv1Step2Rate: '',
                    // lv1Step3Amount: '',
                    // lv1Step3Rate: '',
                    // table_0: '',
                    // lv2Step1Amount: '',
                    // lv2Step1Rate: '',
                    // lv2Step2Amount1: '',
                    // lv2Step2Amount2: '',
                    // lv2Step2Rate: '',
                    // lv2Step3Amount: '',
                    // lv2Step3Rate: '',
                    // table_1: '',
                    channelTypeList: [],
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: '',
                        fixFee: 0,
                        monthIncomeAmount: '',
                        serviceFeeRate: '',
                        serviceFeeType: 'standard',
                        containMonthAmount: true,
                        stepwiseList: []
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    }
                },
				rules: {
                    customIndustry: [
                        {required: true, message: '请填写客户从事', trigger: 'blur'}
                    ],
                    offer: [
                        {required: true, message: '请选择并正确填写报价（大于零且最多两位小数）', trigger: 'blur'}
                    ],
					invoiceType: [
						{required: true, message: '请选择发票类型', trigger: 'change'}
                    ],
					// invoiceSubjectId: [
					// 	{required: true, message: '请选择发票类目', trigger: 'change'}
                    // ],
					serviceCompanyId: [
						{required: true, message: '请选择服务商', trigger: 'change'}
                    ],
                    industryType: [
                        {required: true, message: '请选择行业类型', trigger: 'change'}
                    ],
					contractStartDate: [
						{ required: true, message: '请选择合同期限', trigger: 'blur' }
                    ],
					customCompanyName: [
						{required: true, message: '请填写客户公司名称', trigger: 'blur'}
					],
					customLegalPerson: [
						{required: true, message: '请填写客户公司法定代表人', trigger: 'blur'}
                    ],
					customCollector: [
						{ required: true, message: '请填写客户联系人姓名', trigger: 'blur' }
					],
					customCollectorPhone: [
						{ required: true, message: '请填写正确的电话号码', trigger: 'blur', validator: checkPhone }
					],
					customCollectorAddr: [
						{ required: true, message: '请填写客户联系地址', trigger: 'blur' }
					],
					invoiceCompanyName: [
						{ required: true, message: '请填写公司名称', trigger: 'blur' }
					],
					customTaxIdcd: [
						{ required: true, message: '请填写纳税人识别号', trigger: 'blur' }
					],
					customAddr: [
						{ required: true, message: '请填写地址', trigger: 'blur' }
					],
					customPhone: [
						{ required: true, message: '请填写正确的电话号码', trigger: 'blur', validator: checkPhone }
					],
					customBankName: [
						{ required: true, message: '请填写开户银行', trigger: 'blur'}
					],
					customBankAccount: [
						{ required: true, message: '银行账号至少为5位数字', trigger: 'blur', validator: checkBankNo  }
                    ],
                    customMail1: [
                        { required: true, message: '请填写邮箱地址', trigger: 'blur'}
                    ],
                    // serviceId: [
					// 	{required: true, message: '请选择服务类型', trigger: 'change'}
                    // ],
                    serviceTypeList: [
						{required: true, message: '请选择服务类型', trigger: 'change'}
                    ],
                    contractPerson: [
						{required: true, message: '销售姓名', trigger: 'blur'}
					],
                    contractEmail: [
						{required: true, message: '销售联系人邮箱', trigger: 'blur'}
                    ],
                    contractTel: [
                        {required: true, message: '销售联系人电话', trigger: 'blur'}
                    ],
                    contractAddr: [
						{required: true, message: '销售联系人地址', trigger: 'blur'}
                    ],
                    // table_0: [
                    //     {required: true, message: '请正确填写（大于零且最多两位小数）', trigger: 'blur'}
                    // ],
                    // table_1: [
                    //     {required: true, message: '请正确填写（大于零且最多两位小数）', trigger: 'blur'}
                    // ],
                    channelTypeList: [
                        {required: true, message: '至少选择一项', trigger: 'blur'}
                    ]
                },
                customList: [],
                serviceList: [],
				searchOptions: {},
                invoiceOptions: {},
                serviceTypes:{},
				dateValue: '',
                contractId: '',
                fileList: [],
                proType: '0',
                table_0: [
                    {
                        rate: 'lv1Step1Rate'
                    },
                    {
                        rate: 'lv1Step2Rate'
                    },
                    {
                        rate: 'lv1Step3Rate'
                    }
                ],
                table_1: [
                    {
                        rate: 'lv2Step1Rate'
                    },
                    {
                        rate: 'lv2Step2Rate'
                    },
                    {
                        rate: 'lv2Step3Rate'
                    }
                ],
                channelTypes: [],
                columnIndex: 0,
                columnIndex2: 0,
                invoiceTypeList: [],
                float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
            }
        },
        computed: {
            serviceCompany() {
                var company = this.serviceList.filter(e => e.companyId == this.contractForm.serviceCompanyId)
                return company[0] || {}
            },
            serviceContent() {
                var str = '', contents = []
                this.contractForm.serviceTypeList.forEach(e => {
                    var content = _.find(this.serviceTypes, serviceType => serviceType.serviceId === e)
                    if(content) {
                        contents.push(content)
                    }
                    // if(content) {
                    //     str += `${str ? '<br>' : ''}${content.seqNo}、${content.serviceContent}`
                    // }
                })
                for(var i =  0; i < contents.length; i++) {
                    for(var j = i; j < contents.length; j++) {
                        console.log(contents[i].seqNo, contents[j].seqNo)
                        if(contents[i].seqNo > contents[j].seqNo) {
                            var a = contents[i]
                            contents[i] = contents[j]
                            contents[j] = a
                        }
                    }
                    str += `${str ? '<br>' : ''}${contents[i].seqNo}、${contents[i].serviceContent}`
                }
                return str
            }
        },
        methods: {
            setOffer(a) {
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
                if(this.contractForm.laddersRate) {
                    this.checkAll(true)
                }
            },
            autoFill(a) {
                if(!a) {
                    var time = new Date(new Date(this.contractForm.contractStartDate).getTime() - 24 * 60 * 60 * 1000)
                    this.contractForm.contractEndDate = `${time.getFullYear() + 1}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`}`
                }
                else {
                    var time = new Date(new Date(this.contractForm.contractEndDate).getTime() + 24 * 60 * 60 * 1000)
                    this.contractForm.contractStartDate = `${time.getFullYear() - 1}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`}`
                }
            },
            checkTable(a, index, b) {
                if(b && !this.contractForm[a]) {
                    return
                }
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
                var relevance = ''
                switch (a) {
                    case 'lv1Step1Amount':
                        relevance = 'lv1Step2Amount1'
                        this.compare_0(a, 'lv1Step2Amount2', index)
                        break;
                    case 'lv1Step2Amount1':
                        relevance = 'lv1Step1Amount'
                        this.compare_0(a, 'lv1Step2Amount2', index)
                        break;
                    case 'lv1Step2Amount2':
                        relevance = 'lv1Step3Amount'
                        this.compare_1(a, 'lv1Step2Amount1', index)
                        break;
                    case 'lv1Step3Amount':
                        relevance = 'lv1Step2Amount2'
                        this.compare_1(a, 'lv1Step2Amount1', index)
                        break;
                    case 'lv2Step1Amount':
                        relevance = 'lv2Step2Amount1'
                        this.compare_0(a, 'lv2Step2Amount2', index)
                        break;
                    case 'lv2Step2Amount1':
                        relevance = 'lv2Step1Amount'
                        this.compare_0(a, 'lv2Step2Amount2', index)
                        break;
                    case 'lv2Step2Amount2':
                        relevance = 'lv2Step3Amount'
                        this.compare_1(a, 'lv2Step2Amount1', index)
                        break;
                    case 'lv2Step3Amount':
                        relevance = 'lv2Step2Amount2'
                        this.compare_1(a, 'lv2Step2Amount1', index)
                        break;
                    default:
                        break;
                }
                this.contractForm[relevance] = this.contractForm[a]
            },
            compare_0(a, b, index) {
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) < 0) && (this.contractForm.offer = '')
            },
            compare_1(a, b, index) {
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) > 0) && (this.contractForm.offer = '')
            },
            checkRate(a, index, b) {
                if(b && !this.contractForm[a]) {
                    return
                }
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
            },
            checkAll(b) {
                var amount = [
                    ['lv1Step1Amount', 'lv1Step2Amount1', 'lv1Step2Amount2', 'lv1Step3Amount'],
                    ['lv2Step1Amount', 'lv2Step2Amount1', 'lv2Step2Amount2', 'lv2Step3Amount']
                ], rate = [
                    ['lv1Step1Rate', 'lv1Step2Rate', 'lv1Step3Rate'],
                    ['lv2Step1Rate', 'lv2Step2Rate', 'lv2Step3Rate']
                ]
                amount.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkTable(ev, i, b)
                    })
                })
                rate.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkRate(ev, i, b)
                    })
                })
            },
            aCompany(){
                get('/api/sysmgr-web/commom/company-infos', {
                        companyId: 1
                    }).then(result => {
                            if(result){
                                this.contractForm.aygLegalPerson = result.baseInfo.legalPerson 
                                this.contractForm.aygContactPhone = result.baseInfo.contactPhone1
                                this.contractForm.aygAddress = result.baseInfo.contactAddr1
                            }
                            
                    })
            },
            serviceBank(){
                if(this.contractForm.serviceCompanyId){
                    this.serviceList.forEach(e => {
                        if(e.companyId == this.contractForm.serviceCompanyId) {
                            this.contractForm.serviceDepositBank = e.bankBranchName
                            this.contractForm.serviceAccountNo = e.bankAccount
                            this.contractForm.serviceAccountName = e.bankAccountName
                        }
                    })
                }
            },
            getTemplateDetail(tplId) {
                get('/api/contract-web/contract-tpl/contract-tpl-detail', {
	                id: tplId
                }).then(result => {
	                this.templateDetail = result
                    this.fileList = result.attachments
                })
            },
            getCompanyList() {
                get('/api/salemgt/common/service-company/list').then(data => {
                    this.serviceList = data
                })
            },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=ContractGenInvoiceType,ContractGenSettleType', {})
			        .then(result => {
				        this.searchOptions = result
			        })
            },
            getInvoiceOptions() {
                if(this.contractForm.serviceTypeList.length) {
                    post('/api/contract-web/service-mgr/get-service-subject-options', {
	                	serviceIds: this.contractForm.serviceTypeList,
                    }).then(result => {
                        this.invoiceOptions = result;
		            })
                }
                else {
                    this.invoiceOptions = []
                }
            },
            getServiceTypesOptions() {
	            get('/api/contract-web/service-mgr/get-service-type-options', {}).then(result => {
                    this.serviceTypes = result
                })
            },
            seviceTypeChange(){
                this.getInvoiceOptions();
            },
            setContractFormData(options, key, idKey, nKey, value) {
                let obj = _.find(options, item => item[idKey] === value)
                console.log(arguments)
            	this.contractForm[`${key}Name`] = obj[nKey]
            },
	        backToList() {
            	this.$router.push('contractList')
            },
            // -------------------------------------
            calcuServiceFee(a) {
                this.inputRate = ''
                if(this.contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                    this.contractForm.offer = (this.float2.test(this.inputStandard) && this.inputStandard <= 100) ? 0 : '';
                    // (this.inputStandard && (this.inputStandard - 0 > 0 && this.inputStandard <= 100)) ? 0 : '';
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                    this.contractForm.offer = 0;
                    this.showInputRatio = a;
                    this.initColumn(2)
                    this.contractForm.serviceFeeContent.stepwiseList[0].endAmount = 2.8
                    this.contractForm.serviceFeeContent.stepwiseList[1].startAmount = 2.8
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_0') {
                    this.contractForm.offer = 0;
                    this.showInputRatio = a;
                    this.initColumn()
                }
                if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_1') {
                    this.contractForm.offer = 0;
                    this.showInputRatio = a;
                    this.initColumn()
                    this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
                }
                this.$refs['contractForm'].validateField('offer')
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
            amount(a, b, c) {
                var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList, amount = ''
                if(c) {
                    stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
                }
                if(b) {
                    stepwiseList[a + 1] && (stepwiseList[a + 1].startAmount = stepwiseList[a].endAmount)
                    amount = stepwiseList[a].endAmount
                }
                else {
                    stepwiseList[a - 1] && (stepwiseList[a - 1].endAmount = stepwiseList[a].startAmount)
                    amount = stepwiseList[a].startAmount
                }
                if(this.float2.test(amount) && stepwiseList[a].startAmount - 0 < stepwiseList[a].endAmount) {
                    this.contractForm.offer = 0
                }
                else {
                    this.contractForm.offer = ''
                }
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
            checkInputRate() {
                this.contractForm.offer = (this.float2.test(this.inputRate) && this.inputRate <= 100) ? 0 : ''
                // this.inputRate ? 0 : ''
            },
            // -------------------------------------
	        submitForm(formName) {
		        let url = this.contractId ? '/api/contract-web/contract-generate/update-contract-generate' : '/api/contract-web/contract-generate/create-contract-generate'
                if(this.contractForm.serviceFeeContent.serviceFeeType != 'standard' && this.inputRate === '') {
                    this.contractForm.offer = ''
                }
		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        this.setContractFormData(this.searchOptions.ContractGenInvoiceType, 'invoiceType', 'value', 'text', this.contractForm.invoiceType)
				        this.setContractFormData(this.serviceList, 'serviceCompany', 'companyId', 'name', this.contractForm.serviceCompanyId)
                        var err = false, contractForm = JSON.parse(JSON.stringify(this.contractForm))
                        contractForm.serviceFeeContent.settledRate = this.Fixed(this.inputRate)
                        if(contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                            contractForm.serviceFeeContent.serviceFeeRate = this.Fixed(this.inputStandard)
                        }
                        if(contractForm.serviceFeeContent.serviceFeeType == 'step'){
                            contractForm.serviceFeeContent.secondType = 0
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
                        if(contractForm.serviceFeeContent.serviceFeeType == 'step_0'){
                            console.log('step_0')
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
                            showNotify('error', '请正确填写服务费收费比例！')
                            this.contractForm.offer = ''
                            this.$refs[formName].validateField('offer')
                            return
                        }
                        // --------------------------------------------
                        contractForm.tplId = this.templateDetail.id
                        delete contractForm.offer
				        contractForm = _.assign(contractForm, {
					        serviceLegalPerson: this.serviceCompany.corporateName,
					        serviceRegisterAddr: this.serviceCompany.address,
                            servicePhone: this.serviceCompany.telephone
                        })
                        if(contractForm.serviceTypeList) {
                            var serviceTypeList = []
                            contractForm.serviceTypeList.forEach(e => {
                                this.serviceTypes.forEach(ev => {
                                    if(e == ev.serviceId) {
                                        serviceTypeList.push({
                                            serviceId: ev.serviceId,
                                            serviceName: ev.serviceName
                                        })
                                    }
                                })
                            })
                            contractForm.serviceTypeList = serviceTypeList
                        }
                        if(this.contractId) contractForm.id = this.contractId
                        post(url, contractForm)
                            .then(result => {
	                            showNotify('success', this.contractId ? '编辑成功' : '新建成功')
	                            this.backToList()
                            })
			        }else {
			        	showNotify('error', '请检查输入项错误！')
                    }
		        })
            },
            getContractDetail(id) {
                get('/api/contract-web/contract-generate/contract-generate-detail', {
                	id: id
                }).then(result => {
                    this.tplId = result.tplId
                    this.getTemplateDetail(this.tplId);
                    for(var k in this.contractForm) {
                        if(result[k]) {
                            this.contractForm[k] = result[k]
                        }
                    }
                    this.inputRate = this.contractForm.serviceFeeContent.settledRate
                    this.columnIndex = this.contractForm.serviceFeeContent.stepwiseList.length
                    if(this.contractForm.serviceFeeContent2) {
                        this.columnIndex2 = this.contractForm.serviceFeeContent2.stepwiseList.length
                    }
                    if(this.contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                        this.inputStandard = this.contractForm.serviceFeeContent.serviceFeeRate
                    }
                    if(this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                        if(this.contractForm.serviceFeeContent.secondType == 1) {
                            this.contractForm.serviceFeeContent.serviceFeeType = 'step_0'
                            this.showInputRatio = 4
                        }
                        else if(this.contractForm.serviceFeeContent.secondType == 2){
                            this.contractForm.serviceFeeContent.serviceFeeType = 'step_1'
                            this.showInputRatio = 5
                        }
                        else {
                            this.showInputRatio = 3
                        }
                    }
                    if(this.contractForm.serviceTypeList) {
                        var serviceTypeList = []
                        this.contractForm.serviceTypeList.forEach(e => {
                            serviceTypeList.push(e.serviceId)
                        })
                        this.contractForm.serviceTypeList = serviceTypeList
                    }
                    this.getInvoiceOptions();
                    // if(this.contractForm.channelType) {
                    //     this.channelTypes = this.contractForm.channelType.split(',')
                    // }
                })
            },
	        handleDownload(downloadCode) {
            	window.location.href = `/api/contract-web/contract-generate/download-single-attachment?downloadCode=${downloadCode}&id=${this.contractId}&type=docx`
            },
            show(){
                this.isShow = !this.isShow;
                if(this.isShow){
                    this.showDesc = '收起';
                }else{
                     this.showDesc = '展开';
                }
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
                this.contractForm.offer = (this.float2.test(a) && a <= 100) ? 0 : ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 1000px;
    }
    .item_div {
        margin-bottom: 20px;
    }
    .input_300 {
        width: 300px;
    }
    .input_200 {
        width: 200px;
    }
    .input_100 {
        width: 100px;
    }
    .mr8 {
        margin-right: 8px;
    }
    .ml86 {
        margin-left: 86px;
    }
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
    .top_24 {
        margin-top: 24px;
    }
    .mb15 {
        margin-bottom: 15px;
    }
</style>