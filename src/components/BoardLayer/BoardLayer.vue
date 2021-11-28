<template>
	<div class="layer" v-if="currentBoard != null">
		<div class="side-wrap">
			<img
				src="@/assets/go-back-arrow.png"
				alt="Go back"
				class="go-back"
				@click="goBack"
			/>
			<div class="list-button" @click.stop="newList"></div>
		</div>
		<h1>{{currentBoard.title}}</h1>
		<div class="list-wrap">
			<draggable
				class="listContainer"
				:list="lists"
				:group="{ name: 'lists' }"
				item-key="uid"
				tag="transition-group"
				:component-data="{ tag: 'div', name: 'flip-list' }"
			>
				<template #item="list">
					<div class="list" :class="{ taskHovered: hoveredTask }">
						<div class="list-header">
							<div class="list-title">
								{{ list.element.title }}
							</div>
							<div
								class="more"
								@click="showListOptions(list.element)"
							>
								<img
									src="@/assets/ellipsis.png"
									alt="More board options"
								/>
								<div
									v-if="list.element.optionsOpen"
									class="options"
								>
									<div
										class="option edit"
										@click="editList(list.index, list)"
									>
										Edit
									</div>
									<div
										class="option delete"
										@click="deleteList(list.index, list)"
									>
										Delete
									</div>
								</div>
							</div>
						</div>
						<div
							class="taskContainer"
							@mouseover="hoveredTask = true"
							@mouseleave="hoveredTask = false"
						>
							<draggable
								class="taskContainer"
								:list="list.element.tasks"
								:group="{ name: 'tasks' }"
								item-key="uid"
								tag="transition-group"
								:component-data="{
									tag: 'div',
									name: 'flip-list',
								}"
							>
								<template #item="task">
									<div class="task">
										<div>
											{{ task.element.title }}
										</div>
										<div class="buttons">
											<img
												src="@/assets/edit.png"
												alt="Edit button"
												class="button"
												@click="editTask(index, task)"
											/>
											<img
												src="@/assets/delete.png"
												alt="Delete button"
												class="button"
												@click="deleteTask(index, task)"
											/>
										</div>
									</div>
								</template>
							</draggable>
						</div>
						<div
							class="task-button"
							@click.stop="createTask(list.index)"
						></div>
					</div>
				</template>
			</draggable>
		</div>
	</div>
</template>

<script>
import draggable from "vuedraggable";

class List {
	constructor(title, uid, ...tasks) {
		this.title = title;
		this.uid = uid;
		this.tasks = [];
		this.addTasks(...tasks);
		this.optionsOpen = false;
	}
	addTasks(...tasks) {
		let counter = this.tasks.length;
		const newTasks = tasks.map((t, idx) => ({
			title: t,
			uid: counter + idx,
		}));
		this.tasks.push(...newTasks);
		return this;
	}
}

export default {
	name: "BoardLayer",
	components: { draggable },
	data() {
		return {
			lists: [
				new List("Ideas", 0, "Idea1"),
				new List("Todo", 1, "Todo1", "Todo2"),
				new List("InProgress", 2, "inProgress1", "inProgress2"),
				new List("Completed", 3),
			],
			hoveredTask: false,
			currentBoard: null,
		};
	},
	methods: {
		async newList() {
			const title = prompt("List title");
			if (title === "") {
				return alert("Title cannot be empty");
			}
			if (title === null) {
				return;
			}
			const body = {title, index: this.lists.length};
			const res = await this.request(`/lists/${this.currentBoard.uid}`, {method: 'POST', body})
			if (res.status === 201) {
				const json = await res.json();
				const list = new List(json.title, json.index);
				this.lists.push(list);
			} else {
				alert('Could not the list')
			}
		},
		createTask(listId) {
			const title = prompt("Task title");
			if (title === "") {
				return alert("Title cannot be empty");
			}
			if (title === null) {
				return;
			}
			this.lists[listId].addTasks(title);
		},
		editTask(listId, task) {
			const title = prompt("New task title", task.element.title);
			if (title === "") {
				return alert("Title cannot be empty");
			}
			if (title === null) {
				return;
			}
			this.lists[listId].tasks[task.index].title = title;
		},
		deleteTask(listId, task) {
			if (
				!confirm(
					`Are you sure you want to delete ${task.element.title}?`
				)
			)
				return;
			this.lists[listId].tasks.splice(task.index, 1);
		},
		showListOptions(selectedList) {
			console.log(selectedList);
			if (!selectedList.optionsOpen) {
				for (const list of this.lists) {
					list.optionsOpen = false;
				}
			}
			selectedList.optionsOpen = !selectedList.optionsOpen;
		},
		editList(listId, list) {
			const title = prompt("New list title", list.element.title);
			if (title === "") {
				return alert("Title cannot be empty");
			}
			if (title === null) {
				return;
			}
			this.lists[listId].title = title;
		},
		deleteList(listId, list) {
			if (
				!confirm(
					`Are you sure you want to delete ${list.element.title}?`
				)
			)
				return;
			this.lists.splice(listId, 1);
		},
		goBack() {
			this.currentBoard = null
			this.listeners.showWorkspaces();
		}
	},
	mounted() {
    this.listeners.loadBoard = board => {
			console.log(board)
			this.currentBoard = board;
    }
  },
  beforeUnmount() {
    this.listeners.loadBoard = () => {};
  },
};
</script>

<style scoped>
.layer {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: rgb(233, 233, 233);
	overflow-y: auto;
	display: grid;
	column-gap: 10px;
	grid-template-columns: 100px auto;
	grid-template-rows: 100px auto;
	grid-template-areas:
		"side top"
		"side lists";
}

.side-wrap {
	grid-area: side;
	vertical-align: middle;
	background-color: #2c3e50;
}

.side-wrap .go-back {
	display: inline-block;
	width: 40px;
	cursor: pointer;
}

.list-wrap {
	display: flex;
	align-items: flex-start;
}

.listContainer {
	grid-area: lists;
	display: flex;
	padding-right: 50px;
	flex-wrap: nowrap;
	overflow-x: auto;
	justify-content: flex-start;
	align-items: flex-start;
}

.list {
	display: flex;
	flex-direction: column;
	margin: 5px;
	min-width: 200px;
	max-width: 200px;
	border-radius: 5px;
	padding: 0 10px 10px 10px;
}

.list:hover {
	border: 2px solid #56af9f;
	background-color: rgb(243, 243, 243);
	cursor: grab;
}

.list:hover.taskHovered {
	background-color: transparent;
	border: 0;
	cursor: default;
}

.taskContainer {
	display: flex;
	flex-direction: column;
	padding-bottom: 10px;
}

.list-title {
	display: inline-block;
	border-radius: 10px;
	padding: 10px;
	font-size: 1.2em;
	font-weight: 900;
	margin-bottom: 10px;
}

.list-header .more {
	display: none;
}

.list-header .more img {
	width: 15px;
}

.list-header:hover .more {
	display: inline-block;
	cursor: pointer;
}

.list-header .more .options {
	background-color: white;
	border-radius: 5px;
	box-shadow: 1px 1px 3px rgb(195, 195, 195);
}

.flip-list-move {
	transition: transform 0.5s;
}

.task {
	background-color: white;
	margin-bottom: 10px;
	border-radius: 5px;
	padding: 10px 15px;
	display: flex;
	justify-content: space-between;
}

.task:hover {
	cursor: grab;
}

.task:hover .buttons {
	display: block;
}

.buttons {
	display: none;
	min-width: 30px;
}

.buttons .button {
	cursor: pointer;
	width: 15px;
	opacity: 0.5;
}

.task-button {
	background-image: url(../../assets/add.png);
	background-color: white;
	background-size: 25px;
	width: 50px;
	height: 50px;
	background-repeat: no-repeat;
	background-position: center center;
	margin-left: auto;
	margin-right: auto;
	border-radius: 50%;
}

.task-button:hover {
	color: #56af9f;
	border: 2px solid #56af9f;
	border-radius: 50%;
	cursor: pointer;
}

.list-button {
	background-image: url(../../assets/add.png);
	background-color: white;
	background-size: 25px;
	width: 50px;
	height: 50px;
	background-repeat: no-repeat;
	background-position: center center;
	margin-left: auto;
	margin-right: auto;
	border-radius: 5px;
}
</style>
