import RoutePath from "@/router/route_patch";
import CreateEmpresaVue from "../CreateEmpresa.vue";
import RouteName from "@/router/route_name";

const router = {
  path: RoutePath.CREATE_EMPRESA,
  name: RouteName.CREATE_EMPRESA,
  component: CreateEmpresaVue,
};

export default router;
