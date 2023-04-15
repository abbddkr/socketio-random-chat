<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { state, socket, customIO } from "@/helpers/socketio";
import api from "@/helpers/api";

export default defineComponent({
  name: "RandomChatView",
  layout: "guest",
  data() {
    return {
      message: {
        roomId: "",
        sender: "",
        gender: "",
        content: "",
        date: "",
      },
      disabled: false,
      messages: Array(),
      overlay: false,
      chatReady: false,
      roomId: "",
      isLeft: false,
      isWaiting: false,
      isTyping: false,
      timeout: null,
      me: {},
    };
  },
  methods: {
    newChat() {
      let nickname = JSON.parse(localStorage.getItem("user") || "").data
        .nickname;
      socket.emit("userDisconnected", { roomId: this.roomId, nickname });
      socket.disconnect();
      window.location.reload();
    },
    getGenderAvatar(gender: string) {
      return gender === "male"
        ? "/src/assets/male.png"
        : "/src/assets/female.png";
    },
    sendMessage() {
      const nickname = JSON.parse(localStorage.getItem("user") || "").data
        .nickname;
      const gender = JSON.parse(localStorage.getItem("user") || "").data.gender;
      const date: Date = new Date();

      this.disabled = true;
      this.message.roomId = this.roomId;
      this.message.sender = nickname;
      this.message.gender = gender;
      this.message.date = date.toLocaleTimeString();

      if (socket.emit("message", this.message)) {
        this.messages.push({
          id: "uniqueKey", // just to escape type-checkers
          sender: "me",
          gender: this.message.gender,
          message: this.message.content,
          roomId: this.roomId,
          date: date.toLocaleTimeString(),
        });
        this.disabled = false;

        this.message = {
          roomId: "",
          sender: "",
          gender: "",
          content: "",
          date: "",
        };
      }
    },
    startRandomChat() {
      const id = JSON.parse(localStorage.getItem("user") || "").data.id;
      this.overlay = true;

      socket.emit("join", id, () => {
        this.overlay = false;
      });
    },
    handleMessage() {
      socket.emit("typing", { roomId: this.roomId, typing: true });

      setTimeout(() => {
        socket.emit("typing", { roomId: this.roomId, typing: false });
      }, 2000);
    },
    async verifyGuestUser() {
      const res = await api.post(
        "/users/verify_guest",
        JSON.parse(localStorage.getItem("user") || "")?.data
      );
      if (!res.data) {
        this.$router.push({ path: "/" });
      }
      return true;
    },
  },
  mounted() {
    // write your own middleware
    this.verifyGuestUser();

    socket.on("matched", (msg) => {
      this.roomId = msg.roomId;
      this.overlay = false;
      this.chatReady = true;
    });

    // display welcoming message
    socket.on("waiting", () => {
      this.isWaiting = true;
      setTimeout(() => {
        this.isWaiting = false;
      }, 4000);
    });

    // stranger's message received
    socket.on("message", (msg) => {
      this.messages.push({
        gender: msg.gender,
        sender: msg.sender,
        message: msg.content,
        roomId: msg.roomId,
        date: msg.date,
      });
    });

    socket.on("typing", (data) => {
      if (data) {
        this.isTyping = true;
      } else {
        this.isTyping = false;
      }
    });

    socket.on("userDisconnected", (data) => {
      this.messages = [];
      this.isLeft = true;
      this.chatReady = false;
    });
  },
});
</script>

<template>
  <b-row>
    <b-col class="chat-area">
      <b-overlay :show="overlay">
        <template #overlay>
          <div class="text-center mt-5">
            <p id="cancel-label">Joining a random chat...</p>
            <p id="cancel-label">Please Wait</p>
          </div>
        </template>
        <b-card
          header="Chat Planet / Random Chat"
          class="messages-card"
          ref="chatBox"
          style="height: 440px; overflow-y: auto"
        >
          <div class="alert alert-primary" v-if="isWaiting">
            A Random user has joined the chat
            <br />
            <b>Say Hi!</b>
          </div>
          <div class="alert alert-primary" v-if="isLeft">
            a Stranger Left The Chat
            <br />
          </div>
          <div class="messages" v-for="message in messages" :key="message.id">
            <div class="single-message d-flex align-items-center">
              <b-avatar :src="getGenderAvatar(message.gender)"></b-avatar>
              <p class="m-3">
                <b class="single-message-sender">{{ message.sender }}</b>
                <span class="single-message-date">{{ message.date }}</span>
                <br />
                <span class="single-message-body">
                  {{ message.message }}
                </span>
              </p>
            </div>
            <hr />
          </div>
          <div v-if="isTyping" class="typing-message">
            <p>Typing...</p>
          </div>
        </b-card>
        <b-form @submit.prevent="" class="message-form d-flex">
          <b-input-group>
            <template #prepend>
              <b-input-group-text> </b-input-group-text>
            </template>
            <b-form-input
              @input="handleMessage"
              placeholder="Message @Stranger"
              :disabled="!chatReady"
              v-model="message.content"
            ></b-form-input>
            <template #append>
              <div v-if="chatReady">
                <b-button-group>
                  <b-button
                    :disabled="disabled"
                    type="button"
                    @click="sendMessage"
                    variant="primary"
                  >
                    Send
                  </b-button>
                  <b-button
                    :disabled="disabled"
                    type="button"
                    @click="newChat"
                    variant="danger"
                  >
                    New Chat
                  </b-button>
                </b-button-group>
              </div>
              <div v-else>
                <button
                  :disabled="disabled"
                  type="button"
                  @click="startRandomChat"
                  class="btn btn-primary"
                >
                  Join Random Chat
                </button>
              </div>
            </template>
          </b-input-group>
        </b-form>
      </b-overlay>
    </b-col>
  </b-row>
</template>
<style scoped>
.chat-area {
  height: 400px;
}

.single-message {
}

.message-form {
  width: 100%;
}

.receiver {
  background-color: #f3f3f3;
  margin-top: 5px;
}

.sender {
  margin-top: 5px;
}

.available-users {
  list-style: none;
}

.user-lists {
  background-color: #f3f3f3;
  overflow-y: scroll;
  height: 550px;
}

.messages-card {
  background: #313338;
  color: #eeecec;
  font-weight: lighter;
}

.single-message-body {
  font-size: 13px;
}

.single-message-sender {
  font-size: 14px;
  font-weight: bold;
}

.single-message-date {
  font-size: 10px;
  font-size: lighter;
  margin-left: 5px;
}

.typing-message {
  position: absolute;
  bottom: 0;
}
</style>
