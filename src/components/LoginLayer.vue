<template>
  <div class="layer">
    <div class="blur-layer"></div>
    <LoginBox></LoginBox>
    <Logo></Logo>
  </div>
</template>

<script>
import LoginBox from './LoginBox.vue'
import Logo from './Logo.vue'

export default {
  name: 'LoginLayer',
  components: {
    LoginBox, Logo
  }
}
</script>


<style scoped>
.layer {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/don-background.jpeg);
  background-size: cover;
  background-position: center center;
}
.blur-layer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
}
</style>