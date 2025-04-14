<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import CreateRegistroDiario from "../create-registro-diario/CreateRegistroDiario.vue";

const route = useRoute();
const registroDiario = ref<RegistroDiario | null>(null);
const registroDiarioRepository = new RegistroDiarioRepository();

onMounted(async () => {
  const idRegistro = Number(route.params.id);
  if (idRegistro) {
    const response = await registroDiarioRepository.getById(idRegistro);
    registroDiario.value = response;
  }
});
</script>

<template>
  <div v-if="registroDiario">
    <CreateRegistroDiario :registro="registroDiario" />
  </div>
  <div v-else>Carregando...</div>
</template>
