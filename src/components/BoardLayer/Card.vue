<template>
	<div class="overlay" @click.stop="unselect($event)">
		<transition name="section" mode="out-in" appear>
			<div class="card">
				<textarea
					class="title"
					v-on:keydown.enter.prevent="editCard"
					v-model="this.title"
					oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
				/>
				<div class="inside" ref="inside">
					<textarea
						v-model="this.description"
						v-on:keydown.enter.prevent="editCard"
						placeholder="Oh please, tell me more..."
					/>
					<div
						class="attachments"
						@dragover.prevent="this.dragovering = true"
						@dragleave="this.dragovering = false"
						@drop.prevent="dropFile"
					>
						<h3>Attachments</h3>
						<input
							v-show="false"
							type="file"
							multiple
							@change="uploadFile"
							ref="file"
						/>
						<div v-if="dragovering" class="file-drop">
							Drop your files!
						</div>
						<div v-else class="file-container">
							<div v-for="file in files" v-bind:key="file.uid">
								<div class="file" @click.stop="showFile(file)">
									{{ file.filename }}
								</div>
							</div>
							<div
								class="file file-button"
								@click.stop="triggerUpload"
							></div>
						</div>
					</div>
					<div class="comments">
						<h3>Comments</h3>
						<div
							v-for="comment in comments"
							v-bind:key="comment.uid"
						>
							<div class="author">
								{{ comment.username }}
								<span class="date">{{
									formatDate(comment.date)
								}}</span>
							</div>
							<div class="comment">{{ comment.content }}</div>
						</div>
					</div>
				</div>
				<textarea
					class="comment-input"
					ref="commentInput"
					v-on:input="resizeTextarea"
					v-on:keydown.enter="sendComment"
					v-model="comment"
				></textarea>
			</div>
		</transition>
	</div>
</template>

<script>
import moment from "moment";

class Comment {
	constructor(uid, content, date, username) {
		this.uid = uid;
		this.content = content;
		this.date = date;
		this.username = username;
	}
}

class File {
	constructor(uid, storagePath, filename) {
		this.uid = uid;
		this.storagePath = storagePath;
		this.filename = filename;
	}
}

export default {
	name: "Card",
	props: ["card"],
	data() {
		return {
			title: this.card.title,
			description: this.card.description,
			files: this.card.files || [],
			comments: this.card.comments || [],
			comment: "",
			dragovering: false,
		};
	},
	methods: {
		unselect(e) {
			if (e.target.className === "overlay") this.$emit("unselected");
			// this.$emit(
			// 	"unselected",
			// 	new Card(
			// 		this.title,
			// 		this.description,
			// 		this.files,
			// 		this.comments
			// 	)
			// );
		},
		toggleAttachments() {
			this.showAttachments = !this.showAttachments;
		},
		triggerUpload() {
			this.$refs.file.click();
		},
		dropFile(e) {
			console.log("drop");
			this.$refs.file.files = e.dataTransfer.files;
			this.uploadFile();
			this.dragovering = false;
		},
		async uploadFile() {
			const files = this.$refs.file.files;
			if (files.length === 0) {
				return await this.alert("No files selected");
			}
			console.log(files);
			const xhr = new XMLHttpRequest();
			xhr.onerror = async (e) => {
				console.log(e);
				await this.alert("An error occured");
			};
			xhr.upload.onprogress = function(e) {
				console.log(e);
			};
			const attachmentList = this.files;
			xhr.onload = function() {
				if (this.status === 202) {
					let res = JSON.parse(this.responseText);
					let attachment = new File(
						res.uid,
						res.storagePath,
						res.filename
					);
					attachmentList.push(attachment);
				} else {
					alert("Could not add the file");
				}
			};
			const data = new FormData();
			data.append("file", files[0]);
			data.append("token", localStorage.token);
			xhr.open(
				"POST",
				`${this.backendUrl}/cards/${this.card.uid}/upload`,
				true
			);
			xhr.send(data);

			this.$refs.file.value = "";
		},
		showFile(file) {
			window.open(file.storagePath, "_blank").focus();
		},
		formatDate(date) {
			return moment(date * 1000).fromNow();
		},
		resizeTextarea() {
			const input = this.$refs.commentInput;
			if (input.scrollHeight <= 100) return;
			input.style.height = input.scrollHeight * 2 + "px";
		},
		async editCard() {
			const body = { title: this.title, description: this.description };
			console.log(body);
			await this.request(`/cards/${this.card.uid}`, {
				method: "PUT",
				body,
			});
		},
		async sendComment(e) {
			if (e.shiftKey) return;
			e.preventDefault();
			if (this.comment === "") {
				return;
			}
			const body = { content: this.comment };
			const res = await this.request(`/cards/${this.card.uid}/comment`, {
				method: "POST",
				body,
			});
			if (res.status === 201) {
				this.comment = "";
				const json = await res.json();
				console.log(json);
				let comment = new Comment(
					json.uid,
					json.content,
					json.date,
					json.username
				);
				this.comments.push(comment);
				setTimeout(() => {
					this.$refs.inside.scroll({
						top: 100000000,
						behavior: "smooth",
					});
				}, 0);
			} else {
				await this.alert("Could not add the comment");
			}
		},
	},
};
</script>

<style scoped>
.overlay {
	position: fixed;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.764);
}

.card {
	position: absolute;
	right: 0;
	background-color: rgb(36, 36, 36);
	height: 100%;
	width: 35%;
	border-radius: 40px 0 0 40px;
	color: #56af9f;
	display: flex;
	flex-direction: column;
	padding: 30px;
}

.card .title {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	font-weight: bold;
	background-color: rgba(255, 255, 255, 0);
	border: none;
	color: #56af9f;
	outline: 0;
	margin-bottom: 20px;
	font-size: 2em;
}

.card .title:focus {
	background-color: rgba(255, 255, 255, 0.137);
}

.inside {
	overflow-y: auto;
	margin-bottom: 10px;
}

.card .inside div > *:not(:first-child) {
	color: white;
}

.inside > textarea {
	height: 200px;
	border: none;
}

textarea {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	background-color: rgba(255, 255, 255, 0);
	color: white;
	resize: none;
	width: 100%;
	outline: 0;
}

.inside > textarea:focus {
	background-color: rgba(255, 255, 255, 0.137);
}

.attachments > h3 {
	margin-right: 10px;
	display: inline-block;
}

.attachments .file-drop {
	min-height: 100px;
	background-color: rgba(255, 255, 255, 0.137);
	display: flex;
	align-items: center;
	justify-content: center;
}

.attachments .file-container {
	margin-bottom: 20px;
	display: flex;
	flex-wrap: wrap;
}

.attachments .file {
	margin: 5px;
	width: 75px;
	height: 50px;
	border-radius: 5px;
	background-color: white;
	padding-left: 5px;
	color: rgb(118, 118, 118);
	overflow: hidden;
}

.file-button {
	background-image: url(../../assets/add.png);
	background-color: white;
	background-size: 25px;
	background-repeat: no-repeat;
	background-position: center center;
}

.file-button:hover {
	border: 2px solid #56af9f;
	cursor: pointer;
}

.section-enter-active {
	animation: slideIn 0.5s ease-out;
}

.comments {
	display: flex;
	flex-direction: column;
	align-content: space-between;
}

.comment-input {
	border-width: 0 0 2px;
	border-color: #56af9f;
	background-color: rgba(255, 255, 255, 0);
	height: 100px;
	font-family: Arial, Helvetica, sans-serif;
}

.comments .comment {
	margin: 10px 0px;
	white-space: pre-wrap;
	word-break: break-word;
	background: #434343;
	border-radius: 15px;
	padding: 5px 10px;
	border-right: 3px solid rgba(255, 255, 255, 0.137);
	border-bottom: 3px solid rgba(255, 255, 255, 0.137);
}

.comments .author {
	font-weight: bold;
	color: #56af9f;
}

.comments .author .date {
	font-weight: normal;
	font-size: 12px;
	color: gray;
	float: right;
	line-height: 20px;
}

@keyframes slideIn {
	from {
		right: -100%;
	}
	to {
	}
}
</style>
