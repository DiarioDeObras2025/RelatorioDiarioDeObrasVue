<script lang="ts" setup>
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import { onMounted, ref } from "vue";
import Btn from "@/@shared/components/button/Btn.vue";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
import { useRoute } from "vue-router";
import { useToast } from "@/composables/toast/Toast.composable";
const { showToast } = useToast();

const repository = new RegistroDiarioRepository();
const loading = ref(true);
const registroDiario = ref<RegistroDiario[]>([]);
const route = useRoute();

const obraId = Number(route.params.id);
const { goToEditRegistroDiario } = useNavigation();

async function getAllFromObraId() {
  loading.value = true;
  try {
    registroDiario.value = await repository.getRelatorioFromObraid(obraId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function goToEditRegistro(id: number) {
  goToEditRegistroDiario(id);
}

function gerarPDF(idRelatorio: number, idObra: number) {
  repository.gerarPdf(idRelatorio, idObra).catch((error) => {
    console.error("Falha ao gerar PDF:", error);
  });
}

onMounted(async () => {
  await getAllFromObraId();
});

const formatarData = (dataString: string | Date): string => {
  if (!dataString) return "Não definida";

  const data = new Date(dataString);
  if (isNaN(data.getTime())) return "Data inválida";

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};

const getClimaIcon = (condicao: any) => {
  const icons = [
    "mdi-weather-sunny", // 0 - Ensolarado
    "mdi-weather-partly-cloudy", // 1 - Parcialmente nublado
    "mdi-weather-cloudy", // 2 - Nublado
    "mdi-weather-pouring", // 3 - Chuvoso
    "mdi-weather-lightning", // 4 - Tempestade
  ];
  return icons[condicao] || "mdi-weather-cloudy";
};

const getClimaColor = (condicao: any) => {
  const colors = [
    "amber", // 0 - Ensolarado
    "light-blue", // 1 - Parcialmente nublado
    "grey", // 2 - Nublado
    "blue", // 3 - Chuvoso
    "deep-purple", // 4 - Tempestade
  ];
  return colors[condicao] || "grey";
};

async function duplicarRegistro(idObra: number, idRegistro: number) {
  try {
    const response = await repository.duplicarRelatorio(idObra, idRegistro);
    showToast('Redirecionando para o novo relatório...');

    setTimeout(() => {
      goToEditRegistro(response.id);
    }, 1500);
    
  } catch (error) {
    showToast('Erro ao duplicar relatório!', 'red');
  }
}

</script>

<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-file-document-multiple" color="indigo-darken-2" class="mr-2"></v-icon>
      Relatórios Diários
      <v-spacer />
      <v-chip color="indigo" text-color="white" class="mr-2">
        Total: {{ registroDiario.length }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(relatorio, index) in registroDiario" :key="index">
          <v-expansion-panel-title expand-icon="mdi-chevron-down">
            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar" color="teal-darken-2" class="mr-2"></v-icon>
              {{ formatarData(relatorio.data!) }} - {{ relatorio.titulo || "Sem título" }}
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="relatorio-detalhes pa-4">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-3">
                    <v-icon
                      icon="mdi-text-box-edit-outline"
                      color="blue-grey"
                      class="mr-2"
                    ></v-icon>
                    <strong>Resumo:</strong> {{ relatorio.resumo || "Nenhum resumo fornecido" }}
                  </div>

                  <div class="mb-3">
                    <v-icon
                      :icon="getClimaIcon(relatorio.condicoesClimaticas || 0)"
                      :color="getClimaColor(relatorio.condicoesClimaticas || 0)"
                      class="mr-2"
                    ></v-icon>
                    <strong>Clima:</strong>
                    {{ [relatorio.condicoesClimaticas || 0] }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="mb-3">
                    <v-icon icon="mdi-clock-outline" color="orange" class="mr-2"></v-icon>
                    <strong>Horas trabalhadas:</strong> {{ relatorio.horasTrabalhadas || 0 }}h
                  </div>

                  <div class="mb-3">
                    <v-icon icon="mdi-alert-box-outline" color="red" class="mr-2"></v-icon>
                    <strong>Ocorrências:</strong> {{ relatorio.ocorrencias || "Nenhuma" }}
                  </div>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between mt-4">
                <!-- Botão Duplicar à esquerda -->
                <btn
                  text="Duplicar relatório"
                  variant="tonal"
                  prepend-icon="mdi-content-copy"
                  @click="duplicarRegistro(relatorio.obraId, relatorio.id)"
                ></btn>

                <!-- Grupo de botões à direita -->
                <div style="gap: 8px" class="d-flex">
                  <btn
                    text="Editar"
                    variant="tonal"
                    prepend-icon="mdi-pencil"
                    @click="goToEditRegistro(relatorio.id)"
                  ></btn>
                  <btn
                    text="Gerar PDF"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-file-pdf-box"
                    @click="gerarPDF(relatorio.id, relatorio.obraId)"
                  ></btn>
                </div>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-alert
        v-if="registroDiario.length === 0 && !loading"
        type="info"
        color="primary"
        class="mt-4"
        variant="outlined"
      >
        Nenhum relatório cadastrado ainda.
      </v-alert>

      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="ma-4"
      ></v-progress-circular>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.relatorio-detalhes {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.v-expansion-panel-title {
  font-weight: 500;
}

.v-expansion-panel-text__wrapper {
  padding: 0;
}
</style>
