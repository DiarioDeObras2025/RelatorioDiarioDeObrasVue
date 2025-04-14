import type { Material, MembroEquipe } from "@/components/create-registro-diario/CreateRegistroDiario.vue";

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
    public equipe: MembroEquipe[] = [],
    public horasTrabalhadas: number = 8,
    public equipamentos: string = "",
    public consumoCimento: number = 0,
    public materiais: Material[] = [],
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
    return new RegistroDiario(
      0,          // id
      null,       // data
      0,          // obraId
      "",         // resumo
      CondicaoClimaticaEnum.ENSOLARADO, // condicoesClimaticas
      [],         // equipe (agora é MembroEquipe[])
      8,          // horasTrabalhadas
      "",         // equipamentos
      0,          // consumoCimento
      [],         // materiais (agora é Material[])
      EtapaObraEnum.ESTRUTURA, // etapa
      0,          // percentualConcluido
      0,          // areaExecutada
      "",         // ocorrencias
      "",         // temperatura
      null,       // precipitacao
      "",         // assinaturaResponsavel
      null,       // dataAssinatura
      ""          // titulo
    );
  }

  // Método para criar a partir de um objeto parcial
  static fromPartial(partial: Partial<RegistroDiario>): RegistroDiario {
    return new RegistroDiario(
      partial.id ?? 0,
      partial.data ? new Date(partial.data) : new Date(),
      partial.obraId ?? 0,
      partial.resumo ?? "",
      partial.condicoesClimaticas ?? CondicaoClimaticaEnum.ENSOLARADO,
      partial.equipe ?? [],
      partial.horasTrabalhadas ?? 8,
      partial.equipamentos ?? "",
      partial.consumoCimento ?? 0,
      partial.materiais ?? [], // Agora aceita Material[] ou undefined
      partial.etapa ?? EtapaObraEnum.ESTRUTURA,
      partial.percentualConcluido ?? 0,
      partial.areaExecutada ?? 0,
      partial.ocorrencias ?? "",
      partial.temperatura ?? "",
      partial.precipitacao ?? null,
      partial.assinaturaResponsavel ?? "",
      partial.dataAssinatura ? new Date(partial.dataAssinatura) : null,
      partial.titulo ?? ""
    );
  }
}
