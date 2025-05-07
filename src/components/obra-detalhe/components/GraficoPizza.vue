<template>
    <div>
      <Doughnut :data="chartData" :options="options" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
  import type { ChartOptions } from 'chart.js'
  ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
  const props = defineProps<{
    categorias: string[],
    valores: number[],
    cores: string[]
  }>()
  
  const chartData = {
    labels: props.categorias,
    datasets: [
      {
        data: props.valores,
        backgroundColor: props.cores
      }
    ]
  }
  
  const options: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
  </script>
  