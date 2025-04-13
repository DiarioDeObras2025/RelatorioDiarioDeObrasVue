<script lang="ts" setup>
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import { onMounted, ref } from "vue";
import Btn from "@/@shared/components/button/Btn.vue";

const repository = new RegistroDiarioRepository();
const loading = ref(true);
const registroDiario = ref<RegistroDiario[]>([]);


async function getAllFromObraId() {
  loading.value = true;
  try {
    registroDiario.value = await repository.getRelatorioFromObraid(1);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  getAllFromObraId();
});

const relatorios = ref([
  {
    data: "05/04/2025",
    atividade: "Concretagem da laje",
    equipe: 5,
    clima: "Nublado",
    observacoes: "Concretagem concluída conforme planejado",
    anexos: 2,
  },
  {
    data: "06/04/2025",
    atividade: "Assentamento de tijolos",
    equipe: 3,
    clima: "Ensolarado",
    observacoes: "Andamento dentro do cronograma",
    anexos: 1,
  },
  {
    data: "06/04/2025",
    atividade: "Assentamento de tijolos",
    equipe: 3,
    clima: "Ensolarado",
    observacoes: "Andamento dentro do cronograma",
    anexos: 1,
  },
]);
</script>

<template>
  <!-- Seção de Relatórios -->
  <v-card class="mb-4" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-file-document-multiple" color="indigo-darken-2" class="mr-2"></v-icon>
      Relatórios Diários
    </v-card-title>

    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(relatorio, index) in registroDiario" :key="index">
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar" color="teal-darken-2" class="mr-2"></v-icon>
              {{ relatorio.data }} - {{ relatorio.titulo }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="relatorio-detalhes">
              <div class="mb-2">
                <v-icon icon="mdi-account-group" color="blue-grey-darken-2" class="mr-1"></v-icon>
                <strong>Equipe:</strong> {{ relatorio.totalFuncionarios }} pessoas
              </div>
              <div class="mb-2">
                <v-icon icon="mdi-weather-cloudy" color="light-blue-darken-2" class="mr-1"></v-icon>
                <strong>Condições climáticas:</strong> {{ relatorio.condicoesClimaticas }}
              </div>
              <div class="mb-2">
                <v-icon icon="mdi-text-box" color="amber-darken-2" class="mr-1"></v-icon>
                <strong>Observações:</strong> {{ relatorio.ocorrencias }}
              </div>
              <btn text="visualizar" variant="outlined"></btn>

              <!-- <v-chip-group v-if="relatorio.anexos > 0" class="mt-2">
                <v-chip prepend-icon="mdi-paperclip" size="small" color="deep-purple-lighten-4">
                  {{ relatorio.anexos }} anexo(s)
                </v-chip>
              </v-chip-group> -->
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-alert v-if="relatorios.length === 0" type="info" class="mt-4">
        Nenhum relatório cadastrado ainda.
      </v-alert>
    </v-card-text>
  </v-card>
</template>
