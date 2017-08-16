<template>
  <div id="page">
    <div v-html="text"></div>
  </div>
</template>

<script>
  export default {
    name: 'page',
    data() {
      return {
        text: '',
      };
    },
    created() {
      this.getPage();
    },
    watch: {
      $route: 'getPage',
    },
    methods: {
      // TODO: Retrieve data from database
      getPage() {
        switch (this.$route.name) {
          case 'About':
            this.text = 'About';
            break;
          case 'Resume':
            this.text = 'Resume';
            break;
          case 'Portfolio':
            this.text = 'Portfolio';
            break;
          case 'Blog':
            this.text = 'Blog';
            break;
          case 'Contact':
            this.text = 'Contact';
            break;
          case 'Login':
            this.text = 'Login';
            break;
          default:
            this.text = 'Bonjour, je suis Thomas Kint <br />Je suis développeur informatique :)';
            break;
        }
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
