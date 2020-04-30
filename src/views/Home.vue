<template>
    <div class="home">
        <div class="featuredM">
            <MovieCarousel v-bind:movies="featured"/>
        </div>
        <div class="popularM ma-4">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text">Popular Movies</div>
            <MovieGrid v-bind:movies="popularMovies"/>
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
        const key = process.env.VUE_APP_TMDB_API_KEY;
        axios
            .get("https://api.themoviedb.org/3/trending/movie/day?api_key=" + key)
            .then(res => {
                this.popularMovies = res.data.results
                this.popularMovies.forEach(element => {
                    element['category'] = "action aventure"
                    element['backdrop_url'] = this.imageURL + element.backdrop_path
                    element['poster_url'] = this.imageURL + element.poster_path
                });
                for (let i = 0; i < 5; i++) {
                let item = this.popularMovies[Math.floor(Math.random() * this.popularMovies.length)];
                console.log(item)

                if (!this.featured.includes(item)) {
                    this.featured.push(item);
                }
              }
            })
            .catch(err => {console.log(err)})
    },
    data() {
        return {
            pageTitle: "Popular Movies",
            featured: [],
            popularMovies: [],
            trendingMoviesURL: "https://lebonfilm.herokuapp.com/getTrendingMovies",
            imageURL: "http://image.tmdb.org/t/p/original",
        };
    }
}
</script>
