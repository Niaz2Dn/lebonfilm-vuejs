<template>
    <div class="search-result">
        <div class="ma-4 pb-8">
            <div class="mt-8 mb-2 display-1 font-weight-medium grey--text text--lighten-1">
                <span v-if="this.searchResults.length !== 0">Search Results: ({{ this.totalResults }})</span>
                <span v-else>Search Results:</span>
            </div>
            <MovieGrid v-bind:movies="searchResults"/>
            <v-btn v-if="!noData && this.page != this.totalPages" @click="loadMore" block color="light-blue" class="white--text mb-8">
                <div class="font-weight-black subtitle-1">Load more</div>
            </v-btn>
        </div>
        <div v-if="noData && this.name">
            <h4 class="mt-8 mb-2 grey--text text--lighten-1">No result found.</h4>
        </div>
  </div>
</template>

<script>
import axios from "axios"
import MovieGrid from "@/components/MovieGrid"

export default {
    data() {
        return {
        imageURL: "http://image.tmdb.org/t/p/w500",
        searchResults: [],
        totalResults: "",
        totalPages: "",
        page: "1",
        noData: false
        };
    },
    components: {
        MovieGrid
    },
    props: ["name"],
    mounted() {
        this.noData = false;
        this.searchResults = [];
        axios
            .get("https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query=" + this.$props.name + "&api_key=" + process.env.VUE_APP_TMDB_API_KEY + "&page=" + this.page)
            .then(res => {
                this.totalPages = res.data.total_pages;
                this.totalResults = res.data.total_results;
                res.data.results.forEach(element => {
                    if (element.backdrop_path) {
                        element['backdrop_url'] = this.imageURL + element.backdrop_path                        
                    }
                    if (element.poster_path) {
                        element['poster_url'] = this.imageURL + element.poster_path
                    }
                    this.searchResults.push(element);
                });
                if (this.searchResults.length === 0) {
                    this.noData = true;
                }
            });
    },
    methods: {
        loadMore() {
        this.page++;
        axios
            .get("https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query=" + this.$props.name + "&api_key=" + process.env.VUE_APP_TMDB_API_KEY + "&page=" + this.page)
            .then(res => {
                res.data.results.forEach(element => {
                    if (element.backdrop_path) {
                        element['backdrop_url'] = this.imageURL + element.backdrop_path                        
                    }
                    if (element.poster_path) {
                        element['poster_url'] = this.imageURL + element.poster_path
                    }
                    this.searchResults.push(element);
                });
            });
        }
    },
    name: "Search",
    watch: {
        name(value) {
            this.noData = false;
            this.searchResults = [];
            axios
                .get("https://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query=" + value + "&api_key=" + process.env.VUE_APP_TMDB_API_KEY + "&page=" + this.page)
                .then(res => {
                    this.totalPages = res.data.total_pages;
                    this.totalResults = res.data.total_results;
                    res.data.results.forEach(element => {
                        if (element.backdrop_path) {
                            element['backdrop_url'] = this.imageURL + element.backdrop_path                        
                        }
                        if (element.poster_path) {
                            element['poster_url'] = this.imageURL + element.poster_path
                        }
                        this.searchResults.push(element);
                    });
                    if (this.searchResults.length === 0) {
                        this.noData = true;
                    }
                });
        },
        searchResults(newSearchResults) {
            this.searchResults = newSearchResults;
        },
        page(newPage) {
            this.page = newPage;
        }
    }
};
</script>

<style scoped>
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
