<script lang="ts" setup>
import type { Obra } from "@/domain/entities/obra/Obra";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
import ObraCardNovo from "./ObraCard.vue";
import { useDimession } from "@/composables/dimension/Dimension.composable";

const { isDesktop } = useDimession()

defineProps<{
  obras: Obra[];
}>();

const { goToObraDetalhePage, goToCreateObra } = useNavigation();

function goToObraDetalhe(id: number) {
  goToObraDetalhePage(id);
}
</script>

<template>
  <div class="content-wrapper">
    <!-- Estado vazio modernizado -->
    <div v-if="obras.length === 0" class="empty-state">
      <div class="illustration">
        <v-icon icon="mdi-domain" size="80" color="primary" />
      </div>
      
      <h3 class="empty-title">Nenhuma obra cadastrada</h3>
      <p class="empty-description">Você ainda não possui obras cadastradas. Comece criando uma nova obra.</p>
      
      <v-btn
        color="primary"
        variant="tonal"
        size="large"
        @click="goToCreateObra"
        class="empty-action"
      >
        <v-icon icon="mdi-plus" class="mr-2"></v-icon>
        Criar primeira obra
      </v-btn>
    </div>

    <!-- Grid de obras -->
    <div v-else class="obra-grid" :class="{ 'single-item': obras.length === 1 }">
      <obra-card-novo
        v-for="obra in obras"
        :key="obra.id"
        :obra="obra"
        @click="goToObraDetalhe(obra.id)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-wrapper {
  padding: 24px;
}

.obra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  cursor: pointer;
  
  &.single-item {
    grid-template-columns: minmax(300px, 400px);
    justify-content: center;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  gap: 16px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.illustration {
  background-color: rgba(var(--v-theme-primary), 0.1);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 24px;
  max-width: 400px;
}

.empty-action {
  margin-top: 16px;
  padding: 12px 24px;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }
  
  .obra-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    
    &.single-item {
      grid-template-columns: 1fr;
    }
    
    :deep(.v-card) {
      width: 100%;
      margin: 0;
    }
  }
  
  .empty-state {
    height: 60vh;
    padding: 16px;
  }
  
  .empty-title {
    font-size: 1.25rem;
  }
}
</style>