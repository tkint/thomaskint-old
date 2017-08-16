<template>
  <v-app dark>
    <v-navigation-drawer permanent style="overflow: hidden">
      <v-list class="navbar" dense>
        <v-list-tile id="avatar-tile" v-if="pages[0]" :to="!pages[0].external ? { name: pages[0].target } : ''" :href="pages[0].external ? pages[0].target : ''">
          <v-list-tile-content>
            <img id="avatar" src="./assets/logo.png"/>
            <v-list-tile-title id="avatar-title">
              Thomas Kint
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="(page, index) in pages" v-if="index > 0" :key="page.name" :to="!page.external ? { name: page.target } : ''" :href="page.external ? page.target : ''" :id="page.name === $route.name ? 'selected-tile' : ''">
          <v-list-tile-content>
            <v-list-tile-title>
              <v-icon large style="font-size: 40px;" v-if="page.name === $route.name">{{ page.icon }}</v-icon>
              <v-icon large style="font-size: 30px; color: grey" v-else>{{ page.icon }}</v-icon>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ page.name }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <main>
      <v-container fluid>
        <transition name="slide-fade" mode="out-in">
          <router-view :key="$route.name"></router-view>
        </transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import Page from '@/components/Page';

  require('../node_modules/vuetify/dist/vuetify.min.css');

  export default {
    name: 'app',
    data() {
      return {
        pages: [],
        // TODO: Delete when data source is set
        customPages: [
          { path: '/',
            name: 'Home',
            component: Page,
            link: { name: 'Home', target: 'Home', icon: 'home', fa: false },
          },
          { path: '/about',
            name: 'About',
            component: Page,
            link: { name: 'About', target: 'About', icon: 'person', fa: false },
          },
          { path: '/resume',
            name: 'Resume',
            component: Page,
            link: { name: 'Resume', target: 'Resume', icon: 'featured_play_list', fa: false },
          },
          { path: '/portfolio',
            name: 'Portfolio',
            component: Page,
            link: { name: 'Portfolio', target: 'Portfolio', icon: 'dashboard', fa: false },
          },
          { path: '/blog',
            name: 'Blog',
            component: Page,
            link: { name: 'Blog', target: 'Blog', icon: 'book', fa: false },
          },
          { path: '/contact',
            name: 'Contact',
            component: Page,
            link: { name: 'Contact', target: 'Contact', icon: 'phone', fa: false },
          },
          { path: '/login',
            name: 'Login',
            component: Page,
            link: { name: 'Login', target: 'Login', icon: 'https', fa: false },
          },
        ],
      };
    },
    created() {
      this.getPages();
    },
    methods: {
      getPages() {
        this.axios.get('page').then((response) => {
          const pages = response.data;
          const routes = [];
          pages.forEach((e) => {
            routes.push({ path: e.path, name: e.name, component: Page });
            this.pages.push(e.link);
          });
          this.$router.addRoutes(routes);
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

  .list__tile__title, .list__tile__sub-title {
    text-align: center;
  }

  .slide-fade-enter-active {
    transition: all .1s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateY(10px);
    opacity: 0;
  }

  #selected-tile {
    height: 80px;
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
</style>
