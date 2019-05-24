<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">查看历史版本</div>
    </div>
</template>

<script>
import {post, get} from '../../store/api';
export default {
    data() {
        return {
            pageSize: 10,
            contractId: ''
        }
    },
    methods: {
        requestAction(pageInfo) {
            const { contractId } = this
            let param = {
                contractId,
                page: pageInfo.page,
                pageSize: pageInfo.pageSize,
            };
            get('/api/contract-web/contract/query-contracts-history', param).then(data => {
                this.tableList = data
            })
        },
    },
    created() {
        this.contractId = this.$route.query.contractId
        this.requestAction({
            page: 1,
            pageSize: this.pageSize,
        })
    }
}
</script>

