import RoutePath from "@/router/route_patch";
import RouteName from "@/router/route_name";
import ListUserPageVue from "../ListUserPage.vue";

const router = {
  path: RoutePath.LIST_USER,
  name: RouteName.LIST_USER,
  component: ListUserPageVue,
};

export default router;
