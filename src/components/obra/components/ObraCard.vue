<script lang="ts" setup>
import type { Obra } from "@/domain/entities/obra/Obra";

defineProps<{
  obra: Obra;
}>();

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    Andamento: "primary",
    Cancelada: "red",
    Planejada: "default",
    Concluida: "blue",
    Pausada: "orange",
  };
  return statusColors[status] || "default";
};
</script>

<template>
  <v-card class="my-2" max-width="374">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://media.istockphoto.com/id/473919658/pt/foto/local-de-constru%C3%A7%C3%A3o.jpg?s=1024x1024&w=is&k=20&c=bqee-Mr3mPou8b-7LwDftQHoR03EpX_j73nyBJiioQM="
      cover
    ></v-img>

    <v-card-item>
      <v-card-title>{{ obra.nome }}</v-card-title>

      <v-card-subtitle>
        <v-icon color="primary" icon="mdi-map-marker" size="small"></v-icon>
        <span class="me-1">{{ obra.endereco }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-icon color="error" icon="mdi-image-multiple" size="small"></v-icon>

        <div class="text-grey ms-2">{{ obra.totalRegistrosDiarios }} Relatório(s)</div>

        <v-icon class="ml-3" color="error" icon="mdi-paperclip-check" size="small"></v-icon>

        <div class="text-grey ms-2">4 anexo</div>
      </v-row>

      <div class="mt-6 text-subtitle">
        <v-icon icon="mdi-account" size="small"></v-icon>
        {{ obra.cliente }}
      </div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>
      <span class="data-inicio-label">Data de início:</span>
      <span class="data-inicio">{{ new Date(obra.dataInicio).toLocaleDateString("pt-BR") }}</span>
    </v-card-title>

    <div class="px-4 mb-2">
      <v-chip :color="getStatusColor(obra.status!)">{{ obra.status }}</v-chip>
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
.data-inicio-label {
  font-weight: 500;
  color: #555;
}

.text-subtitle {
  font-size: 12px;
  color: #a1a0a0;
}

.data-inicio {
  font-weight: bold;
  color: var(--primary); // roxo escuro bonito
  font-size: 1.1rem;
  margin-left: 6px;
}
</style>
