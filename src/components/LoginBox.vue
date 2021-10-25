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
    left: 0px;
    bottom: 20%;
    width: 400px;
    height: 300px;
    border-radius: 0px 20px 20px 0px;
    background-color: rgb(49, 49, 49);
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
    background-color: rgb(49, 49, 49);
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
    border-radius: 15px;
    border: 0px;
    padding: 5px 15px;
    background-color: black;
    color: white;
    outline: none;
  }
</style>