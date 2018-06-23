import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login-page',
      component: require('@/components/LoginPage').default
    }, {
      path: '/l',
      name: 'layout',
      component: require('@/components/Layout').default,
      children: [
        {
          path: '/l/stock/activity',
          component: require('@/components/stock/Activity').default
        }, {
          path: '/l/stock/add',
          component: require('@/components/stock/Add').default
        }, {
          path: '/l/stock/remove',
          component: require('@/components/stock/Remove').default
        }, {
          path: '/l/stock/transfer',
          component: require('@/components/stock/Transfer').default
        }, {
          path: '/l/stock/in-stock',
          component: require('@/components/stock/InStock').default
        }, {
          path: '/l/products',
          component: require('@/components/products/List').default
        }, {
          path: '/l/products/add',
          component: require('@/components/products/Add').default
        }, {
          path: '/l/products/:id/edit',
          component: require('@/components/products/Edit').default
        }, {
          path: '/l/providers',
          component: require('@/components/providers/List').default
        }, {
          path: '/l/providers/add',
          component: require('@/components/providers/Add').default
        }, {
          path: '/l/providers/:id/edit',
          component: require('@/components/providers/Edit').default
        }, {
          path: '/l/stores',
          component: require('@/components/stores/List').default
        }, {
          path: '/l/stores/add',
          component: require('@/components/stores/Add').default
        }, {
          path: '/l/stores/:id/edit',
          component: require('@/components/stores/Edit').default
        }
      ]
    }/*, {
     path: '*',
     redirect: '/'
    } */
  ]
})
