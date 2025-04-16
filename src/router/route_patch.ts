export default class RoutePath {
  static readonly LIST_OBRA: string = "/obra";
  static readonly OBRA_DETALHE: string = `/obra/detalhe/:id`;
  static readonly CREATE_OBRA: string = `/obra/create-obra`;
  static readonly EDIT_OBRA: string = `/obra/editar/:id`;
  static readonly LOGIN: string = `/login`;
  static readonly CREATE_USER: string = `/create-user`;
  static readonly CREATE_EMPRESA: string = `/create-empresa`;
  static readonly CREATE_REGISTRO_DIARIO: string = `/create-registro-diario/obra/:id`;
  static readonly EDIT_REGISTRO_DIARIO: string = `/edit-registro-diario/:id`;
  static readonly LIST_RELATORIO_GERAL: string = `/list-relatorio-geral`;
  static readonly TODAS_OBRAS: string = `/todas-obras`;
}
