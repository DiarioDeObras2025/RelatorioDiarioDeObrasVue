import RoutePath from "@/router/route_patch";
import RecuperaarSenhaPageVue from "../RecuperarSenhaPage.vue";
import RouteName from "@/router/route_name";

const router = {
    path: RoutePath.RECUPERAR_SENHA,
    name: RouteName.RECUPERAR_SENHA,
    component: RecuperaarSenhaPageVue,
};

export default router;
