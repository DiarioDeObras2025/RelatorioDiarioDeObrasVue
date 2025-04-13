<script lang="ts" setup>
import { useDimession } from "@/composables/dimension/Dimension.composable";
import type { Obra } from "@/domain/entities/obra/Obra";
import { computed } from "vue";

const props = defineProps<{
  obra: Obra;
}>();

const { isDesktop } = useDimession();

const statusClasses = computed(() => {
  switch (props.obra.status?.toLowerCase()) {
    case "em andamento":
      return "blue";
    case "concluído":
      return "green";
    case "cancelado":
      return "red";
    default:
      return "black";
  }
});
</script>

<template>
  <v-card class="floating-card pa-4">
    <h1 class="title-container">
      <span class="title-text">
        <v-icon class="mr-1" color="secondary" icon="mdi-domain" size="x-small"></v-icon>
        {{ obra.nome }}
      </span>
      <div v-if="isDesktop" class="title-right">
        <p>
          <v-icon class="mr-1" color="primary" icon="mdi-account-hard-hat" size="x-small"></v-icon>
          {{ obra.engenheiroResponsavel }}
        </p>
      </div>
    </h1>
    <v-divider class="mt-2"></v-divider>
    <div class="title-container">
      <p class="mt-2">
        <v-icon class="mr-1" color="primary" icon="mdi-map-marker" size="x-small"></v-icon
        >{{ obra.endereco }}
      </p>
      <div class="title-right">
        <v-chip v-if="isDesktop" class="mt-2" :color="statusClasses">
          {{ obra.status }}
        </v-chip>
      </div>
    </div>

    <p>
      <v-icon class="mr-1" color="secondary" icon="mdi-account" size="x-small"></v-icon
      >{{ obra.cliente }}
    </p>
    <v-chip v-if="!isDesktop" class="mt-2" :color="statusClasses">
      {{ obra.status }}
    </v-chip>
  </v-card>
</template>

<style lang="scss" scoped>
.floating-card {
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  animation: float 3s ease-in-out infinite;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  height: auto;
  overflow: hidden;
}

/* .floating-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
} */

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-text {
  font-weight: bold;
  font-size: 1.1rem;
}

.title-right {
  font-size: 0.9rem;
  color: #555;
  -size: 1.1rem;
}

.title-right {
  font-size: 0.9rem;
  color: #555;
}
</style>
