<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Hello there
    </p>
    <h1>
      GENERAL KENOBI
    </h1>
    <h3>Backend health check</h3>
    <p>Status: {{ status }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      status: 'Loading...'
    }
  },
  created() {
    this.setStatus();
  },
  methods: {
    async setStatus() {
      const backendStatus = await (await fetch(`${this.backendUrl}/healthcheck`)).json();
      console.log(backendStatus)
      this.status = backendStatus.Status
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
