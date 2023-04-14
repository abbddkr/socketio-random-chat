<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "ChatLayout",
  components: {},
  props: {},
  data() {},
  methods: {},
});
</script>
<template>
  <header>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/chat">Chat</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>

  <b-container class="py-5" id="container" ref="container">
    <router-view />
  </b-container>
</template>

<style scoped></style>
