<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ObraCard from "./components/ObraCard.vue";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import type { Obra } from "@/domain/entities/obra/Obra";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
const { goToObraDetalhePage, goToCreateObra } = useNavigation();

const obraRepo = new ObraRepository();
const obras = ref<Obra[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

async function getAll() {
  loading.value = true;
  try {
    obras.value = await obraRepo.getAll();
  } catch (err) {
    error.value = "Erro ao carregar obras. Tente novamente mais tarde.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  getAll();
});
</script>

<template>
  <div class="obra-page">
    <div class="header">
  <div class="header-left">
    <h1>📋 Suas Obras</h1>
    <p class="subtitle">Acompanhe e gerencie todas as suas construções em andamento.</p>
  </div>

  <v-btn 
    color="primary"
    prepend-icon="mdi-plus"
    @click="goToCreateObra"
    class="nova-obra-btn"
  >
    Nova Obra
  </v-btn>
</div>


    <div class="content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-grid">
        <div v-for="i in 3" :key="`loading-${i}`" class="card-placeholder">
          <div class="placeholder-content"></div>
        </div>
      </div>

      <!-- Conteúdo principal -->
      <div v-else class="obra-grid">
        <!-- Cards existentes -->
        <obra-card
          v-for="obra in obras"
          :key="obra.id"
          :obra="obra"
          class="card-real"
          @click="goToObraDetalhePage(obra.id)"
        />
        
        <!-- Placeholders "Adicionar nova obra" -->
        <div 
          v-for="i in Math.max(0, 3 - obras.length)"
          :key="`add-${i}`"
          class="card-placeholder"
          @click="goToCreateObra"
        >
          <div class="add-content">
            <v-icon icon="mdi-plus" size="40" color="grey-lighten-1" />
            <p>Adicionar nova obra</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; // pra mobile não quebrar feio
  margin-bottom: 24px;
  gap: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #2e7d32;
  }

  .subtitle {
    font-size: 1rem;
    color: #666;
    margin-top: 4px;
  }
}

.nova-obra-btn {
  white-space: nowrap;
}
.obra-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(primay)
  }
}

.content {
  min-height: 60vh;
}

.obra-grid, .loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 60px;
}
.card-real, .card-placeholder {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.card-placeholder {
  background: #e7e7e7;
  border: 1px dashed #e0e0e0;
  margin-top: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  .placeholder-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f5f5f5 25%, #e0e0e0 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  .add-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    
    p {
      margin-top: 12px;
      color: #616161;
      font-weight: 500;
    }
  }
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (min-width: 1024px) {
  .obra-grid, .loading-grid {
    grid-template-columns: repeat(3, 1fr); // Fixa 3 colunas no desktop
  }
}

@media (max-width: 768px) {
  .obra-page {
    padding: 16px;
    
    h1 {
      font-size: 1.5rem;
    }
  }
  
  .obra-grid, .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>