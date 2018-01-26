import { get, post } from '../store/api'

export const queryRole = (name) => {
    let param = {};
    if(name) {
        param.roleName = name;
    }
    return get('/common/option/role', param);
};

export const queryServiceCompany = (name) => get('/common/option/service-company', {"name":name});

export const queryFundCompany = (name) => get('/common/option/fund-company', {"name":name});


