<template>
  <div v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register'">
    <v-app-bar app color="white">
      <span class="pt-4 pb-2">
        <img width="130" src="@/assets/logo.png"/>
      </span>
      <v-spacer></v-spacer>
      <div v-if="this.$route.name === 'Home'">
        <v-toolbar-title class="ma-2 font-weight-medium title grey--text text--darken-1">Home</v-toolbar-title>
      </div>
      <div v-else>
        <v-toolbar-title class="ma-2 font-weight-medium subtitle-1 grey--text">
            <router-link class="rt" :to="{name: 'Home'}">Home</router-link>
        </v-toolbar-title>
      </div>
      <div v-if="this.$route.name === 'Profile'">
        <v-toolbar-title class="ma-2 font-weight-medium title grey--text text--darken-1">{{ username }}</v-toolbar-title>
      </div>
      <div v-else>
        <v-toolbar-title class="ma-2 font-weight-medium subtitle-1 grey--text">
          <router-link class="rt" :to="{name: 'Profile', params: { username: this.username }}">{{ username }}</router-link>
        </v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <div class="search">
        <v-text-field class="mr-2 mt-4" ref="searchTitle" v-model="searchTitle" v-on:keyup.enter="search" prepend-icon="mdi-magnify" placeholder="Search" color="light-blue" dense>
        </v-text-field>
      </div>
      <v-btn icon @click="logout" color="light-blue">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-footer absolute padless class="font-weight-medium" color="white">
      <v-col class="text-center grey--text" cols="12"><strong>&copy; 2020 Master STL #PC3R</strong>Project by Mohamed Nizamuddin & Skander Sersi</v-col>
    </v-footer>
  </div>
</template>

<script>
// import axios from "axios";

export default {
    data() {
        return {
            username: "Bob3",
            searchTitle: "",
            imageURL: "http://image.tmdb.org/t/p/w500",
            isConnectedURL: "https://lebonfilm.herokuapp.com/isConnected",
            logoutURL: "https://lebonfilm.herokuapp.com/logout"
        };
    },
    mounted() {
        this.isConnected();
    },
    methods: {
        search() {
            if ( this.searchTitle !== null && this.searchTitle !== "" && this.searchTitle !== this.$route.params.name) {
                this.$router.push({
                    path: "/search/" + this.searchTitle
                });
            }
        },
        isConnected() {
            this.interval = setInterval(() => {
                // axios
                //     .get(this.isConnectedURL)
                //     .then(res => {
                //         if (res.data.status_code === 10 && !this.username) {
                //             this.username = res.data.lbf_data.username
                //         } else {
                //             this.$router.push({
                //                 name: "Login"
                //             });
                //         }
                //     })
                //     .catch((err) => console.log(err));
                console.log("isConnected");
            }, 10000);
        },
        logout() {
            // axios
            //     .get(this.logoutURL)
            //     .then(res => {
            //         if (res.data.code == 201) {
            //             this.$router.push({
            //                 name: "Login"
            //             });
            //         }
            //     });
            console.log("logout");
        }
    }
};
</script>

<style scoped>
.rt {
    text-decoration: none;
    display: block;
    color: #9e9e9e;
}
.rt:hover {
    text-decoration: underline;
    color: #9e9e9e;
}
.search {
    min-width: 100px;
}
</style>
