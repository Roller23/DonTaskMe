<template>
	<transition name="fade" mode="out-in">
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
			<h1>{{ currentBoard.title }}</h1>
			<div class="list-wrap">
				<draggable
					class="listContainer"
					ghost-class="border-ghost"
					:list="lists"
					:group="{ name: 'lists' }"
					item-key="uid"
					tag="transition-group"
					:component-data="{ tag: 'div', name: 'flip-list' }"
				>
					<template #item="list">
						<div
							class="list"
							@mouseleave="showListOptions(list.element, true)"
						>
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
										alt="More list options"
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
											@click="
												deleteList(
													list.index,
													list.element
												)
											"
										>
											Delete
										</div>
									</div>
								</div>
							</div>
							<div class="task-container">
								<draggable
									class="task-container"
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
													@click="
														editTask(
															list.index,
															task
														)
													"
												/>
												<img
													src="@/assets/delete.png"
													alt="Delete button"
													class="button"
													@click="
														deleteTask(
															list.element,
															task.element
														)
													"
												/>
											</div>
										</div>
									</template>
								</draggable>
							</div>
							<div
								class="task-button"
								@click.stop="createTask(list.element)"
							></div>
						</div>
					</template>
				</draggable>
			</div>
		</div>
	</transition>
</template>

<script>
import draggable from "vuedraggable";

class Task {
	constructor(title, uid) {
		this.title = title;
		this.uid = uid;
	}
}

class List {
	constructor(title, uid, ...tasks) {
		this.title = title;
		this.uid = uid;
		this.tasks = [];
		this.addTasks(...tasks);
		this.optionsOpen = false;
	}
	addTasks(...tasks) {
		this.tasks.push(...tasks);
		return this;
	}
}
export default {
	name: "BoardLayer",
	components: { draggable },
	data() {
		return {
			lists: [],
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
			const body = { title, index: this.lists.length };
			const res = await this.request(`/lists/${this.currentBoard.uid}`, {
				method: "POST",
				body,
			});
			if (res.status === 201) {
				const json = await res.json();
				const list = new List(json.title, json.uid);
				this.lists.push(list);
			} else {
				alert("Could not add the list");
			}
		},
		async createTask(list) {
			const title = prompt("Task title");
			if (title === "") {
				return alert("Title cannot be empty");
			}
			if (title === null) {
				return;
			}
			const body = { title, index: list.tasks.length, listUid: list.uid };
			const res = await this.request("/cards", { method: "POST", body });
			if (res.status === 201) {
				const json = await res.json();
				console.log(json);
				list.addTasks(new Task(json.title, json.uid));
			} else {
				alert("Could not add the task");
			}
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
		async deleteTask(list, task) {
			if (!confirm(`Are you sure you want to delete ${task.title}?`)) return;
			const res = await this.request(`/cards/${list.uid}/${task.uid}`, {
				method: "DELETE",
			});
			if (res.status === 202) {
				const index = list.tasks.indexOf(task);
				if (index !== -1) {
					list.tasks.splice(index, 1);
				}
			} else {
				alert("Could not delete the task");
			}
		},
		showListOptions(selectedList, hide) {
			if (hide) {
				for (const list of this.lists) {
					list.optionsOpen = false;
				}
				return;
			}
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
		async deleteList(listId, list) {
			if (!confirm(`Are you sure you want to delete ${list.title}?`)) return;
			const res = await this.request(`/lists/${list.uid}`, {
				method: "DELETE",
			});
			if (res.status === 202) {
				const index = this.lists.indexOf(list);
				if (index !== -1) {
					this.lists.splice(index, 1);
				}
			} else {
				alert("Could not delete the list");
			}
		},
		goBack() {
			this.currentBoard = null;
			setTimeout(this.listeners.showWorkspaces, 500);
		},
	},
	mounted() {
		this.listeners.loadBoard = async (board) => {
			console.log(board);
			this.currentBoard = board;
			this.lists.splice(0); // clear the array to remove leftover lists
			const res = await this.request(`/lists/${this.currentBoard.uid}`);
			if (res.status === 200) {
				const lists = await res.json();
				console.log(lists);
				for (const list of lists) {
					const newList = new List(list.title, list.uid);
					for (const card of list.cards || []) {
						newList.addTasks(new Task(card.title, card.uid));
					}
					this.lists.push(newList);
				}
			} else {
				alert("Could not load the board");
				window.location.reload();
			}
		};
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
	background-image: url("../../assets/bg11.jpg");
	background-size: cover;
	background-position: center top;
	overflow-y: auto;
	display: grid;
	column-gap: 10px;
	grid-template-columns: 100px auto;
	grid-template-rows: 100px auto;
	grid-template-areas:
		"side top"
		"side lists";
}
.layer h1 {
	margin-left: 20px;
	line-height: 58px;
	color: white;
}
.side-wrap {
	grid-area: side;
	vertical-align: middle;
	background-color: rgb(36, 36, 36);
	display: grid;
	column-gap: 10px;
	grid-template-rows: 100px auto;
	justify-items: center;
}
.side-wrap .go-back {
	width: 40px;
	cursor: pointer;
	filter: invert(100%);
	align-self: center;
}
.list-button {
	background-image: url(../../assets/add.png);
	background-color: white;
	background-size: 25px;
	width: 75px;
	height: 50px;
	background-repeat: no-repeat;
	background-position: center center;
	margin-left: auto;
	margin-right: auto;
	border-radius: 5px;
}
.list-button:hover {
	border: 2px solid #56af9f;
	cursor: pointer;
}
.list-wrap {
	overflow-x: hidden;
}
.listContainer {
	grid-area: lists;
	display: flex;
	padding-right: 50px;
	flex-wrap: nowrap;
	overflow-x: auto;
	height: 100%;
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
	cursor: grab;
}
.task-container {
	display: flex;
	flex-direction: column;
	padding-bottom: 25px;
}
.list-title {
	display: inline-block;
	border-radius: 10px;
	padding: 10px;
	font-size: 1.2em;
	font-weight: 900;
	margin-bottom: 10px;
	color: white;
}
.list-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.list-header .more {
	visibility: hidden;
	align-self: flex-start;
	margin-top: 15px;
}
.list-header .more img {
	width: 15px;
	filter: invert(100%);
}
.list:hover .list-header .more {
	visibility: visible;
	cursor: pointer;
	position: relative;
}
.list-header .more .options {
	background-color: white;
	border-radius: 5px;
	box-shadow: 1px 1px 3px rgb(195, 195, 195);
	position: absolute;
	top: 10px;
	left: 120%;
	padding: 10px;
}
.options .delete {
	padding: 5px;
	color: red;
}
.options .delete:hover {
	color: white;
	background-color: red;
}
.options .edit {
	padding: 5px;
	color: #56af9f;
}
.options .edit:hover {
	color: white;
	background-color: #56af9f;
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
	background-color: rgb(243, 243, 243);
}
.task:hover .buttons {
	visibility: visible;
}
.buttons {
	visibility: hidden;
	min-width: 30px;
}
.buttons .button {
	cursor: pointer;
	width: 15px;
	opacity: 0.5;
	margin-left: 5px;
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
.border-ghost {
	border: 2px dashed white;
}
.fade-leave-active {
	animation: slide 1.5s;
}
.fade-leave-to {
}
@keyframes slide {
	0% {
	}
	50% {
		transform: translateX(50%) translateX(-35%);
	}
	100% {
		opacity: 0;
	}
}
</style>
