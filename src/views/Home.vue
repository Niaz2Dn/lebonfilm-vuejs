<template>
    <div class="home">
        <MovieCarousel v-bind:movies="featured"/>
        <div class="ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text text--lighten-1">Trending Movies</div>
            <MovieGrid v-bind:movies="trendingMovies"/>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import MovieCarousel from "@/components/MovieCarousel"
import MovieGrid from "@/components/MovieGrid"

export default {
    name: 'Home',
    components: {
        MovieCarousel,
        MovieGrid
    },
    mounted() {
        axios
            .get(this.trendingMoviesUrl)
            .then(res => {
                this.trendingMovies = res.data.results
                for (let i = 0; i < 5; i++) {
                    let item = this.trendingMovies[Math.floor(Math.random() * this.trendingMovies.length)];
                    if (!this.featured.includes(item)) {
                        this.featured.push(item);
                    }
                }
            })
            .catch(() => {})
    },
    data() {
        return {
            featured: [],
            trendingMovies: [],
            trendingMoviesUrl: "https://lebonfilm-prod.herokuapp.com/movie/trending"
        };
    }
}
</script>
