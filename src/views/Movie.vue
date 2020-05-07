<template>
    <div class="movie">
        <v-container :style="{ backgroundImage: 'url(' + movie.backdrop_url + ')' }" class="image pa-8" fluid pb-3>
            <v-row align="start" justify="end" class="mr-8 pr-8">
                <v-card class="pr-8 pt-4 mr-8 mt-8" width="600" color="transparent" outlined>
                    <v-card-title :title="movie.original_title || movie.title" class="display-2 font-weight-black white--text">{{ (movie.original_title || movie.title) | truncate(movie.original_title || movie.title, 33, "...")}}
                        <span :title="movie.new_date" class="ml-2 mb-8 pd-8 body-1 font-weight-regular white--text">{{ movie.new_date }}</span>
                    </v-card-title>
                    <v-card-text class="body-1 font-weight-regular white--text" :title="movie.overview">{{ movie.overview | truncate(movie.overview, 250, "...") }}
                        <!-- <div>budget : {{ movie.budget }}</div> -->
                        <div>category : {{ movie.category }}</div>
                        <!-- <div>homepage_url : {{ movie.homepage_url }}</div>
                        <div>keywords : {{ movie.keywords }}</div>
                        <div>revenue : {{ movie.revenue }}</div>
                        <div>runtime : {{ movie.runtime }}</div>
                        <div>status : {{ movie.status }}</div> -->
                    </v-card-text>
                    <v-rating class="ml-4 op1" :title="movie.new_rating + '/5'" v-model="movie.new_rating" color="amber" background-color="amber darken-2" empty-icon="$ratingFull" dense readonly></v-rating>
                    <v-card-actions>
                        <v-dialog @click:outside="resetTrailer" width="1080" overlay-opacity="0.2">
                            <template v-slot:activator="{ on }">
                                <v-btn fab v-on="on" class="ml-2 ma-2" @click="trailer()" small color="light-blue">
                                    <v-icon dense medium color="white">mdi-play</v-icon>
                                </v-btn>
                            </template>
                            <LazyYoutubeVideo v-if="trailerLoaded" :src="movie.trailer_url" autoplay/>
                        </v-dialog>
                        <v-btn v-if="isLiked" fab class="ml-2 ma-2" @click="like(movie.id)" small color="pink">
                            <v-icon dense medium color="white">mdi-heart</v-icon>
                        </v-btn>
                        <v-btn v-else fab outlined class="ml-2 ma-2" @click="like(movie.id)" small color="white">
                            <v-icon dense medium color="white">mdi-heart</v-icon>
                        </v-btn>
                        <span class="white--text font-weight-medium">{{ this.nbLikes }}</span>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
        <div class="ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text text--lighten-1">Recommendations</div>
            <MovieGrid v-bind:movies="recoMovies"/>
        </div>
        <div class="ma-4 comments mb-8 pb-8">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">
                <span v-if="this.movieComments.length !== 0">Comments: ({{ this.movieComments.length }})
                </span>
                <span v-else>Comments: </span>
            </div>
            <div class="comment-input ">
                <v-text-field class="ma-4" ref="newComment" v-model="newComment" prepend-icon="mdi-comment" placeholder="Add a comment" color="light-blue" dense></v-text-field>
                <v-btn @click="addComment" color="light-blue" class="white--text ma-4">
                    <div class="font-weight-black subtitle-1">Add a comment</div>
                </v-btn>
                <Comments v-bind:comments="movieComments"></Comments>
            </div>
        </div>
    </div>
</template>


<script>
import axios from "axios";
import LazyYoutubeVideo from "vue-lazy-youtube-video";
import Comments from "@/components/Comments";
import MovieGrid from "@/components/MovieGrid";

export default {
    name: "Home",
    data: function() {
        return {
            movie: "",
            trailerLoaded: false,
            username: "",
            movieComments: [],
            newComment: "",
            isLiked: false,
            nbLikes: 0,
            recoMovies: [],
            details: false,
            movieDetailsUrl: "https://lebonfilm-prod.herokuapp.com/movie/details",
            movieLikeUrl: "https://lebonfilm-prod.herokuapp.com/movie/likes",
            movieCommentsUrl: "https://lebonfilm-prod.herokuapp.com/movie/comments"
        };
    },
    filters: {
        truncate: function(text, length, suffix) {
            if (text && text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        }
    },
    components: {
        LazyYoutubeVideo,
        Comments,
        MovieGrid
    },
    props: ["id"],
    mounted() {
        this.details = false;
        axios.get(this.movieDetailsUrl+"?tmdb_id="+this.id)
        .then(res => {
            if (res.data.result) {
                this.movie = res.data.result;
                this.movie["new_date"] = this.movie.release_date.substring(0, 4);
                this.movie["new_rating"] = (this.movie.vote_average * 5) / 10;
                this.details = true;
            }
        })
        .catch(err => {
            if (err.response.status == 404 || err.response.status == 500) {
                console.log(err.response.data.error_message)
            }
        });
        this.getLikes();
        this.getComments();
        this.$root.$on('username', (res) => {this.username = res});
    },
    updated() {
        if (this.details) {
            this.movie.recommendations.split(" ").forEach(m => {
                axios.get(this.movieDetailsUrl+"?tmdb_id="+m)
                .then(res => {
                    if (res.data.result) {
                        this.recoMovies.push(res.data.result);
                    }
                })
                .catch(err => {
                    if (err.response.status == 404 || err.response.status == 500) {
                        console.log(err.response.data.error_message)
                    }
                });
            })
            this.details = false;
        }
    },
    computed: {
        getFullPath() {
            return this.$route.path
        }
    },
    methods: {
        trailer() {
          this.trailerLoaded = true;
        },
        addComment() {
            if (this.newComment) {
                axios({
                        method: 'POST',
                        url: this.movieCommentsUrl,
                        data: {
                            username: this.username,
                            tmdb_id: this.id,
                            content: this.newComment
                        }
                    })
                    .then(() => {
                        this.getComments();
                    })
                    .catch(() => {})
            }
            this.newComment = "";
        },
        getComments() {
                axios({
                    method: 'GET',
                    url: this.movieCommentsUrl + "?tmdb_id=" + this.id,
                })
                .then(res => {
                    if(res.data.results) {
                        this.movieComments = res.data.results
                    }
                })
                .catch(() => {})
        },
        getLikes() {
                axios({
                    method: 'GET',
                    url: this.movieLikeUrl + "?tmdb_id=" + this.id,
                })
                .then(res => {
                    if(res.data.results) {
                        this.nbLikes = res.data.results.length
                        this.isLiked = false
                        res.data.results.forEach(element => {
                            if (element === this.username) {
                                this.isLiked = true
                            }
                        });
                    }
                })
                .catch(() => {
                })
        },
        like() {
            if (!this.isLiked) {
                axios({
                    method: 'POST',
                    url: this.movieLikeUrl,
                    data: {
                        username: this.username,
                        tmdb_id: this.id
                    }
                })
                .then(() => {
                    this.getLikes();
                })
                .catch(() => {
                })
            } else {
                axios({
                    method: 'DELETE',
                    url: this.movieLikeUrl,
                    data: {
                        username: this.username,
                        tmdb_id: this.id
                    }
                })
                .then(() => {
                    this.getLikes();
                })
                .catch(() => {
                })
            }
            
        },
        resetTrailer() {
            this.trailerLoaded = false;
        },
        reload() {
            this.details = false;
            axios.get(this.movieDetailsUrl+"?tmdb_id="+this.id)
            .then(res => {
                if (res.data.result) {
                    this.movie = res.data.result;
                    this.movie["new_date"] = this.movie.release_date.substring(0, 4);
                    this.movie["new_rating"] = (this.movie.vote_average * 5) / 10;
                    this.details = true;
                }
            })
            .catch(err => {
                if (err.response.status == 404 || err.response.status == 500) {
                    console.log(err.response.data.error_message)
                }
            });
            this.getLikes();
            this.getComments();
            this.$root.$on('username', (res) => {this.username = res});
        }
    },
    watch: {
        nbLikes(newNbLikes) {
            this.nbLikes = newNbLikes;
        },
        isLiked(newIsLiked) {
            this.isLiked = newIsLiked;
        },
        movieComments(newMovieComments) {
            this.movieComments = newMovieComments;
        },
        recoMovies(newRecoMovies) {
            this.recoMovies = newRecoMovies;
        },
        getFullPath() {
            this.reload();
        }
    }
};
</script>

<style scoped>
.image {
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: inset 0 0 0 50vw rgb(0, 0, 0, 0.2);
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
