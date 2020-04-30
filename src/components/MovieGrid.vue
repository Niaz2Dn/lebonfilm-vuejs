<template>
    <v-layout class="ma-8" justify-start row wrap>
        <v-flex xs6 sm4 md3 lg2 v-for="(movie, i) in movies" :key="i">
            <router-link class="ml-2 pb-8 titre" :title="(movie.title || movie.original_title)" :to="{ name: 'Movie', params: { id: movie.id } }">
                <v-card raised width="187" color="transparent">
                    <v-img class="carte" v-if="movie.poster_url" :src="movie.poster_url" height="275" cover></v-img>
                    <v-img class="carte" v-if="!movie.poster_url" src="@/assets/poster404.jpg" height="275" cover></v-img>
                </v-card>
                <div class="mt-2">{{ (movie.title || movie.original_title) }}</div>
          </router-link>
        </v-flex>
      </v-layout>
</template>

<script>

export default {
    name: 'MovieGrid',
    props: ['movies']
}
</script>

<style scoped>
    .carte {
        border-radius: 2%;
    }

    .titre:hover {
        color: #03a9f4;
    }
    .titre {
        width: 163px;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-decoration: none;
        color: black;
    }
</style>