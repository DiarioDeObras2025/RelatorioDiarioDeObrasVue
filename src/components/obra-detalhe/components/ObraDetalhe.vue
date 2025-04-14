<template>
  <v-container class="pa-4">
    <!-- Cabeçalho da Obra -->
    <v-card class="mb-6" elevation="2">
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

              <v-list-item v-if="obra.dataTerminoPrevista">
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar-end" color="red-darken-2"></v-icon>
                </template>
                <v-list-item-title
                  >Término previsto: {{ formatDate(obra.dataTerminoPrevista) }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >({{ calcularDiasRestantes() }} dias restantes)</v-list-item-subtitle
                >
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

        <!-- Barra de Progresso -->
        <v-progress-linear
          v-if="obra.dataInicio && obra.dataTerminoPrevista"
          :model-value="calcularProgresso()"
          height="20"
          rounded
          color="light-green"
          class="mt-4"
        >
          <strong>{{ calcularProgresso() }}%</strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>

    <!-- Botão Novo Relatório -->
    <div class="btn-wrapper">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="novoRelatorio" class="mb-4" block>
        Novo Relatório
      </v-btn>
    </div>

    <!-- Lista de Relatórios -->
    <list-relatorio />
  </v-container>
</template>

<script lang="ts" setup>
import type { Obra } from "@/domain/entities/obra/Obra";
import { computed } from "vue";
import ListRelatorio from "./ListRelatorio.vue";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const props = defineProps<{
  obra: Obra;
}>();

const { goToCreateRegistroDiario } = useNavigation();

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

.v-progress-linear {
  margin-top: 16px;
}

.v-list-item {
  padding-left: 0;
}
</style>
