import RoutePath from "@/router/route_patch";
import CreateObraVue from "@/components/obra-create/CreateObra.vue";
import RouteName from "@/router/route_name";

const obraRouter = {
  path: RoutePath.CREATE_USER,
  name: RouteName.CREATE_USER,
  component: CreateObraVue,
};

export default obraRouter;
