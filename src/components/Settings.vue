<template>
  <div id="settings">
    <v-tabs centered grow>
      <v-tabs-bar slot="activators" class="teal"
                  style="position: fixed; left: 100px; right: 0; width: auto; z-index: 998">
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
                        class="column text-xs-left"
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
            sortable: true,
            value: 'numorder',
          },
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          {
            text: 'Path',
            align: 'left',
            sortable: false,
            value: 'path',
          },
        ],
        pages: [],
      };
    },
    created() {
      this.getPages();
      this.pageItemHandler();
    },
    watch: {},
    methods: {
      getPages() {
        this.axios.get('page').then((response) => {
          this.pages = response.data;
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
    },
  };
</script>

<style scoped>
  .tabs__content {
    margin-top: 48px;
  }

  .ghost {
    background: #616161;
  }
</style>
