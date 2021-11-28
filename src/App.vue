<template>
	<BoardLayer></BoardLayer>
	<WorkspacesLayer></WorkspacesLayer>
	<LoginLayer v-if="!hasToken()"></LoginLayer>
</template>

<script>
import LoginLayer from "./components/LoginLayer.vue";
import WorkspacesLayer from "./components/WorkspacesLayer.vue";
import BoardLayer from "./components/BoardLayer/BoardLayer.vue";

export default {
	name: "App",
	components: {
		LoginLayer,
		WorkspacesLayer,
		BoardLayer,
	},
	data() {
		return {
			hasToken() {
				return !!localStorage.token;
			},
		};
	},
};
</script>

<style>
* {
	box-sizing: border-box;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
}
</style>
