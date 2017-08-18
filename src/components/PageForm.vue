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
                v-on:input="onPageNameChange"
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
            <v-flex xs12 md3>
              <v-text-field
                label="Link"
                v-model="page.link"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                label="Order"
                v-model="page.numorder"
              ></v-text-field>
              <span v-for="n in numorders" :class="n.numorder === page.numorder ? 'red--text' : ''">{{ n.numorder }} </span>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                label="Icon"
                v-model="page.icon"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-switch
                label="Font Awesome"
                v-model="fa"
              ></v-switch>
            </v-flex>
          </v-layout>
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
        <v-btn @click.native="save">
          <span v-if="isEdit">Save</span>
          <span v-else>Create</span>
        </v-btn>
        <v-btn v-if="isEdit" @click.native="goBack">Back</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'pageform',
    data() {
      return {
        numorders: [],
        page: {
          name: null,
          link: null,
          path: null,
          icon: null,
          fa: null,
          numorder: null,
          content: null,
          style: null,
        },
        fa: null,
        createLink: false,
      };
    },
    created() {
      this.getPage();
      this.getNumorders();
      this.$parent.editBtn = false;
    },
    destroyed() {
      this.$parent.editBtn = true;
    },
    computed: {
      isEdit() {
        return this.$route.params.action === 'edit';
      },
    },
    methods: {
      getPage() {
        if (this.$route.params.action === 'edit' && this.$route.params.page) {
          this.axios.get(`page/${this.$route.params.page}`).then((response) => {
            this.page = response.data;
          });
        }
      },
      getNumorders() {
        this.axios.get('page/numorders').then((response) => {
          this.numorders = response.data;
          if (!this.page.numorder) {
            this.page.numorder = parseInt(this.numorders[this.numorders.length - 1].numorder, 10) + 1;
          }
        });
      },
      onPageNameChange() {
        this.page.name = this.page.name.replace(/\s/g, '').trim();
        this.page.path = `/${this.page.name.toLowerCase()}`;
        this.page.link = this.page.name;
        this.page.link = this.link.name.replace(/([A-Z])/g, ' $1').trim();
      },
      goBack() {
        this.$router.push({ name: this.page.name });
      },
      save() {
        if (this.isValid()) {
          this.page.fa = this.fa;
          if (this.$route.name === 'NewPage') {
            this.axios.post('page', this.page).then((response) => {
              this.page = response.data;
              this.goBack();
            });
          } else {
            this.axios.put('page', this.page).then((response) => {
              this.page = response.data;
              this.goBack();
            });
          }
        }
      },
      isValid() {
        return true;
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
