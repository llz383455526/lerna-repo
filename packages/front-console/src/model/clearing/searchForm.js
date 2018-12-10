import baseModel from '../base/BaseModel'

class searchForm extends baseModel {
    constructor() {
        super();
        this.page = 1; // 当前页
        this.pageSize = 10; // 每页大小
        this.appId = ''; // 商户ID
        this.companyId = ''; // 客户公司ID
        this.createAtBegin = ''; // 开始时间
        this.createAtEnd = ''; // 结束时间
        this.fromPaymentUserNo = ''; // 转出支付用户账户ID
        this.orderBy = ''; // 排序子句(不含orderBy)
        this.toPaymentUserNo = ''; // 转入支付用户账户ID
        this.state = ''; // 状态
    }
}

export default searchForm;