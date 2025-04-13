export enum CondicaoClimaticaEnum {
  ENSOLARADO = "Ensolarado",
  PARCIALMENTE_NUBLADO = "ParcialmenteNublado",
  NUBLADO = "Nublado",
  CHUVOSO = "Chuvoso",
  CHUVA_FORTE = "ChuvaForte",
  TEMPESTADE = "Tempestade",
  VENTANIA = "Ventania",
  GRANIZO = "Granizo",
}

export enum EtapaObraEnum {
  PREPARACAO_TERRENO = "PreparacaoTerreno",
  FUNDACAO = "Fundacao",
  ESTRUTURA = "Estrutura",
  ALVENARIA = "Alvenaria",
  INSTALACOES = "Instalacoes",
  COBERTURA = "Cobertura",
  ACABAMENTO = "Acabamento",
}

export class RegistroDiario {
  constructor(
    public id: number = 0,
    public data: Date | null = null,
    public obraId: number = 0,
    public resumo: string = "",
    public condicoesClimaticas: CondicaoClimaticaEnum = CondicaoClimaticaEnum.NUBLADO,
    public totalFuncionarios: number = 0,
    public totalTerceirizados: number = 0,
    public horasTrabalhadas: number = 8,
    public equipamentos: string = "",
    public consumoCimento: number = 0,
    public materiais: string[] = [],
    public etapa: EtapaObraEnum = EtapaObraEnum.ESTRUTURA,
    public percentualConcluido: number = 0,
    public areaExecutada: number = 0,
    public ocorrencias: string = "",
    public temperatura: string = "",
    public precipitacao: number | null = null,
    public assinaturaResponsavel: string = "",
    public dataAssinatura: Date | null = null,
    public titulo: string = "",
  ) {}

  // Método factory para criar um registro vazio
  static createEmpty(): RegistroDiario {
    return new RegistroDiario();
  }

  // Método para criar a partir de um objeto parcial
  static fromPartial(partial: Partial<RegistroDiario>): RegistroDiario {
    return new RegistroDiario(
      partial.id ?? 0,
      partial.data ? new Date(partial.data) : new Date(),
      partial.obraId ?? 0,
      partial.resumo ?? "",
      partial.condicoesClimaticas ?? CondicaoClimaticaEnum.ENSOLARADO,
      partial.totalFuncionarios ?? 0,
      partial.totalTerceirizados ?? 0,
      partial.horasTrabalhadas ?? 8,
      partial.equipamentos ?? "",
      partial.consumoCimento ?? 0,
      partial.materiais ?? [],
      partial.etapa ?? EtapaObraEnum.ESTRUTURA,
      partial.percentualConcluido ?? 0,
      partial.areaExecutada ?? 0,
      partial.ocorrencias ?? "",
      partial.temperatura ?? "",
      partial.precipitacao ?? null,
      partial.assinaturaResponsavel ?? "",
      partial.dataAssinatura ? new Date(partial.dataAssinatura) : null,
      partial.titulo ?? "",
    );
  }
}
