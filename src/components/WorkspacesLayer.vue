<template>
  <div class="layer">
    <div class="boxes-wrap">
      <div class="workspaces" :class="{hidden: currentWorkspace !== null}">
        <div class="back-wrap" :class="{visible: currentWorkspace !== null}" @click="hideBoards">
          <img src="@/assets/go-back-arrow.png" alt="Go back" class="go-back">
        </div>
        <h1 class="top-text">Your workspaces</h1>
        <div v-for="workspace in workspaces"
            v-bind:key="workspace.title" class="workspace-wrap workspace"
            :class="{hidden: workspace.hidden, selected: currentWorkspace === workspace}"
            @click="workspaceSelect(workspace)">
          <div class="buttons">
            <img src="@/assets/edit.png" alt="Edit button" class="button"
            @click="editWorkspace($event, workspace)">
            <img src="@/assets/delete.png" alt="Delete button" class="button"
            @click="deleteWorkspace($event, workspace)">
          </div>
          <h2 class="title">{{workspace.title}}</h2>
          <p class="desc">{{workspace.desc}}</p>
        </div>
      </div>
      <div class="boards" :class="{expanded: currentWorkspace !== null}">
        <transition name="fade">
          <div class="choose-workspace" v-if="currentWorkspace === null">
            <img class="icon" src="@/assets/workspace.png" alt="Workspace icon">
            <h2 class="text">Choose a workspace to see its boards</h2>
            <p class="text">or</p>
            <h2 class="text new-workspace" @click="newWorkspace">Create a new one</h2>
          </div>
        </transition>
        <transition name="fade">
          <h1 v-if="currentWorkspace !== null">
            Boards in
            <span class="curr-workspace-title">{{currentWorkspace.title}}</span>
          </h1>
        </transition>
        <div class="boards-wrap" v-if="currentWorkspace !== null">
          <div class="board" v-for="board in currentWorkspace.boards"
               v-bind:key="board.title" :class="{visible: board.visible, 'new-board': board.newBoard}"
               @click="board.newBoard ? createBoard() : enterBoard(board)">
            <h2 class="title">{{board.title}}</h2>
            <div class="more" @click="showBoardOptions($event, board)" v-if="!board.newBoard">
              <img src="@/assets/ellipsis.png" alt="More board options">
              <div class="options" :class="{visible: board.optionsOpen}">
                <div class="option edit">Edit</div>
                <div class="option delete" @click="deleteBoard($event, board)">Delete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

class Board {
  constructor(title, uid, newBoard = false) {
    this.title = title;
    this.uid = uid;
    this.visible = false;
    this.newBoard = newBoard;
  }
}

class Workspace {
  constructor(title, desc, uid, ...boards) {
    this.title = title;
    this.desc = desc;
    this.boards = [new Board('', '', true)];
    this.hidden = false;
    this.uid = uid;
    this.addBoards(boards)
  }
  addBoards(...boards) {
    for (const board of boards) {
      if (board instanceof Board) {
        this.boards.push(board)
      }
    }
    return this
  }
  removeBoard(board) {
    if (!(board instanceof Board)) return;
    const index = this.boards.indexOf(board);
    if (index === -1) return;
    this.boards.splice(index, 1);
  }
}

export default {
  name: 'WorkspacesLayer',
  components: {
    
  },
  data() {
    return {
      workspaces: [],
      currentWorkspace: null,
      currentBoardOptions: null,
    }
  },
  methods: {
    hideBoards() {
      for (const workspace of this.workspaces) {
        workspace.hidden = false;
        for (const board of workspace.boards) board.visible = false;
      }
      this.currentWorkspace = null;
    },
    workspaceSelect(selectedWorkspace) {
      const boardChanged = this.currentWorkspace !== null;
      if (selectedWorkspace === this.currentWorkspace) {
        return this.hideBoards();
      }
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
    },
    caputereKeyboard(event) {
      if (event.key !== 'Escape') return;
      if (this.currentWorkspace === null) return;
      this.hideBoards();
    },
    showBoardOptions(event, selectedBoard) {
      event.stopPropagation();
      if (this.currentBoardOptions === selectedBoard) {
        this.currentBoardOptions.optionsOpen = false;
        this.currentBoardOptions = null;
        return;
      }
      for (const board of this.currentWorkspace.boards) {
        board.optionsOpen = false;
      }
      selectedBoard.optionsOpen = true;
      this.currentBoardOptions = selectedBoard;
    },
    async deleteBoard(event, selectedBoard) {
      event.stopPropagation();
      if (!confirm(`Are you sure you want to delete ${selectedBoard.title}?`)) return;
      const res = await this.request(`/boards/${this.currentWorkspace.uid}/${selectedBoard.uid}`, {method: 'DELETE'})
      if (res.status === 202) {
        this.currentWorkspace.removeBoard(selectedBoard)
      } else {
        alert('Could not delete the board');
      }
    },
    async getWorkspaces() {
      const res = await this.request('/workspaces');
      if (res.status === 200) {
        const json = await res.json();
        console.log(json)
        for (const workspace of json) {
          const newWorkspace = new Workspace(workspace.title, workspace.desc, workspace.uid);
          for (const board of workspace.boards) {
            newWorkspace.addBoards(new Board(board.title, board.uid))
          }
          this.workspaces.push(newWorkspace)
        }
      } else {
        localStorage.removeItem('token');
        alert('Could not load workspaces, log in again');
        window.location.reload();
      }
    },
    async newWorkspace() {
      const title = prompt('Workspace title');
      if (!title) {
        return alert('Title cannot be empty');
      }
      const desc = prompt('Workspace description');
      const res = await this.request('/workspaces', {method: 'POST', body: {title, desc}})
      if (res.status === 201) {
        const json = await res.json();
        console.log(json)
        const workspace = new Workspace(json.title, json.desc, json.uid);
        this.workspaces.push(workspace)
      } else {
        console.log('Could not add the workspace');
      }
    },
    async createBoard() {
      const title = prompt('Board title');
      if (!title) return alert('Title cannot be empty');
      const body = {title, workspace: this.currentWorkspace.uid};
      const res = await this.request('/boards', {method: 'POST', body})
      if (res.status === 201) {
        const json = await res.json();
        console.log(json)
        const board = new Board(json.title, json.uid);
        board.visible = true;
        this.currentWorkspace.boards.push(board)
      } else {
        console.log('Could not add the board');
      }
    },
    enterBoard(board) {
      console.log(board)
    },
    editWorkspace(event, workspace) {
      event.stopPropagation();
      console.log(workspace);
      const title = prompt('New title');
      const desc = prompt('New description');
      const data = {title, desc};
      return data;
    },
    async deleteWorkspace(event, workspace) {
      event.stopPropagation();
      console.log(workspace);
      if (!confirm(`Are you sure you want to delete ${workspace.title} and all of its boards?`)) return;
      const res = await this.request(`/workspaces/${workspace.uid}`, {method: 'DELETE'})
      if (res.status === 202) {
        const index = this.workspaces.indexOf(workspace);
        if (index === -1) return;
        this.workspaces.splice(index, 1);
      } else {
        alert('Could not delete the workspace');
      }
    }
  },
  mounted() {
    document.addEventListener('keyup', this.caputereKeyboard);
    if (localStorage.token) {
      this.getWorkspaces();
    }
    this.listeners.loadWorkspaces = () => {
      this.getWorkspaces();
    }
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.caputereKeyboard);
    this.listeners.loadWorkspaces = () => {};
  },
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
  padding-bottom: 0px;
}
.back-wrap {
  width: 0px;
  margin-right: 0px;
  overflow: hidden;
  vertical-align: middle;
  transform: translateY(-5px);
  transition: 0.3s;
  float: right;
  filter: invert(100%);
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
  margin-bottom: 10px;
  display: inline-block;
  color: white;
}
.boxes-wrap {
  height: 100%;
  white-space: nowrap;
}
.workspaces {
  width: 50%;
  height: 100%;
  overflow: auto;
  padding-right: 5px;
  transition: 0.6s;
  display: inline-block;
  background-color: rgb(36, 36, 36);
  padding: 30px;
}
.workspaces.hidden {
  transform: translateX(-60%);
}
.boards {
  background-color: rgb(243, 243, 243);
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
.boards-wrap {
  overflow: auto;
  white-space: initial;
  padding-bottom: 50px;
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
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  vertical-align: top;
}
.boards .board.new-board {
  background-image: url(../assets/add.png);
  background-size: 50px;
  background-repeat: no-repeat;
  background-position: center center;
  border: 2px solid #56AF9F;
}
.boards .board:hover {
  box-shadow: 1px 1px 5px rgb(189, 189, 189);
}
.boards .board .title {
  margin-top: 5px;
  margin-left: 10px;
}
.boards .board.visible {
  opacity: 1;
}
.boards .board .more {
  position: absolute;
  bottom: 5px;
  left: 20px;
  display: block;
  cursor: pointer;
}
.boards .board .more img {
  width: 20px;
}
.boards .board .more .options {
  background-color: white;
  position: absolute;
  bottom: 0px;
  left: 0px;
  transform: translate(25px, calc(100% - 10px));
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgb(195, 195, 195);
  overflow: hidden;
  height: 0px;
  transition: 0.3s;
}
.boards .board .more .options.visible {
  height: 63px;
}
.boards .board .more .option {
  cursor: pointer;
  font-weight: 500;
  padding: 5px;
  transition: 0.2s;
}
.boards .board .delete {
  color: red;
}
.boards .board .delete:hover {
  color: white;
  background-color: red;
}
.boards .board .edit {
  color: #56AF9F;
}
.boards .board .edit:hover {
  color: white;
  background-color: #56AF9F;
}
.boards .curr-workspace-title {
  color: #56AF9F;
}
.choose-workspace {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.choose-workspace .icon {
  width: 300px;
  filter: grayscale(20%);
  margin-bottom: 20px;
}
.choose-workspace .text {
  color: gray;
}
.choose-workspace h2 {
  margin: 10px 0px;
}
.choose-workspace p {
  margin: 10px 0px;
}
.choose-workspace .new-workspace {
  font-size: 20px;
  cursor: pointer;
  color: #56AF9F;
  border: 2px solid #56AF9F;
  border-radius: 30px;
  display: inline-table;
  padding: 5px 15px;
  margin: 0px;
  transition: 0.3s;
}
.choose-workspace .new-workspace:hover {
  background-color: #56AF9F;
  color: white;
}
.workspace-wrap {
  cursor: pointer;
  padding: 10px 20px;
  background-color: rgb(238, 238, 238);
  margin-bottom: 15px;
  border-radius: 25px;
  transition: 0.3s;
  text-align: right;
  border: 4px solid rgb(238, 238, 238);
  position: relative;
}
.workspace-wrap.hidden {
  transform: translateX(-10%);
}
.workspace-wrap:not(.selected):hover {
  border: 4px solid #56AF9F;
  transform: translateX(5px);
}

.workspace-wrap.selected {
  border-right: 4px solid #56AF9F;
}

.workspace-wrap .desc {
  color: gray;
}
.workspace-wrap .buttons {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.workspace-wrap .buttons .button {
  display: inline-block;
  cursor: pointer;
  width: 25px;
  opacity: 0.5;
}
.workspace-wrap .buttons .button:first-child {
  margin-right: 25px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>