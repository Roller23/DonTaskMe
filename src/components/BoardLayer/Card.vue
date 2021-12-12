<template>
	<div class="overlay" @click.stop="unselect($event)">
		<transition name="section" mode="out-in" appear>
			<div class="card">
				<h1>{{ this.title }}</h1>
				<div class="inside">
					<textarea
						v-model="this.description"
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
							<div class="comment" />
						</div>
						<textarea
							class="comment"
							oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
							v-on:keyup.enter="sendComment"
							v-model="comment"
						></textarea>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
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
				console.log(this.responseText);
				let res = JSON.parse(this.responseText);
				let attachment = new File(
					res.uid,
					res.storagePath,
					res.filename
				);
				console.log(attachmentList);
				attachmentList.push(attachment);
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
			window.open(file.storagePath, "_blank").focus(); // TODO: php path na poczatek
		},
		async sendComment() {
			if (this.comment === "") {
				return;
			}
			const body = { content: this.comment };
			const res = await this.request(`/cards/${this.card.uid}/comment`, {
				method: "POST",
				body,
			});
			if (res.status === 201) {
				const json = await res.json();
				console.log(json);
				let comment = new Comment(
					json.uid,
					json.content,
					json.date,
					json.username
				);
				this.comments.push(comment);
			} else {
				alert("Could not add the task");
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

.inside {
	overflow-y: hidden;
}

.card .inside div > *:not(:first-child) {
	color: white;
}

.inside > textarea {
	height: 200px;
	border: none;
}

textarea {
	background-color: rgba(255, 255, 255, 0);
	color: white;
	resize: none;
	width: 100%;
	outline: 0;
}

.inside > textarea:focus {
	background-color: rgba(255, 255, 255, 0.137);
	border: 0px;
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

.comments > textarea {
	border-width: 0 0 2px;
	border-color: #56af9f;
	background-color: rgba(255, 255, 255, 0);
}

@keyframes slideIn {
	from {
		right: -100%;
	}
	to {
	}
}
</style>
