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

const props = defineProps<{ registro?: RegistroDiario }>();
const router = useRouter();
const route = useRoute();
const { showToast } = useToast();

const registroRepo = new RegistroDiarioRepository();
const loading = ref(false);
const obraId = Number(route.params.id);

const registro = ref<RegistroDiario>(
  props.registro ? RegistroDiario.fromPartial(props.registro) : RegistroDiario.createEmpty(),
);

const materiaisComuns = ref([
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

const unidadesMedida = ref(["kg", "g", "L", "mL", "m", "cm", "mm", "un", "sacos", "ton"]);

const cargosComuns = ref([
  "Pedreiro",
  "Servente",
  "Mestre de Obras",
  "Encarregado",
  "Eletricista",
  "Encanador",
  "Carpinteiro",
  "Armador",
  "Pintor",
  "Ajudante",
  "Engenheiro",
  "Arquiteto",
  "Técnico",
  "Segurança",
  "Outro",
]);

export interface Material {
  nome: string;
  quantidade: number;
  unidade: string;
}

export interface MembroEquipe {
  nome: string;
  cargo: string;
  terceirizado: boolean;
  observacao?: string;
}

function adicionarMaterial() {
  registro.value.materiais ||= [];
  registro.value.materiais.push({ nome: "", quantidade: 0, unidade: "un" });
}

function adicionarMembro() {
  registro.value.equipe ||= [];
  registro.value.equipe.push({ nome: "", cargo: "", terceirizado: false, observacao: "" });
}

function removerMembro(index: number) {
  registro.value.equipe.splice(index, 1);
}

function removerMaterial(index: number) {
  registro.value.materiais.splice(index, 1);
}

const condicoesClimaticas = Object.values(CondicaoClimaticaEnum).map((value) => ({
  value,
  text: value.charAt(0) + value.slice(1).toLowerCase().replace("_", " "),
}));

const etapasObra = Object.values(EtapaObraEnum).map((value) => ({
  value,
  text: value.charAt(0) + value.slice(1).toLowerCase().replace("_", " "),
}));

watch(
  () => props.registro,
  (novoRegistro) => {
    if (novoRegistro) {
      registro.value = RegistroDiario.fromPartial(novoRegistro);
    }
  },
  { immediate: true, deep: true },
);

const formatDate = (date: Date | null | undefined) =>
  date ? new Date(date).toLocaleDateString("pt-BR") : "Hoje";

const salvarRegistro = async () => {
  loading.value = true;
  try {
    const payload = {
      ...registro.value,
      obraId,
      data: registro.value.data!,
    };

    if (registro.value.id === 0) {
      await registroRepo.create(payload);
    } else {
      await registroRepo.update(payload);
    }

    showToast("Registro salvo com sucesso!", "success");
    setTimeout(() => router.go(-1), 1000);
  } catch (error) {
    console.error(error);
    showToast(error instanceof Error ? error.message : "Erro desconhecido", "red");
  } finally {
    loading.value = false;
  }
};

const voltar = () => {
  router.go(-1);
};
</script>

<template>
  <v-container class="pa-4" style="max-width: 800px">
    <!-- Cabeçalho -->
    <v-card-title class="text-h5 font-weight-bold d-flex align-center mb-2">
      <v-icon icon="mdi-file-document-edit" color="primary" class="mr-2" size="28" />
      {{ registro.id === 0 ? "Novo Registro Diário" : "Editar Registro Diário" }}
    </v-card-title>

    <!-- Barra de Status -->
    <v-card class="mb-4" elevation="1">
      <v-card-text class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-chip color="primary" variant="outlined" class="mr-2">
            <v-icon icon="mdi-calendar" start />
            {{ formatDate(registro.data) }}
          </v-chip>
          <v-chip v-if="registro.condicoesClimaticas" color="blue-lighten-3">
            <v-icon icon="mdi-weather-partly-cloudy" start />
            {{ registro.condicoesClimaticas }}
          </v-chip>
        </div>
        <v-btn variant="text" color="primary" size="small">
          <v-icon icon="mdi-printer" class="mr-1" />
          Imprimir
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Formulário -->
    <v-card elevation="2" class="pa-6">
      <v-text-field
        label="Título do Relatório"
        v-model="registro.titulo"
        variant="outlined"
        prepend-inner-icon="mdi-alert-circle"
        class="mb-4"
        required
      />

      <v-textarea
        label="Resumo das atividades"
        v-model="registro.resumo"
        variant="outlined"
        rows="3"
        required
      />

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Data"
            type="date"
            v-model="registro.data"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Condições Climáticas"
            v-model="registro.condicoesClimaticas"
            :items="condicoesClimaticas"
            item-title="text"
            item-value="value"
            variant="outlined"
            prepend-inner-icon="mdi-weather-cloudy"
            required
          />
        </v-col>
      </v-row>

      <!-- Painéis Expansíveis -->
      <v-expansion-panels multiple class="mt-4">
        <!-- Equipe -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
            Equipe
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card v-for="(membro, index) in registro.equipe" :key="index" class="mb-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="Nome"
                      v-model="membro.nome"
                      prepend-inner-icon="mdi-account"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-combobox
                      label="Cargo"
                      v-model="membro.cargo"
                      :items="cargosComuns"
                      required
                    ></v-combobox>
                  </v-col>
                  <v-col cols="5" sm="3">
                    <v-checkbox label="Terceirizado" v-model="membro.terceirizado"></v-checkbox>
                  </v-col>
                  <v-col cols="1" sm="2" class="d-flex align-center">
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removerMembro(index)"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Observações"
                      v-model="membro.observacao"
                      rows="1"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-btn
              color="primary"
              variant="outlined"
              @click="adicionarMembro"
              prepend-icon="mdi-plus"
            >
              Adicionar Membro
            </v-btn>

            <v-text-field
              class="mt-4"
              label="Horas Trabalhadas"
              type="number"
              v-model="registro.horasTrabalhadas"
              min="0"
              suffix="h"
              prepend-inner-icon="mdi-clock-outline"
            ></v-text-field>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Materiais -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-package-variant" class="mr-2"></v-icon>
            Materiais e Equipamentos
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-card v-for="(material, index) in registro.materiais" :key="index" class="mb-4">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="5">
                        <v-combobox
                          label="Material"
                          v-model="material.nome"
                          :items="materiaisComuns"
                          prepend-inner-icon="mdi-package-variant"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-text-field
                          label="Quantidade"
                          v-model="material.quantidade"
                          type="number"
                          min="0"
                          step="0.01"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="5" sm="3">
                        <v-combobox
                          label="Unidade"
                          v-model="material.unidade"
                          :items="unidadesMedida"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="1" sm="1" class="d-flex align-center">
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          @click="removerMaterial(index)"
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="adicionarMaterial"
                  prepend-icon="mdi-plus"
                >
                  Adicionar Material
                </v-btn>
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

        <!-- Progresso da Obra -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-progress-check" class="mr-2" />
            Progresso da Obra
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-select
              label="Etapa Atual"
              v-model="registro.etapa"
              :items="etapasObra"
              item-title="text"
              item-value="value"
              variant="outlined"
              prepend-inner-icon="mdi-construction"
            />
            <v-slider
              class="mt-4"
              label="Percentual Concluído"
              v-model="registro.percentualConcluido"
              min="0"
              max="100"
              step="5"
              thumb-label="always"
            />
            <v-text-field
              class="mt-4"
              label="Área Executada (m²)"
              type="number"
              v-model="registro.areaExecutada"
              variant="outlined"
              min="0"
              prepend-inner-icon="mdi-ruler-square"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Ocorrências -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-alert" class="mr-2" />
            Ocorrências
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-textarea
              label="Ocorrências do Dia"
              v-model="registro.ocorrencias"
              rows="2"
              variant="outlined"
              prepend-inner-icon="mdi-alert"
            />
            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <v-text-field
                  label="Temperatura (ºC)"
                  type="number"
                  v-model="registro.temperatura"
                  variant="outlined"
                  prepend-inner-icon="mdi-thermometer"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Precipitação (mm)"
                  type="number"
                  v-model="registro.precipitacao"
                  variant="outlined"
                  min="0"
                  prepend-inner-icon="mdi-weather-pouring"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Botões -->
      <v-card-actions class="mt-6">
        <v-spacer />
        <v-btn @click="voltar" variant="outlined" color="primary">
          <v-icon icon="mdi-arrow-left" class="mr-1" />
          Voltar
        </v-btn>
        <v-btn :loading="loading" @click="salvarRegistro" color="primary" variant="flat">
          <v-icon icon="mdi-content-save" class="mr-1" />
          {{ registro.id === 0 ? "Salvar" : "Atualizar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-expansion-panel {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

.v-expansion-panel:hover {
  border-color: var(--v-primary-base);
  transition: 0.2s ease;
}
</style>
