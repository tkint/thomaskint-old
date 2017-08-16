<template>
  <div id="page">
    <div v-html="page.content" v-if="page"></div>
  </div>
</template>

<script>
  export default {
    name: 'page',
    data() {
      return {
        page: null,
      };
    },
    created() {
      this.getPage();
    },
    watch: {
      $route: 'getPage',
    },
    methods: {
      getPage() {
        this.axios.get(`page/name/${this.$route.name}`).then((response) => {
          this.page = response.data;
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #hello {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    vertical-align: middle;
  }

  .img-responsive {
    max-width: 100%;
    height: auto;
  }
</style>
