/***************************
 * Author: Runquan Ye
 **************************/
 
<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn color="orange darken-1" dark v-on="on" v-show="isLoggedIn === true">SignOut</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Sign out confirm</v-card-title>
          <v-card-text>Are you sure for exiting?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
            <v-btn color="green darken-1" text @click="signOut">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <v-btn @click="signOut" v-show="isLoggedIn === true">SignOut</v-btn> -->
    </v-app-bar>

    <!-- <v-content> -->
    <transition name="slide">
      <router-view />
    </transition>
    <!-- </v-content> -->
  </v-app>
</template>

<script>
import { AppAUTH } from "./db-init.js";

export default {
  name: "App",

  components: {},

  data: () => ({
    isLoggedIn: false,
    dialog: false
  }),
  mounted() {
    AppAUTH.onAuthStateChanged(u => {
      if (u == null) this.isLoggedIn = false;
      else this.isLoggedIn = true;
    });
  },
  methods: {
    signOut() {
      this.dialog = false;
      AppAUTH.signOut().then(() => {
        this.$router.back(); // same effect as pressing the BACK browser button
      });
    }
  }
};
</script>
