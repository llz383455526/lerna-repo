<template>
    <div class="page-container">
        <invoice-step></invoice-step>
        <invoice-form
            class="invoice-form"
            :invoiceTypeList="invoiceTypeList"
            :invoiceCategory="invoiceCategory"
        ></invoice-form>
    </div>
</template>

<script>
import InvoiceStep from './components/InvoiceStep'
import InvoiceForm from './components/InvoiceForm'

import {invoiceApi} from 'src/api'
import { get, post, importPost } from "../../../store/api";

export default {
    components: {
        InvoiceStep,
        InvoiceForm
    },
    data() {
        return {
            invoiceTypeList: [],
            invoiceCategory: []
        }
    },
    methods: {
        getInvoiceTypeList() {
            get(invoiceApi.getInvoiceTypeList).then(res => {
                this.invoiceTypeList = res
            })
        },
        getInvoiceCategory() {
            get(invoiceApi.getInvoiceCategory, {
                companyId : this.$route.query.customCompanyId,
                serviceCompanyId : this.$route.query.serviceCompanyId})
                .then(res => {
                console.log(res)
                this.invoiceCategory = res || []
            })
            
        }
    },
    created() {
        this.getInvoiceTypeList()
        this.getInvoiceCategory()
    }
}
</script>

<style lang="scss" scoped>
.invoice-form{
    margin-top: 30px;
}
</style>
