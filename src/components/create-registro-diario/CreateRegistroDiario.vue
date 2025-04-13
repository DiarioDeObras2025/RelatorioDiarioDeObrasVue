<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  RegistroDiario,
  CondicaoClimaticaEnum,
  EtapaObraEnum,
} from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import { useToast } from "@/composables/toast/Toast.composable";

const registroRepo = new RegistroDiarioRepository();
const props = defineProps<{ registro?: RegistroDiario }>();
const router = useRouter();
const loading = ref(false);

const route = useRoute();
const obraId = Number(route.params.id);

// Listas para selects
const materiaisComuns = ref([
  "Cimento",
  "Tijolos",
  "Areia",
  "Brita",
  "Tubo PVC",
  "Argamassa",
  "Tinta",
  "Ferro",
  "Madeira",
  "Concreto",
  "Telhas",
  "Vergalhões",
  "Blocos",
  "Rejunte",
]);

const condicoesClimaticas = ref([
  { value: CondicaoClimaticaEnum.ENSOLARADO, text: "Ensolarado" },
  { value: CondicaoClimaticaEnum.PARCIALMENTE_NUBLADO, text: "Parcialmente Nublado" },
  { value: CondicaoClimaticaEnum.NUBLADO, text: "Nublado" },
  { value: CondicaoClimaticaEnum.CHUVOSO, text: "Chuvoso" },
  { value: CondicaoClimaticaEnum.CHUVA_FORTE, text: "Chuva Forte" },
  { value: CondicaoClimaticaEnum.TEMPESTADE, text: "Tempestade" },
]);

const etapasObra = ref([
  { value: EtapaObraEnum.PREPARACAO_TERRENO, text: "Preparação do terreno" },
  { value: EtapaObraEnum.FUNDACAO, text: "Fundação" },
  { value: EtapaObraEnum.ESTRUTURA, text: "Estrutura" },
  { value: EtapaObraEnum.ALVENARIA, text: "Alvenaria" },
  { value: EtapaObraEnum.INSTALACOES, text: "Instalações" },
  { value: EtapaObraEnum.COBERTURA, text: "Cobertura" },
  { value: EtapaObraEnum.ACABAMENTO, text: "Acabamento" },
]);
// Estado do registro
const registro = ref<RegistroDiario>(
  props.registro ? RegistroDiario.fromPartial(props.registro) : RegistroDiario.createEmpty(),
);

const { showToast } = useToast();

type RegistroDiarioPayload = {
  id: number;
  data: Date; // Date convertido em string ISO
  obraId: number;
  resumo: string;
  condicoesClimaticas: CondicaoClimaticaEnum;
  totalFuncionarios: number;
  totalTerceirizados: number;
  horasTrabalhadas: number;
  equipamentos: string;
  consumoCimento: number;
  materiais: string[];
  etapa: EtapaObraEnum;
  percentualConcluido: number;
  areaExecutada: number;
  ocorrencias: string;
  temperatura: string;
  precipitacao: number | null;
  assinaturaResponsavel: string;
  dataAssinatura: Date | null;
  titulo: string;
};

const salvarRegistro = async () => {
  loading.value = true;

  try {
    const payload: RegistroDiarioPayload = {
      id: registro.value.id,
      data: registro.value.data!,
      obraId: obraId,
      resumo: registro.value.resumo,
      condicoesClimaticas: registro.value.condicoesClimaticas,
      totalFuncionarios: registro.value.totalFuncionarios,
      totalTerceirizados: registro.value.totalTerceirizados,
      horasTrabalhadas: registro.value.horasTrabalhadas,
      equipamentos: registro.value.equipamentos,
      consumoCimento: registro.value.consumoCimento,
      materiais: registro.value.materiais,
      etapa: registro.value.etapa,
      percentualConcluido: registro.value.percentualConcluido,
      areaExecutada: registro.value.areaExecutada,
      ocorrencias: registro.value.ocorrencias,
      temperatura: registro.value.temperatura,
      precipitacao: registro.value.precipitacao,
      assinaturaResponsavel: registro.value.assinaturaResponsavel,
      dataAssinatura: registro.value.dataAssinatura ? registro.value.dataAssinatura : null,
      titulo: registro.value.titulo,
    };

      registro.value.id === 0
        ? await registroRepo.create(payload)
        : await registroRepo.update(payload);

        showToast("Registro salvo com sucesso!", "success");
        setTimeout(() => router.go(-1), 1500);
  } catch (error) {
  console.error("Erro ao salvar:", error);
  showToast(error instanceof Error ? error.message : "Erro desconhecido", "red");
} finally {
    loading.value = false;
  }
};
function gotoListRegistro() {
  router.go(-1);
}

// Watch para atualizar registro se a prop mudar
watch(
  () => props.registro,
  (novoRegistro) => {
    if (novoRegistro) {
      registro.value = RegistroDiario.fromPartial(novoRegistro);
    }
  },
  { immediate: true, deep: true },
);

function formatDate(date: any) {
      // Implemente a formatação da data conforme necessário
      return date ? new Date(date).toLocaleDateString('pt-BR') : null;
    }
</script>
<template>
  <v-container class="pa-4" style="max-width: 800px">
    <!-- Barra de Status -->
    <v-card class="mb-6" elevation="1">
      <v-card-text class="d-flex justify-space-between align-center py-3">
        <div>
          <v-chip color="primary" variant="outlined" class="mr-2">
            <v-icon icon="mdi-calendar" start></v-icon>
            {{ formatDate(registro.data) || 'Hoje' }}
          </v-chip>
          <v-chip v-if="registro.condicoesClimaticas" color="blue-lighten-4">
            <v-icon icon="mdi-weather-cloudy" start></v-icon>
            {{ registro.condicoesClimaticas }}
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
      <v-icon icon="mdi-file-document-edit" color="primary" size="32" class="mr-2"></v-icon>
      {{ registro.id === 0 ? "Novo Registro Diário" : "Editar Registro" }}
    </v-card-title>
    <!-- Formulário -->
    <v-card elevation="2" class="pa-6">
      <v-text-field
                  label="Título do relatório"
                  v-model="registro.titulo"
                  rows="2"
                  prepend-inner-icon="mdi-alert-circle"
                ></v-text-field>

      <!-- Seção Básica -->
      <v-card-text class="pa-0">
        <v-textarea
          label="Resumo das atividades"
          variant="outlined"
          v-model="registro.resumo"
          rows="4"
          class="mb-4"
          placeholder="Descreva as atividades realizadas hoje..."
          required
        ></v-textarea>
      </v-card-text>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Data"
            type="date"
            v-model="registro.data"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Condições Climáticas"
            v-model="registro.condicoesClimaticas"
            variant="outlined"
            :items="condicoesClimaticas"
            item-value="value"
            item-title="text"
            prepend-inner-icon="mdi-weather-cloudy"
          />
        </v-col>
      </v-row>

      <!-- Seção Expansível 1: Equipe -->
      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
            Informações da Equipe
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Total de Funcionários"
                  type="number"
                  v-model="registro.totalFuncionarios"
                  variant="outlined"
                  min="0"
                  prepend-inner-icon="mdi-account-hard-hat"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Total de Terceirizados"
                  type="number"
                  v-model="registro.totalTerceirizados"
                  variant="outlined"
                  min="0"
                  prepend-inner-icon="mdi-account-group"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Horas Trabalhadas"
                  type="number"
                  v-model="registro.horasTrabalhadas"
                  variant="outlined"
                  min="0"
                  suffix="horas"
                  prepend-inner-icon="mdi-clock-outline"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção Expansível 2: Materiais -->
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-package-variant" class="mr-2"></v-icon>
            Materiais e Equipamentos
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  label="Materiais Utilizados"
                  v-model="registro.materiais"
                  multiple
                  chips
                  :items="materiaisComuns"
                  prepend-inner-icon="mdi-package-variant"
                ></v-combobox>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Equipamentos Utilizados"
                  v-model="registro.equipamentos"
                  prepend-inner-icon="mdi-tools"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Consumo de Cimento (sacos)"
                  type="number"
                  v-model="registro.consumoCimento"
                  min="0"
                  prepend-inner-icon="mdi-sack"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção Expansível 3: Progresso -->
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-progress-check" class="mr-2"></v-icon>
            Progresso da Obra
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-select
                  label="Etapa Atual"
                  v-model="registro.etapa"
                  :items="etapasObra"
                  item-value="value"
                  item-title="text"
                  prepend-inner-icon="mdi-construction"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-slider
                  label="Percentual Concluído"
                  v-model="registro.percentualConcluido"
                  thumb-label="always"
                  min="0"
                  max="100"
                  step="5"
                  prepend-icon="mdi-progress-check"
                ></v-slider>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Área Executada (m²)"
                  type="number"
                  v-model="registro.areaExecutada"
                  min="0"
                  prepend-inner-icon="mdi-ruler-square"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção Expansível 4: Ocorrências -->
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
            Ocorrências e Observações
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Ocorrências Registradas"
                  v-model="registro.ocorrencias"
                  rows="2"
                  prepend-inner-icon="mdi-alert-circle"
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Temperatura Ambiente (ºC)"
                  type="number"
                  v-model="registro.temperatura"
                  prepend-inner-icon="mdi-thermometer"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Precipitação (mm)"
                  type="number"
                  v-model="registro.precipitacao"
                  min="0"
                  prepend-inner-icon="mdi-weather-pouring"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção Expansível 5: Anexos -->
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-paperclip" class="mr-2"></v-icon>
            Anexos e Documentos
          </v-expansion-panel-title>
          <!-- <v-expansion-panel-text>
            <v-file-input
              label="Fotos do dia"
              v-model="registro.anexosFotos"
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
            ></v-file-input>

            <v-file-input
              label="Documentos"
              v-model="registro.anexosDocumentos"
              multiple
              accept=".pdf,.doc,.docx"
              prepend-icon="mdi-file-document"
              class="mt-4"
            ></v-file-input>
          </v-expansion-panel-text> -->
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Ações -->
      <v-card-actions class="pa-0 mt-6">
        <v-spacer></v-spacer>
        <v-btn
          @click="gotoListRegistro"
          color="primary"
          variant="outlined"
          size="large"
          class="mr-2"
        >
          <v-icon icon="mdi-arrow-left" class="mr-1"></v-icon>
          Voltar
        </v-btn>
        <v-btn
          @click="salvarRegistro"
          color="primary"
          size="large"
          :loading="loading"
          variant="tonal"
        >
          <v-icon icon="mdi-content-save" class="mr-1"></v-icon>
          {{ registro.id === 0 ? "Salvar Registro" : "Atualizar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Estilos melhorados */
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

/* Melhoria no hover */
.v-expansion-panel:hover {
  border-color: var(--primary);
  transition: border-color 0.3s ease;
}
</style>
