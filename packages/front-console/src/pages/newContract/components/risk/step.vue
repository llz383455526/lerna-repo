<template>
  <div>
    <div class="hm-title mt30">分2.8万(不含)以下业务</div>
    <el-form :model="formInline"
             label-width="150px">
      <el-form-item label="设置默认底价">
        <el-input v-model="formInline.user"
                  placeholder="落地公司通用"
                  style="width: 200px;"></el-input>
        <el-button type="primary"
                   @click="onSubmit">确定</el-button>
      </el-form-item>
      <el-form-item label="设置单落地公司底价">
        <el-select v-model="formInline.region"
                   placeholder="选择税优地">
          <el-option label="区域一"
                     value="shanghai"></el-option>
          <el-option label="区域二"
                     value="beijing"></el-option>
        </el-select>
        <el-select v-model="formInline.region"
                   placeholder="选择落地公司">
          <el-option label="区域一"
                     value="shanghai"></el-option>
          <el-option label="区域二"
                     value="beijing"></el-option>
        </el-select>
        <el-input v-model="formInline.user"
                  placeholder="设置底价"
                  style="width: 200px;"></el-input>
        <el-button type="primary"
                   @click="onSubmit">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="date"
                           label="税优地名称">
          </el-table-column>
          <el-table-column prop="name"
                           label="落地公司名称">
          </el-table-column>
          <el-table-column prop="合同底价"
                           label="地址">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, scope.$index)"
                         type="text"
                         size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
        this.tableData.push(this.formInline)
      },
      handleClick(row, index) {
        console.log(row);
        console.log(index);
        this.tableData.splice(index, 1)
      },
    }
  }
</script>
