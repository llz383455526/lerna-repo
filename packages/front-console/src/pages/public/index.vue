<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive === undefined || $route.meta.keepAlive">
                <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
            </router-view>
        </keep-alive>

        <router-view v-if="$route.meta.keepAlive === false">
            <!-- 这里是不被缓存的视图组件，比如 page3 -->
        </router-view>
    </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>

</style>