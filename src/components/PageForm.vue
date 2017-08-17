<template>
  <div id="page">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Name"
                v-model="page.name"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Path"
                v-model="page.path"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-switch
                label="Link"
                v-model="createLink"
              ></v-switch>
            </v-flex>
          </v-layout>
          <v-card v-if="createLink">
            <v-card-text>
              <v-container fluid>
                <v-layout row>
                  <v-flex xs12 md3>
                    <v-text-field
                      label="Name"
                      v-model="link.name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field
                      label="Target"
                      v-model="link.target"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-text-field
                      label="Icon"
                      v-model="link.icon"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-switch
                      label="Font Awesome"
                      v-model="link.fa"
                    ></v-switch>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Content"
                multiLine
                autoGrow
                v-model="page.content"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Style"
                multiLine
                autoGrow
                v-model="page.style"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div v-if="isEdit">
          <v-btn>Save</v-btn>
          <v-btn @click.native="goBack">Back</v-btn>
        </div>
        <v-btn v-else>Create</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-card-text>
        <pre>
{
  name: '{{ page.name }}',
  path: '{{ page.path }}',
  content: '{{ page.content }}',
  style: '{{ page.style }}',
}
        </pre>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'pageform',
    data() {
      return {
        page: { name: null, path: null, content: null, style: null },
        link: { name: null, target: null, icon: null, fa: null },
        createLink: false,
      };
    },
    created() {
      this.getPage();
      this.$parent.editBtn = false;
    },
    destroyed() {
      this.$parent.editBtn = true;
    },
    watch: {
      'page.name': 'onPageNameChange',
    },
    computed: {
      isEdit() {
        return this.$route.params.action === 'edit';
      },
    },
    methods: {
      getPage() {
        if (this.$route.params.page) {
          this.axios.get(`page/${this.$route.params.page}`).then((response) => {
            const page = response.data;
            this.page = page;
            this.link = { name: page.link, target: page.name, icon: page.icon };
          });
        }
      },
      onPageNameChange() {
        this.page.name = this.page.name.replace(/\s/g, '').trim();
        this.page.path = `/${this.page.name.toLowerCase()}`;
        this.link.name = this.page.name;
        this.link.name = this.link.name.replace(/([A-Z])/g, ' $1').trim();
        this.link.target = this.page.name;
      },
      goBack() {
        this.$router.push({ name: this.page.name });
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
