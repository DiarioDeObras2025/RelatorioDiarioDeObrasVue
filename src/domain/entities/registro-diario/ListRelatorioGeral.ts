export class ListRelatorioGeral {
  constructor(
    public id: number = 0,
    public data: Date = new Date(),
    public titulo: string = "",
    public obraId: number = 0,
    public nomeObra: string = "",
  ) {}
}
