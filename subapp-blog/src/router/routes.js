import Home from "../views/index.vue";

const routes = [
  {
    path: "/",
    name: "sifou",
    component: Home
  },
  {
    path: "/juejin",
    name: "juejin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/juejin/index.vue")
  }
];

export default routes;
