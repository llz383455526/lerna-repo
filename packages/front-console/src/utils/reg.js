/**
 * 匹配数字并且最多为两位小数
 */
export function numWithTwoDecimal(numstr) {
  const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  return reg.test(numstr)
}

export function isNumber(val) {
  const regPos = /^\d+(\.\d+)?$/ //非负浮点数
	const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
	if(regPos.test(val) || regNeg.test(val)){
		return true
	}else{
		return false
	}
}
