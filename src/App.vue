<template>
  <v-app dark>
    <v-speed-dial
      fixed
      right
      direction="bottom"
      transition="scale-transition"
      style="z-index: 999"
      v-model="adminMenu"
      v-if="connected"
    >
      <v-btn slot="activator" class="blue darken-2" fab v-model="adminMenu">
        <v-icon>account_circle</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        v-for="(item, index) in adminBtns"
        v-if="item.enabled"
        :key="index"
        :class="item.color"
        @click.native="item.action">
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-navigation-drawer permanent style="overflow: hidden">
      <v-list class="navbar" dense>
        <v-list-tile
          id="avatar-tile"
          v-if="links[0]"
          :to="!links[0].external ? { name: links[0].target } : ''"
          :href="links[0].external ? links[0].target : ''">
          <v-list-tile-content>
            <img id="avatar" src="./assets/logo.png"/>
            <v-list-tile-title id="avatar-title">
              Thomas Kint
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="(link, index) in links"
          v-if="index > 0 && link"
          :key="link.name"
          :to="!link.external ? { name: link.target } : ''"
          :href="link.external ? link.target : ''"
          :id="link.target === $route.name ? 'selected-tile' : ''">
          <v-list-tile-content>
            <v-list-tile-title>
              <v-icon class="menu-icon" large style="font-size: 40px;" v-if="link.name === $route.name">{{ link.icon }}</v-icon>
              <v-icon class="menu-icon" large v-else>{{ link.icon }}</v-icon>
            </v-list-tile-title>
            <v-list-tile-sub-title class="menu-text">
              {{ link.name }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <main>
      <transition name="flip" mode="out-in" appear>
        <router-view :key="$route.name"></router-view>
      </transition>
    </main>
  </v-app>
</template>

<script>
  import Page from '@/components/Page';

  require('vuetify/dist/vuetify.min.css');

  export default {
    name: 'app',
    data() {
      return {
        windowSize: {
          x: 0,
          y: 0,
        },
        adminMenu: false,
        adminBtns: [
          {
            self: this.$parent,
            icon: 'settings',
            color: 'grey',
            enabled: true,
            action() {
              this.self.$router.push({ name: 'Settings' });
            },
          },
          {
            self: this.$parent,
            icon: 'save',
            color: 'teal',
            enabled: false,
            action() {},
          },
          {
            self: this.$parent,
            icon: 'reply',
            color: 'orange',
            enabled: false,
            action() {},
          },
          {
            self: this.$parent,
            icon: 'edit',
            color: 'green',
            enabled: false,
            action() {
              this.self.$router.push({ name: 'EditPage', params: { action: 'edit', page: this.self.$route.name } });
            },
          },
          {
            self: this.$parent,
            icon: 'add',
            color: 'indigo',
            enabled: true,
            action() {
              this.self.$router.push({ name: 'NewPage', params: { action: 'create' } });
            },
          },
          {
            self: this.$parent,
            icon: 'exit_to_app',
            color: 'red',
            enabled: true,
            action() {
              this.self.connected = false;
              this.self.$router.push({ name: 'Home' });
            },
          },
        ],
        links: [],
        connected: true,
      };
    },
    mounted() {
      this.onResize();
    },
    created() {
      this.getPages();
      this.updateMenu();
    },
    watch: {
      $route: ['updateLinks', 'updateMenu'],
    },
    methods: {
      updateMenu() {
        this.adminBtns[1].enabled = this.$route.meta.editing;
        this.adminBtns[2].enabled = this.$route.meta.editing;
        this.adminBtns[3].enabled = this.$route.meta.editable;
      },
      onResize() {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight };
      },
      getPages() {
        this.axios.get('page').then((response) => {
          const pages = response.data;
          const routes = [];
          const links = [];
          pages.forEach((e) => {
            routes.push({
              path: e.path,
              name: e.name,
              component: Page,
              meta: {
                editable: true,
                editing: false,
              },
            });
            links.push({ name: e.link, target: e.name, icon: e.icon });
          });
          this.$router.addRoutes(routes);
          this.links = links;
        });
      },
      updateLinks() {
        this.axios.get('page').then((response) => {
          const pages = response.data;
          const links = [];
          pages.forEach((e) => {
            links.push({ name: e.link, target: e.name, icon: e.icon });
          });
          this.links = links;
        });
      },
    },
  };
</script>

<style>
  .navigation-drawer {
    width: 100px;
  }

  .navigation-drawer--permanent.navigation-drawer--open:not(.navigation-drawer--right)~main {
    padding-left: 100px;
  }

  .list--dense {
    padding-top: 0px;
  }

  .list--dense .list__tile:not(.list__tile--avatar) {
    height: 60px;
    border-bottom: 1px solid dimgrey;
  }

  .list--dense .list__tile:not(.list__tile--avatar) .menu-icon {
    font-size: 30px;
    color: grey
  }

  .list--dense .list__tile:not(.list__tile--avatar) .menu-text {
    color: grey;
  }

  .list--dense .list__tile:not(.list__tile--avatar):hover .menu-icon,
  .list--dense .list__tile:not(.list__tile--avatar):hover .menu-text {
    color: #339966;
  }

  #selected-tile {
    height: 80px;
  }

  #selected-tile .menu-icon, #selected-tile .menu-text {
    color: white;
  }

  .list__tile__title, .list__tile__sub-title {
    text-align: center;
  }

  #avatar-tile {
    height: 120px;
  }

  #avatar {
    width: 100%;
    height: 100%;
    margin-top: -10%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  #avatar-title {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #339966;
    color: white;
    text-shadow: 1px 1px black;
  }

  .container {
    background: no-repeat center;
  }

  .slide-y-enter-active,
  .slide-y-leave-active {
    transition: all .3s ease;
  }

  .slide-y-enter {
    transform: translateY(100%);
  }

  .slide-y-leave-to  {
    transform: translateY(-100%);
    opacity: 1;
  }

  .slide-y-reverse-enter-active,
  .slide-y-reverse-leave-active {
    transition: all .3s ease;
  }

  .slide-y-reverse-enter {
    transform: translateY(-100%);
  }

  .slide-y-reverse-leave-to  {
    transform: translateY(100%);
    opacity: 1;
  }

  .flip-enter-active {
    transition: all .2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }

  .flip-leave-active {
    transition: all .25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .flip-enter, .flip-leave-to {
    transform: scaleY(0) translateZ(0);
    opacity: 0;
  }

  .main-container {
    position: relative;
  }

  .tabs__items {
    border: 0 !important;
  }

  h1, h2, h3, h4, h5, h6 {
    color: inherit;
    text-shadow: 1px 1px 8px black;
    line-height: 30%;
  }
</style>
