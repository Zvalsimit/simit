import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/article',
      name: 'article',
      component: resolve => require(['../components/article.vue'], resolve)
    }, {
      path: '/articleDetail',
      name: 'articleDetail',
      meta: {type: 1},
      component: resolve => require(['../components/articleDetail.vue'], resolve)
    }, {
      path: '/menu',
      name: 'menu',
      meta: {type: 1},
      component: resolve => require(['../components/menu.vue'], resolve)
    }, {
      path: '/message',
      name: 'message',
      meta: {type: 1},
      component: resolve => require(['../components/message.vue'], resolve)
    }, {
      path: '/user',
      name: 'user',
      meta: {type: 1},
      component: resolve => require(['../components/user.vue'], resolve)
    }, {
      path: '/articleList',
      name: 'articleList',
      meta: {type: 1},
      component: resolve => require(['../components/articleList.vue'], resolve)
    }, {
      path: '/shareFriend',
      name: 'shareFriend',
      meta: {type: 1},
      component: resolve => require(['../components/shareFriend.vue'], resolve)
    }, {
      path: '/shareEntry',
      name: 'shareEntry',
      meta: {type: 1},
      component: resolve => require(['../components/shareEntry.vue'], resolve)
    }, {
      path: '/articleDemo',
      name: 'articleDemo',
      component: resolve => require(['../components/articleDemo.vue'], resolve)
    }, {
      path: '/testEntry',
      name: 'testEntry',
      component: resolve => require(['../components/testEntry.vue'], resolve)
    }, {
      path: '/section',
      name: 'section',
      component: resolve => require(['../components/section.vue'], resolve)
    }, {
      path: '/test',
      name: 'test',
      component: resolve => require(['../components/test.vue'], resolve)
    }, {
      path: '/list',
      name: 'list',
      component: resolve => require(['../components/list.vue'], resolve)
    }, {
      path: '/exam',
      name: 'exam',
      component: resolve => require(['../components/exam.vue'], resolve)
    }, {
      path: '/result',
      name: 'result',
      component: resolve => require(['../components/result.vue'], resolve)
    }, {
      path: '/errorList',
      name: 'errorList',
      component: resolve => require(['../components/errorList.vue'], resolve)
    }, {
      path: '/share',
      name: 'share',
      component: resolve => require(['../components/share.vue'], resolve)
    }, {
      path: '/entry',
      name: 'entry',
      component: resolve => require(['../components/entry.vue'], resolve)
    }, {
      path: '/notice',
      name: 'notice',
      component: resolve => require(['../components/notice.vue'], resolve)
    }, {
      path: '*',
      name: '/article',
      component: resolve => require(['../components/article.vue'], resolve)
    }, {
      path: '/wx/',
      component: resolve => require(['../components/testEntry.vue'], resolve)
    }, {
      path: '/wxpro/',
      component: resolve => require(['../components/testEntry.vue'], resolve)
    }
  ]
})
