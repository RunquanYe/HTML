/***************************
 * Author: Runquan Ye
 **************************/

<template>
  <v-container>
    <v-form class="login">
      <v-text-field type="text" label="Username/Email" v-model="userEmail"></v-text-field>
      <v-text-field type="password" label="Password" v-model="userPassword"></v-text-field>

      <v-container v-show="isLoggedIn === false">
        <v-row justify="end">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="doSignUp" v-on="on">SignUp</v-btn>
            </template>
            <span>Create New Account</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="doSignIn" v-on="on">SignIn</v-btn>
            </template>
            <span>Login in your Account</span>
          </v-tooltip>

          <v-snackbar v-model="snackbar" v-show="snackbar === true">
            {{ error }}
            <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
          </v-snackbar>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import { AppAUTH } from "../db-init.js";

export default {
  data: function() {
    return {
      userEmail: "",
      userPassword: "",
      error: "",
      snackbar: false,
      isLoggedIn: false
    };
  },
  mounted() {
    AppAUTH.onAuthStateChanged(u => {
      if (u == null) this.isLoggedIn = false;
      else this.isLoggedIn = true;
    });
    // or
    // this.isLoggedIn = u !== null;
  },
  methods: {
    doSignUp() {
      AppAUTH.createUserWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(u => {
          alert("User created with UID " + u.user.uid);
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          // alert(err);
          this.error = err;
          this.snackbar = true;
        });
    },
    doSignIn() {
      AppAUTH.signInWithEmailAndPassword(this.userEmail, this.userPassword)
        .then(u => {
          alert("You logged in as " + u.user.email);
          this.$router.push({ path: "/budget" });
        })
        .catch(err => {
          // alert(err);
          this.error = err;
          this.snackbar = true;
        });
    }
  }
};
</script>

<style scoped>
.login {
  margin-top: 5em;
  padding: 1em;
  width: 50vw;
  border: 2px solid gray;
  border-radius: 2mm;
}
</style>