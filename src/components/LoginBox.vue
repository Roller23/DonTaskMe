<template>
  <div class='box'>
    <div class="tabs">
      <div class="tab selected" v-on:click="selectTab($event)">Login</div>
      <div class="tab" v-on:click="selectTab($event)">Register</div>
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
    }
  }
}
</script>

<style scoped>
  .box {
    position: absolute;
    left: 0px;
    bottom: 5%;
    width: 400px;
    height: 550px;
    border-radius: 0px 20px 20px 0px;
    background-color: rgba(56, 56, 56, 0.95);
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
    background-color: rgba(56, 56, 56, 0.95);
  }
</style>