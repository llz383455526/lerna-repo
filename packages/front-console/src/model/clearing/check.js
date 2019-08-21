import BaseModel from '../base/BaseModel'

function minNumber (value) {
    var ArrMen = value.split('.');    //截取字符串
    if(ArrMen.length==2) {
        if(ArrMen[1].length>2) {    //判断小数点后面的字符串长度
            return false;
        }
    }
    return true;
}

class Check extends BaseModel {
    constructor() {
        super();
        var checkNumber = (rule, value, callback) => {
            if(value < 0) {
                callback(new Error('只能输入正数'));
            } else if(!minNumber(value)) {
                callback(new Error('只能输入2位小数'));
            } else {
                callback();
            }
        }
        this.rules = {
            serviceCompanyId: [{ required: true, message: "请选择服务商公司", trigger: "change"}],
            channelType: [{ required: true, message: "请选择渠道类型", trigger: "change"}],
            mainAccountNo: [{ required: true, message: "请选择主账户", trigger: "change"}],
            fromPaymentUserId: [{ required: true, message: '请选择转出子账户', trigger: 'change' }],
            toPaymentUserId: [{ required: true, message: '请选择转入子账户', trigger: 'change' }],
            tradeAmount: [
                { required: true, message: "请输入调账金额", trigger: "blur"},
                { validator: checkNumber, trigger: 'blur' }
            ],
            remarks: [
                { required: true, message: '请输入调账备注', trigger: 'blur'},
                { validator: checkNumber, trigger: 'blur' }
            ],
            toAccountNo:  [{ required: true, message: '请选择转入账户', trigger: 'change' }]
        }
    }
}

export default Check;