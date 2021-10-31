<template>
	<TopBar />
</template>

<script>
import TopBar from "./components/TopBar/TopBar.vue";

export default {
	name: "App",
	components: {
		TopBar,
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
	background-image: url("./assets/warsztat1.png");
	background-size: cover;
	background-position: center;
}

h1 {
	margin: 0;
}
</style>
