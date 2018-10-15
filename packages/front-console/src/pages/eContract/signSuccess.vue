<template>
    <div class="main">
        <div class="title">发起新签约</div>
        <div class="tip">
            <div class="el-icon-success">发起签约成功，系统将会自动发起签约通知操作，请在签约管理页面留意签约情况。</div>
            <div>如果您有任何疑问或紧急事项，请及时联系爱员工产品或技术同事，联系电话：020-37127695。</div>
            <router-link :to="`index?templateName=${templateName}`" tag="a">
                <el-button>查看签约记录</el-button>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: {},
	        templateName: ''
        }
    },
    mounted() {
        // this.msg = JSON.parse(sessionStorage.getItem('sign'))
        this.templateName = this.$route.query.name
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
.tip {
    background-color: #fcffe8;
    padding: 30px 20px;
    margin-bottom: 10px;
    width: 800px;
}
.tip > div:nth-child(1) {
    font-size: 16px;
    margin-bottom: 20px;
}
.tip > div:nth-child(1)::before {
    color: #7cba59;
    font-size: 20px;
    margin-right: 10px;
}
.tip > div:nth-child(2) {
    padding-left: 55px;
    color:#999;
    font-size: 14px;
    margin-bottom: 40px;
}
</style>
