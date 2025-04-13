<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import FormObra from "../obra-create/components/FormObra.vue";
import { Obra } from "@/domain/entities/obra/Obra";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";

const route = useRoute();
const obra = ref<Obra | null>(null);
const obraRepo = new ObraRepository();

onMounted(async () => {
  const id = Number(route.params.id);
  if (id) {
    const response = await obraRepo.getById(id);
    obra.value = response;
  }
});
</script>

<template>
  <div v-if="obra">
    <FormObra :obra="obra" />
  </div>
  <div v-else>Carregando...</div>
</template>
