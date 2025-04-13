export class Obra {
  constructor(
    public id: number,
    public nome: string,
    public endereco: string,
    public cliente: string,
    public numeroContrato: string,
    public dataInicio: Date,
    public engenheiroResponsavel?: string,
    public dataTerminoPrevista?: Date | null,
    public status?: string,
    public dataCriacao?: Date,
    public dataAtualizacao?: Date | null,
    public totalRegistrosDiarios?: string,
  ) {}

  // Getter que formata a data, sem necessidade de incluir na criação do objeto
  // get dataInicioFormatada(): string {
  //   return this.dataInicio ? new Date(this.dataInicio).toLocaleDateString() : "";
  // }
}
