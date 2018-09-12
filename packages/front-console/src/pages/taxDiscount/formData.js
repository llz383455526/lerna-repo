
const stepOneFormData = [[{
	elementType: 'text',
	elementLabel: '推荐人姓名：',
	value: '',
	property: 'referee',
	elementRequired: true
}],[{
	elementType: 'radio',
	elementLabel: '信息来源：',
	value: '',
	property: 'infoSource',
	elementOptions: ['自有关系', '其它关系'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'infoSourceAdd',
	elementPlaceholder: '（如：朋友、客户、合伙人、合作伙伴等）'
}],[{
	elementType: 'location',
	elementLabel: '资源地：',
	value: [],
	property: 'region',
	ruleProperty: 'province',
	elementRequired: true,
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'address',
	elementPlaceholder: '备注地址',
	validValue: true
}],[{
	elementType: 'radio',
	elementLabel: '行政级别：',
	value: '',
	property: 'regionType',
	elementOptions: ['市级', '县级', '其它'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'regionTypeAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'text',
	elementLabel: '资源地合伙人姓名：',
	value: '',
	property: 'contact',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '资源地合伙人电话：',
	value: '',
	property: 'contactMobile',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '项目引进政府关键人姓名：',
	value: '',
	property: 'keymanName',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '项目引进政府关键人职位：',
	value: '',
	property: 'keymanPost',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '项目引进政府关键人电话（非必填）：',
	value: '',
	property: 'keymanMobile'
}],[{
	elementType: 'text',
	elementLabel: '营改增项目增值税：',
	value: '',
	property: 'valueTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'valueTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '企业所得税：',
	value: '',
	property: 'corporateTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'corporateTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '个人所得税：',
	value: '',
	property: 'personalTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'personalTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '附征：',
	value: '',
	property: 'taxLawsRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'taxLawsReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'radio',
	elementLabel: '三万以下免征：',
	value: '',
	property: 'remitTaxUnder30000',
	/*propertyOrigin: 'policyDetails',*/
	elementOptions: ['无', '有'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'remitTaxUnder30000Add',
	elementPlaceholder: ''
}],[{
	elementType: 'text',
	elementLabel: '其它(非必填)：',
	value: '',
	property: 'otherPolicy',
	elementPlaceholder: '如有，请列明'
}], [{
	elementType: 'radio',
	elementLabel: '当地政府承诺兑现能力是否有不兑现承诺的情况：',
	value: '',
	property: 'commitmentState',
	elementOptions: ['无', '有'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'commitmentStateAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'text',
	elementLabel: '当地招商部门对我们公司业务的态度(请具体说明)：',
	value: '',
	property: 'initiativeState',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '成本估算：',
	value: '',
	property: 'landCost',
	subLabel: '资源地落地成本',
	shortText: true,
	appendLabel: '元',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'contactCost',
	subLabel: '合伙人分润',
	shortText: true,
	appendLabel: '元'
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'costCount',
	subLabel: '成本合计',
	shortText: true,
	appendLabel: '元',
	valueType: 'count',
	keys: 'landCost,contactCost',
	disabled: true,
	invalid: true
}]]
/*[{
	elementType: 'text',
	elementLabel: '资源地税收地方留存比例：',
	value: '',
	property: 'retainRatio',
	subLabel: '营改增项目增值税',
	shortText: true,
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'retainRatioAdd',
	subLabel: '企业所得税',
	shortText: true,
	add: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'retainRatioAdd2',
	subLabel: '个人所得税',
	shortText: true,
	add: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'retainRatioAdd3',
	subLabel: '其他（如有，请列明）',
	autoText: true,
	add: true
}],*/

const stepTwoFormData = [[{
	elementType: 'textarea',
	elementLabel: '',
	value: '',
	property: 'memo'
}]]

const stepThreeFormData = [[{
	elementType: 'checkbox',
	elementLabel: '业务类型：',
	value: [],
	property: 'landBizTypes',
	optionKey: 'land_biz_type',
	type: 'arr',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landBizTypesAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'location',
	elementLabel: '地点：',
	value: [],
	property: 'landRegion',
	ruleProperty: 'province',
	elementRequired: true,
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'address',
	newProperty: 'landAddress',
	elementPlaceholder: '备注地址',
	validValue: true
}],[{
	elementType: 'text',
	elementLabel: '成本：',
	value: '',
	property: 'costUnder30000',
	subLabel: '三万以下',
	shortText: true,
	appendLabel: '元',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'costOver30000',
	subLabel: '三万以上',
	shortText: true,
	appendLabel: '元'
}],[{
	elementType: 'text',
	elementLabel: '月税收：',
	value: '',
	property: 'monthMinLimit',
	subLabel: '最低值',
	shortText: true,
	appendLabel: '元',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'monthMaxLimit',
	subLabel: '最高值',
	shortText: true,
	appendLabel: '元'
}],[{
	elementType: 'text',
	elementLabel: '营改增项目增值税：',
	value: '',
	property: 'valueTaxRetain',
	newProperty: 'newValueTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'valueTaxReturn',
	newProperty: 'newValueTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '企业所得税：',
	value: '',
	property: 'corporateTaxRetain',
	newProperty: 'newCorporateTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'corporateTaxReturn',
	newProperty: 'newCorporateTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '个人所得税：',
	value: '',
	property: 'personalTaxRetain',
	newProperty: 'newPersonalTaxRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'personalTaxReturn',
	newProperty: 'newPersonalTaxReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'text',
	elementLabel: '附征：',
	value: '',
	property: 'taxLawsRetain',
	newProperty: 'newTaxLawsRetain',
	subLabel: '地方留存比例',
	shortText: true,
	appendLabel: '%',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'taxLawsReturn',
	newProperty: 'newTaxLawsReturn',
	subLabel: '返还比例',
	shortText: true,
	appendLabel: '%'
}],[{
	elementType: 'radio',
	elementLabel: '三万以下免征：',
	value: '',
	property: 'remitTaxUnder30000',
	newProperty: 'newRemitTaxUnder30000',
	/*propertyOrigin: 'policyDetails',*/
	elementOptions: ['无', '有'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'remitTaxUnder30000Add',
	elementPlaceholder: ''
}],[{
	elementType: 'radio',
	elementLabel: '个税核定：',
	value: '',
	property: 'personalTaxAudit',
	newProperty: 'newPersonalTaxAudit',
	elementOptions: ['待定', '已确认'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'personalTaxAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'text',
	elementLabel: '其它(非必填)：',
	value: '',
	property: 'otherPolicy',
	newProperty: 'newOtherPolicy',
	elementPlaceholder: '如有，请列明'
}],[{
	elementType: 'text',
	elementLabel: '成本复核：',
	value: '',
	property: 'landCost',
	newProperty: 'newLandCost',
	subLabel: '资源地落地成本',
	shortText: true,
	appendLabel: '元',
	hasChildren: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'contactCost',
	newProperty: 'newContactCost',
	subLabel: '合伙人分润',
	shortText: true,
	appendLabel: '元'
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'newCostCount',
	subLabel: '成本合计',
	shortText: true,
	appendLabel: '元',
	valueType: 'count',
	keys: 'landCost,contactCost',
	newKeys: 'newLandCost,newContactCost',
	disabled: true,
	invalid: true
}],[{
	elementType: 'radio',
	elementLabel: '协议签署情况：',
	value: [],
	property: 'landAgreementState',
	optionKey: 'agreement_state',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landAgreementStateAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'checkbox',
	elementLabel: '协议中明确的行业：',
	value: [],
	property: 'landIndustrys',
	optionKey: 'land_industry',
	type: 'arr',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landIndustrysAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'select',
	elementLabel: '对接负责人：',
	value: '',
	property: 'landDirector',
	type: 'users',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '当地关键人：',
	value: '',
	property: 'landContact',
	elementRequired: true
}],[{
	elementType: 'date',
	elementLabel: '预计签约日期：',
	value: '',
	property: 'expectSignAt',
	elementRequired: true
}]]

/*const stepThreeFormData = [[{
	elementType: 'checkbox',
	elementLabel: '业务类型：',
	value: [],
	property: 'landBizTypes',
	optionKey: 'land_biz_type',
	type: 'arr',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landBizTypesAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'location',
	elementLabel: '地点：',
	value: [],
	property: 'landRegion',
	ruleProperty: 'provinceId',
	elementRequired: true
}],[{
	elementType: 'radio',
	elementLabel: '三万以下免征：',
	value: '',
	property: 'remitTaxUnder30000',
	// propertyOrigin: 'policyDetails',
	elementOptions: ['无', '有'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'remitTaxUnder30000Add',
	elementPlaceholder: ''
}],[{
	elementType: 'radio',
	elementLabel: '个税核定：',
	value: '',
	property: 'personalTax',
	// propertyOrigin: 'policyDetails',
	elementOptions: ['待定', '已确认'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'personalTaxAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'radio',
	elementLabel: '留存比例 - 增值税：',
	value: '',
	property: 'vaTaxRetain',
	// propertyOrigin: 'policyDetails',
	elementOptions: ['待定', '已确认'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'vaTaxRetainAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'radio',
	elementLabel: '留存比例 - 个税：',
	value: '',
	property: 'personalTaxRetain',
	// propertyOrigin: 'policyDetails',
	elementOptions: ['待定', '已确认'],
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'personalTaxRetainAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'text',
	elementLabel: '返还比例：',
	value: '',
	property: 'returnRatio',
	// propertyOrigin: 'policyDetails',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '成本 - 三万以下：',
	value: '',
	property: 'costUnder30000',
	// propertyOrigin: 'policyDetails',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '成本 - 三万以上：',
	value: '',
	property: 'costOver30000',
	// propertyOrigin: 'policyDetails',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '月流水 - 最低值：',
	value: '',
	property: 'mouthMinLimit',
	// propertyOrigin: 'policyDetails',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '月流水 - 最高值：',
	value: '',
	property: 'mouthMaxLimit',
	// propertyOrigin: 'policyDetails',
	elementRequired: true
}],[{
	elementType: 'radio',
	elementLabel: '协议签署情况：',
	value: [],
	property: 'landAgreementState',
	optionKey: 'agreement_state',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landAgreementStateAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'checkbox',
	elementLabel: '协议中明确的行业：',
	value: [],
	property: 'landIndustrys',
	optionKey: 'land_industry',
	type: 'arr',
	elementRequired: true
},{
	elementType: 'text',
	elementLabel: '',
	value: '',
	property: 'landIndustrysAdd',
	elementPlaceholder: ''
}],[{
	elementType: 'select',
	elementLabel: '对接负责人：',
	value: '',
	property: 'landDirector',
	type: 'users',
	elementRequired: true
}],[{
	elementType: 'text',
	elementLabel: '当地关键人：',
	value: '',
	property: 'landContact',
	elementRequired: true
}],[{
	elementType: 'date',
	elementLabel: '预计签约日期：',
	value: '',
	property: 'expectSignAt',
	elementRequired: true
}]]*/

const stepFourFormData = [[{
	elementType: 'textarea',
	elementLabel: '',
	value: '',
	property: 'memo'
}]]

const stepFiveFormData = [[{
	elementType: 'radio',
	elementLabel: '',
	value: '',
	property: 'signType',
	elementOptions: ['取消签约', '确认签约'],
	validValue: true
},{
	elementType: 'upload',
	elementLabel: '',
	value: [],
	fileList: [],
	property: 'signFile',
	// validValue: true,
	type: 'arr'
}]]


export {
	stepOneFormData,
	stepTwoFormData,
	stepThreeFormData,
	stepFourFormData,
	stepFiveFormData
}
















