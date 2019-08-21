<template>
    <div class="com-paging" :style="{ paddingTop: getPaddingTop }">
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
    /**
     * 分页加载组件
     */
    export default {
        name: 'ComPaging',
        data() {
            return {
                pageSize: 10,
                pageNum: 1,
                timer: null,
            };
        },
        props: {
            paddingTop: {
                type: Number || String,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
            pageSizes: {
                type: Array,
                default: () => [10, 20, 30, 40],
            },
        },
        computed: {
            getPaddingTop() {
                return typeof this.paddingTop === 'number' ? `${this.paddingTop}px` : this.paddingTop;
            },
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.createTimer();

            },
            handleCurrentChange(index) {
                this.pageNum = index;
                this.createTimer();
            },
            /**
             * 物理消抖
             */
            createTimer() {
                this.clearTimer();
                this.timer = setTimeout(() => {
                    this.$emit('onChange', {
                        pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    });
                }, 100);
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
            },
            clear() {
                const [oneSize] = this.pageSizes;
                this.pageSize = oneSize;
                this.pageNum = 1;
                this.$emit('onChange', {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    .com-paging {
        display: flex;
        justify-content: flex-end;
    }
</style>
