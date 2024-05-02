<script setup lang="ts">
import {RouterView} from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import {Notification, Notivue} from "notivue";
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item"/>
  </Notivue>
  <NavBar />
  <RouterView/>
</template>
