<template>
	<div class="ayg-print">
		<div ref="printContent" class="print-content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
    writeIframe() {
      this.$nextTick(() => {
        let iframe = document.getElementById('print-iframe')
        if (!iframe) {
          iframe = document.createElement('iframe')
          iframe.setAttribute('id', 'print-iframe')
          iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
          document.body.appendChild(iframe)
          const w = iframe.contentWindow || iframe.contentDocument
          const doc = iframe.contentDocument || iframe.contentWindow.document
          const content = this.getStyle() + this.getHtml()
          doc.open()
          doc.write(content)
          doc.close()
          const _this = this
          iframe.contentWindow.focus()
          iframe.onload = () => {
            _this.toPrint(w)
            setTimeout(() => {
              document.body.removeChild(iframe)
            }, 500)
          }
        }
      })
    },
    toPrint(frameWindow) {
      try {
        setTimeout(() => {
          frameWindow.focus()
          try {
            if (!frameWindow.document.execCommand('print', false, null)) {
              frameWindow.print()
            }
          } catch (e) {
            frameWindow.print()
          }
          frameWindow.close()
        }, 10)
      } catch (err) {
        console.log('err', err)
      }
    },
		getHtml() {
			const el = this.$refs.printContent
			return el.innerHTML
		},
		getStyle() {
			const styles = document.querySelectorAll('style,link')
			const str = Array.prototype.reduce.call(styles, (str, item) => str + item.outerHTML, '')
			return str
		}
  },
}
</script>

<style lang="less">
.ayg-print {
	.print-content {
		display: none;
	}
}
</style>