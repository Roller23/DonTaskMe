<template>
  <transition name="fade">
    <div class="layer" v-if="visible">
      <div class="blur-layer"></div>
      <LoginBox v-on:login-fadeout="visible = false"></LoginBox>
      <Logo></Logo>
    </div>
  </transition>
</template>

<script>
import LoginBox from './LoginBox.vue'
import Logo from './Logo.vue'

export default {
  name: 'LoginLayer',
  components: {
    LoginBox, Logo
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>


<style scoped>
.layer {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>