<template>
  <div class="widget-header">
    <h4 class="widget-title">
      合同附件管理
    </h4>
    <a
      href="javascript:;"
      class="ml20"
      @click="handleDownloadAll"
    >打包下载全部附件</a>
    <div class="widget-body">
      <div
        class="widget-main"
        style="font-size: 16px;line-height: 30px;"
      >
        <div
          v-for="(formItem, key) in contractForm.datas.contractAttachments"
          :key="key"
        >
          <div
            class="row"
            style="margin-bottom: 15px;"
          >
            <div class="col-xs-4">
              {{ formItem.serviceCompanyName }}
            </div>
            <div
              class="col-xs-4"
            >
              <div>系统合同附件：</div>
              <div
                v-for="(el, index) in formItem.attachments"
                :key="index"
              >
                <div>
                  {{ el.displayname }}
                  <a
                    href="javascript:;"
                    @click="handlePrevFile(el.downloadCode)"
                    style="margin-left:10px;"
                  >预览</a>
                  <a
                    href="javascript:;"
                    @click="handleDownload(el.downloadCode)"
                    style="margin-left:10px;"
                  >下载</a>
                </div>
              </div>
            </div>
          </div>
          <hr v-if="key+1 != contractForm.datas.contractAttachments.length">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from 'src/config/address.js';

export default {
    name: 'ContractAnnex',
    props: {
        contractForm: {
            type: Object,
            default() {
                return {}
            }
        },
        contractTplList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        handlePrevFile(downloadCode) {
            window.open(baseUrl + '/api/contract-web/file/pdf-scan' +
                '?downloadCode=' + downloadCode);
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
                '?downloadCode=' + downloadCode;
        },
        handleDownloadAll() {
            window.location.href = baseUrl + '/api/contract-web/contract/download-sales-flow-attachments?salesInstanceId=' + this.contractForm.id
        },
    }
}
</script>
