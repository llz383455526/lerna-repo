<template>
    <div>
        <el-table :data="tableData">
            <el-table-column label="月总额下限" width="240">
                <template slot-scope="scope">
                    <template v-if="scope.$index">
                        <el-form-item 
                            :prop="`${propName}.${scope.$index}.startAmount`"
                            :rules="{ required: true, message: '请输入月总额下限', trigger: 'blur' }">
                            <el-input v-model="scope.row.startAmount" class="input">
                                <template slot="append">万</template>
                            </el-input>
                        </el-form-item>
                        <el-checkbox v-model="scope.row.equalsStart" class="mt10">含
                            <template v-if="scope.row.sequence === tableData.length - 1">
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
                    <template v-if="scope.row.sequence !== tableData.length - 1">
                        <el-form-item 
                            :prop="`${propName}.${scope.$index}.endAmount`"
                            :rules="{ required: true, message: '请输入月总额上限', trigger: 'blur' }">
                            <el-input v-model="scope.row.endAmount" class="input">
                                <template slot="append">万</template>
                            </el-input>
                        </el-form-item>
                        <el-checkbox v-model="scope.row.equalsEnd" class="mt10">含
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
            <el-table-column label="阶梯收费" width="350">
                <template slot-scope="scope">
                    <el-form-item label="实发金额"
                        :prop="`${propName}.${scope.$index}.percent`"
                        :rules="{ required: true, message: '请输入阶梯收费', trigger: 'blur' }">
                        <el-input v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 
                    </el-form-item>
                    <i class="el-icon-question mt10" title="按每人月收入分阶梯收费"></i>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button 
                        type="text" 
                        @click="deleteColumn(tableData, scope.$index)" 
                        v-if="scope.$index > 1 && scope.$index === tableData.length - 1" 
                        :disabled="disabled">{{scope.$length}}删除</el-button>
                    <div class="center" v-else>-</div>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="mt25" v-if="tableData.length < 10 && showAdd" @click="addColumn(tableData)" size="small" type="primary" :disabled="disabled">增加阶梯</el-button>
    </div>
</template>

<script>
export default {
    props: {
        tableData: {
            type: Array
        },
        showAdd: {
            type: Boolean,
            default: true
        },
        propName: {
            type: String
        }
    },
    methods: {
        deleteColumn(list, index) {
            list.splice(index, 1)
        },
        addColumn(list) {
            list.push({
                "endAmount": null, // 结束金额
                "equalsEnd": false, // 是否包含上限金额
                "equalsStart": false, // 是否包含下限金额
                "percent": 0, // 收费比例
                "sequence": list.length, // 序号
                "startAmount": 0 // 开始金额
            })
        }
    },
    created() {
    }
}
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
.input {
    width: 120px;
    // vertical-align: middle;
}
</style>

