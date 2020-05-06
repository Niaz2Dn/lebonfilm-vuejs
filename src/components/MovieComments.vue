<template>
    <div class="ma-4 comments mb-8 pb-8">
        <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">
            <span v-if="this.comments.length !== 0">Comments: ({{ this.comments.length }})</span>
            <span v-else>Comments: </span>
        </div>
        <div class="comment-input ">
            <v-text-field class="ma-4" ref="newComment" v-model="newComment" prepend-icon="mdi-comment" placeholder="Add a comment" color="light-blue" dense></v-text-field>
            <v-btn @click="addComment" color="light-blue" class="white--text ma-4">
                <div class="font-weight-black subtitle-1">Add a comment</div>
            </v-btn>
            <div class="comment" v-for="(comment, i) in comments" :key="i">
                <v-list-item>
                    <v-list-item-avatar v-if="!comment.image">
                        <v-img :src="comment.image" size="50"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-avatar v-else color="grey" size="50"></v-list-item-avatar>
                    <v-list-item-content class="mb-4">
                        <v-list-item-title class="font-weight-medium">{{ comment.username }}</v-list-item-title>
                        <v-list-item-title class="font-weight-regular">{{ comment.date }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            <span class="com grey--text text--darken-1">{{ comment.content }}</span>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from "axios";

export default {
    name: 'MovieComments',
    props: ['movie'],
    data: function() {
        return {
            backgroundImage: "",
            trailerLoaded: false,
            visitedMovies: [],
            comments: [],
            newComment: "",
            isLiked: false,
            nbLikes: 0,
            username: "bob"
        };
    },
}
</script>