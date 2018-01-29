/**
 * Created by bigben on 2017/11/2.
 */

import _ from 'lodash'

const getters = {
	accessToken: state => state.accessToken,
	//uploadFile: state => state.uploadFile,
	backlogQuantity: state => state.backlogQuantity,
	passwordResetStatus: state => state.passwordResetStatus,

    logoutRandomTime: state => state.logoutRandomTime,
    userInformation: state => state.userInformation,
    principalMenu: state => state.principalMenu,
    permissions: state => state.permissions,

	//userInformation: state => state.userInformation,
	uploadPolicy: state => state.uploadPolicy,
	uploadFile: state => state.uploadFile,
	policyTypeRandom: state => state.policyTypeRandom,
	tradeStateColorMap: state => state.tradeStateColorMap,
	distributeStateColorMap: state => state.distributeStateColorMap,
	dictData: state => {
		let dicData = state.dictData
		
		let dictKeys = _.keys(dicData)
		
		_.forEach(dictKeys, dictKey => {
			let _type = []
			let _dict = {
				all: []
			}
			
			_.forEach(dicData[dictKey], item => {
				if(item.isDisplay) {
					if(item.flag) {
						item.flag = item.flag.split(',')
						
						_.forEach(item.flag, key => {
							if(_.indexOf(_type, key) > -1) {
								_dict[key].push(item)
							}else {
								_type.push(key)
								_dict[key] = new Array(item)
							}
						})
						
					}else {
						_dict.all.push(item)
					}
				}
			})
			
			if(_type.length) {
				dicData[dictKey] = _dict
			}
			
		})
		
		return dicData
	},
	userTaskList: state => state.userTaskList,
	fundCompanyList: state => state.fundCompanyList,
	userTaskCount: state => state.userTaskCount
}

export default getters









