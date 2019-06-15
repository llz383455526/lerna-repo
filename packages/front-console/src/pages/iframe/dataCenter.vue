<template>
    <iframe class="iframe" :src="iframeSrc"></iframe>
</template>
<script>
const iframeSrcSet = {
    //流水运营分析
    100: 'https://datacenter.aiyuangong.com/embed/query/148/visualization/170?api_key=tpogyB2M7AFPu8Jks1lMAQWWV7ix9mUtKmIVe9cf&',
    //行业流水排名统计
    101: 'https://datacenter.aiyuangong.com/embed/query/149/visualization/171?api_key=tpogyB2M7AFPu8Jks1lMAQWWV7ix9mUtKmIVe9cf&',
    // 客户流水排名统计
    102: 'https://datacenter.aiyuangong.com/embed/query/150/visualization/172?api_key=tpogyB2M7AFPu8Jks1lMAQWWV7ix9mUtKmIVe9cf&p_%E5%85%AC%E5%8F%B8%E6%95%B0%E9%87%8F=250',
    // 客户毛利额排名统计
    103: 'https://datacenter.aiyuangong.com/embed/query/151/visualization/173?api_key=tpogyB2M7AFPu8Jks1lMAQWWV7ix9mUtKmIVe9cf&p_%E5%85%AC%E5%8F%B8%E6%95%B0%E9%87%8F=250',
    // 个人收入统计
    104: 'https://datacenter.aiyuangong.com/embed/query/144/visualization/166?api_key=tpogyB2M7AFPu8Jks1lMAQWWV7ix9mUtKmIVe9cf&p_%E5%B9%B4%E4%BB%BD(%E9%BB%98%E8%AE%A42019)=%E5%85%A8%E9%83%A8&p_%E6%94%B6%E5%85%A5=%E5%B9%B4%E6%94%B6%E5%85%A5&p_%E5%AE%A2%E6%88%B7%E5%85%AC%E5%8F%B8=%E5%85%A8%E9%83%A8&p_%E8%90%BD%E5%9C%B0%E5%85%AC%E5%8F%B8=%E5%85%A8%E9%83%A8&p_%E7%A8%8E%E4%BC%98%E5%9C%B0=%E5%85%A8%E9%83%A8&p_%E8%BA%AB%E4%BB%BD%E8%AF%81=%E5%85%A8%E9%83%A8'
}
export default {
    data(){
        return {
            // iframeSrc: iframeSrcSet[this.$route.query.url]
            iframeSrc: decodeURIComponent(this.$route.query.url)
        }
    },
    watch: {
        // '$route': function(oldUrl,newUrl) {
        //     console.log('origin-->', this.$route.query.url);
        //     let id = this.$route.query.url
        //     this.iframeSrc = iframeSrcSet[id]
        //     console.log('decode-->',this.iframeSrc);
        // }
        '$route': function() {
            this.iframeSrc = decodeURIComponent(this.$route.query.url)
        }
    }
}
</script>
<style scoped>
.iframe {
    width: 100%;
    height: calc(100vh - 96px);
}
</style>
