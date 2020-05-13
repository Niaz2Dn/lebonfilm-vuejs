<template>
    <div v-if="userExist && user" class="profile-page">
        <div class="user-info">
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title class="headline mb-1">{{ user.username }}</v-list-item-title>
                                <v-list-item-subtitle>{{ user.profil_bio }}<div>{{ user.email }}</div></v-list-item-subtitle>

                            </v-list-item-content>
                            <v-list-item-avatar v-if="user.profil_image_url" size="100">
                                <v-img :src="user.profil_image_url"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-avatar v-else color="grey" size="100">
                            </v-list-item-avatar>
                        </v-list-item>
                        <div v-if="username == name">
                            <v-card class="ma-4" color="transparent" outlined>
                    <v-card-text>
                        <v-form>
                            <v-textarea auto-grow dense counter="160" color="black" ref="profil_bio" v-model="form['profil_bio']" label="Bio" type="text" :rules="[rules.bio_length]"></v-textarea>
                            <v-text-field color="black" ref="profil_image_url" v-model="form['profil_image_url']" label="Image" type="text" :rules="[]"></v-text-field>
                            <v-text-field color="black" ref="email" v-model="form['email']" label="Email" type="text" :rules="[rules.email]"></v-text-field>
                            <v-text-field color="black" ref="password" v-model="form['password']" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                        </v-form>
                        <div class="mb-4">
                            <v-alert dense v-if="error" text color="error">{{ errorMessage }}</v-alert>
                            <v-alert dense v-if="success" text color="success">{{ successMessage }}</v-alert>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="update" color="light-blue" class="mr-4 white--text">
                            <div class="font-weight-black subtitle-1">Update</div>
                        </v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <v-form>
                            <v-text-field color="black" ref="deletePassword" v-model="deletePassword" label="Password" type="password" :rules="[rules.required]"></v-text-field>
                        </v-form>
                        <div class="mb-4">
                            <v-alert dense v-if="deleteError" text color="error">{{ deleteErrorMessage }}</v-alert>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="deleteAcc" color="red" class="mr-4 white--text">
                            <div class="font-weight-black subtitle-1">Delete your account</div>
                        </v-btn>
                    </v-card-actions>
                </v-card>
        </div>
                        <div class="ma-4 comments mb-8 pb-8">
                            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">
                                <span v-if="this.movieComments.length !== 0">Comments: ({{ this.movieComments.length }})</span>
                                <span v-else>Comments: </span>
                            </div>
                            <div class="comment-input ">
                                <Comments v-bind:comments="movieComments"></Comments>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
                   <div class="ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text text--lighten-1">Liked Movies</div>
            <MovieGrid v-bind:movies="likedMovies"/>
        </div>
        </div>
    </div>
    <div v-else class="text-center ma-8 pt-8 display-4 font-weight-regular light-blue--text">404 User not found.</div>
</template>

<script>
import axios from "axios";
import Comments from "@/components/Comments";
import MovieGrid from "@/components/MovieGrid";

export default {
    name: "Profil",
    data: function() {
        return {
            likedMovies: [],
            likedMoviesDetails: [],
            userExist: false,
            user: null,
            name: "",
            deletePassword: "",
            movieComments: [],
            usersUrl: "https://lebonfilm-prod.herokuapp.com/users",
            movieDetailsUrl: "https://lebonfilm-prod.herokuapp.com/movies?",
            movieLikeUrl: "https://lebonfilm-prod.herokuapp.com/likes?",
            movieCommentsUrl: "https://lebonfilm-prod.herokuapp.com/comments?",
            logoutUrl: "https://lebonfilm-prod.herokuapp.com/logout",
            form: {},
            deleteErrorMessage: "",
            deleteError: false,
            errorMessage: "",
            error: false,
            successMessage: "",
            success: false,
            rules: {
                required: value => !!value || "Required.",
                bio_length: () => !!this.form['profil_bio'] && this.form['profil_bio'].length <= 160 || 'Bio must be less than 160 characters',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || "Invalid e-mail.";
                },
                url: value => {
                    const pattern = /\.(jpeg|jpg|gif|png)$/;
                    return pattern.test(value) || "Invalid image url.";
                }
            },
        };
    },
    components: {
        Comments,
        MovieGrid
    },
    props: ["username"],
    mounted() {
        axios.get(this.usersUrl)
        .then(res => {
            if (res.data.results) {
                res.data.results.forEach(element => {
                    if (this.username && element === this.username) {
                        this.getUserInfo();
                        this.getComments();
                        this.getLikedMovies();
                        this.userExist = true;
                    }
                });
            }
        })
        .catch(() => {});
        this.$root.$on('user', (res) => {this.name = res});
    },
    computed: {
        getFullPath() {
            return this.$route.path
        }
    },
    methods: {
        update() {
            this.error = false;
            this.errorMessage = "";
            this.success = false;
            this.successMessage = "";
            if (!(this.form["password"])) {
                this.$refs["password"].validate(true);
            } else {
                if (this.form["email"] || this.form["profil_bio"] || this.form["profil_image_url"]) {
                    axios({
                        method: 'PUT',
                        url: this.usersUrl,
                        data: {
                            username: this.username,
                            password: this.form["password"],
                            email: this.form["email"] || this.user.email,
                            profil_bio: this.form["profil_bio"] || this.user.profil_bio || "",
                            profil_image_url: this.form["profil_image_url"] || this.user.profil_image_url || "",
                        }
                    })
                    .then(res => {
                        this.success = true;
                        this.successMessage = res.data.message;
                        this.reload();
                    })
                    .catch(err => {
                        if (err.response.status == 401) {
                            this.error = true
                            this.errorMessage = err.response.data.error
                        }
                    })
                } else {
                    this.error = true
                    this.errorMessage = "Please complete your information to update."
                }
            }
            setTimeout(() => {this.error = false;}, 2000);
        },
        deleteAcc() {
            this.deleteError = false;
            this.deleteErrorMessage = "";
            if (!(this.deletePassword)) {
                this.$refs["deletePassword"].validate(true);
            } else {
                axios({
                    method: 'DELETE',
                    url: this.usersUrl,
                    data: {
                        username: this.username,
                        password: this.deletePassword
                    },
                })
                .then(() => {
                    this.logout();
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.deleteError = true
                        this.deleteErrorMessage = err.response.data.error
                    }
                })
            }
            setTimeout(() => {this.deleteError = false;}, 2000);
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
        },
        getComments() {
            axios({
                method: 'GET',
                url: this.movieCommentsUrl + "username=" + this.username,
            })
            .then(res => {
                if(res.data.results) { 
                    this.movieComments = res.data.results
                }
            })
            .catch(() => {});
        },
        getLikedMovies() {
            axios({
                method: 'GET',
                url: this.movieLikeUrl + "username=" + this.username,
            })
            .then(res => {
                if(res.data.results) {
                    this.likedMovies = res.data.results;
                }
            })
            .catch(() => {
            })
        },
        getUserInfo() {
            axios.get(this.usersUrl + "?username=" + this.username)
            .then(res => {
                if (res.data.result) {
                    this.user = res.data.result;
                }
            })
            .catch(() => {});
        },
        reload() {
            axios.get(this.usersUrl)
            .then(res => {
                if (res.data.results) {
                    res.data.results.forEach(element => {
                        if (this.username && element === this.username) {
                            this.getUserInfo();
                            this.getComments();
                            this.getLikedMovies();
                            this.userExist = true;
                        }
                    });
                }
            })
            .catch(() => {});
        }
    },
    watch: {
        getFullPath() {
            this.reload();
        },
        userExist(newUserExist) {
            this.userExist = newUserExist;
        }
    },
};
</script>

<style scoped>
.rl {
    text-decoration: none;
    display: block;
    color: #9e9e9e;
}
.comment-input {
    color: white;
    border: 2px solid white;
    border-radius: 5px;
    background-color: white;
    display: block;
    text-decoration: none;
}
</style>