import Vue from 'vue';
import Router from 'vue-router';
import PageForm from '@/components/PageForm';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/pageform/:action',
      name: 'NewPage',
      component: PageForm,
    },
    { path: '/pageform/:action/:page',
      name: 'EditPage',
      component: PageForm,
    },
  ],
});
