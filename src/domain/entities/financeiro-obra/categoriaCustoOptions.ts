import { CategoriaCusto } from "./CategoriaCustoEnum";

export const categoriaCustoOptions = [
  { value: CategoriaCusto.PagamentoFuncionario, label: 'Pagamento de Funcionário' },
  { value: CategoriaCusto.Alimentacao, label: 'Alimentação' },
  { value: CategoriaCusto.CompraMateriais, label: 'Compra de Materiais' },
  { value: CategoriaCusto.AluguelEquipamentos, label: 'Aluguel de Equipamentos' },
  { value: CategoriaCusto.Transporte, label: 'Transporte' },
  { value: CategoriaCusto.DespesasGerais, label: 'Despesas Gerais' },
  { value: CategoriaCusto.ServicosTerceirizados, label: 'Serviços Terceirizados' },
  { value: CategoriaCusto.Imprevistos, label: 'Imprevistos' },
];
