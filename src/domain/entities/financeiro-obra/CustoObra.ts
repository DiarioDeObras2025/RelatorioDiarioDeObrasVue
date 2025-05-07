import { CategoriaCusto } from "./CategoriaCustoEnum"; // ajuste o path conforme o local real

export class CustoObra {
  constructor(
    public id: number,
    public obraId: number,
    public categoria: CategoriaCusto,
    public descricao: string,
    public valor: number,
    public data: Date,
    public obra?: any,
    public categoriaNome?: string 
  ) {}

  get categoriaNomeTexto(): string {
    const categorias: { [key in CategoriaCusto]: string } = {
      [CategoriaCusto.PagamentoFuncionario]: 'Pagamento de Funcionário',
      [CategoriaCusto.Alimentacao]: 'Alimentação',
      [CategoriaCusto.CompraMateriais]: 'Compra de Materiais',
      [CategoriaCusto.AluguelEquipamentos]: 'Aluguel de Equipamentos',
      [CategoriaCusto.Transporte]: 'Transporte',
      [CategoriaCusto.DespesasGerais]: 'Despesas Gerais',
      [CategoriaCusto.ServicosTerceirizados]: 'Serviços Terceirizados',
      [CategoriaCusto.Imprevistos]: 'Imprevistos'
    };

    return categorias[this.categoria] ?? 'Desconhecido';
  }
}
