// 这份数据里面有一些用不上，但是为了数据完整，可供参考
import { get, post } from '../../store/api'
class Form {
    constructor() {
        this.contractAttachments = []
        this.contractId = 0
        this.contract = ''
        this.workflowType = {
            agent: ['create_agent_sale_contract', 'create_agent_ns_sale_contract'],
            channel: ['create_channel_sale_contract', 'create_channel_ns_sale_contract']
        }
    }
    getDetail(id) {
        get(`/api/opencrm/workflow/details/${id}`).then(res => {
            this.contractAttachments = res.datas.contractAttachments
            this.contractId = res.id
            this.contract = res
		})
    }
    submitForm () {
        const url = '/api/opencrm/workflow/save_submit';
        const param = this.contract;
        return post(url, param)
    }
}
    
export default Form