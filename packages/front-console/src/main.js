
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import store from './store'
import './filter'

import 'vue-area-linkage/dist/index.css'
import './style'
import './style/iconfont'

import { AreaSelect } from 'vue-area-linkage'

import {
	Menu,
	Submenu,
	MenuItem,
	Form,
	FormItem,
	Input,
	Button,
	Loading,
	Notification,
	Select,
	Option,
	DatePicker,
	Pagination,
	Table,
	TableColumn,
	Dialog,
	Dropdown,
  	DropdownMenu,
  	DropdownItem,
	Tabs,
	TabPane,
  	TimeSelect,
  	TimePicker,
  	Col,
  	MessageBox,
	Radio,
	RadioGroup,
	InputNumber,
	Badge,
	Autocomplete,
    Steps,
	Step,
	CheckboxGroup,
	Checkbox,
	Row,
	Progress,
	Switch,
	Transfer,
	Tag,
	Tooltip,
	Container,
	Aside,
	Main,
	Upload,
	Breadcrumb,
	BreadcrumbItem,
	Tree,
	Message,
    Cascader,
    Card
} from 'element-ui'

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Col)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(InputNumber)
Vue.use(Badge)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Row)
Vue.use(Progress)
Vue.use(Switch)
Vue.use(Transfer)
Vue.use(Tag)
Vue.use(Tooltip)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Upload)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Card)

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
Vue.prototype.checkRight = function(permissions, url) {
    console.log(permissions)
    if(permissions) {
        return url in permissions
    }
    else {
        return false
    }
}

Vue.use(AreaSelect)

Date.prototype.toJSON = function () {
	return Date.parse(this)
}

Date.prototype.format = function(fmt) { //author: meizz
  	var o = {
  	  "M+" : this.getMonth()+1,                 //月份
  	  "d+" : this.getDate(),                    //日
  	  "h+" : this.getHours(),                   //小时
  	  "m+" : this.getMinutes(),                 //分
  	  "s+" : this.getSeconds(),                 //秒
  	  "q+" : Math.floor((this.getMonth()+3)/3), //季度
  	  "S"  : this.getMilliseconds()             //毫秒
  	};
  	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  	for(var k in o)
  		if(new RegExp("("+ k +")").test(fmt))
  	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  	return fmt;
}

import {register} from './component/component'
register();

Vue.prototype.judgePermission = function (url) {
    let permissions = this.$store.getters['permissions'];
    return permissions && permissions.hasOwnProperty(url);
}

Vue.use(VueRouter)
export const router = new VueRouter({
	routes: routes,
	mode: 'history',
	scrollBehavior:()=>({ // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
		y:0
	})
})

new Vue({
	router,
	store
}).$mount('#app')















