import RelatorioViewPageVue from "../RelatorioViewPage.vue";
import RoutePath from "@/router/route_patch";
import RouteName from "@/router/route_name";

const router = {
  path: RoutePath.RELATORIO_VIEW,
  name: RouteName.RELATORIO_VIEW,
  component: RelatorioViewPageVue,
};

export default router;
