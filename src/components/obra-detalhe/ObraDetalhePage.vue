<script lang="ts" setup>
import type { Obra } from "@/domain/entities/obra/Obra";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import { ref, onMounted } from "vue";
import ObraDetalhe from "./components/ObraDetalhe.vue";
import { useRoute } from "vue-router"; // importa useRoute

const route = useRoute(); // acessa a rota

const obraRepo = new ObraRepository();
const obra = ref<Obra>();

onMounted(async () => {
  const id = Number(route.params.id); // pega o id da rota e converte para número
  if (id) {
    obra.value = await obraRepo.getById(id);
  }
});
</script>

<template>
  <obra-detalhe v-if="obra" :obra="obra" />
  <!-- <btn text="Novo relatório" prepend-inner-icon="mdi-plus" @click="goToNovoRelatorio"></btn> -->
</template>

<style lang="scss" scoped>
.list-rel {
  font-size: 20px;
  font-weight: 800;
  color: #666666;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
