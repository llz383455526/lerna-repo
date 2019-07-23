<template>
    <div class="com-paging">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="pageSizes"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                pageSize: 10,
                pageNum: 1,
                timer: null
            }
        },
        props: {
            total: {
                type: Number,
                default: 0
            },
            pageSizes: {
                type: Array,
                default: () => [10, 20, 30, 40]
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size
                this.createTimer()

            },
            handleCurrentChange(index) {
                this.pageNum = index
                this.createTimer()
            },
            /**
             * 物理消抖
             */
            createTimer() {
                this.clearTimer()
                this.timer = setTimeout(() => {
                    this.$emit('onChange', {
                        pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    })
                }, 100)
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer)
                    this.timer = null
                }
            },
            clear() {
                const [oneSize] = this.pageSizes
                this.pageSize = oneSize
                this.pageNum = 1
                this.$emit('onChange', {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .com-paging {
        display: flex;
        justify-content: flex-end;
        padding-top: 20px;
    }
</style>
