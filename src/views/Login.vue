<template>
    <v-container :style="{ backgroundImage: 'url(' + require('@/assets/landingLogin.jpg') + ')' }" class="background-img" fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card raised>
                    <v-card-title class="justify-center">
                        <img class="ma-8" width="300" src="@/assets/logo.png" />
                    </v-card-title>
                    <v-toolbar color="light-blue" dark flat>
                        <v-spacer></v-spacer>
                        <v-toolbar-title class="headline font-weight-black">Le bon film pour vous.</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field color="black" ref="username" v-model="form['username']" label="Username" type="text" :rules="[rules.required]"></v-text-field>
                            <v-text-field color="black" ref="password" v-model="form['password']" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                        </v-form>
                        <div class="mb-4">
                            <v-alert dense v-if="error" text color="error">{{ errorMessage }}</v-alert>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="login" color="light-blue" class="mr-4 white--text">
                            <div class="font-weight-black subtitle-1">Login</div>
                        </v-btn>
                        <router-link class="sign-up-btn ma-4" :to="{name: 'Register'}">Sign up</router-link>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data: function() {
        return {
            form: {},
            errorMessage: "",
            error: false,
            rules: {
                required: value => !!value || "Required."
            },
            loginUserUrl: "https://lebonfilm-prod.herokuapp.com/loginUser"
        };
    },
    methods: {
        login() {
            this.error = false;
            this.errorMessage = "";
            if (!(this.form["username"] && this.form["password"])) {
                this.$refs["username"].validate(true);
                this.$refs["password"].validate(true);
            } else {
                axios
                .post(
                    this.loginUserUrl,
                    {
                        username: this.form["username"],
                        password: this.form["password"]
                    }
                )
                .then(() => {
                    this.$router.push({
                        name: "Home"
                    });
                })
                .catch(err => {
                    this.error = true;
                    this.errorMessage = err.data.error_message;
                })
            }
            setTimeout(() => {this.error = false;}, 6000);
        }
    }
};
</script>

<style scoped>
.background-img {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
.sign-up-btn {
    text-decoration: none;
    display: block;
    color: #03a9f4;
}
.sign-up-btn:hover {
    text-decoration: underline;
    color: #03a9f4;
}
</style>
