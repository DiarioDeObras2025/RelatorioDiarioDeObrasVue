<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { ObraRepository } from "@/domain/repositories/obra/ObraRepository";
import type { Obra } from "@/domain/entities/obra/Obra";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const { goToObraDetalhePage, goToCreateObra } = useNavigation();
const obraRepo = new ObraRepository();
const obras = ref<Obra[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

// Função para calcular o progresso baseado em datas
const calcularProgresso = (obra: Obra): number => {
  if (!obra.dataInicio || !obra.dataTerminoPrevista) return 0;

  const dataInicio = new Date(obra.dataInicio);
  const dataTermino = new Date(obra.dataTerminoPrevista);
  const hoje = new Date();

  // Se a obra ainda não começou
  if (hoje < dataInicio) return 0;

  // Se a obra já deveria ter terminado
  if (hoje >= dataTermino) return 100;

  // Duração total em milissegundos
  const duracaoTotal = dataTermino.getTime() - dataInicio.getTime();

  // Tempo já decorrido em milissegundos
  const tempoDecorrido = hoje.getTime() - dataInicio.getTime();

  // Progresso baseado no tempo (0-100%)
  const progresso = (tempoDecorrido / duracaoTotal) * 100;

  return Math.round(progresso);
};

// Função para calcular dias restantes
const calcularDiasRestantes = (obra: Obra): number => {
  if (!obra.dataTerminoPrevista) return 0;

  const hoje = new Date();
  const termino = new Date(obra.dataTerminoPrevista);
  hoje.setHours(0, 0, 0, 0);
  termino.setHours(0, 0, 0, 0);

  // Se já passou da data de término
  if (hoje > termino) return 0;

  const diffTime = termino.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Atualizar dados dos gráficos
const atualizarGraficos = () => {
  chartData.value.progresso.labels = obras.value.map((o) => o.nome);
  chartData.value.progresso.datasets[0].data = obras.value.map((o) => calcularProgresso(o));
  chartData.value.progresso.datasets[0].backgroundColor = obras.value.map(
    (_, i) => ["#4CAF50", "#8BC34A", "#CDDC39", "#2E7D32", "#689F38"][i % 5],
  );
};

// Dados para os gráficos
const chartData = ref({
  progresso: {
    labels: [] as string[],
    datasets: [
      {
        label: "Progresso (%)",
        data: [] as number[],
        backgroundColor: [] as string[],
      },
    ],
  },
  //   relatorios: {
  //     labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  //     datasets: [
  //       {
  //         label: 'Relatórios Enviados',
  //         data: [12, 19, 15, 8, 14, 7],
  //         backgroundColor: '#2196F3',
  //       },
  //       {
  //         label: 'Relatórios Pendentes',
  //         data: [5, 3, 7, 4, 6, 2],
  //         backgroundColor: '#FF9800',
  //       }
  //     ]
  //   },
  custos: {
    labels: ["Mão de Obra", "Materiais", "Equipamentos", "Projeto", "Outros"],
    datasets: [
      {
        label: "Distribuição de Custos",
        data: [35, 40, 10, 8, 7],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  },
});

const obrasRecentes = computed(() => obras.value.slice(0, 3));

// Calcular a próxima entrega entre todas as obras
// Calcular a próxima entrega entre todas as obras
const proximaEntrega = computed(() => {
  if (obras.value.length === 0) return "Nenhuma";

  // Filtrar obras com dataTerminoPrevista válida
  const obrasComData = obras.value.filter(
    (o) => o.dataTerminoPrevista && new Date(o.dataTerminoPrevista).toString() !== "Invalid Date",
  );

  if (obrasComData.length === 0) return "Nenhuma";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Normalizar para comparar apenas datas

  try {
    const proximas = obrasComData
      .map((o) => new Date(o.dataTerminoPrevista!))
      .filter((d) => {
        d.setHours(0, 0, 0, 0);
        return d >= hoje;
      })
      .sort((a, b) => a.getTime() - b.getTime());

    return proximas.length > 0 ? formatarData(proximas[0].toISOString()) : "Nenhuma";
  } catch (error) {
    console.error("Erro ao calcular próxima entrega:", error);
    return "Erro";
  }
});

async function getAll() {
  loading.value = true;
  try {
    obras.value = await obraRepo.getAll();
    atualizarGraficos();
  } catch (err) {
    error.value = "Erro ao carregar obras. Tente novamente mais tarde.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const totalRelatorio = ref<number>();
async function getTotalRegistro() {
  totalRelatorio.value = await obraRepo.getTotalRegistro();
}

onMounted(async () => {
  await getAll();
  getTotalRegistro();
});

// Adicione esta função no seu script
const formatarData = (dataString: string | Date): string => {
  if (!dataString) return "Não definida";

  const data = new Date(dataString);
  if (isNaN(data.getTime())) return "Data inválida";

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};
</script>

<template>
  <div class="dashboard-page">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="title">
          <v-icon icon="mdi-home-construction" size="32" class="mr-2" />
          Diário de Obras
        </h1>
        <p class="subtitle">Visão completa do andamento de suas construções</p>
      </div>

      <div class="header-actions">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="goToCreateObra"
          class="action-btn"
          variant="flat"
        >
          Nova Obra
        </v-btn>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Stats Overview -->
      <section class="stats-overview">
        <v-card class="stat-card">
          <v-card-title>Obras Ativas</v-card-title>
          <v-card-text class="stat-value">{{ obras.length }}</v-card-text>
        </v-card>

        <v-card class="stat-card">
          <v-card-title>Total de Relatórios Gerados</v-card-title>
          <v-card-text class="stat-value">{{ totalRelatorio }}</v-card-text>
        </v-card>

        <v-card class="stat-card">
          <v-card-title>Próxima Entrega</v-card-title>
          <v-card-text class="stat-value">{{ proximaEntrega }}</v-card-text>
        </v-card>
      </section>

      <!-- Gráficos Section -->
      <section class="charts-section">
        <v-row>
          <!-- Progresso das Obras -->
          <v-col cols="12" md="6">
            <v-card class="chart-card">
              <v-card-title class="chart-title">
                <v-icon icon="mdi-progress-check" class="mr-2" />
                Progresso das Obras
              </v-card-title>
              <v-card-text>
                <v-chart
                  type="bar"
                  :data="chartData.progresso"
                  :options="{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }"
                  class="chart"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Distribuição de Custos -->
          <v-col cols="12" md="6">
            <v-card class="chart-card">
              <v-card-title class="chart-title">
                <v-icon icon="mdi-chart-pie" class="mr-2" />
                Distribuição de Custos
              </v-card-title>
              <v-card-text>
                <v-chart
                  type="pie"
                  :data="chartData.custos"
                  :options="{ responsive: true }"
                  class="chart"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Relatórios Mensais -->
          <v-col cols="12">
            <v-card class="chart-card">
              <v-card-title class="chart-title">
                <v-icon icon="mdi-chart-bar" class="mr-2" />
                Relatórios Mensais
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Recent Works Section -->
      <section class="works-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon icon="mdi-home-group" class="mr-2" />
            Obras Recentes
          </h2>
          <v-btn variant="text" color="primary" @click="goToCreateObra" class="see-all-btn">
            Ver todas
          </v-btn>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <v-skeleton-loader
            v-for="i in 3"
            :key="`skeleton-${i}`"
            type="card"
            class="skeleton-item"
          />
        </div>

        <!-- Works Grid -->
        <div v-else class="works-grid">
          <v-card
            v-for="obra in obrasRecentes"
            :key="obra.id"
            class="work-card"
            @click="goToObraDetalhePage(obra.id)"
          >
            <v-card-item>
              <v-card-title>{{ obra.nome }}</v-card-title>
              <v-card-subtitle>{{ obra.endereco }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="card-details">
              <div class="detail-item">
                <v-icon icon="mdi-calendar-start" size="18" class="mr-1" />
                <span>Início: {{ formatarData(obra.dataInicio) }}</span>
              </div>
              <div class="detail-item">
                <v-icon icon="mdi-calendar-end" size="18" class="mr-1" />
                <span>Previsão Término: {{ formatarData(obra.dataTerminoPrevista!) }}</span>
              </div>
              <div class="detail-item">
                <v-icon icon="mdi-file-document-multiple" size="18" class="mr-1" />
                <span>Relatórios: {{ obra.totalRegistrosDiarios || 0 }}</span>
              </div>
            </v-card-text>

            <v-card-actions>
              <div class="progress-container">
                <div class="progress-info">
                  <span class="progress-days">
                    {{ calcularDiasRestantes(obra) }} dias restantes
                  </span>
                </div>
                <v-progress-linear
                  :model-value="calcularProgresso(obra)"
                  color="primary"
                  height="10"
                  rounded
                ></v-progress-linear>
              </div>
            </v-card-actions>
          </v-card>

          <!-- Add New Work Card -->
          <v-card v-if="obrasRecentes.length < 3" class="add-work-card" @click="goToCreateObra">
            <div class="add-content">
              <v-icon icon="mdi-plus" size="48" color="grey-lighten-1" />
              <p class="add-text">Adicionar nova obra</p>
            </div>
          </v-card>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  .header-content {
    .title {
      font-size: 2rem;
      font-weight: 700;
      color: #2e7d32;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 1rem;
      color: #616161;
    }
  }

  .header-actions {
    .action-btn {
      height: 48px;
      font-weight: 500;
    }
  }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  .stat-card {
    padding: 16px;
    border-radius: 12px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2e7d32;
      text-align: center;
      padding: 8px 0;
    }
  }
}

.charts-section {
  .chart-card {
    border-radius: 12px;
    height: 100%;

    .chart-title {
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      padding-bottom: 0;
    }

    .chart {
      height: 300px;
      width: 100%;
    }
  }
}

.works-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #424242;
      display: flex;
      align-items: center;
    }

    .see-all-btn {
      text-transform: none;
      letter-spacing: normal;
    }
  }
}

.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  .skeleton-item {
    height: 200px;
    border-radius: 12px;
  }
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.work-card {
  border-radius: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .card-details {
    padding-top: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .detail-item {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: #616161;
    }
  }

  .v-card-actions {
    padding: 0 16px 16px;

    .progress-container {
      width: 100%;

      .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .progress-label {
          font-size: 0.8rem;
          color: #616161;
          font-weight: 500;
        }

        .progress-days {
          font-size: 0.8rem;
          color: #616161;
        }
      }
    }
  }
}

.add-work-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border: 2px dashed #e0e0e0;
  background-color: #fafafa;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #2e7d32;
    background-color: #f5f5f5;

    .add-content {
      .v-icon,
      .add-text {
        color: #2e7d32;
      }
    }
  }

  .add-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;

    .add-text {
      margin-top: 12px;
      color: #757575;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    .header-actions {
      width: 100%;

      .action-btn {
        width: 100%;
      }
    }
  }

  .stats-overview {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
}
</style>
