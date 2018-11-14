
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
	Collapse,
	CollapseItem,
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
Vue.use(Collapse)
Vue.use(CollapseItem)

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
Vue.prototype.checkRight = function(permissions, url) {
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















