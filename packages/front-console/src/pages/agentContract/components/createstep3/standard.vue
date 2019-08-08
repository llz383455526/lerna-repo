<template>
  <div class="widget-box mb20">
    <div class="widget-header">
      <h4 class="widget-title">合同附件管理</h4>
      <a href="javascript:;"
         class="ml20"
         @click="handleDownloadAll">打包下载全部附件</a>
    </div>
    <div class="widget-body">
      <div class="widget-main"
           style="font-size: 16px;line-height: 30px;">
        <div v-for="(formItem, key) in contractAttachments"
             :key="key">
          <div class="row mb15">
            <div class="col-xs-4">{{ formItem.serviceCompanyName }}</div>
            <div class="col-xs-4">
              <div>系统合同附件：</div>
              <div v-for="(el, index) in formItem.attachments"
                   :key="index">
                <div v-if="el.targetTypeName != '自定义附件'">{{ el.targetTypeName }}：{{ el.displayname }}
                  <a href="javascript:;"
                     class="ml10"
                     @click="handlePrevFile(el.downloadCode)">预览</a>
                  <a href="javascript:;"
                     class="ml10"
                     @click="handleDownload(el.downloadCode)">下载</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from 'src/config/address.js';

export default {
    props: {
        contractAttachments: {
            type: Array
        },
        contractId: {
            // type: Number
        },
    },
    methods: {
        handleDownloadAll() {
            const url = '/api/contract-web/contract/download-sales-flow-attachments?salesInstanceId='
            window.open(baseUrl + url + this.contractId)
        },
        handlePrevFile(downloadCode) {
            const url = '/api/contract-web/file/pdf-scan?downloadCode='
            window.open(baseUrl + url + downloadCode);
        },
        handleDownload(downloadCode) {
            const url = '/api/contract-web/file/download?downloadCode='
            window.open(baseUrl + url + downloadCode);
        }
    }
}
</script>

