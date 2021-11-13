<template>
  <div class="layer">
    <h1>{{workspacesText}}</h1>
    <div class="workspaces">
      <div v-for="workspace in workspaces"
           v-bind:key="workspace.title" class="workspace-wrap workspace"
           :class="{hidden: workspace.hidden}"
           @click="workspaceSelect(workspace)"
      >
        <h2>{{workspace.title}}</h2>
        <p>{{workspace.desc}}</p>
      </div>
      <div class="workspace-wrap new-workspace">
        Create a new workspace
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
}
.workspaces {
  width: 50%;
  height: 100%;
  overflow: auto;
  padding-right: 5px;
}
.workspace-wrap {
  cursor: pointer;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 1px 1px 1px 1px rgb(172, 172, 172);
  margin-bottom: 10px;
  border-radius: 10px;
  transition: 0.3s;
  text-align: right;
}
.workspace-wrap.hidden {
  transform: translateX(-70%);
}
.workspace-wrap:hover {
  transform: scale(1.01) translate(-2px, -2px);
  box-shadow: 1px 1px 4px 2px rgb(172, 172, 172);
}
</style>