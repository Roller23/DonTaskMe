<template>
  <div class='box'>
    <div class="tabs">
      <div class="tab selected" tab='login' v-on:click="selectTab($event)">Login</div>
      <div class="tab" tab='register' v-on:click="selectTab($event)">Register</div>
    </div>
    <div class="inputs-wrapper">
      <div class="inputs">
        <p>
          <input type="text" placeholder="Login" id="login-name" class="icon-login" v-model="loginName">
        </p>
        <p>
          <input type="password" placeholder="Password" id="login-password" class="icon-password" v-model="loginPassword">
        </p>
        <p>
          <button type="button" v-on:click="signIn">Sign in</button>
        </p>
      </div>
      <div class="inputs">
        <p>
          <input type="text" placeholder="Login" id="register-name" class="icon-login" v-model="registerName">
        </p>
        <p>
          <input type="password" placeholder="Password" id="register-password1" class="icon-password" v-model="registerPassword1">
        </p>
        <p>
          <input type="password" placeholder="Repeat password" id="register-password2" class="icon-password repeat" v-model="registerPassword2">
        </p>
        <p>
          <button type="button" v-on:click="signUp">Sign up</button>
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
      loginName: '',
      loginPassword: '',
      registerName: '',
      registerPassword1: '',
      registerPassword2: ''
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
    },
    signIn() {
      const login = this.$data.loginName;
      const password = this.$data.loginPassword;
      if (!login) return alert(`Login can't be empty`)
      if (!password) return alert(`Password can't be empty`)
      // TODO: send data to backend
      this.$emit('loginFadeout')
    },
    async signUp() {
      const login = this.$data.registerName;
      const password1 = this.$data.registerPassword1;
      const password2 = this.$data.registerPassword2;
      if (!login) return alert(`Login can't be empty`)
      if (!password1) return alert(`Password can't be empty`)
      if (!password2) return alert(`Password can't be empty`)
      if (password1 !== password2) return alert(`Passwords must match`)
      // TODO: send to backend
      const body = {nickname: login, password: password1};
      const res = await fetch(`${this.backendUrl}/register`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
      })
      const json = await res.json();
      console.log(json)
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
    text-align: center;
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
    margin-top: 15px;
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
    border-radius: 5px;
    border: 0px;
    padding: 10px 20px;
    padding-left: 40px;
    font-size: 14px;
    background-color: rgb(32, 32, 32);
    color: white;
    outline: none;
    border-left: 2px solid transparent;
    transition: 0.2s;
  }

  .inputs button {
    cursor: pointer;
    border: 0px;
    padding: 10px 30px;
    color: white;
    background-color: black;
    border-radius: 8px;
    margin-top: 10px;
    transition: 0.3s;
  }

  .inputs button:hover {
    transform: translate(-2px, -2px);
  }

  .inputs button:active {
    transition: 0s;
    transform: translate(0px, 0px);
    background-color: rgb(27, 27, 27);
  }

  .inputs input:focus {
    border-left: 2px solid rgb(200, 200, 200);
  }

  .icon-login, .icon-password {
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 10px center;
  }
  .icon-login {
    background-image: url(~@/assets/login-icon.png);
  }
  .icon-password {
    background-image: url(~@/assets/password-icon.png);
  }
  .icon-password.repeat {
    background-image: url(~@/assets/password-icon2.png);
  }
</style>