<template>
    <div>
        <p>收票人: {{info.collector}}</p>
        <p>收票人电话: {{info.collectorPhone}}</p>
        <p>收票人地址: {{info.collectorAddr}}</p>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object
        }
    }
}
</script>
