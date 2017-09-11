<template>
  <div id="pageform">
    <v-tabs centered grow>
      <v-tabs-bar slot="activators" class="teal">
        <v-tabs-slider class="white"></v-tabs-slider>
        <v-tabs-item href="#tab-settings">
          Settings
        </v-tabs-item>
        <v-tabs-item href="#tab-content">
          Content
        </v-tabs-item>
        <v-tabs-item href="#tab-style">
          Style
        </v-tabs-item>
        <v-tabs-item href="#tab-preview" @click.native="updateStyle">
          Preview
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-settings">
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Name"
                    v-model="page.name"
                    v-on:input="onPageNameChange"
                    :disabled="page.name === 'Home'"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Path"
                    v-model="page.path"
                    :disabled="page.name === 'Home'"
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
                    disabled
                  ></v-text-field>
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
            </v-container>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-content">
        <v-card>
          <v-card-text>
            <editor :page="page"></editor>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-style">
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    multiLine
                    autoGrow
                    rows="30"
                    v-model="page.style"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-preview">
        <v-container
          class="main-container"
          v-html="$encoder.decode(page.content)"
          v-if="page && page.content"
          fluid
          :style="'min-height: ' + ($parent.windowSize.y - 0) + 'px'"
        >
        </v-container>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
  import Page from '@/components/Page';
  import Editor from '@/components/Editor';

  export default {
    components: { Editor },
    name: 'pageform',
    data() {
      return {
        oldPage: null,
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
        pageChanged: false,
        numorders: [],
        fa: null,
      };
    },
    created() {
      this.getPage();
      this.getNumorders();
      this.updateMenu();
    },
    computed: {
      isEdit() {
        return this.$route.params.action === 'edit';
      },
    },
    methods: {
      updateMenu() {
        this.$parent.getAdminBtnByKey('save').action = () => this.save();
        this.$parent.getAdminBtnByKey('back').action = () => this.goBack();
      },
      getPage() {
        this.clearStyle();
        this.axios.get(`page/${this.$route.params.page}`).then((response) => {
          const page = response.data;
          if (page.style) {
            const s = document.createElement('style');
            s.setAttribute('id', 'page-style');
            s.innerHTML = page.style;
            document.getElementsByTagName('head')[0].appendChild(s);
          }
          this.page = page;
          this.oldPage = Object.assign({}, page);
        });
      },
      updateStyle() {
        this.clearStyle();
        if (this.page.style) {
          const s = document.createElement('style');
          s.setAttribute('id', 'page-style');
          s.innerHTML = this.page.style;
          document.getElementsByTagName('head')[0].appendChild(s);
        }
      },
      clearStyle() {
        const s = document.getElementById('page-style');
        if (s) {
          document.getElementsByTagName('head')[0].removeChild(s);
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
        if (this.page && this.page.name !== 'Home') {
          this.page.name = this.page.name.replace(/\s/g, '').trim();
          if (!this.oldPage || !this.oldPage.path) {
            this.page.path = `/${this.page.name.toLowerCase()}`;
          }
          this.page.link = this.page.name;
          this.page.link = this.page.link.replace(/([A-Z])/g, ' $1').trim();
        }
      },
      goBack() {
        if (this.isEdit) {
          this.$router.push({ name: this.page.name });
        } else {
          this.axios.get(`page/${this.page.name}`).then((response) => {
            const page = response.data;
            if (page.name) {
              this.$router.addRoutes([{
                path: page.path,
                name: page.name,
                component: Page,
                meta: {
                  canSave: false,
                  canBack: false,
                  canEdit: true,
                  canAdd: true,
                },
              }]);
              this.$parent.updateLinks();
              this.$router.push({ name: this.page.name });
            } else {
              this.$router.push({ target: '/' });
            }
          });
        }
      },
      save() {
        if (this.hasChanged()) {
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
        }
      },
      isValid() {
        return true;
      },
      hasChanged() {
        return !(JSON.stringify(this.page) === JSON.stringify(this.oldPage));
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pageform .tabs__container {
    overflow-x: ;
  }

  #pageform[class*="active"] .tabs__bar {
    position: absolute;
    left: 0;
    right: 0;
    width: auto;
    z-index: 998;
  }

  #pageform:not([class*="active"]) .tabs__bar {
    position: fixed;
    left: 100px;
    right: 0;
    width: auto;
    z-index: 998;
  }

  .tabs__content {
    margin-top: 48px;
  }
</style>
