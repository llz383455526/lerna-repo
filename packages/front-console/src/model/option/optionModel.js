import BaseModel from '../base/BaseModel'
import { get, post } from '../../store/api'

class optionModel extends BaseModel {
	constructor() {
		super();
		this.customerCompanies = []; // 客户公司(企业)列表
		this.appList = []; // 商户列表
		this.serveCompanyList = []; // 服务商公司列表
		this.primaryAccountList = []; // 主账户列表
		this.bypassAccountList = []; // 子账户列表
		this.clearingStateList = []; // 清分状态下拉列表
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
	getAppList(companyId) {
		get('/api/sysmgr-web/commom/app-list', {
			companyId: companyId
		}).then(result => {
			this.appList = result;
		})
	}
	getServeCompanyList() {
		get('/api/sysmgr-web/commom/company', {
			companyIdentity: 'service'
		}).then(data => {
			this.serveCompanyList = data
		})
	}
	getPrimaryAccountList(companyId) {
		post('/api/paymentmgt/front/channel/qrylist', {
			companyId: companyId,
			channelType: 'pingan',
			pageNo: 1,
			pageSize: 100000
		}).then(res => {
			this.primaryAccountList = res.data
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
}

export default optionModel;