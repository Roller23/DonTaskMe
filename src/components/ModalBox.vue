<template>
  <div class="background-layer" v-if="rendered" :class="{ visible }">
    <div class="box">
      <img class="icon" alt="Modal icon" :src="getIcon(icon)" />
      <img class="icon2" alt="Modal icon" :src="getIcon(icon)" />
      <div class="inner-box">
        <h1>{{ title }}</h1>
        <hr v-if="type !== 'prompt'" />
        <h3 v-if="type === 'alert' || type === 'confirm'">{{ body }}</h3>
        <p v-if="type === 'prompt'">
          <input
            type="text"
            ref="input"
            v-model="inputValue"
            class="input"
            v-on:keyup.enter="acceptButton.handler"
          />
        </p>
        <hr v-if="type !== 'prompt'" />
        <div class="buttons">
          <button
            v-for="button in buttons"
            :key="button.text"
            class="btn"
            type="button"
            @click="button.handler"
            :class="{
              neutral: button.theme === 'neutral',
              red: button.theme === 'red',
            }"
          >
            {{ button.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
class Button {
  constructor(text, handler = () => {}, theme = "green") {
    this.text = text;
    this.handler = handler;
    this.theme = theme;
  }
}

export default {
  name: "ModalBox",
  data() {
    return {
      type: null,
      title: "",
      body: "",
      buttons: [],
      rendered: false,
      visible: false,
      acceptButton: null,
      documentHandler: null,
      inputValue: "",
      icon: "question-mark.png",
    };
  },
  methods: {
    getIcon(name) {
      return require(`../assets/${name}`);
    },
    async alert(text, title = "") {
      this.icon = "exclamation-mark.png";
      this.body = text;
      this.title = title;
      this.type = "alert";
      this.acceptButton = null;
      this.buttons.splice(0);
      const promise = new Promise((resolve) => {
        const handler = () => {
          this.visible = false;
          setTimeout(() => {
            this.rendered = false;
            document.removeEventListener("keyup", this.documentHandler);
            resolve();
          }, 500);
        };
        this.buttons.push(new Button("Okay", handler));
        this.documentHandler = (e) => {
          if (e.code === "Escape" || e.code === "Enter") {
            handler();
          }
        };
        document.addEventListener("keyup", this.documentHandler);
      });
      this.rendered = true;
      setTimeout(() => (this.visible = true), 0);
      return promise;
    },
    async prompt(title = "", defaultValue = "") {
      this.icon = "pencil.png";
      this.body = null;
      this.title = title;
      this.type = "prompt";
      this.acceptButton = null;
      this.buttons.splice(0);
      this.inputValue = defaultValue;
      const promise = new Promise((resolve) => {
        const createHandler = (returnNull) => {
          return () => {
            this.visible = false;
            setTimeout(() => {
              this.rendered = false;
              document.removeEventListener("keyup", this.documentHandler);
              let value = this.inputValue;
              this.inputValue = "";
              resolve(returnNull ? null : value);
            }, 500);
          };
        };
        const acceptButton = new Button("Okay", createHandler(false), "green");
        const rejectButton = new Button(
          "Cancel",
          createHandler(true),
          "neutral"
        );
        this.buttons.push(rejectButton, acceptButton);
        this.acceptButton = acceptButton;
        this.documentHandler = (e) => {
          if (e.code !== "Escape") return;
          rejectButton.handler();
        };
        document.addEventListener("keyup", this.documentHandler);
      });
      this.rendered = true;
      setTimeout(() => {
        this.visible = true;
        this.$refs.input.focus();
      }, 0);
      return promise;
    },
    async confirm(text, title = "") {
      this.icon = "question-mark.png";
      this.body = text;
      this.title = title;
      this.type = "confirm";
      this.acceptButton = null;
      this.buttons.splice(0);
      const promise = new Promise((resolve) => {
        const createHandler = (returnValue) => {
          return () => {
            this.visible = false;
            setTimeout(() => {
              this.rendered = false;
              document.removeEventListener("keyup", this.documentHandler);
              resolve(returnValue);
            }, 500);
          };
        };
        const noButton = new Button("No", createHandler(false), "red");
        const yesButton = new Button("Yes", createHandler(true), "green");
        this.buttons.push(noButton, yesButton);
        this.documentHandler = (e) => {
          if (e.code === "Escape") {
            noButton.handler();
          } else if (e.code === "Enter") {
            yesButton.handler();
          }
        };
        document.addEventListener("keyup", this.documentHandler);
      });
      this.rendered = true;
      setTimeout(() => (this.visible = true), 0);
      return promise;
    },
  },
};
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
  padding: 5px;
  border-radius: 30px;
  background-color: white;
  width: 100%;
  max-width: 400px;
}

.box .icon {
  width: 50px;
  position: absolute;
  right: 0px;
  top: 0px;
  transform: translate(10%, -10%) rotate(5deg);
  transition: 0.3s;
}

.box .icon2 {
  width: 70px;
  position: absolute;
  right: 0px;
  top: 0px;
  transform: translate(10%, -10%) rotate(5deg);
  transition: 0.3s;
}

.background-layer.visible .box .icon {
  transform: translate(-20%, -50%) rotate(-20deg);
}

.background-layer.visible .box .icon2 {
  transform: translate(60%, -30%) rotate(20deg);
}

.inner-box {
  border: 2px dashed #56af9f;
  padding: 20px;
  border-radius: 30px;
}

.box .input {
  border: 0px;
  border-bottom: 2px solid #56af9f;
  outline: none;
  padding: 4px 10px;
  font-size: 16px;
  width: 100%;
  color: #222222;
  background-color: rgb(243, 243, 243);
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
  background-color: #56af9f;
  border: 2px solid #56af9f;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-left: 10px;
}

.buttons .btn.neutral {
  background-color: white;
  color: #56af9f;
}

.buttons .btn.red {
  background-color: white;
  color: rgb(204, 53, 53);
  border: 2px solid rgb(204, 53, 53);
}
</style>