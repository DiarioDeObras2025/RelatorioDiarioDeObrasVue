<template>
  <v-container class="pa-4">
    <!-- Cabeçalho da Obra -->
    <v-card class="mb-6" elevation="2">
      <v-img
        height="200"
        src="https://media.istockphoto.com/id/473919658/pt/foto/local-de-constru%C3%A7%C3%A3o.jpg?s=1024x1024&w=is&k=20&c=bqee-Mr3mPou8b-7LwDftQHoR03EpX_j73nyBJiioQM="
        cover
      >
        <v-card-title
          class="text-h4 white--text"
          style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8)"
        >
          {{ obra.nome }}
        </v-card-title>
      </v-img>

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
                  <v-icon icon="mdi-office-building" color="purple-darken-2"></v-icon>
                </template>
                <v-list-item-title>Cliente: {{ obra.cliente }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :icon="statusIcon" :color="statusColor"></v-icon>
                </template>
                <v-list-item-title
                  >Status:
                  <v-chip :color="statusColor" size="small" class="ml-2">
                    {{ obra.status }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn color="primary" prepend-icon="mdi-pencil" @click="goToEditCreate">
          Editar Obra
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" prepend-icon="mdi-plus" @click="novoRelatorio">
          Novo Relatório
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="btn-wrapper">
  <v-btn 
    color="primary"
    prepend-icon="mdi-plus"
    @click="novoRelatorio"
    class="nova-obra-btn"
  >
    Novo relatório
  </v-btn>
</div>

    <list-relatorio class="mt-4" />
  </v-container>
</template>

<script lang="ts" setup>
import type { Obra } from "@/domain/entities/obra/Obra";
import { computed } from "vue";
import { useRouter } from "vue-router";
import ListRelatorio from "./ListRelatorio.vue";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const props = defineProps<{
  obra: Obra;
}>();

const router = useRouter();
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

function goToEditCreate() {
  router.push({ name: "obra-editar", params: { id: props.obra.id } });
}

function novoRelatorio() {
  goToCreateRegistroDiario(props.obra.id);
}

</script>

<style scoped>
.relatorio-detalhes {
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.v-expansion-panel-title {
  font-weight: 500;
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
