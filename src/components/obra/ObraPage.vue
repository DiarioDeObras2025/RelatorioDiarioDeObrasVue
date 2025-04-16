<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import { Obra } from "@/domain/entities/obra/Obra";
import RoutePath from "@/router/route_patch";

const obras = ref<Obra[]>([]);
const router = useRouter();
const obraRepo = new ObraRepository();
const filtroStatus = ref<string | "todas">("todas");

const statusObra = [
  { value: "Andamento", text: "Andamento" },
  { value: "Cancelada", text: "Cancelada" },
  { value: "Planejada", text: "Planejada" },
  { value: "Concluída", text: "Concluída" },
  { value: "Pausada", text: "Pausada" },
];

const statusObraMap = Object.fromEntries(statusObra.map(({ value, text }) => [value, text]));

const obrasFiltradas = computed(() => {
  if (filtroStatus.value === "todas") return obras.value;
  return obras.value.filter((o) => o.status === filtroStatus.value);
});

onMounted(async () => {
  obras.value = await obraRepo.getAll();
});

function novaObra() {
  router.push(RoutePath.CREATE_OBRA);
}

function editarObra(id: number) {
  router.push(`/obra/editar/${id}`);
}

function acessarRelatorios(id: number) {
  router.push(`/obra/${id}/relatorios`);
}
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-space-between align-center mb-4">
      <v-col cols="auto">
        <h1 class="text-h5 font-weight-bold">Obras</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="novaObra" prepend-icon="mdi-plus">Nova Obra</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="filtroStatus"
          label="Filtrar por status"
          :items="[{ value: 'todas', text: 'Todas' }, ...statusObra]"
          item-value="value"
          item-title="text"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="obra in obrasFiltradas" :key="obra.id" cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h6">{{ obra.nome }}</v-card-title>
          <v-card-subtitle>{{ obra.cliente }}</v-card-subtitle>
          <v-card-text>
            <p>Status: {{ statusObraMap[obra.status!] }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" variant="outlined" @click="editarObra(obra.id)">
              Editar
            </v-btn>
            <v-btn color="primary" variant="flat" @click="acessarRelatorios(obra.id)">
              Relatórios
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
