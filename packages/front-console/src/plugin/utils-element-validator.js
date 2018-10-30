let checkBankNo = (rule, value, callback) => {
	//格式为银行卡号
	if(!/^\d{5,}$/g.test(value)) {
		callback(new Error('账号为5至20位的数字'));
	} else {
		callback();
	}
}

let checkPhone = (rule, value, callback) => {
	if(!/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/g.test(value) && !/\d{3}-\d{8}|\d{4}-\d{7}/g.test(value)) {
		callback(new Error('号码格式错误'));
	} else {
		callback();
	}
}

let checkRateNum = (rule, value, callback) => {
	//格式为比例值，不超过100
	if(!/^\d+(\.\d{1,2})?$/g.test(value)) {
		console.log('1')
		callback(new Error('请填写正确数值'));
	} else {
		console.log('2')
		if(value > 100) {
			console.log('3')
			callback(new Error('比例不能大于100'));
			return ;
		}
		console.log('4')
		callback();
	}
}

let checkPureNum = (rule, value, callback) => {
	//格式为纯数字，不限位数
	if(!/^\d+$/g.test(value)) {
		callback(new Error('请填写正确数值'));
	} else {
		callback();
	}
}

let checkMoney = (rule, value, callback) => {
	//格式为金钱，两个浮点数
	if(!/^\d+(\.\d{1,2})?$/g.test(value)) {
		callback(new Error('请填写正确数值'));
	} else {
		callback();
	}
}

export {
	checkBankNo,
	checkRateNum,
	checkPureNum,
	checkMoney,
	checkPhone
}
