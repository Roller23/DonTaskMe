<template>
  <div class="layer">
    <div class="back-wrap" :class="{visible: currentWorkspace !== null}" @click="hideBoards">
      <img src="@/assets/go-back-arrow.png" alt="Go back" class="go-back">
    </div>
    <h1 class="top-text">{{workspacesText}}</h1>
    <div class="boxes-wrap">
      <div class="workspaces" :class="{hidden: currentWorkspace !== null}">
        <div class="workspace-wrap new-workspace">
          Create a new workspace
        </div>
        <div v-for="workspace in workspaces"
            v-bind:key="workspace.title" class="workspace-wrap workspace"
            :class="{hidden: workspace.hidden}"
            @click="workspaceSelect(workspace)">
          <h2 class="title">{{workspace.title}}</h2>
          <p class="desc">{{workspace.desc}}</p>
        </div>
      </div>
      <div class="boards" :class="{expanded: currentWorkspace !== null}">
        <transition name="fade">
          <div class="chooseWorkspace" v-if="currentWorkspace === null">
            <img class="icon" src="@/assets/workspace.png" alt="Workspace icon">
            <h2 class="text">Choose a workspace to see its boards</h2>
          </div>
        </transition>
        <transition name="fade">
          <h1 v-if="currentWorkspace !== null">Boards in this workspace</h1>
        </transition>
        <div class="boards-wrap" v-if="currentWorkspace !== null">
          <div class="board" v-for="board in currentWorkspace.boards"
               v-bind:key="board.title" :class="{visible: board.visible}">
            <h2 class="title">{{board.title}}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkspacesLayer',
  components: {
    
  },
  data() {
    return {
      workspaces: [
        {title: 'Personal projects', desc: 'Some of the projects I am working on in my free time', hidden: false, boards: []},
        {title: 'University', desc: 'Homework and TUL related stuff', hidden: false, boards: []},
        {title: 'Work', desc: 'Zeus, Athena, Hermes etc...', hidden: false, boards: [
          {title: 'Zeus', visible: false},
          {title: 'Athena', visible: false},
          {title: 'Hermes', visible: false},
        ]},
        {title: 'Todo', desc: 'Non-work related tasks', hidden: false, boards: []},
        {title: 'Workspace 5', desc: 'Some description', hidden: false, boards: []},
        {title: 'Workspace 6', desc: 'Some description', hidden: false, boards: []},
        {title: 'Workspace 7', desc: 'Some description', hidden: false, boards: []},
        {title: 'Workspace 8', desc: 'Some description', hidden: false, boards: []},
        {title: 'Workspace 9', desc: 'Some description', hidden: false, boards: []},
      ],
      currentWorkspace: null,
      workspacesText: 'Your workspaces'
    }
  },
  methods: {
    hideBoards() {
      for (const workspace of this.workspaces) {
        workspace.hidden = false;
        for (const board of workspace.boards) board.visible = false;
      }
      this.workspacesText = 'Your workspaces';
      this.currentWorkspace = null;
    },
    workspaceSelect(selectedWorkspace) {
      const boardChanged = this.currentWorkspace !== null;
      if (selectedWorkspace === this.currentWorkspace) {
        return this.hideBoards();
      }
      this.workspacesText = selectedWorkspace.title;
      this.currentWorkspace = selectedWorkspace
      for (const workspace of this.workspaces) {
        workspace.hidden = workspace !== selectedWorkspace;
        if (workspace.hidden) {
          for (const board of workspace.boards) board.visible = false;
        }
      }
      for (let i = 0; i < selectedWorkspace.boards.length; i++) {
        setTimeout(() => {
          selectedWorkspace.boards[i].visible = true;
        }, (500 * !boardChanged) + (150 * i));
      }
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
  background-color: rgb(233, 233, 233);
  padding: 20px;
  padding-bottom: 0px;
}
.back-wrap {
  width: 0px;
  display: inline-block;
  margin-right: 0px;
  overflow: hidden;
  vertical-align: middle;
  transform: translateY(-5px);
  transition: 0.3s;
}
.back-wrap.visible {
  width: 40px;
  margin-right: 10px;
}
.back-wrap .go-back {
  width: 40px;
  cursor: pointer;
}
.top-text {
  height: 50px;
  margin: 0px;
  display: inline-block;
}
.boxes-wrap {
  height: calc(100% - 50px);
  white-space: nowrap;
}
.workspaces {
  width: 50%;
  height: 100%;
  overflow: auto;
  padding-right: 5px;
  transition: 0.6s;
  display: inline-block;
}
.workspaces.hidden {
  transform: translateX(-60%);
}
.boards {
  color: black;
  display: inline-block;
  vertical-align: top;
  width: 50%;
  padding: 20px;
  height: 100%;
  transition: 0.6s;
  position: relative;
}
.boards.expanded {
  transform: translateX(-37%);
  width: 80%;
}
.boards .board {
  opacity: 0;
  transition: 0.3s;
  display: inline-block;
  margin: 10px;
  padding: 10px;
  min-height: 100px;
  min-width: 200px;
  background-color: white;
  border-radius: 15px;
  cursor: pointer;
}
.boards .board:hover {
  transform: translate(-3px, -3px);
  box-shadow: 1px 1px 5px rgb(189, 189, 189);
}
.boards .board .title {
  margin-top: 5px;
  margin-left: 10px;
}
.boards .board.visible {
  opacity: 1;
}
.chooseWorkspace {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.chooseWorkspace .icon {
  width: 300px;
  filter: grayscale(20%)
}
.chooseWorkspace .text {
  color: gray;
}
.workspace-wrap {
  cursor: pointer;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 1px 1px 1px 1px rgb(172, 172, 172);
  margin-bottom: 10px;
  border-radius: 5px;
  transition: 0.3s;
  text-align: right;
}
.workspace-wrap.hidden {
  transform: translateX(-10%);
}
.workspace-wrap:hover {
  transform: scale(1.01) translate(-2px, -2px);
  box-shadow: 1px 1px 4px 2px rgb(172, 172, 172);
}

.workspace-wrap .desc {
  color: gray;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>