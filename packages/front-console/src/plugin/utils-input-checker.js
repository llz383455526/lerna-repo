/**
 * Created by freeson on 16/11/29.
 */

import {showTopToast} from './utils-toast'

const FORM_CHECKER = new Map();
FORM_CHECKER.set('common', 'checkCommon');
FORM_CHECKER.set('password', 'checkPassword');
FORM_CHECKER.set('onlyDigit', 'checkIsOnlyDigit');
FORM_CHECKER.set('moneyInput', 'checkIsMoneyInput');
FORM_CHECKER.set('phone', 'checkPhone');
FORM_CHECKER.set('email', 'checkEmail');
FORM_CHECKER.set('imageVerifyCode', 'checkImageVerifyCode');
FORM_CHECKER.set('messageVerifyCode', 'checkMessageVerifyCode');
FORM_CHECKER.set('identifyCard', 'isIdentifyCard');
FORM_CHECKER.set('onlyChinese', 'onlyChinese');
FORM_CHECKER.set('web', 'checkWeb');

export function checkCommon(text, {showToastHint = false, emptyText = '', minHintText = '', maxHintText = '', min = 0, max = 0} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    if (max && showToastHint && text.length > max) {
        if (maxHintText) {
            showToast(maxHintText);
        }
        return false;
    }
    if (min && showToastHint && text.length < min) {
        if (minHintText) {
            showToast(minHintText);
        }
        return false;
    }
    return true;
}

export function checkPassword(text, {showToastHint = false, emptyText = '请输入密码', hintText = '请输入正确的密码'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = /^([a-zA-Z0-9]){6,20}$/.test(text);
    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

export function checkIsOnlyDigit(text, {
                                     showToastHint = false,
                                     emptyText = '',
                                     hintText = '只允许数字',
                                     min = 0,
                                     max = 0,
                                     len = 0,
                                     minHintText = '',
                                     maxHintText = ''
                                 } = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = new RegExp("^[0-9]+$", "g").test(text);
    if (right) {
        if (len) {
            if (text.length !== len && showToastHint && hintText) {
                showToast(hintText);
                return false;
            }
        } else {
            if (min) {
                if (text.length < min && showToastHint && minHintText) {
                    showToast(minHintText);
                    return false;
                }
            }
            if (max) {
                if (text.length > max && showToastHint && maxHintText) {
                    showToast(maxHintText);
                    return false;
                }
            }
        }
    }
    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

export function checkIsMoneyInput(text, {showToastHint = false, emptyText = '请输入金额', hintText = '请输入正确的金额'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = /^[0-9]+([.]{1}[0-9]{1,2}){0,1}$/.test(text);
    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

//type 1手机，2 为固话，3 为两种皆可
export function checkPhone(text, {showToastHint = false, type = 1, emptyText = '请输入手机号', hintText = '请输入正确的手机号码'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = false;
    if (type == 1) {
        right = /^1\d{10}$/.test(text);
    } else if (type == 2) {
        if (text.indexOf('-') !== -1) {
            right = /^\d{3,4}-\d{7,8}$/.test(text);
        } else {
            right = /^\d{12}$/.test(text);
        }
    } else {
        right = /^1\d{10}$/.test(text);
        if (!right) {
            if (text.indexOf('-') !== -1) {
                right = /^\d{3,4}-\d{7,8}$/.test(text);
            } else {
                right = /^\d{12}$/.test(text);
            }
        }
    }

    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;

}

export function checkEmail(text, {showToastHint = false, emptyText = '请输入邮箱地址', hintText = '请输入正确的邮箱地址'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(text);
    if (!right && showToastHint) {
        showToast(hintText);
    }
    return right;
}

export function checkWeb(text, {showToastHint = false, emptyText = '请输入网址', hintText = '请输入正确的网址'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(text);
    if (!right && showToastHint) {
        showToast(hintText);
    }
    return right;
}

export function onlyChinese(text, {
                                showToastHint = false,
                                minHintText = '',
                                maxHintText = '',
                                max = 0,
                                min = 0,
                                emptyText = '',
                                hintText = ''
                            } = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = new RegExp("[\\u4E00-\\u9FFF]+", "g").test(text);
    if (!right && showToastHint) {
        showToast(hintText);
    }
    if (max && showToastHint && text.length > max) {
        if (maxHintText) {
            showToast(maxHintText);
        }
        return false;
    }
    if (min && showToastHint && text.length < min) {
        if (minHintText) {
            showToast(minHintText);
        }
        return false;
    }

    return right;
}

export function checkImageVerifyCode(text, {showToastHint = false, emptyText = '请输入验证码', hintText = '请输入4位验证码'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = text !== undefined && text.length === 4;
    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

export function checkMessageVerifyCode(text, {
                                           showToastHint = false,
                                           emptyText = '请输入验证码',
                                           length = 4,
                                           hintText = '请输入4位数字验证码'
                                       } = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let right = text !== undefined && new RegExp('^([0-9]){' + length + '}$', 'gm').test(text);
    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

export function isIdentifyCard(text, {showToastHint = false, emptyText = '请输入身份证', hintText = '请输入正确的身份证'} = {}) {
    if (!text && showToastHint && emptyText) {
        showToast(emptyText);
        return false;
    }
    let identifyCard = text.toUpperCase();
    let right = /(^\d{15}$)|(\d{17}(?:\d|x|X)$)/.test(identifyCard);
    if (right) {
        if (identifyCard.length === 18) {
            let idCard17 = identifyCard.substring(0, 17);
            let idCard18 = identifyCard.slice(-1);
            let checkCode = getCheckCodeBySum(idCard17);
            if (idCard18 === checkCode) {
                right = true;
            } else {
                right = false;
            }
        } else {
            right = false;
        }
    } else {
        right = false;
    }

    if (!right && showToastHint && hintText) {
        showToast(hintText);
    }
    return right;
}

function getCheckCodeBySum(identifyCard) {
    let ARR = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let LAST = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let y = 0;
    for (let i = 0; i < 17; ++i) {
        y += parseInt(identifyCard.charAt(i)) * ARR[i];
    }
    return (LAST[y % 11]).toString();
}

export function formSubmitChecker(paramArray) {
    let result = true;
    for (let index = 0; index < paramArray.length; ++index) {
        let item = paramArray[index];
        let key = Object.keys(item)[0];
        if (FORM_CHECKER.has(key)) {
            let functionName = FORM_CHECKER.get(key);
            let method = new invokeFunction(functionName);
            item = item[key];
            let text = item.text;
            delete item.text;
            if (!item.hasOwnProperty('showToastHint')) {
                item.showToastHint = true;
            }
            result = method.invoke(text, item);
            if (!result) {
                break;
            }
        }
    }
    return result;
}

function invokeFunction(functionName) {
    this.invoke = eval(functionName);
}

function showToast(text) {
    showTopToast('error', text,);
}
