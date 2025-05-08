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
import ListRelatorioGeralVue from "@/components/list-relatorio/ListRelatorioGeral.vue";
import ShowAllObrasVue from "@/components/showAllObras/ShowAllObras.vue";
import ListUserPageVue from "@/components/list-user/ListUserPage.vue";
import RelatorioViewPageVue from "@/components/registro-diario-view/RelatorioViewPage.vue";
import RecuperarSenhaPageVue from "@/components/recuperar-senha/RecuperarSenhaPage.vue";
import ResetarSenhaPageVue from "@/components/resetar-senha/ResetarSenhaPage.vue";

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
    path: RoutePath.LIST_RELATORIO_GERAL,
    name: RouteName.LIST_RELATORIO_GERAL,
    component: ListRelatorioGeralVue,
  },
  {
    path: RoutePath.TODAS_OBRAS,
    name: RouteName.TODAS_OBRAS,
    component: ShowAllObrasVue,
  },
  {
    path: RoutePath.LIST_USER,
    name: RouteName.LIST_USER,
    component: ListUserPageVue,
  },
  {
    path: RoutePath.RELATORIO_VIEW,
    name: RouteName.RELATORIO_VIEW,
    component: RelatorioViewPageVue,
  },
  {
    path: RoutePath.RECUPERAR_SENHA,
    name: RouteName.RECUPERAR_SENHA,
    component: RecuperarSenhaPageVue,
  },
  {
    path: RoutePath.RESETAR_SENHA,
    name: RouteName.RESETAR_SENHA,
    component: ResetarSenhaPageVue,
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
    to.path === RoutePath.CREATE_EMPRESA ||
    to.path === RoutePath.RECUPERAR_SENHA ||
    to.path === RoutePath.RESETAR_SENHA
  ) {
    return next();
  }
  if (!isAuthenticated()) {
    return next({ path: RoutePath.LOGIN });
  }

  next();
});

export default router;
