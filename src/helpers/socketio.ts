import { reactive } from "vue";
import { io, Socket } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL: any = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL);
export const customIO = io;
