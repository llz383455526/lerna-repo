import * as types from '../mutation-types'
import {post, get} from '../api'
// import _ from 'lodash'

const initState = {
    companyBuildList: {total: 0, list: []},
    companyAddContactResult: '',
    companyDeleteResult: '',
    companyContactDeleteResult: '',
    companyContactList: [],
    companyBasicInfo: {
        id: '',
        name: '',
        icInfo: {},
        shareholderInfos: [],
        keyPersonnelInfos: [],
        branchInfos: [],
        foreignInvestInfos: [],
        ipInfos: {},
        riskInfo: {},
    },
    companySubmitResult: '',
    companySearchResult: {
        result: '',
    },
    account: '',
    customerNameList: [],
    payOrderList: []
}

const state = {
    ...initState,
    initState() {
        return initState
    }
}

const getters = {
    companyBuildList: state => state.companyBuildList,
    companySearchResult: state => state.companySearchResult,
    companyAddContactResult: state => state.companyAddContactResult,
    companyContactList: state => state.companyContactList,
    companyBasicInfo: state => state.companyBasicInfo,
    companyDeleteResult: state => state.companyDeleteResult,
    companyContactDeleteResult: state => state.companyContactDeleteResult,
    companySubmitResult: state => state.companySubmitResult,
    account: state => state.account,
    customerNameList: state => state.customerNameList,
    payOrderList: state => state.payOrderList
}

const actions = {
    companyBuildList({commit}, param) {
        get('/pay-order/get-all-app').then(data => {
            commit(types.GET_COMPANY_BUILD_LIST, data);
        })
    },

    account({commit}, param) {
        post('/pay-user-account/query', {
            "companyId": 60085,
            "isQueryBalance": 1
        }).then(data => {
            commit(types.GET_ACCOUNT, data)
        });
    },

    customerNameList({commit}) {
        get('/pay-order/get-all-app').then(data => {
            commit(types.GET_CUSTOMERNAMELIST, data)
        });
    },

    payOrderList({commit}, param) {
        post('/pay-order/query-item', param).then(data => {
            // _.forEach(data.list, item => {
            //     var timestampDate = new Date(item.createAt);
            //     var y = timestampDate.getFullYear();
            //     var mo = timestampDate.getMonth() + 1;
            //     var d = timestampDate.getDate();
            //     var h = timestampDate.getHours();
            //     var m = timestampDate.getMinutes();
            //     var s = timestampDate.getSeconds();
            //     item.createAt = y + '-' + mo + '-' + d + ' ' + h + ':' + m + ':' + s;
            // });
            commit(types.GET_PAYORDERLIST, data)
        })
    },

    exportXls({commit}, param) {
        get('/pay-order/export-item', param).then(data => {
            console.log(data)
        });
    },

    searchCompanyByName({commit}, param) {
        commit(types.GET_COMPANY_SEARCH_RESULT, false);
        get('/company/fetch/names', param).then(data => {
            commit(types.GET_COMPANY_SEARCH_RESULT, {
                result: data,
            });
        })
    },

    companyDetailAdd({commit}, param) {
        post('/company/detail/add', param).then(data => {
            commit(types.ADD_NEW_COMPANY, data);
        })
    },

    companyContactAddOrUpdate({commit}, param) {
        let url = param.id ? '/company/contacts/update' : '/company/contacts/add';
        post(url, param).then(data => {
            commit(types.ADD_NEW_COMPANY_CONTACT, new Date().valueOf());
        })
    },

    companyContactList({commit}, param = {}) {
        param.pageSize = 100;
        param.page = 1;
        post('/company/detail/contacts', param).then(data => {
            commit(types.SET_COMPANY_CONTACT_LIST, data.list);
        })
    },

    companyBasicInfo({commit}, param) {
        commit(types.SET_COMPANY_BASIC, {
            id: '',
            name: '',
            icInfo: {},
            shareholderInfos: [],
            keyPersonnelInfos: [],
            branchInfos: [],
            foreignInvestInfos: [],
            ipInfos: {},
            riskInfo: {},
        });
        commit(types.SET_COMPANY_CONTACT_LIST, []);
        if (param) {
            get('/company/detail/basic', param).then(data => {
                commit(types.SET_COMPANY_BASIC, data);
            })
        }
    },

    deleteCompany({commit}, param) {
        post('/company/delete', param).then(data => {
            commit(types.DELETE_COMPANY, new Date().valueOf());
        })
    },

    submitCompany({commit}, param) {
        post('/company/companies/submit', param).then(data => {
            commit(types.SET_COMPANY_SUBMIT_RESULT, new Date().valueOf());
        })
    },

    deleteCompanyContact({commit}, param) {
        post('/company/contacts/delete', param).then(data => {
            commit(types.DELETE_COMPANY_CONTACT, new Date().valueOf());
        })
    },

}

const mutations = {
    [types.GET_COMPANY_BUILD_LIST](state, payload) {
        state.companyBuildList = payload;
    },
    [types.GET_ACCOUNT](state, payload) {
        state.account = payload;
    },
    [types.GET_CUSTOMERNAMELIST](state, payload) {
        state.customerNameList = payload;
    },
    [types.GET_PAYORDERLIST](state, payload) {
        state.payOrderList = payload;
    },
    [types.GET_COMPANY_SEARCH_RESULT](state, payload) {
        state.companySearchResult = payload;
    },
    [types.ADD_NEW_COMPANY](state, payload) {
        state.companyBasicInfo = payload;
    },
    [types.ADD_NEW_COMPANY_CONTACT](state, payload) {
        state.companyAddContactResult = payload;
    },
    [types.SET_COMPANY_CONTACT_LIST](state, payload) {
        state.companyContactList = payload;
    },
    [types.SET_COMPANY_BASIC](state, payload) {
        state.companyBasicInfo = payload;
    },
    [types.DELETE_COMPANY](state, payload) {
        state.companyDeleteResult = payload;
    },
    [types.DELETE_COMPANY_CONTACT](state, payload) {
        state.companyContactDeleteResult = payload;
    },
    [types.SET_COMPANY_SUBMIT_RESULT](state, payload) {
        state.companySubmitResult = payload;
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}







































