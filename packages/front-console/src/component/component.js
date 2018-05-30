/**
 * Created by freeson on 2017/12/14.
 */

import Vue from 'vue'

export function register() {
    Vue.component('ayg-pagination', {
        props: ['total', 'currentPage', 'currentSize'],
        template: ' <div style="padding: 30px;text-align: right;background-color: white"><el-pagination\
    	background\
    	@size-change="handleSizeChange"\
    	@current-change="handleCurrentChange"\
		:current-page="currentPage"\
		:page-sizes="[10, 20, 30, 40]"\
		:page-size="currentSize || 10"\
		layout="total, prev, pager, next, sizes, jumper"\
		:total="total">\
    	</el-pagination></div>',
        methods: {
            handleSizeChange(value){
                this.$emit('handleSizeChange', value);
            },
            handleCurrentChange(value){
                this.$emit('handleCurrentChange', value);
            }
        },
    })
};