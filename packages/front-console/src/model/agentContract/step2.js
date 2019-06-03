import { get, post } from '../../store/api'
class Form {
    constructor() {
        this.serviceCompanyFeeContentList = []
    }
    saveDraft() {
        return post('/api/opencrm/workflow/save_draft', this.contract).then(res => {
            // console.log('res',res)
            this.contract.instanceId = res.id
        })
    }
    submitForm(form) {
        post('/api/contract-web/agent-residence-flow/agent-residence-submit', form).then(res => {
            console.log('res',res)
        })
    }
}

export default Form