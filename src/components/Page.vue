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
        isEditing: true,
      };
    },
    created() {
      this.getPage();
    },
    destroyed() {
      const s = document.getElementById('page-style');
      if (s) {
        document.getElementsByTagName('head')[0].removeChild(s);
      }
    },
    watch: {
      $route: 'getPage',
    },
    methods: {
      getPage() {
        this.axios.get(`page/${this.$route.name}`).then((response) => {
          this.page = response.data;
          if (this.page.style) {
            const s = document.createElement('style');
            s.setAttribute('id', 'page-style');
            s.innerHTML = this.page.style;
            document.getElementsByTagName('head')[0].appendChild(s);
          }
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

  #create .speed-dial {
    position: absolute;
  }

  #create .btn--floating {
    position: relative;
  }
</style>
