import { get, post } from '../store/api'

export const queryUserList = (param, pageIndex, pageSize) => post('/user/query', {...param, page: pageIndex, pageSize});

export const createUser = (param) => post('/user/create', param);

export const updateUser = (param) => post('/user/update', param);

export const getUser = (id) => get('/user/detail', {id:id});


