<template>
  <v-container class="pa-4" style="max-width: 1440px">
    <!-- Cabeçalho da Obra -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="d-flex justify-center align-center py-4">
        <v-icon color="primary" size="x-large" class="mr-2">mdi-home-city</v-icon>
        <span class="font-weight-bold title text-h5 text-md-h3">
          {{ obra.nome }}
        </span>
      </v-card-title>

      <v-divider class="mx-4 mb-4"></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar-start" color="blue-darken-2"></v-icon>
                </template>
                <v-list-item-title>Início: {{ formatDate(obra.dataInicio) }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar-end" color="red-darken-2"></v-icon>
                </template>
                <v-list-item-title>
                  Término previsto:
                  {{ obra.dataTerminoPrevista ? formatDate(obra.dataTerminoPrevista) : "Data não informada" }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  ({{ calcularDiasRestantes() }} dias restantes)
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account-hard-hat" color="orange-darken-2"></v-icon>
                </template>
                <v-list-item-title>Engenheiro: {{ obra.engenheiroResponsavel }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-map-marker" color="green-darken-2"></v-icon>
                </template>
                <v-list-item-title>Endereço: {{ obra.endereco }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account" color="purple-darken-2"></v-icon>
                </template>
                <v-list-item-title>Cliente: {{ obra.cliente }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :icon="statusIcon" :color="statusColor"></v-icon>
                </template>
                <v-list-item-title>
                  Status:
                  <v-chip :color="statusColor" size="small" class="ml-2" label>
                    {{ obra.status }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-progress-linear v-if="obra.dataInicio && obra.dataTerminoPrevista" :model-value="calcularProgresso()"
          height="20" rounded color="light-green" class="mt-4">
          <strong>{{ calcularProgresso() }}%</strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>

    <!-- Abas -->
    <v-tabs v-model="abaSelecionada" bg-color="white" color="primary" grow>
  <v-tab value="relatorios">
    <v-icon start color="primary">mdi-file-document</v-icon>
    <span class="text-subtitle-1 font-weight-medium">Relatórios</span>
  </v-tab>
  <v-tab value="financeiro">
    <v-icon start color="primary">mdi-cash-multiple</v-icon>
    <span class="text-subtitle-1 font-weight-medium">Financeiro</span>
  </v-tab>
</v-tabs>

    <div v-if="abaSelecionada === 'relatorios'">
      <div class="d-flex justify-end mt-4 mb-2 px-2">
  <v-btn color="primary" prepend-icon="mdi-plus" @click="novoRelatorio">
    Novo Relatório
  </v-btn>
</div>

      <list-relatorio />
    </div>

    <div v-if="abaSelecionada === 'financeiro'">
      <financeiro-obra v-if="obra?.id" :obra-id="obra.id" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Obra } from "@/domain/entities/obra/Obra";
import ListRelatorio from "./ListRelatorio.vue";
import FinanceiroObra from "./FinanceiroObra.vue";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const props = defineProps<{ obra: Obra }>();
const { goToCreateRegistroDiario } = useNavigation();

const abaSelecionada = ref('relatorios')

const statusIcon = computed(() => {
  const icons: Record<string, string> = {
    Andamento: "mdi-progress-clock",
    Cancelada: "mdi-cancel",
    Planejada: "mdi-calendar-text",
    Concluida: "mdi-check-all",
    Pausada: "mdi-pause",
  };
  return icons[props.obra.status!] || "mdi-help-circle";
});

const statusColor = computed(() => {
  const colors: Record<string, string> = {
    Andamento: "primary",
    Cancelada: "red",
    Planejada: "grey",
    Concluida: "green",
    Pausada: "orange",
  };
  return colors[props.obra.status!] || "grey";
});

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function calcularProgresso(): number {
  if (!props.obra.dataInicio || !props.obra.dataTerminoPrevista) return 0;
  const inicio = new Date(props.obra.dataInicio);
  const termino = new Date(props.obra.dataTerminoPrevista);
  const hoje = new Date();
  const total = termino.getTime() - inicio.getTime();
  const decorrido = hoje.getTime() - inicio.getTime();
  return Math.min(Math.round((decorrido / total) * 100), 100);
}

function calcularDiasRestantes(): number {
  if (!props.obra.dataTerminoPrevista) return 0;
  const termino = new Date(props.obra.dataTerminoPrevista);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  termino.setHours(0, 0, 0, 0);
  const diffTime = termino.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function novoRelatorio() {
  goToCreateRegistroDiario(props.obra.id);
}
</script>

<style scoped>
.btn-wrapper {
  margin-bottom: 16px;
}

.title {
  color: var(--primary);
  white-space: normal;
  text-align: center;
  word-break: break-word;
}
</style>
