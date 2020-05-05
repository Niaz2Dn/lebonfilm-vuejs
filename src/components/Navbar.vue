<template>
    <div class="nav">
        <v-app-bar app color="white" v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register'">
            <span class="pt-4 pb-2">
                <img width="130" src="@/assets/logo.png"/>
            </span>
            <v-spacer></v-spacer>
            <div v-if="this.$route.name === 'Home'">
                <v-toolbar-title class="uline ma-2 font-weight-medium subtitle-1">Home</v-toolbar-title>
            </div>
            <div v-else>
                <v-toolbar-title class="ma-2 font-weight-medium subtitle-1">
                    <router-link class="rt" :to="{name: 'Home'}">Home</router-link>
                </v-toolbar-title>
            </div>
            <div v-if="this.$route.name === 'Profile'">
                <v-toolbar-title class="uline ma-2 font-weight-medium subtitle-1">{{ username }}</v-toolbar-title>
            </div>
            <div v-else>
                <v-toolbar-title class="ma-2 font-weight-medium subtitle-1">
                <router-link class="rt" :to="{name: 'Profile', params: { username: this.username }}">{{ username }}</router-link>
                </v-toolbar-title>
            </div>
            <v-spacer></v-spacer>
            <v-text-field class="search-bar mt-6 mr-2" prepend-icon="mdi-magnify" placeholder="Find movies..." dense outlined single-line flat ref="searchTitle" v-model="searchTitle" v-on:keyup.enter="search" color="light-blue"></v-text-field>
            <v-btn large icon @click="logout" color="grey">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-footer absolute padless class="font-weight-medium" color="transparent">
            <v-col class="text-center grey--text" cols="12"><strong>&copy; 2020 Master STL #PC3R </strong>Project by Mohamed Nizamuddin & Skander Sersi</v-col>
        </v-footer>
    </div>
</template>

<script>
import axios from "axios"

export default {
    data() {
        return {
            username: "",
            searchTitle: "",
            isConnectedUrl: "https://lebonfilm-prod.herokuapp.com/isConnected",
            logoutUrl: "https://lebonfilm-prod.herokuapp.com/logoutUser"
        };
    },
    mounted() {
        this.isConnected();
    },
    methods: {
        search() {
            if ( this.searchTitle && this.searchTitle !== this.$route.params.name) {
                this.$router.push({
                    path: "/search/" + this.searchTitle
                });
            }
        },
        isConnected() {
            setInterval(() => {
                axios
                    .get(this.isConnectedUrl)
                    .then(res => {
                        if (res.data.result && !this.username) {
                            this.username = res.data.result.username
                        } else {
                            if (this.$route.name === 'Movie' || this.$route.name === 'Home' || this.$route.name === 'Search' || this.$route.name === 'Profil') {
                                this.$router.push({
                                    name: "Login"
                                });
                            }
                        }
                    })
                    .catch((err) => console.log(err));
            }, 2000);
        },
        logout() {
            axios
                .get(this.logoutUrl)
                .then(res => {
                    if (res.data.message) {
                        this.$router.push({
                            name: "Login"
                        });
                    }
                });
        }
    }
};
</script>

<style scoped>
.rt {
    text-decoration: none;
    display: block;
    color: black;
}
.rt:hover {
    text-decoration: none;
    color: #03a9f4;
}
.search-bar {
    width: 20px;
}
.uline {
    box-shadow: inset 0 -3px 0 0 #03a9f4;
}
</style>
