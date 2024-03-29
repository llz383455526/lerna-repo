import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import store from './store'
import { $delete, $add } from './utils/global'
import './filter'

import 'vue-area-linkage/dist/index.css'
import './style'
import './style/iconfont'

import { AreaSelect } from 'vue-area-linkage'
Vue.use(AreaSelect)

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
	RadioButton,
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
	Card,
	Alert,
	Popover
} from 'element-ui'

Vue.use(Popover)
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
Vue.use(RadioButton)
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
Vue.use(Alert)

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
Vue.use(Avue)

Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.checkRight = function (permissions, url) {
	if (permissions) {
		return url in permissions
	}
	else {
		return false
	}
}

Vue.prototype.$delete = $delete
Vue.prototype.$add = $add

Date.prototype.toJSON = function () {
	return Date.parse(this)
}

import { register } from './component/component'
register();

Vue.prototype.judgePermission = function (url) {
	let permissions = this.$store.getters['permissions'];
	return permissions && permissions.hasOwnProperty(url);
}

Vue.use(VueRouter)
export const router = new VueRouter({
	routes: routes,
	mode: 'history',
	scrollBehavior: () => ({ // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
		y: 0
	})
})

new Vue({
	router,
	store
}).$mount('#app')
