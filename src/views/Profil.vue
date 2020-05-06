<template>
  <div v-if="userExist()" class="profile-page">
    <div class="user-info">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">{{
                  profile.username
                }}</v-list-item-title>
                <v-list-item-subtitle>{{ profile.bio }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar v-if="profile.image" size="100">
                <v-img :src="profile.image"></v-img>
              </v-list-item-avatar>
              <v-list-item-avatar v-else color="grey" size="100">
              </v-list-item-avatar>
            </v-list-item>
            <div v-if="isCurrentUser()">
              <router-link class="rl" :to="{ name: 'settings' }">
                <v-btn rounded>
                  <v-icon left>mdi-cog</v-icon>Edit Profile Settings
                </v-btn>
              </router-link>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="user-info">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1"
                  >My favorites movies</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <div v-for="(movie, i) in user.movies" :key="i">
              <h3>{{ movie.name }}</h3>
            </div>

            <!-- <div v-if="isCurrentUser()">
              <h1 class="headline mb-1">Available chatrooms</h1>
              <div v-for="(room, i) in user.chatrooms" :key="i">
                <h3>{{ room.name }}</h3>
              </div>
            </div> -->
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'profile' }"
                >
                  My Comments
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profil",
  data: function() {
    return {
      profile: {
        username: this.$route.params.username,
        image: "https://picsum.photos/100",
        bio: "je suis bob"
      },
      user: {
        movies: [
          {
            name: "a"
          },
          {
            name: "a"
          },
          {
            name: "a"
          },
          {
            name: "a"
          }
        ]
      }
    };
  },
  mounted() {
    //check si le profileUsername exist si c'est pas le cas
  },
  computed: {},
  methods: {
    isCurrentUser() {
      // if (this.currentUser.username && this.profile.username) {
      //   return this.currentUser.username === this.profile.username;
      // }
      // return false;
      return true;
    },
    userExist() {
      return true;
    }
  }
};
</script>

<style scoped>
.rl {
  text-decoration: none;
  display: block;
  color: #9e9e9e;
}
</style>