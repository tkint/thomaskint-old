<template>
  <v-container
    class="main-container"
    v-html="page.content.replace(/\n/g, '<br />')"
    v-if="page"
    fluid
  >
  </v-container>
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
    watch: {
      $route: 'getPage',
    },
    methods: {
      getPage() {
        this.clearStyle();
        this.axios.get(`page/${this.$route.name}`).then((response) => {
          const page = response.data;
          if (page.style) {
            const s = document.createElement('style');
            s.setAttribute('id', 'page-style');
            s.innerHTML = page.style;
            document.getElementsByTagName('head')[0].appendChild(s);
          }
          this.page = page;
        });
      },
      clearStyle() {
        const s = document.getElementById('page-style');
        if (s) {
          document.getElementsByTagName('head')[0].removeChild(s);
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #create .speed-dial {
    position: absolute;
  }

  #create .btn--floating {
    position: relative;
  }
</style>
