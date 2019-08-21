import BaseModel from '../base/BaseModel'
import { get, post } from '../../store/api'

class optionModel extends BaseModel {
	constructor() {
		super();
		this.customerCompanies = []; // 客户公司(企业)列表
		this.appList = []; // 商户列表
        this.serveCompanyList = []; // 服务商公司列表
        this.channelTypeList = [];  // 渠道类型列表
		this.primaryAccountList = []; // 主账户列表
		this.bypassAccountList = []; // 子账户列表
        this.clearingStateList = []; // 清分状态下拉列表
        this.withdrawInfo = {}
        this.customNatureList = []; // 客户性质
        this.vciPayTypeList = []; // 付款方式
        this.customCompanyUnderTypeList = [
            { text: '甲方分公司', value: 'branch' },
            { text: '甲方子公司', value: 'sub' }
        ]; // 甲方下属公司类型
        this.companyIdentityList = []; // 已有客户
        this.agentTypeList = []; // 客户主体列表
        this.contractTplList = []; // 合同模版
        this.agentCompanyList = []; // 代理商公司列表
        this.agentContractCompanyList = []; // 代理商公司列表
        this.groupUsersList = []; // 销售姓名列表
	}
	getJson (list, key, value) {
		return list.find(function(element) {
			return element[key] === value;
		})
	}
	getCustomerCompanies() {
		get('/api/console-dlv/option/get-option-customer-companies').then(res => {
			this.customerCompanies = res
		})
    }
    getChannelTypeList() {
        get('/api/balance-web/commom/option?enumType=ReconThirdPaymentType').then(res => {
            this.channelTypeList = res
        })
    }
	getAppList(companyId) {
		get('/api/sysmgr-web/commom/app-list', {
			companyId: companyId
		}).then(result => {
			this.appList = result;
		})
    }
    /**
     * 手动清分，服务商列表
     */
	getServeCompanyList() {
		get('/api/sysmgr-web/commom/company', {
			companyIdentity: 'service'
		}).then(data => {
			this.serveCompanyList = data
		})
	}
	getPrimaryAccountList(companyId, channelType='pingan') {
		post('/api/paymentmgt/front/channel/qrylist', {
			companyId: companyId,
			channelType: channelType,
			pageNo: 1,
			pageSize: 100000
		}).then(res => {
			this.primaryAccountList = res.data
		})
    }
    getWithdrawInfo(param) {
        this.withdrawInfo = {}
        post('/api/balance-web/pay-user-recon/get-withdraw-info', param).then(res => {
            this.withdrawInfo = res
        })
    }
	getBypassAccountList(channelId) {
		post('/api/paymentmgt/front/channel/payuser/qrylist', {
			channelId: channelId,
			pageNo: 1,
			pageSize: 100000
		}).then(res => {
			this.bypassAccountList = res.data
		})
	}
	getClearingStateList() {
		get('/api/balance-web/commom/option', {enumType: 'ReconciliationState'}).then(result => {
            this.clearingStateList = result;
        })
    }
    getSourceTypeList() {
        get('/api/balance-web/commom/option', {enumType: 'ReconciliationSourceType'}).then(result => {
            this.sourceTypeList = result;
        })
    }
    getCustomNatureList() {
        get('/api/sysmgr-web/commom/option?enumType=CustomNature').then(data => {
            this.customNatureList = data;
        })
    }
    getVciPayTypeList() {
        return new Promise((resolve) => {
            get('/api/sysmgr-web/commom/option?enumType=VciPayType').then(data => {
                this.vciPayTypeList = data;
                resolve(data)
            })
        })
    }
    getCompanyIdentityList() {
        get('/api/contract-web/contract/custom-company-options').then(data => {
            this.companyIdentityList = data;
        })
    }
    getAgentTypeList() {
        get('/api/contract-web/commom/option?enumType=AgentType').then(data => {
            this.agentTypeList = data;
        })
    }
    getContractTplList(tplType) {
        const param = { tplType: tplType || '' }
        get('/api/contract-web/contract-tpl/tpl-options', param).then(data => {
            this.contractTplList = data;
        })
    }
    getAgentCompanyList() {
        get('/api/sysmgr-web/commom/agent-company-options').then(data => {
            this.agentCompanyList = data
        })
    }
    getAgentContractCompanyList() {
        get('/api/contract-web/agent-residence-flow/agent-contract-company-options').then(data => {
            this.agentContractCompanyList = data
        })
    }
    getGroupUsersList() {
        get('/api/sysmgr-web/user/get-group-users?relationKey=ChannelUserRelation').then(data => {
            this.groupUsersList = data
        })
    }
}

export default optionModel;