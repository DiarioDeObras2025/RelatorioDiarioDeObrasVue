<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import type { RegistroDiario } from "@/domain/entities/registro-diario/RegistroDiario";
import { RegistroDiarioRepository } from "@/domain/repositories/registro-diario/RegistroDiarioRepository";

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

const formatDate = (date: Date | null | undefined) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "Hoje";

const podeGerarPdf = computed(() =>
    registroDiario.value?.id && registroDiario.value?.obraId
);

function gerarPDF() {
    if (!podeGerarPdf.value) return;

    const id = registroDiario.value!.id;
    const obraId = registroDiario.value!.obraId;

    registroDiarioRepository.gerarPdf(id, obraId).catch((error) => {
        console.error("Falha ao gerar PDF:", error);
    });
}

const condicoesClimaticasMap: Record<number, string> = {
  0: "Ensolarado",
  1: "Parcialmente Nublado",
  2: "Nublado",
  3: "Chuvoso",
  4: "Chuva Forte",
  5: "Tempestade",
  6: "Ventania",
  7: "Granizo"
};

const condicaoClimaticaTexto = computed(() => {
  const raw = registroDiario.value?.condicoesClimaticas;
  const idx = Number(raw);

  return condicoesClimaticasMap[idx] ?? "Não informado";
});



</script>
<template>
    <v-container>
        <!-- Cabeçalho -->
        <v-card class="pa-4 mb-4 d-flex justify-space-between align-center">
            <div>
                <h2 class="text-h5 font-weight-bold mb-1">
                    <v-icon start icon="mdi-file-document-edit-outline" class="mr-2" />
                    {{ registroDiario?.titulo }}
                </h2>
                <div class="text-caption text-grey">📅 {{ formatDate(registroDiario?.data) }}</div>
                <div class="mt-1">🌦️ Condições climáticas: {{ condicaoClimaticaTexto }}</div>
            </div>
            <v-btn color="primary" @click="gerarPDF" prepend-icon="mdi-printer" :disabled="!podeGerarPdf">
                Imprimir
            </v-btn>
        </v-card>

        <!-- Atividades -->
        <v-card class="pa-4 mb-4" v-if="registroDiario?.atividades?.length">
            <h3 class="text-h6 font-weight-bold mb-2">
                <v-icon start icon="mdi-clipboard-list-outline" class="mr-2" />
                Atividades Realizadas
            </h3>
            <v-list density="compact">
                <v-list-item v-for="(item, index) in registroDiario.atividades" :key="index">
                    <v-list-item-content>{{ item.descricao }}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>

        <!-- Equipe -->
        <v-card class="pa-4 mb-4" v-if="registroDiario?.equipe?.length">
            <h3 class="text-h6 font-weight-bold mb-2">
                <v-icon start icon="mdi-account-group-outline" class="mr-2" />
                Equipe
            </h3>
            <v-table density="compact">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Observação</th>
                        <th>Terceirizado?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(membro, index) in registroDiario.equipe" :key="index">
                        <td>{{ membro.nome }}</td>
                        <td>{{ membro.cargo }}</td>
                        <td>{{ membro.observacao || '-' }}</td>
                        <td>{{ membro.terceirizado ? 'Sim' : 'Não' }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Materiais -->
        <v-card class="pa-4 mb-4" v-if="registroDiario?.materiais?.length">
            <h3 class="text-h6 font-weight-bold mb-2">
                <v-icon start icon="mdi-hammer-screwdriver" class="mr-2" />
                Materiais Utilizados
            </h3>
            <v-table density="compact">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(mat, index) in registroDiario.materiais" :key="index">
                        <td>{{ mat.nome }}</td>
                        <td>{{ mat.quantidade }}</td>
                        <td>{{ mat.unidade }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>

        <!-- Ocorrências -->
        <v-card class="pa-4 mb-4" v-if="registroDiario?.ocorrencias">
            <h3 class="text-h6 font-weight-bold mb-2 text-red">
                <v-icon start icon="mdi-alert-circle" color="red" class="mr-2" />
                Ocorrências
            </h3>
            <p style="white-space: pre-line;">{{ registroDiario.ocorrencias }}</p>
        </v-card>

        <!-- Fotos (comentado) -->
        <!--
      <v-card class="pa-4 mb-4" v-if="registroDiario?.fotos?.length">
        <h3 class="text-h6 font-weight-bold mb-2">
          <v-icon start icon="mdi-camera-outline" class="mr-2" />
          Fotos da Obra
        </h3>
        <v-row dense>
          <v-col
            v-for="(foto, index) in registroDiario.fotos"
            :key="index"
            cols="12" sm="4" md="3"
          >
            <v-img
              :src="foto.caminhoArquivo"
              :alt="foto.descricao"
              height="150"
              class="mb-1"
            />
            <div class="text-caption">{{ foto.descricao }}</div>
          </v-col>
        </v-row>
      </v-card>
      -->
    </v-container>
</template>
