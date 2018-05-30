<template>

    <div class="bg-white p15">
        <el-tabs type="border-card">
            <el-tab-pane
                    :key="item.downloadCode"
                    v-for="(item, index) in contractList"
                    :label="item.displayname"
            >
                <!--<iframe :src="item.pdfUrl" width="100%" height="900px"></iframe>-->
                <div style="display: flex">
                    <div style="margin: auto" v-html="item.htmlText"></div>
                </div>

            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
	import { post, get, formPost } from "../../store/api"

	import _ from 'lodash'

	import { baseUrl } from '../../config/address'

	export default {
		created() {
			this.contractId = this.$route.query.contractId

            this.getContractAttachment(this.contractId)
        },
        data() {
			return {
                contractId: '',
                contractList: []
            }
        },
        methods: {
            getContractAttachment(id) {
            	get('/api/contract-web/contract-generate/preview-contract', {
            		id: id
                }).then(result => {
                	let contractList = result.attachments
                    let tag = 0
                    let finishTag = contractList.length
                	//this.contractList = result.attachments

                    _.forEach(contractList, contract => {
	                    /*contract.pdfUrl = `${baseUrl}/api/contract-web/contract-generate/download-single-attachment?downloadCode=${contract.downloadCode}&id=${this.contractId}&type=pdf`*/
	                    get('/api/contract-web/contract-generate/get-contract-as-html', {
	                    	id: this.contractId,
		                    downloadCode: contract.downloadCode
                        }).then(result => {
		                    contract.htmlText = result
		                    tag += 1
                            if(tag === finishTag) {
	                            this.contractList = contractList
                            }
                        })
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>














