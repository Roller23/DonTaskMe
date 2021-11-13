<template>
  <div class="layer">
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
        {title: 'Workspace 1', desc: 'Some description', hidden: false},
        {title: 'Workspace 2', desc: 'Some description', hidden: false},
        {title: 'Workspace 3', desc: 'Some description', hidden: false},
        {title: 'Workspace 4', desc: 'Some description', hidden: false},
        {title: 'Workspace 5', desc: 'Some description', hidden: false},
        {title: 'Workspace 6', desc: 'Some description', hidden: false},
        {title: 'Workspace 7', desc: 'Some description', hidden: false},
        {title: 'Workspace 8', desc: 'Some description', hidden: false},
        {title: 'Workspace 9', desc: 'Some description', hidden: false},
        {title: 'Workspace 10', desc: 'Some description', hidden: false},
      ],
      currentWorkspace: null,
      workspacesText: 'Your workspaces'
    }
  },
  methods: {
    workspaceSelect(selectedWorkspace) {
      if (selectedWorkspace === this.currentWorkspace) {
        for (const workspace of this.workspaces) {
          workspace.hidden = false;
        }
        this.workspacesText = 'Your workspaces';
        this.currentWorkspace = null;
        return;
      }
      this.workspacesText = selectedWorkspace.title;
      this.currentWorkspace = selectedWorkspace
      for (const workspace of this.workspaces) {
        workspace.hidden = workspace !== selectedWorkspace;
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
.top-text {
  height: 50px;
  margin: 0px;
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