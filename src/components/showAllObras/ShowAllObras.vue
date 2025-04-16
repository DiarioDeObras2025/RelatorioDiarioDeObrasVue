<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import { Obra } from "@/domain/entities/obra/Obra";
import RoutePath from "@/router/route_patch";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const { goToObraDetalhePage } = useNavigation();

const obras = ref<Obra[]>([]);
const router = useRouter();
const obraRepo = new ObraRepository();
const filtroStatus = ref<string | "todas">("todas");
const search = ref("");
const loading = ref(false);

const statusObra = [
  { value: "Andamento", text: "Andamento", color: "orange" },
  { value: "Cancelada", text: "Cancelada", color: "red" },
  { value: "Planejada", text: "Planejada", color: "blue" },
  { value: "Concluída", text: "Concluída", color: "green" },
  { value: "Pausada", text: "Pausada", color: "grey" },
];

const statusObraMap = Object.fromEntries(
  statusObra.map(({ value, text, color }) => [value, { text, color }]),
);

const obrasFiltradas = computed(() => {
  let filtered = obras.value;

  if (filtroStatus.value !== "todas") {
    filtered = filtered.filter((o) => o.status === filtroStatus.value);
  }

  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.nome.toLowerCase().includes(term) ||
        (o.cliente && o.cliente.toLowerCase().includes(term)) ||
        (o.endereco && o.endereco.toLowerCase().includes(term)),
    );
  }

  return filtered;
});

async function fetchObras() {
  try {
    loading.value = true;
    obras.value = await obraRepo.getAll();
  } catch (error) {
    console.error("Erro ao carregar obras:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchObras);

function novaObra() {
  router.push(RoutePath.CREATE_OBRA);
}

function editarObra(id: number) {
  router.push(`/obra/editar/${id}`);
}

function acessarRelatorios(id: number) {
  goToObraDetalhePage(id);
}

function acessarDetalhes(id: number) {
  router.push(`/obra/${id}`);
}

const formatDate = (date: Date | null | undefined) =>
  date ? new Date(date).toLocaleDateString("pt-BR") : "Sem data final prevista";
</script>

<template>
  <v-container class="pa-4" style="max-width: 1400px">
    <!-- Cabeçalho -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <v-card-title class="text-h4 font-weight-bold">
          <v-icon icon="mdi-home-group" color="primary" class="mr-3" size="36" />
          Gestão de Obras
        </v-card-title>
        <v-card-subtitle class="text-subtitle-1">
          Visualize e gerencie todas as obras da empresa
        </v-card-subtitle>
      </div>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="novaObra">
        Nova Obra
      </v-btn>
    </div>

    <!-- Filtros e Busca -->
    <v-card class="mb-6" elevation="1">
      <v-card-text class="d-flex flex-wrap align-center gap-4 pa-4">
        <v-select
          v-model="filtroStatus"
          label="Status"
          :items="[{ value: 'todas', text: 'Todas' }, ...statusObra]"
          item-value="value"
          item-title="text"
          variant="outlined"
          density="comfortable"
          style="min-width: 200px"
        />

        <v-text-field
          v-model="search"
          label="Pesquisar obras..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          style="min-width: 300px"
        />

        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-refresh"
          @click="fetchObras"
          :loading="loading"
        >
          Atualizar
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="d-flex flex-wrap gap-4">
      <v-skeleton-loader
        v-for="i in 3"
        :key="`skeleton-${i}`"
        type="card"
        width="344"
        height="200"
      />
    </div>

    <!-- Lista Vazia -->
    <v-card v-else-if="obrasFiltradas.length === 0" class="text-center py-8">
      <v-icon icon="mdi-inbox" size="48" color="grey-lighten-1" class="mb-4" />
      <h3 class="text-h6 mb-2">Nenhuma obra encontrada</h3>
      <p class="text-body-1 text-grey">Tente ajustar os filtros ou cadastre uma nova obra</p>
      <v-btn color="primary" class="mt-4" @click="novaObra"> Cadastrar Obra </v-btn>
    </v-card>

    <!-- Grid de Obras -->
    <v-row v-else>
      <v-col v-for="obra in obrasFiltradas" :key="obra.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="work-card" elevation="2" @click="acessarDetalhes(obra.id)">
          <v-card-item>
            <v-card-title class="text-h6 text-truncate">
              {{ obra.nome }}
            </v-card-title>
            <v-card-subtitle class="text-truncate">
              {{ obra.cliente || "Sem cliente associado" }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="d-flex flex-column gap-2">
            <div class="d-flex align-center">
              <v-icon icon="mdi-map-marker" size="18" class="mr-2" />
              <span class="text-truncate">
                {{ obra.endereco || "Endereço não informado" }}
              </span>
            </div>

            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar-start" size="18" class="mr-2" />
              <span>Início: {{ formatDate(obra.dataInicio) }}</span>
            </div>

            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar-end" size="18" class="mr-2" />
              <span>Término: {{ formatDate(obra.dataTerminoPrevista) }}</span>
            </div>
          </v-card-text>

          <v-divider class="mx-4" />

          <v-card-actions class="d-flex justify-space-between px-4 py-3">
            <v-chip :color="statusObraMap[obra.status!]?.color || 'grey'">
              {{ statusObraMap[obra.status!]?.text || obra.status }}
            </v-chip>

            <div class="d-flex gap-1">
              <v-btn
                icon="mdi-file-document"
                variant="text"
                color="primary"
                size="small"
                @click.stop="acessarRelatorios(obra.id)"
                title="Relatórios"
              />
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="secondary"
                size="small"
                @click.stop="editarObra(obra.id)"
                title="Editar"
              />
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.work-card {
  height: 100%;
  transition: all 0.2s ease;
  cursor: pointer;
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.gap-4 {
  gap: 16px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
