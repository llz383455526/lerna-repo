<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="createByName"
      label="备注人">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="备注时间">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注内容">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
}
</script>

<style>

</style>