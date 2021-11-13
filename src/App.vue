<template>
  <div class="blur-layer"></div>
  <LoginBox></LoginBox>
  <Logo></Logo>
</template>

<script>
import LoginBox from './components/LoginBox.vue'
import Logo from './components/Logo.vue'

export default {
  name: 'App',
  components: {
    LoginBox, Logo
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/don-background.jpeg);
  background-size: cover;
  background-position: center center;
}

.blur-layer {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
}
</style>
