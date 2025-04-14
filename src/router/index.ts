import { createRouter, createWebHistory } from "vue-router";
import obraRouter from "@/components/obra/router/ObraRouter";
import ObraDetalhePageVue from "@/components/obra-detalhe/ObraDetalhePage.vue";
import RoutePath from "./route_patch";
import RouteName from "./route_name";
import CreateObraVue from "@/components/obra-create/CreateObra.vue";
import EditObraPageVue from "@/components/obra-edit/EditObraPage.vue";
import LoginPageVue from "@/components/login/LoginPage.vue";
import CreateUserVue from "@/components/create-user/CreateUser.vue";
import { isAuthenticated } from "./auth_guard";
import CreateEmpresaVue from "@/components/create-empresa/CreateEmpresa.vue";
import CreateRegistroDiarioVue from "@/components/create-registro-diario/CreateRegistroDiario.vue";
import EditRegistroDiarioVue from "@/components/edit-registro-diario/EditRegistroDiario.vue";

const routes = [
  // ✅ Redirecionamento simples sem component
  {
    path: "/",
    redirect: RoutePath.LOGIN,
  },
  obraRouter,
  {
    path: RoutePath.OBRA_DETALHE,
    name: RouteName.OBRA_DETALHE,
    component: ObraDetalhePageVue,
  },
  {
    path: RoutePath.CREATE_OBRA,
    name: RouteName.CREATE_OBRA,
    component: CreateObraVue,
  },
  {
    path: RoutePath.EDIT_OBRA,
    name: RouteName.OBRA_EDIT,
    component: EditObraPageVue,
    props: true,
  },
  {
    path: RoutePath.LOGIN,
    name: RouteName.LOGIN,
    component: LoginPageVue,
  },
  {
    path: RoutePath.CREATE_USER,
    name: RouteName.CREATE_USER,
    component: CreateUserVue,
  },
  {
    path: RoutePath.CREATE_EMPRESA,
    name: RouteName.CREATE_EMPRESA,
    component: CreateEmpresaVue,
  },
  {
    path: RoutePath.CREATE_REGISTRO_DIARIO,
    name: RouteName.CREATE_REGISTRO_DIARIO,
    component: CreateRegistroDiarioVue,
  },
  {
    path: RoutePath.EDIT_REGISTRO_DIARIO,
    name: RouteName.EDIT_REGISTRO_DIARIO,
    component: EditRegistroDiarioVue,
    props: true,
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: RoutePath.LIST_OBRA,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.path === RoutePath.LOGIN ||
    to.path === RoutePath.CREATE_USER ||
    to.path === RoutePath.CREATE_EMPRESA
  ) {
    return next();
  }
  if (!isAuthenticated()) {
    return next({ path: RoutePath.LOGIN });
  }

  next();
});

export default router;
