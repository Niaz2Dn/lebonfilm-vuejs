<template>
    <div class="nav">
        <v-app-bar app color="white" v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register'">
            <span class="pt-4 pb-2">
                <img @click="drawer = !drawer" width="130" src="@/assets/logo.png"/>
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
            <div v-if="this.$route.path === '/profil/' + this.username">
                <v-toolbar-title class="uline ma-2 font-weight-medium subtitle-1">{{ username }}</v-toolbar-title>
            </div>
            <div v-else>
                <v-toolbar-title v-if="this.username" class="ma-2 font-weight-medium subtitle-1">
                <router-link class="rt" :to="{name: 'Profil', params: { username: this.username }}">{{ username }}</router-link>
                </v-toolbar-title>
            </div>
            <v-spacer></v-spacer>
            <v-text-field class="search-bar mt-6 mr-2" prepend-icon="mdi-magnify" placeholder="Find movies..." dense outlined single-line flat ref="searchTitle" v-model="searchTitle" v-on:keyup.enter="search" color="light-blue"></v-text-field>
            <v-btn large icon @click="logout" color="grey">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <div class="text-center grey--text font-weight-medium">Users</div>
            <v-divider></v-divider>
            <v-list>
            <v-list-item v-for="user in users" :key="user">
                <v-list-item-content>
                    <router-link class="titre" :title="user" :to="{name: 'Profil', params: { username: user }}">
                        <v-list-item-title class="font-weight-medium">{{ user }}</v-list-item-title>
                    </router-link>
                </v-list-item-content>
            </v-list-item>

            </v-list>

        </v-navigation-drawer>
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
            drawer: false,
            searchTitle: "",
            isConnectedUrl: "https://lebonfilm-prod.herokuapp.com/isConnected",
            logoutUrl: "https://lebonfilm-prod.herokuapp.com/logout",
            usersUrl: "https://lebonfilm-prod.herokuapp.com/users",
            users: []
        };
    },
    mounted() {
        this.isConnected();
        this.getUsers();
    },
    updated() {
        this.getUsers();
    },
    methods: {
        search() {
            if ( this.searchTitle && this.searchTitle !== this.$route.params.name) {
                this.$router.push({
                    path: "/search/" + this.searchTitle
                });
                this.searchTitle = ""
            }
        },
        isConnected() {
            axios({
                method: 'GET',
                url: this.isConnectedUrl,
                withCredentials: true
            })
            .then(res => {
                if (res.data.result) {
                    console.log("connecte")
                    this.username = res.data.result.username
                    this.$root.$emit('user', this.username)
                    if (this.$route.name === 'Login' || this.$route.name === 'Register') {
                        this.$router.push({
                            name: "Home"
                        });
                    }
                } else {
                    console.log("pas connecte");
                    if (this.$route.name !== 'Login' && this.$route.name !== 'Register') {
                        this.$router.push({
                            name: "Login"
                        });
                    }
                }
            })
            .catch(() => {})
        },
        getUsers() {
            axios({
                method: 'GET',
                url: this.usersUrl
            })
            .then(res => {
                if(res.data.results) {
                    this.users = res.data.results
                }
            })
            .catch(() => {})
        },
        logout() {
            axios({
                method: 'GET',
                url: this.logoutUrl,
                withCredentials: true
            })
            .then(res => {
                if (res.data.message) {
                    this.$router.push({
                        name: "Login"
                    });
                }
            })
            .catch(() => {})
        }
    },
    computed: {
        getFullPath() {
            return this.$route.path
        }
    },
    watch: {
        getFullPath() {
            this.isConnected();
            this.getUsers();
        },
        username(newUsername) {
            this.username = newUsername
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
.titre:hover {
    color: #03a9f4;
}
.titre {
    color: black;
    width: 163px;
    display: block;
    text-decoration: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
