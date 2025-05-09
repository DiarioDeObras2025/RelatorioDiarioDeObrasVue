import { useRouter } from "vue-router";
import RouteName from "@/router/route_name";
import RoutePath from "@/router/route_patch";

export function useNavigation() {
  const router = useRouter();

  const goToPath = (path: string) => {
    router.push({ path });
  };

  function goToObraDetalhePage(id: number) {
    router.push({
      name: RouteName.OBRA_DETALHE,
      params: {
        id,
      },
    });
  }

  function goToViewRegistro(id: number) {
    router.push({
      name: RouteName.RELATORIO_VIEW,
      params: {
        id,
      },
    });
  }

  
  const goToCreateObra = () => {
    router.push(RoutePath.CREATE_OBRA);
  };

  const goToListObra = () => {
    router.push(RoutePath.LIST_OBRA);
  };

  const goToCreateEmpreas = () => {
    router.push(RoutePath.CREATE_EMPRESA);
  };

  const goToCreateUser = () => {
    router.push(RoutePath.CREATE_USER);
  };

  const goToCreateRegistroDiario = (id: number) => {
    router.push({
      name: RouteName.CREATE_REGISTRO_DIARIO,
      params: {
        id,
      },
    });
  };

  const goToLogin = () => {
    router.push(RoutePath.LOGIN);
  };

  const goToEditRegistroDiario = (id: number) => {
    router.push({
      name: RouteName.EDIT_REGISTRO_DIARIO,
      params: {
        id,
      },
    });
  };

  const goToListGeralRelatorio = () => {
    router.push(RoutePath.LIST_RELATORIO_GERAL);
  };

  const goToShowAllObras = () => {
    router.push(RoutePath.TODAS_OBRAS);
  };

  const goToListUser = () => {
    router.push(RoutePath.LIST_USER);
  };

  const goToRecuperarSenha = () => {
    router.push(RoutePath.RECUPERAR_SENHA);
  };
  
  return {
    goToPath,
    goToObraDetalhePage,
    goToCreateObra,
    goToListObra,
    goToCreateEmpreas,
    goToCreateUser,
    goToCreateRegistroDiario,
    goToEditRegistroDiario,
    goToLogin,
    goToListGeralRelatorio,
    goToShowAllObras,
    goToListUser,
    goToViewRegistro,
    goToRecuperarSenha
  };
}
