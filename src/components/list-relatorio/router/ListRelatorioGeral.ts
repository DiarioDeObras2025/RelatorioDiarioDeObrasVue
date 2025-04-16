import RoutePath from "@/router/route_patch";
import ListRelatorioGeralVue from "../ListRelatorioGeral.vue";
import RouteName from "@/router/route_name";

const router = {
  path: RoutePath.LIST_RELATORIO_GERAL,
  name: RouteName.LIST_RELATORIO_GERAL,
  component: ListRelatorioGeralVue,
};

export default router;
