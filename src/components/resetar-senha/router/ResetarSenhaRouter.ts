import RoutePath from "@/router/route_patch";
import ResetarSenhaPageVue from "../ResetarSenhaPage.vue";
import RouteName from "@/router/route_name";

const router = {
    path: RoutePath.RESETAR_SENHA,
    name: RouteName.RESETAR_SENHA,
    component: ResetarSenhaPageVue,
};

export default router;
