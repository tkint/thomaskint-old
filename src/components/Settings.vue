<template>
  <div id="settings">
    <v-tabs centered grow>
      <v-tabs-bar slot="activators" class="teal">
        <v-tabs-slider class="white"></v-tabs-slider>
        <v-tabs-item href="#tab-general">
          General
        </v-tabs-item>
        <v-tabs-item href="#tab-pages">
          Pages
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-general">
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  Language
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-pages">
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <table class="datatable table">
                    <thead>
                    <tr>
                      <th
                        v-for="header in pagesHeaders"
                        :key="header.name"
                        @click="sortPages(header)"
                        :class="`column text-xs-${header.align}`"
                      >
                        {{ header.text }}
                      </th>
                    </tr>
                    </thead>
                    <draggable v-model="pages" @end="movePage" :element="'tbody'" :options="{ ghostClass: 'ghost' }">
                      <tr v-for="page in pages" :key="page.numorder" class="page-item">
                        <td>{{ page.numorder }}</td>
                        <td>{{ page.name }}</td>
                        <td>{{ page.path }}</td>
                        <td>
                          <v-btn icon @click.native.stop="editPage(page.name)">
                            <v-icon>edit</v-icon>
                          </v-btn>
                          <v-btn icon @click.native.stop="deletePage(page.name)">
                            <v-icon>delete_outline</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </draggable>
                  </table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable';

  export default {
    name: 'settings',
    components: {
      Draggable,
    },
    data() {
      return {
        pagesHeaders: [
          {
            text: 'Order',
            align: 'left',
          },
          {
            text: 'Name',
            align: 'left',
          },
          {
            text: 'Path',
            align: 'left',
          },
          {
            text: 'Action',
            align: 'left',
          },
        ],
        oldPages: [],
        pages: [],
      };
    },
    created() {
      this.getPages();
      this.pageItemHandler();
      this.updateMenu();
    },
    watch: {},
    methods: {
      updateMenu() {
        this.$parent.getAdminBtnByKey('save').action = () => this.save();
        this.$parent.getAdminBtnByKey('back').action = () => this.goBack();
      },
      getPages() {
        this.axios.get('page').then((response) => {
          this.pages = response.data;
          this.oldPages = Object.assign({}, this.pages);
        });
      },
      movePage() {
        let i = 0;
        while (i < this.pages.length) {
          this.pages[i].numorder = i;
          i += 1;
        }
        return true;
      },
      pageItemHandler() {
        let i = 0;
        const items = document.getElementsByClassName('page-item');
        while (i < items.length) {
          items[i].addEventListener('dragstart', items[i].off('mouseout'));
          i += 1;
        }
      },
      hasChanged() {
        return !(JSON.stringify(this.pages) === JSON.stringify(this.oldPages));
      },
      isValid() {
        return true;
      },
      goBack() {
        this.$router.push({ path: '/' });
      },
      save() {
        if (this.hasChanged()) {
          if (this.isValid()) {
            this.axios.put('page/numorders', this.pages).then((response) => {
              this.pages = response.data;
              this.$parent.updateLinks(response.data);
            });
          }
        }
      },
      editPage(pagename) {
        this.$router.push({ name: 'EditPage', params: { action: 'edit', page: pagename } });
      },
      deletePage(pagename) {
        this.axios.delete(`page/${pagename}`).then((response) => {
          if (response.data) {
            this.pages.splice(this.getPageIndexByName(pagename), 1);
            this.oldPages = Object.assign({}, this.pages);
            this.$parent.updateLinks(this.pages);
          }
        });
      },
      getPageByName(pagename) {
        return this.pages[this.getPageIndexByName(pagename)];
      },
      getPageIndexByName(pagename) {
        let i = 0;
        while (i < this.pages) {
          if (this.pages[i].name === pagename) {
            return i;
          }
          i += 1;
        }
        return -1;
      },
    },
  };
</script>

<style scoped>
  #settings[class*="active"] .tabs__bar {
    position: absolute;
    left: 0;
    right: 0;
    width: auto;
    z-index: 998;
  }

  #settings:not([class*="active"]) .tabs__bar {
    position: fixed;
    left: 100px;
    right: 0;
    width: auto;
    z-index: 998;
  }

  .tabs__content {
    margin-top: 48px;
  }

  .ghost {
    background: #616161;
  }
</style>
