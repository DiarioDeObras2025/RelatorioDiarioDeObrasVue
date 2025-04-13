<template>
  <v-snackbar
    :model-value="model"
    @update:model-value="model = $event"
    :color="color"
    location="top right"
    :timeout="timeout"
    multi-line
  >
    {{ text }}

    <template #actions>
      <v-progress-linear
        v-if="showProgress"
        :color="progressColor"
        height="2"
        indeterminate
        absolute
        bottom
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  text: string;
  color?: string;
  timeout?: number;
  showProgress?: boolean;
  progressColor?: string;
}>();
</script>
