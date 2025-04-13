import RoutePath from "@/router/route_patch";
import ObraPageVue from "../ObraPage.vue";
import RouteName from "@/router/route_name";

const obraRouter = {
  path: RoutePath.LIST_OBRA,
  name: RouteName.OBRA,
  component: ObraPageVue,
};

export default obraRouter;
