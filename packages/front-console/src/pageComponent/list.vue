<template>

    <div class="list-container">
        <div class="listing-container">
            <div class="content">
                <div class="search-box">
                    <slot name="search"></slot>
                </div>
            </div>
        </div>

        <div class="table-container">

            <div class="function-container">
                <slot name="functionality"></slot>
            </div>

            <slot name="table"></slot>
        </div>

        <div class="pagination-container">
            <slot name="pagination"></slot>
        </div>
    </div>

</template>

<script>
	export default {
		name: "list"
	}
</script>

<style lang="scss" scoped>

</style>













