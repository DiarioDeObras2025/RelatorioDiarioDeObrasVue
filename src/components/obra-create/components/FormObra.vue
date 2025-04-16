<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Obra } from "@/domain/entities/obra/Obra";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import { useToast } from "@/composables/toast/Toast.composable";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const obraRepo = new ObraRepository();
const props = defineProps<{ obra?: Obra }>();
const router = useRouter();
const loading = ref(false);
const { goToListObra } = useNavigation();

const statusObra = Object.entries({
  0: "Andamento",
  1: "Cancelada",
  2: "Planejada",
  3: "Concluída",
  4: "Pausada",
}).map(([value, text]) => ({ value: Number(value), text }));

const obra = ref<Obra>(
  props.obra
    ? new Obra(
        props.obra.id,
        props.obra.nome,
        props.obra.endereco,
        props.obra.cliente,
        props.obra.numeroContrato,
        props.obra.dataInicio ? new Date(props.obra.dataInicio) : new Date(),
        props.obra.engenheiroResponsavel ?? "",
        props.obra.dataTerminoPrevista ? new Date(props.obra.dataTerminoPrevista) : null,
        props.obra.status ?? "",
        props.obra.dataCriacao ?? new Date(),
        props.obra.dataAtualizacao ?? new Date(),
      )
    : new Obra(0, "", "", "", "", new Date(), "", null, "", new Date(), new Date()),
);

const { showToast } = useToast();

const salvarObra = async () => {
  loading.value = true;

  try {
    const payload = {
      id: obra.value.id,
      nome: obra.value.nome,
      endereco: obra.value.endereco,
      cliente: obra.value.cliente,
      numeroContrato: obra.value.numeroContrato,
      dataInicio: obra.value.dataInicio,
      engenheiroResponsavel: obra.value.engenheiroResponsavel,
      dataTerminoPrevista: obra.value.dataTerminoPrevista,
      status: obra.value.status,
    };

    obra.value.id === 0 ? await obraRepo.create(payload) : await obraRepo.update(payload);

    showToast("Obra salva com sucesso!", "success");
    setTimeout(() => goToListObra(), 1500);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    showToast(error instanceof Error ? error.message : "Erro desconhecido", "red");
  } finally {
    loading.value = false;
  }
};

function voltar() {
  router.go(-1);
}

watch(
  () => props.obra,
  (novaObra) => {
    if (novaObra) {
      obra.value = novaObra;
    }
  },
  { immediate: true, deep: true },
);

function formatDate(date: Date | null) {
  return date ? new Date(date).toLocaleDateString("pt-BR") : "Não definida";
}
</script>

<template>
  <v-container class="pa-4" style="max-width: 1440px">
    <!-- Barra de Status -->
    <v-card class="mb-6" elevation="1">
      <v-card-text class="d-flex justify-space-between align-center py-3">
        <div>
          <v-chip color="primary" variant="outlined" class="mr-2">
            <v-icon icon="mdi-calendar" start></v-icon>
            {{ formatDate(obra.dataInicio) }}
          </v-chip>
          <v-chip v-if="obra.status" color="blue-lighten-4">
            <v-icon icon="mdi-progress-check" start></v-icon>
            {{ obra.status }}
          </v-chip>
        </div>
        <v-btn variant="text" color="primary" size="small">
          <v-icon icon="mdi-printer" class="mr-1"></v-icon>
          Imprimir
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Cabeçalho -->
    <v-card-title class="text-h5 font-weight-bold mb-4 d-flex align-center">
      <v-icon icon="mdi-home-edit" color="primary" size="32" class="mr-2"></v-icon>
      {{ obra.id === 0 ? "Nova Obra" : "Editar Obra" }}
    </v-card-title>

    <!-- Formulário -->
    <v-card elevation="2" class="pa-6">
      <!-- Seção Básica -->
      <v-card-text class="pa-0">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Nome da Obra"
              v-model="obra.nome"
              variant="outlined"
              prepend-inner-icon="mdi-form-textbox"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Endereço"
              v-model="obra.endereco"
              variant="outlined"
              prepend-inner-icon="mdi-map-marker"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Cliente"
              v-model="obra.cliente"
              variant="outlined"
              prepend-inner-icon="mdi-account-tie"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Número do Contrato"
              v-model="obra.numeroContrato"
              variant="outlined"
              prepend-inner-icon="mdi-file-document"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Engenheiro Responsável"
              v-model="obra.engenheiroResponsavel"
              variant="outlined"
              prepend-inner-icon="mdi-account-hard-hat"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Seção Expansível 1: Datas -->
      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-calendar-range" class="mr-2"></v-icon>
            Datas Importantes
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Data de Início"
                  type="date"
                  v-model="obra.dataInicio"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar-start"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Data de Término Prevista"
                  type="date"
                  v-model="obra.dataTerminoPrevista"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar-end"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção Expansível 2: Status -->
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-progress-check" class="mr-2"></v-icon>
            Status da Obra
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  label="Status"
                  v-model="obra.status"
                  :items="statusObra"
                  item-title="text"
                  item-value="value"
                  :return-object="false"
                  prepend-inner-icon="mdi-list-status"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Ações -->
      <v-card-actions class="pa-0 mt-6">
        <v-spacer></v-spacer>
        <v-btn @click="voltar" color="primary" variant="outlined" size="large" class="mr-2">
          <v-icon icon="mdi-arrow-left" class="mr-1"></v-icon>
          Voltar
        </v-btn>
        <v-btn @click="salvarObra" color="primary" size="large" :loading="loading" variant="tonal">
          <v-icon icon="mdi-content-save" class="mr-1"></v-icon>
          {{ obra.id === 0 ? "Salvar Obra" : "Atualizar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Estilos consistentes com o exemplo */
.v-text-field,
.v-textarea,
.v-select {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.v-card-text {
  padding-bottom: 16px;
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
}

.v-expansion-panel {
  margin-bottom: 8px;
  border-radius: 8px !important;
  border: 1px solid #e0e0e0;
}

.v-expansion-panel-title {
  min-height: 56px;
  font-weight: 500;
}

.v-expansion-panel-text {
  padding: 16px 0;
}

.v-expansion-panel:hover {
  border-color: var(--primary);
  transition: border-color 0.3s ease;
}
</style>
