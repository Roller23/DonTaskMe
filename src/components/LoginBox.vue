<template>
  <div class='box'>
    <div class="tabs">
      <div class="tab selected" tab='login' v-on:click="selectTab($event)">Login</div>
      <div class="tab" tab='register' v-on:click="selectTab($event)">Register</div>
    </div>
    <div class="inputs-wrapper">
      <div class="inputs">
        <p>
          <input type="text" placeholder="Login">
        </p>
        <p>
          <input type="password" placeholder="Password">
        </p>
      </div>
      <div class="inputs">
        <p>
          <input type="text" placeholder="Login">
        </p>
        <p>
          <input type="password" placeholder="Password">
        </p>
        <p>
          <input type="password" placeholder="Confirm password">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginBox',
  props: {
    
  },
  data() {
    return {
      
    }
  },
  created() {

  },
  methods: {
    selectTab(e) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('selected'))
      e.target.classList.add('selected')
      if (e.target.getAttribute('tab') === 'register') {
        document.querySelector('.inputs-wrapper').classList.add('register')
      } else {
        document.querySelector('.inputs-wrapper').classList.remove('register')
      }
    }
  }
}
</script>

<style scoped>
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 300px;
    border-radius: 20px;
    transform: translate(-50%, -50%);
    background-color: rgba(170, 170, 170, 0.3);
    backdrop-filter: blur(5px);
    overflow: hidden;
  }
  .tabs {
    display: flex;
  }
  .tab {
    color: white;
    width: 100%;
    cursor: pointer;
    text-align: center;
    padding: 10px 0px;
    transition: 0.5s;
    background-color: rgb(32, 32, 32);
  }

  .tab.selected {
    background-color: rgba(0, 0, 0, 0.0);
  }

  .inputs-wrapper {
    overflow: hidden;
    width: 200%;
    margin-top: 30px;
    height: calc(100% - 30px);
    transition: 0.5s;
  }
  .inputs-wrapper.register {
    transform: translateX(-50%);
  }
  .inputs {
    width: 50%;
    height: 100%;
    display: inline-block;
  }

  .inputs input {
    border-radius: 20px;
    border: 0px;
    padding: 10px 20px;
    font-size: 14px;
    background-color: rgb(32, 32, 32);
    color: white;
    outline: none;
  }
</style>