<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  RegistroDiario,
  CondicaoClimaticaEnum,
  EtapaObraEnum,
} from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";
import { useToast } from "@/composables/toast/Toast.composable";
import { useRoute } from "vue-router";

const props = defineProps<{ registro?: RegistroDiario }>();
const router = useRouter();
const { showToast } = useToast();
const route = useRoute();

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

export interface Atividades {
  descricao: string;
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
      obraId: registro.value.obraId || obraId,
      data: registro.value.data!,
    };

    let registroSalvo: RegistroDiario;
    if (registro.value.id === 0) {
      registroSalvo = await registroRepo.create(payload); // precisa retornar o registro com id
    } else {
      await registroRepo.update(payload);
      registroSalvo = registro.value;
    }

    // Agora envia os arquivos
    if (midiasSelecionadas.value.length > 0) {
      const formData = new FormData();

      const metadados = midiasSelecionadas.value.map((midia) => ({
        NomeArquivo: midia.file.name,
        descricao: midia.descricao || "", // garante que sempre terá descrição (mesmo que vazia)
        categoria: midia.categoria || "", // garante que sempre terá categoria (mesmo que vazia)
      }));
      midiasSelecionadas.value.forEach((midia) => {
        formData.append("arquivos", midia.file);
      });

      // Aqui você envia os metadados como JSON
      formData.append("metadadosJson", JSON.stringify(metadados));

      await registroRepo.uploadMidias(registroSalvo.id, formData);
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

const inputArquivos = ref<HTMLInputElement | null>(null);
const midiasSelecionadas = ref<
  Array<{
    file: File;
    url: string;
    descricao: string; // Mude para string (não opcional)
    categoria: string; // Mude para string (não opcional)
  }>
>([]);

const abrirSeletorArquivos = () => {
  inputArquivos.value?.click();
};

const handleArquivosSelecionados = (event: Event) => {
  const arquivos = (event.target as HTMLInputElement).files;
  if (!arquivos) return;

  for (let i = 0; i < arquivos.length; i++) {
    const file = arquivos[i];

    if (midiasSelecionadas.value.length >= 3) {
      showToast("Você pode adicionar no máximo 3 arquivos.", "info");
      break;
    }

    if (!file.type.startsWith("image/")) continue;

    redimensionarImagem(file).then((compressedFile) => {
      const url = URL.createObjectURL(compressedFile);
      midiasSelecionadas.value.push({
        file: compressedFile,
        url,
        descricao: "", // Inicia vazio
        categoria: "", // Inicia vazio
      });
    });
  }
};

const redimensionarImagem = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;

      img.onload = () => {
        const MAX_WIDTH = 1024;
        const scale = MAX_WIDTH / img.width;
        const width = MAX_WIDTH;
        const height = img.height * scale;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type });
              resolve(resizedFile);
            } else {
              resolve(file); // fallback: envia original
            }
          },
          file.type,
          0.7,
        ); // 0.7 = qualidade (de 0 a 1)
      };

      img.src = e.target.result as string;
    };

    reader.readAsDataURL(file);
  });
};

function adicionarAtividade() {
  registro.value.atividades ||= [];
  registro.value.atividades.push({ descricao: "" });
}

function removerAtividade(index: number) {
  registro.value.atividades.splice(index, 1);
}
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

      <!-- Dentro da tag <template>, adicione este novo painel expansível junto aos outros -->
      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-clipboard-list" color="primary" class="mr-2"></v-icon>
            Atividades Realizadas
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card v-for="(atividade, index) in registro.atividades" :key="index" class="mb-4">
              <v-card-text>
                <v-row>
                  <v-col >
                    <v-text-field
                      label="Descrição da Atividade"
                      v-model="atividade.descricao"
                      prepend-inner-icon="mdi-text"
                      required
                      icon-color="primary"
                      color="primary"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center">
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      @click="removerAtividade(index)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-btn
              color="primary"
              variant="outlined"
              @click="adicionarAtividade"
              prepend-icon="mdi-plus"
              class="mt-2"
            >
              Adicionar Atividade
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Seção de Fotos e Vídeos (Nova seção) -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-camera" class="mr-2" color="primary"></v-icon>
            Fotos e Vídeos
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <!-- Área de upload visual -->
            <v-card variant="outlined" class="mb-4">
              <v-card-text class="text-center py-8">
                <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-2" />
                <div class="text-h6">Arraste e solte fotos/vídeos aqui</div>
                <div class="text-body-2 text-medium-emphasis mt-2">ou</div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  class="mt-4"
                  prepend-icon="mdi-folder-image"
                  @click="abrirSeletorArquivos"
                >
                  Selecione arquivos
                </v-btn>
                <input
                  ref="inputArquivos"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  style="display: none"
                  @change="handleArquivosSelecionados"
                />
                <div class="text-caption text-medium-emphasis mt-2">
                  Formatos suportados: JPG, PNG, MP4 (Máx. 10MB cada)
                </div>
              </v-card-text>
            </v-card>

            <!-- Pré-visualização das mídias selecionadas -->
            <div v-if="midiasSelecionadas.length" class="d-flex flex-wrap gap-4">
              <v-card
                v-for="(midia, index) in midiasSelecionadas"
                :key="index"
                width="220"
                elevation="2"
                class="position-relative"
              >
                <!-- Imagem quadrada -->
                <v-img
                  v-if="midia.file.type.startsWith('image/')"
                  :src="midia.url"
                  height="220"
                  width="220"
                  cover
                  style="aspect-ratio: 1/1"
                ></v-img>

                <!-- Vídeo (mantém proporção original) -->
                <div
                  v-else-if="midia.file.type.startsWith('video/')"
                  style="height: 220px; width: 220px; background: #000"
                >
                  <video
                    :src="midia.url"
                    style="object-fit: contain; height: 100%; width: 100%"
                    muted
                    autoplay
                    loop
                  ></video>
                </div>

                <!-- Campos de metadados -->
                <v-card-text class="pa-2">
                  <v-text-field
                    v-model="midia.descricao"
                    label="Descrição"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="mb-2"
                    icon-color="primary"
                  ></v-text-field>
                  <v-select
                    v-model="midia.categoria"
                    label="Categoria"
                    :items="['Estrutura', 'Acabamento', 'Instalações', 'Documentação']"
                    variant="outlined"
                    density="compact"
                    hide-details
                  ></v-select>
                </v-card-text>

                <!-- Botão para remover -->
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="error"
                  variant="flat"
                  class="position-absolute"
                  style="top: -8px; right: -8px"
                  @click="midiasSelecionadas.splice(index, 1)"
                ></v-btn>
              </v-card>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Painéis Expansíveis -->
      <v-expansion-panels multiple>
        <!-- Equipe -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-account-group" class="mr-2" color="primary"></v-icon>
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
                      icon-color="primary"
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
                        icon-color="primary"
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
              icon-color="primary"
              prepend-inner-icon="mdi-clock-outline"
            ></v-text-field>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Materiais -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-package-variant" class="mr-2" color="primary"></v-icon>
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
                          icon-color="primary"
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
                    icon-color="primary"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Consumo de Cimento (sacos)"
                  type="number"
                  v-model="registro.consumoCimento"
                  min="0"
                    icon-color="primary"
                  prepend-inner-icon="mdi-sack"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Progresso da Obra -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-progress-check" class="mr-2" color="primary"/>
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
                icon-color="primary"
              prepend-inner-icon="mdi-ruler-square"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Ocorrências -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon icon="mdi-alert" class="mr-2" color="red"/>
            Ocorrências
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-textarea
              label="Ocorrências do Dia"
              v-model="registro.ocorrencias"
              rows="2"
              variant="outlined"
              prepend-inner-icon="mdi-alert"
                icon-color="primary"
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
