<template>
  <div id="settings">
    <v-tabs centered grow>
      <v-tabs-bar slot="activators" class="teal" style="position: fixed; left: 100px; right: 0; width: auto; z-index: 998">
        <v-tabs-slider class="white"></v-tabs-slider>
        <v-tabs-item href="#tab-pages">
          Pages
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-pages">
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <v-data-table
                    :headers="pagesHeaders"
                    :items="pages"
                    slot="footer"
                    hide-actions
                  >
                    <template slot="items" scope="page" class="page-item">
                      <td>{{ page.item.numorder }}</td>
                      <td>{{ page.item.name }}</td>
                      <td>{{ page.item.path }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <table>
                    <thead>
                      <tr>
                        <th
                          v-for="header in pagesHeaders"
                          :key="header.name"
                          @click="sortPages(header)">
                          {{ header.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <draggable v-model="pages" @end="movePage">
                        <tr v-for="page in pages" :key="page.numorder">
                          <td>{{ page.numorder }}</td>
                          <td>{{ page.name }}</td>
                          <td>{{ page.path }}</td>
                        </tr>
                      </draggable>
                    </tbody>
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
    },
    watch: {
    },
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
    },
  };
</script>

<style scoped>

</style>
