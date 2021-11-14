<template>
  <div class="layer">
    <div class="back-wrap" :class="{visible: currentWorkspace !== null}" @click="hideBoards">
      <img src="@/assets/go-back-arrow.png" alt="Go back" class="go-back">
    </div>
    <h1 class="top-text">{{workspacesText}}</h1>
    <div class="boxes-wrap">
      <div class="workspaces" :class="{hidden: currentWorkspace !== null}">
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
          <h1 v-if="currentWorkspace !== null">Boards in this workspace</h1>
        </transition>
        <div class="boards-wrap" v-if="currentWorkspace !== null">
          <div class="board" v-for="board in currentWorkspace.boards"
               v-bind:key="board.title" :class="{visible: board.visible, 'new-board': board.newBoard}"
               @click="board.newBoard ? createBoard() : enterBoard(board)">
            <h2 class="title">{{board.title}}</h2>
            <div class="more" @click="showBoardOptions(board)" v-if="!board.newBoard">
              <img src="@/assets/ellipsis.png" alt="More board options">
              <div class="options" :class="{visible: board.optionsOpen}">
                <div class="option edit">Edit</div>
                <div class="option delete" @click="deleteBoard(board)">Delete</div>
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
  constructor(title, newBoard = false) {
    this.title = title;
    this.visible = false;
    this.newBoard = newBoard;
  }
}

class Workspace {
  constructor(title, desc, ...boards) {
    this.title = title;
    this.desc = desc;
    this.boards = [new Board('', true)];
    this.hidden = false;
    this.addBoards(boards)
  }
  addBoards(...boards) {
    for (const board of boards) {
      if (typeof board === 'string') {
        this.boards.push(new Board(board))
      } else if (board instanceof Board) {
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
      workspaces: [
        new Workspace('Personal projects', 'Some of the projects I am working on in my free time'),
        new Workspace('University', 'Homework and TUL related stuff').addBoards('DonTaskMe', 'Squidventure', 'Hermes', 'Mish'),
        new Workspace('Work', 'Zeus, Athena, Hermes etc...').addBoards('Zeus', 'Athena', 'Hermes'),
        new Workspace('Todo', 'Non-work related tasks'),
        new Workspace('Workspace 5', 'Some description'),
        new Workspace('Workspace 6', 'Some description'),
        new Workspace('Workspace 7', 'Some description'),
        new Workspace('Workspace 8', 'Some description'),
        new Workspace('Workspace 9', 'Some description'),
      ],
      currentWorkspace: null,
      currentBoardOptions: null,
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
    },
    caputereKeyboard(event) {
      if (event.key !== 'Escape') return;
      if (this.currentWorkspace === null) return;
      this.hideBoards();
    },
    showBoardOptions(selectedBoard) {
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
    deleteBoard(selectedBoard) {
      if (!confirm(`Are you sure you want to delete ${selectedBoard.title}?`)) return;
      // TODO: delete it on the backend
      this.currentWorkspace.removeBoard(selectedBoard)
    },
    newWorkspace() {
      const title = prompt('Workspace title');
      const desc = prompt('Workspace description');
      const data = {title, desc};
      // TODO: send it to the backend
      const workspace = new Workspace(data.title, data.desc);
      this.workspaces.push(workspace)
    },
    createBoard() {
      const title = prompt('Board title');
      const board = new Board(title);
      board.visible = true;
      this.currentWorkspace.boards.push(board)
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
    deleteWorkspace(event, workspace) {
      event.stopPropagation();
      console.log(workspace);
      if (!confirm(`Are you sure you want to delete ${workspace.title} and all of its boards?`)) return;
      // TODO: delete it on the backend
      const index = this.workspaces.indexOf(workspace);
      if (index === -1) return;
      this.workspaces.splice(index, 1);
    }
  },
  mounted() {
    document.addEventListener('keyup', this.caputereKeyboard);
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.caputereKeyboard);
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
  border-radius: 5px;
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
  bottom: 0px;
  left: 15px;
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
  background-color: white;
  box-shadow: 1px 1px 1px 1px rgb(216, 216, 216);
  margin-bottom: 10px;
  border-radius: 3px;
  transition: 0.3s;
  text-align: right;
  border: 2px solid white;
  position: relative;
}
.workspace-wrap.hidden {
  transform: translateX(-10%);
}
.workspace-wrap:not(.selected):hover {
  border: 2px solid #56AF9F;
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