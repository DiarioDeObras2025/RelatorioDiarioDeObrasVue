<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
    categorias: string[]
    valores: number[]
    cores: string[]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
    if (chartInstance) {
        chartInstance.destroy()
    }

    if (!canvas.value) return

    chartInstance = new Chart(canvas.value, {
        type: 'bar',
        data: {
            labels: props.categorias,
            datasets: [
                {
                    label: 'Valor por Categoria (R$)',
                    data: props.valores,
                    backgroundColor: props.cores,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value: string | number | string[] | number[] | null | undefined) => {
                            if (typeof value === 'number') {
                                return `R$ ${value.toFixed(2)}`
                            }
                            return value
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `R$ ${context.parsed.y.toFixed(2)}`
                    }
                }
            }
        }

    })
}

onMounted(renderChart)
watch(() => [props.categorias, props.valores, props.cores], renderChart)
</script>

<style scoped>
canvas {
    max-width: 100%;
}
</style>