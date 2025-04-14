import RoutePath from "@/router/route_patch";
import EditRegistroDiarioVue from "../EditRegistroDiario.vue";
import RouteName from "@/router/route_name";

const router = {
  path: RoutePath.EDIT_REGISTRO_DIARIO,
  name: RouteName.EDIT_REGISTRO_DIARIO,
  component: EditRegistroDiarioVue,
};

export default router;
