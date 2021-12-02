<template>
  <div class="background-layer" v-if="rendered" :class="{visible}">
    <div class="box">
      <h1>{{title}}</h1>
      <hr>
      <h3 v-if="type === 'alert' || type === 'confirm'">{{body}}</h3>
      <p v-if="type === 'prompt'">
        <input type="text" ref="input" class="input" v-on:keyup.enter="acceptButton.handler">
      </p>
      <hr>
      <div class="buttons">
        <button v-for="button in buttons" v-bind:key="button.text"
          class="btn" type="button" @click="button.handler"
          :class="{neutral: button.theme === 'neutral', red: button.theme === 'red'}">
          {{button.text}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

class Button {
  constructor(text, handler = () => {}, theme = 'green') {
    this.text = text;
    this.handler = handler;
    this.theme = theme;
  }
}

export default {
  name: 'ModalBox',
  data() {
    return {
      type: null,
      title: 'Some title',
      body: 'Some body',
      buttons: [],
      rendered: false,
      visible: false,
      acceptButton: null,
      documentHandler: null
    }
  },
  methods: {
    async alert(text, title = '') {
      this.body = text;
      this.title = title;
      this.type = 'alert';
      this.acceptButton = null;
      this.buttons.splice(0);
      const promise = new Promise(resolve => {
        const handler = () => {
          this.visible = false;
          setTimeout(() => {
            this.rendered = false;
            document.removeEventListener('keyup', this.documentHandler)
            resolve();
          }, 500)
        }
        this.buttons.push(new Button('Okay', handler));
        this.documentHandler = e => {
          if (e.code === 'Escape' || e.code === 'Enter') {
            handler();
          }
        }
        document.addEventListener('keyup', this.documentHandler)
      });
      this.rendered = true;
      setTimeout(() => this.visible = true, 0)
      return promise;
    },
    async prompt(title = '') {
      this.body = null;
      this.title = title;
      this.type = 'prompt';
      this.acceptButton = null;
      this.buttons.splice(0);
      const promise = new Promise(resolve => {
        const createHandler = returnNull => {
          return () => {
            this.visible = false;
            setTimeout(() => {
              this.rendered = false;
              document.removeEventListener('keyup', this.documentHandler)
              resolve(returnNull ? null : this.$refs.input.value);
            }, 500);
          }
        }
        const acceptButton = new Button('Okay', createHandler(false), 'green');
        const rejectButton = new Button('Cancel', createHandler(true), 'neutral');
        this.buttons.push(rejectButton, acceptButton);
        this.acceptButton = acceptButton;
        this.documentHandler = e => {
          if (e.code !== 'Escape') return;
          rejectButton.handler();
        };
        document.addEventListener('keyup', this.documentHandler)
      });
      this.rendered = true;
      setTimeout(() => {
        this.visible = true;
        this.$refs.input.focus();
      }, 0)
      return promise;
    },
    async confirm(text, title = '') {
      this.body = text;
      this.title = title;
      this.type = 'confirm';
      this.acceptButton = null;
      this.buttons.splice(0);
      const promise = new Promise(resolve => {
        const createHandler = returnValue => {
          return () => {
            this.visible = false;
            setTimeout(() => {
              this.rendered = false;
              document.removeEventListener('keyup', this.documentHandler)
              resolve(returnValue);
            }, 500);
          }
        };
        const noButton = new Button('No', createHandler(false), 'red');
        const yesButton = new Button('Yes', createHandler(true), 'green');
        this.buttons.push(noButton, yesButton);
        this.documentHandler = e => {
          if (e.code === 'Escape') {
            noButton.handler();
          } else if (e.code === 'Enter') {
            yesButton.handler();
          }
        }
        document.addEventListener('keyup', this.documentHandler)
      });
      this.rendered = true;
      setTimeout(() => this.visible = true, 0)
      return promise;
    },
  }
}
</script>

<style scoped>
.background-layer {
  z-index: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  transition: 0.5s;
  background-color: rgba(0, 0, 0, 0.746);
}

.background-layer.visible {
  opacity: 1;
}

.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 30px;
  background-color: white;
  border: 4px dashed #56AF9F;
  width: 400px;
}

.box .input {
  border: 2px solid #56AF9F;
  border-radius: 10px;
  outline: none;
  padding: 4px 10px;
  font-size: 16px;
  width: 100%;
  color: #222222;
}

.buttons {
  text-align: right;
  padding: 5px 20px 0px 0px;
}

.buttons .btn {
  border: 0px;
  border-radius: 15px;
  padding: 4px 18px;
  color: white;
  background-color: #56AF9F;
  border: 2px solid #56AF9F;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-left: 10px;
}

.buttons .btn.neutral {
  background-color: white;
  color: #56AF9F;
}

.buttons .btn.red {
  background-color: white;
  color: red;
  border: 2px solid red;
}
</style>