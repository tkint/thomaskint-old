import Vue from 'vue';
import Router from 'vue-router';
import PageForm from '@/components/PageForm';
import Settings from '@/components/Settings';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/pageform/:action',
      name: 'NewPage',
      component: PageForm,
      meta: {
        canSave: true,
        canBack: true,
        canEdit: false,
        canAdd: true,
      },
    },
    {
      path: '/pageform/:action/:page',
      name: 'EditPage',
      component: PageForm,
      meta: {
        canSave: true,
        canBack: true,
        canEdit: false,
        canAdd: true,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        canSave: true,
        canBack: true,
        canEdit: false,
        canAdd: true,
      },
    },
  ],
});
