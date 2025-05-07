<template>
  <div class="mt-4">
    <h1>Financeiro da Obra</h1>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex ga-2 flex-column flex-sm-row">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirNovoLancamento">
          Novo Lançamento
        </v-btn>
        <v-btn color="secondary" prepend-icon="mdi-file-pdf" @click="gerarRelatorioFinanceiro">
          Gerar Relatório
        </v-btn>
      </div>

    </div>

    <v-card class="pa-4 mb-4" outlined>
      <div class="text-h6 font-weight-bold">Total gasto na obra:</div>
      <div class="text-h5 mt-2">R$ {{ totalGeral.toFixed(2) }}</div>
    </v-card>

    <v-expansion-panels class="mt-6 mb-6" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Resumo e Gráficos de Custos</v-expansion-panel-title>
        <v-expansion-panel-text>

          <!-- RESUMO DAS CATEGORIAS -->
          <v-row dense class="mb-4">
            <v-col v-for="(cat, i) in categoriasChart.categorias" :key="i" cols="12" sm="6" md="3">
              <v-card :style="{ backgroundColor: categoriasChart.cores[i] }" class="pa-4">
                <div class="text-white font-weight-bold">{{ cat }}</div>
                <div class="text-white text-h6">R$ {{ categoriasChart.valores[i].toFixed(2) }}</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- GRÁFICOS -->
          <v-row align="center">
            <v-col cols="12" md="6">
              <GraficoPizza v-if="custos.length" :categorias="categoriasChart.categorias"
                :valores="categoriasChart.valores" :cores="categoriasChart.cores" style="height: 300px;" />
            </v-col>
            <v-col cols="12" md="6">
              <GraficoColuna v-if="custos.length" :categorias="categoriasChart.categorias"
                :valores="categoriasChart.valores" :cores="categoriasChart.cores" style="height: 300px;" />
            </v-col>
          </v-row>

        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>



    <v-data-table :headers="headers" :items="custos" class="elevation-1" no-data-text="Nenhum lançamento cadastrado">
      <template #item.data="{ item }">
        {{ item.data.toLocaleDateString() }}
      </template>
      <template #item.valor="{ item }">
        R$ {{ item.valor.toFixed(2) }}
      </template>
      <template #item.categoria="{ item }">
        {{ item.categoriaNomeTexto }}
      </template>
      <template #item.acoes="{ item }">
        <v-btn icon size="small" @click="editarCusto(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" color="red" @click="excluirCusto(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="abrirModal" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Novo Lançamento</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <v-text-field v-model="novo.descricao" label="Descrição" :rules="[v => !!v || 'Informe a descrição']"
              required />

            <money3 v-model="novo.valor" v-bind="moneyConfig" class="w-100"
              style="border: 1px solid #ccc; border-radius: 4px; padding: 12px;" />

            <v-select v-model="novo.categoria" :items="categorias" item-value="value" item-title="label"
              label="Categoria" :rules="[v => !!v || 'Selecione uma categoria']" required />
            <v-text-field v-model="novo.data" label="Data" type="date" :rules="[v => !!v || 'Informe a data']"
              required />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="fecharModal">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarCusto">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <v-dialog v-model="abrirConfirmacao" max-width="400">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">Confirmar exclusão</v-card-title>
      <v-card-text>Tem certeza que deseja excluir este lançamento?</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="abrirConfirmacao = false">Cancelar</v-btn>
        <v-btn color="red" @click="confirmarExclusao">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { FinanceiroRepository } from '@/domain/repositories/financeiro/FinanceiroRepository'
import { CustoObra } from '@/domain/entities/financeiro-obra/CustoObra'
import { useToast } from '@/composables/toast/Toast.composable'
import { Money3Component } from 'v-money3'
import api from "@/config/axios";
import GraficoPizza from './GraficoPizza.vue'
import GraficoColuna from './GraficoColuna.vue'
import { CategoriaCusto } from '@/domain/entities/financeiro-obra/CategoriaCustoEnum'

const abrirConfirmacao = ref(false)
const idParaExcluir = ref<number | null>(null)

const totalGeral = computed(() => {
  return custos.value.reduce((acc, item) => acc + item.valor, 0)
})


const nomeCategorias = new Map<number, string>([
  [CategoriaCusto.PagamentoFuncionario, 'Pagamento de Funcionário'],
  [CategoriaCusto.Alimentacao, 'Alimentação'],
  [CategoriaCusto.CompraMateriais, 'Compra de Materiais'],
  [CategoriaCusto.AluguelEquipamentos, 'Aluguel de Equipamentos'],
  [CategoriaCusto.Transporte, 'Transporte'],
  [CategoriaCusto.DespesasGerais, 'Despesas Gerais'],
  [CategoriaCusto.ServicosTerceirizados, 'Serviços Terceirizados'],
  [CategoriaCusto.Imprevistos, 'Imprevistos']
])

const corCategorias = new Map<number, string>([
  [CategoriaCusto.PagamentoFuncionario, '#ef5350'],
  [CategoriaCusto.Alimentacao, '#66bb6a'],
  [CategoriaCusto.CompraMateriais, '#ffa726'],
  [CategoriaCusto.AluguelEquipamentos, '#ab47bc'],
  [CategoriaCusto.Transporte, '#42a5f5'],
  [CategoriaCusto.DespesasGerais, '#bdbdbd'],
  [CategoriaCusto.ServicosTerceirizados, '#26a69a'],
  [CategoriaCusto.Imprevistos, '#ec407a']
])

const categoriasChart = computed(() => {
  const agrupado = new Map<number, number>()

  custos.value.forEach(item => {
    agrupado.set(item.categoria, (agrupado.get(item.categoria) || 0) + item.valor)
  })

  const categorias: string[] = []
  const valores: number[] = []
  const cores: string[] = []

  for (const [categoria, total] of agrupado.entries()) {
    categorias.push(nomeCategorias.get(categoria) || `Categoria ${categoria}`)
    valores.push(parseFloat(total.toFixed(2)))
    cores.push(corCategorias.get(categoria) || '#ccc')
  }

  return { categorias, valores, cores }
})


defineOptions({
  components: {
    money3: Money3Component
  }
})


async function gerarRelatorioFinanceiro() {
  try {
    const response = await api.get(`CustoObra/financeiro/obra/${props.obraId}/pdf`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `relatorio-financeiro-obra-${props.obraId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    showToast("Erro ao gerar PDF. Tente novamente.", "error");
    console.error("Erro ao gerar PDF:", error);
  }
}


const { showToast } = useToast()
const moneyConfig = {
  masked: false,
  prefix: 'R$ ',
  thousands: '.',
  decimal: ',',
  precision: 2,
  shouldRound: true
}

const props = defineProps<{ obraId: number }>()
const repository = new FinanceiroRepository()

const custos = ref<CustoObra[]>([])
const abrirModal = ref(false)
const formRef = ref()
const formValido = ref(false)
const editandoId = ref<number | null>(null)

const novo = ref<{
  descricao: string
  valor: string | number
  categoria: number
  data: string
}>({
  descricao: '',
  valor: 0,
  categoria: 1,
  data: new Date().toISOString().substring(0, 10)
})

const categorias = [
  { value: 1, label: 'Pagamento de Funcionário' },
  { value: 2, label: 'Alimentação' },
  { value: 3, label: 'Compra de Materiais' },
  { value: 4, label: 'Aluguel de Equipamentos' },
  { value: 5, label: 'Transporte' },
  { value: 6, label: 'Despesas Gerais' },
  { value: 7, label: 'Serviços Terceirizados' },
  { value: 8, label: 'Imprevistos' }
]

const headers = [
  { title: 'Data', key: 'data' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Categoria', key: 'categoria' },
  { title: 'Valor (R$)', key: 'valor' },
  { title: 'Ações', key: 'acoes', sortable: false }
]

async function carregarCustos() {
  custos.value = await repository.listarCustosPorObra(props.obraId)
}

function abrirNovoLancamento() {
  resetarFormulario()
  abrirModal.value = true
}

function editarCusto(custo: CustoObra) {
  novo.value = {
    descricao: custo.descricao,
    valor: custo.valor.toFixed(2).replace('.', ','),
    categoria: custo.categoria,
    data: custo.data.toISOString().substring(0, 10)
  }
  editandoId.value = custo.id
  abrirModal.value = true
}

function fecharModal() {
  abrirModal.value = false
  resetarFormulario()
}

function resetarFormulario() {
  editandoId.value = null
  novo.value = {
    descricao: '',
    valor: 0,
    categoria: 1,
    data: new Date().toISOString().substring(0, 10)
  }
}

async function salvarCusto() {
  const valido = await formRef.value?.validate()
  if (!valido) return

  const valorNumerico = typeof novo.value.valor === 'string'
    ? parseFloat(novo.value.valor.replace(',', '.'))
    : novo.value.valor

  const custo = new CustoObra(
    editandoId.value ?? 0,
    props.obraId,
    novo.value.categoria,
    novo.value.descricao,
    valorNumerico,
    new Date(novo.value.data)
  )

  if (editandoId.value) {
    await repository.atualizarCusto(custo)
    showToast('Lançamento atualizado com sucesso!', 'success')
  } else {
    await repository.criarCusto(custo)
    showToast('Lançamento criado com sucesso!', 'success')
  }

  fecharModal()
  await carregarCustos()
}

function excluirCusto(id: number) {
  idParaExcluir.value = id
  abrirConfirmacao.value = true
}

async function confirmarExclusao() {
  if (idParaExcluir.value !== null) {
    await repository.removerCusto(idParaExcluir.value)
    showToast("Lançamento excluído com sucesso!", "success")
    await carregarCustos()
    idParaExcluir.value = null
    abrirConfirmacao.value = false
  }
}


onMounted(carregarCustos)
</script>