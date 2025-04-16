<script lang="ts" setup>
import type { ListRelatorioGeral } from "@/domain/entities/registro-diario/ListRelatorioGeral";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import { ref, onMounted } from "vue";
import type { DataTableHeader } from "vuetify";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const relatorioEmpresa = ref<ListRelatorioGeral[]>([]);
const repository = new RegistroDiarioRepository();
const loading = ref(true);
const search = ref("");

const headers: DataTableHeader[] = [
  {
    title: "Data",
    key: "data",
    width: "120px",
    sortable: false,
  },
  {
    title: "Título",
    key: "titulo",
    sortable: true,
  },
  {
    title: "Obra",
    key: "nomeObra",
    sortable: true,
  },
  {
    title: "Ações",
    key: "actions",
    sortable: false,
    align: "end",
  },
];

const { goToEditRegistroDiario, goToCreateRegistroDiario } = useNavigation();

async function getAllFromEmpresa() {
  try {
    loading.value = true;
    const response = await repository.getRelatorioGeral();
    relatorioEmpresa.value = response;
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
  } finally {
    loading.value = false;
  }
}

function formatDate(date: Date | string | undefined) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("pt-BR");
}

function gerarPDF(idRelatorio: number, idObra: number) {
  repository.gerarPdf(idRelatorio, idObra).catch((error) => {
    console.error("Falha ao gerar PDF:", error);
  });
}

function editarRelatorio(id: number) {
  goToEditRegistroDiario(id);
}

function novoRelatorio(id: number) {
  goToCreateRegistroDiario(id);
}

onMounted(() => {
  getAllFromEmpresa();
});
</script>

<template>
  <v-container class="pa-4" style="max-width: 1400px">
    <!-- Cabeçalho -->
    <v-card-title class="text-h5 font-weight-bold d-flex align-center mb-4">
      <v-icon icon="mdi-file-document-multiple" color="primary" class="mr-2" size="28" />
      Relatórios Gerais
    </v-card-title>

    <!-- Barra de Ações e Pesquisa -->
    <v-card class="mb-6" elevation="1">
      <v-card-text class="d-flex justify-space-between align-center pa-4">
        <v-text-field
          v-model="search"
          label="Pesquisar relatórios..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          style="max-width: 400px"
        />

        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="novoRelatorio"
            disabled
          >
            Novo Relatório
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Lista de Relatórios -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="relatorioEmpresa"
        :search="search"
        :loading="loading"
        loading-text="Carregando relatórios..."
        no-data-text="Nenhum relatório encontrado"
        hover
        class="elevation-1"
      >
        <template #item.data="{ item }">
          <v-chip color="primary" variant="outlined" label>
            <v-icon icon="mdi-calendar" start size="small" />
            {{ formatDate(item.data) }}
          </v-chip>
        </template>

        <template #item.titulo="{ item }">
          <div class="d-flex align-center">
            <v-icon icon="mdi-file-document" color="primary" class="mr-2" size="small" />
            <span class="font-weight-medium">{{ item.titulo }}</span>
          </div>
        </template>

        <template #item.nomeObra="{ item }">
          <v-chip variant="tonal" color="blue">
            <v-icon icon="mdi-home-city" start size="small" />
            {{ item.nomeObra }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end gap-1">
            <v-btn
              icon="mdi-content-save"
              variant="text"
              color="primary"
              size="small"
              @click="gerarPDF(item.id, item.obraId)"
              title="gerar PDF"
            />
            <v-btn
              icon="mdi-pencil"
              variant="text"
              color="primary"
              size="small"
              title="Editar"
              @click="editarRelatorio(item.id)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              title="Excluir"
              disabled
            />
          </div>
        </template>

        <template #bottom>
          <div class="d-flex justify-space-between align-center pa-2 w-100">
            <div class="text-caption text-medium-emphasis">
              Total de {{ relatorioEmpresa.length }} relatórios
            </div>
            <div>
              <v-btn
                variant="text"
                color="primary"
                prepend-icon="mdi-refresh"
                @click="getAllFromEmpresa"
              >
                Atualizar
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Cards alternativos (para visualização mobile) -->
    <div class="d-flex flex-column gap-3 mt-4 d-md-none">
      <v-card v-for="item in relatorioEmpresa" :key="item.id" variant="outlined" class="pa-4">
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-file-document" color="primary" class="mr-2" size="small" />
              <span class="font-weight-medium">{{ item.titulo }}</span>
            </div>

            <div class="d-flex align-center mb-1">
              <v-icon icon="mdi-calendar" color="primary" size="small" class="mr-2" />
              <span class="text-caption">{{ item.data }}</span>
            </div>

            <div class="d-flex align-center">
              <v-icon icon="mdi-home-city" color="primary" size="small" class="mr-2" />
              <span class="text-caption">{{ item.nomeObra }}</span>
            </div>
          </div>

          <div class="d-flex gap-1">
            <v-btn
              icon="mdi-eye"
              variant="text"
              color="primary"
              size="small"
              density="comfortable"
            />
          </div>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}

/* Efeito hover nos cards */
.v-card:hover {
  border-color: rgb(var(--v-theme-primary));
  transition: border-color 0.2s ease;
}

/* Ajuste para a tabela */
:deep(.v-data-table__td) {
  padding: 12px 16px !important;
}

/* Responsividade */
@media (max-width: 960px) {
  .v-data-table {
    display: none;
  }
}

@media (min-width: 961px) {
  .d-md-none {
    display: none !important;
  }
}
</style>
