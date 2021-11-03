<template>
	<div class="tab">
		<div>{{ this.name }}</div>
		<slot v-if="this.dropShowing" />
		<img v-if="!this.arrowDown" src="../../../assets/down-arrow.png" />
	</div>
</template>

<script>
export default {
	props: ["name", "dropShowing", "arrowDown"],
	data() {
		return {
			showDrop: this.dropShowing,
		};
	},
};
</script>

<style>
.tab img {
	max-height: 35%;
	padding: 0 11px;
}
</style>
