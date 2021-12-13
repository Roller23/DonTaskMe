<template>
    <div class="overlay" @click.stop="unselect($event)">
        <transition name="section" mode="out-in" appear>
            <div class="card">
                <textarea
                    class="title"
                    ref="titleInput"
                    @blur="editCard($event, 'titleInput')"
                    v-on:input="resizeTextarea('titleInput')"
                    v-on:keydown.enter="editCard($event, 'titleInput')"
                    v-model="this.title"
                />
                <div class="inside" ref="inside">
                    <textarea
                        ref="descriptionInput"
                        v-model="this.description"
                        v-on:input="resizeTextarea('descriptionInput')"
                        @blur="editCard($event, 'descriptionInput')"
                        v-on:keydown.enter="
                            editCard($event, 'descriptionInput')
                        "
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
                                <div
                                    class="file"
                                    @click.stop="showFile(file)"
                                    :style="[
                                        file.storagePath.match(
                                            /.(jpg|jpeg|png|gif)$/i
                                        )
                                            ? {
                                                  'background-image':
                                                      'url(' +
                                                      file.storagePath +
                                                      ')',
                                                  'background-size': 'cover',
                                              }
                                            : { background: 'white' },
                                    ]"
                                >
                                    <span>{{ file.filename }}</span>
                                    <img
                                        src="@/assets/delete.png"
                                        alt="Delete button"
                                        class="button"
                                        @click.stop="deleteFile(file.uid)"
                                    />
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
                <div
                    class="new-comment"
                    @dragover.prevent="this.dragoveringComment = true"
                    @dragleave="this.dragoveringComment = false"
                    @drop.prevent="
                        this.prepareUpload = true;
                        dropFile($event);
                    "
                >
                    <div v-if="dragoveringComment" class="file-drop">
                        Drop your files!
                    </div>
                    <div v-else class="comment-input-area">
                        <textarea
                            class="comment-input"
                            ref="commentInput"
                            v-on:input="resizeTextarea('commentInput')"
                            v-on:keydown.enter="sendComment"
                            v-model="comment"
                            placeholder="Share your opinion, I like it..."
                        ></textarea>
                        <img
                            src="@/assets/attachment.png"
                            alt="Attach button"
                            class="button"
                            @click.stop="attachFile"
                        />
                        <span class="prepare" v-if="ifPreparingUpload()"
                            >+</span
                        >
                        <img
                            src="@/assets/send.png"
                            alt="Send button"
                            class="button"
                            @click.stop="sendComment"
                        />
                    </div>
                </div>
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
            dragoveringComment: false,
            prepareUpload: false,
        };
    },
    methods: {
        unselect(e) {
            if (e.target.className === "overlay")
                this.$emit("unselected", {
                    title: this.title,
                    description: this.description,
                    files: this.files,
                    comments: this.comments,
                });
        },
        toggleAttachments() {
            this.showAttachments = !this.showAttachments;
        },
        triggerUpload() {
            this.$refs.file.click();
        },
        dropFile(e) {
            this.$refs.file.files = e.dataTransfer.files;
            this.uploadFile();
            this.dragovering = false;
            this.dragoveringComment = false;
        },
        async uploadFile() {
            if (this.prepareUpload) return;
            const files = this.$refs.file.files;
            if (files.length === 0) {
                return await this.alert("No files selected");
            }
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
            window.open(file.storagePath, "_blank"); // TODO: set in PHP that link forces download
        },
        formatDate(date) {
            return moment(date * 1000).fromNow();
        },
        resizeTextarea(inputName) {
            const input = this.$refs[inputName];
            if (
                parseInt(input.style.height) <= 100 ||
                parseInt(input.style.height) >= 250
            ) {
                return;
            }
            input.style.height = "auto";
            input.style.height = input.scrollHeight * 2 + "px";
        },
        async editCard(e, inputName) {
            if (e.shiftKey) return;
            e.preventDefault();
            if (inputName) this.$refs[inputName].blur();
            const body = { title: this.title, description: this.description };
            console.log(body);
            await this.request(`/cards/${this.card.uid}`, {
                method: "PUT",
                body,
            });
        },
        attachFile() {
            this.triggerUpload();
            if (this.$refs.file.files) this.prepareUpload = true;
        },
        ifPreparingUpload() {
            return !!this?.$refs?.file?.files.length;
        },
        async sendComment(e) {
            if (e.shiftKey) return;
            e.preventDefault();
            this.prepareUpload = false;
            this.$refs.commentInput.blur();
            if (this.comment === "") {
                return;
            }
            const body = { content: this.comment };
            const res = await this.request(`/cards/${this.card.uid}/comment`, {
                method: "POST",
                body,
            });
            if (res.status === 201) {
                this.uploadFile();
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
        async deleteFile(fileUid) {
            if (
                !(await this.confirm(
                    `Are you sure you want to delete this file?`
                ))
            )
                return;
            const res = await this.request(
                `/cards/${this.card.uid}/upload/${fileUid}`,
                {
                    method: "DELETE",
                }
            );
            if (res.status === 202) {
                const index = this.files.findIndex(
                    (file) => file.uid === fileUid
                );
                this.files.splice(index, 1);
            } else {
                await this.alert("Could not delete file"); //TODO: doesn't work, pewnie potrzebuje tych modali
            }
        },
    },
    mounted() {
        this.resizeTextarea("titleInput");
        this.resizeTextarea("descriptionInput");
        this.resizeTextarea("commentInput");
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

textarea {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: rgba(255, 255, 255, 0);
    color: white;
    resize: none;
    width: 100%;
    min-height: 50px;
    outline: 0;
    overflow-y: auto;
    max-height: 250px;
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
    padding-right: 30px;
}

.card .inside div > *:not(:first-child) {
    color: white;
}

.inside > textarea {
    min-height: 200px;
    border: none;
}

.inside > textarea:focus {
    background-color: rgba(255, 255, 255, 0.137);
}

.attachments > h3 {
    margin-right: 10px;
    display: inline-block;
}

.file-drop {
    min-height: 100px;
    background-color: rgba(255, 255, 255, 0.137);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.attachments .file-container {
    margin-bottom: 20px;
    margin-right: 10px;
    display: flex;
    flex-wrap: wrap;
}

.attachments .file {
    margin: 5px;
    width: 75px;
    height: 50px;
    border-radius: 5px;
    overflow-y: clip;
    position: relative;
}
.attachments span {
    position: absolute;
    bottom: 0;
    font-size: 0.8em;
    color: black;
    background-color: white;
}

.attachments .file > .button {
    position: absolute;
    background-color: rgb(143, 0, 0);
    padding: 3px;
    cursor: pointer;
    width: 15px;
    top: 0;
    right: 0;
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

.comment-input-area {
    position: relative;
    display: grid;
    grid-template-columns: 90% auto;
    grid-template-areas:
        "input attach"
        "input send";
}

.comment-input-area .button {
    background-color: #56af9f;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    width: 25px;
    place-self: center;
}

.comment-input-area .button:hover {
    background-color: #6ad8c4;
}

.comment-input-area .prepare {
    position: absolute;
    top: 0;
    right: 0;
}

.comment-input {
    grid-area: input;
    border-width: 0 0 2px;
    border-color: #56af9f;
    background-color: rgba(255, 255, 255, 0);
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.comment-input:focus {
    background-color: rgba(255, 255, 255, 0.137);
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
