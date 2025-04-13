import RoutePath from "@/router/route_patch";
import CreateRegistroDiarioVue from "../CreateRegistroDiario.vue";
import RouteName from "@/router/route_name";

const router = {
  path: RoutePath.CREATE_REGISTRO_DIARIO,
  name: RouteName.CREATE_REGISTRO_DIARIO,
  component: CreateRegistroDiarioVue,
};

export default router;
