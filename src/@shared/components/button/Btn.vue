<script lang="ts" setup>
interface Props {
  text?: string;
  color?: string;
  prependInnerIcon?: string;
  appendInnerIcon?: string;
  disabled?: boolean;
  telaInteira?: boolean;
  loading?: boolean;
  variant?: any;
}

withDefaults(defineProps<Props>(), {
  color: "primary",
});
</script>

<template>
  <v-btn
    :append-icon="appendInnerIcon"
    :prepend-icon="prependInnerIcon"
    :disabled="disabled"
    :color="color"
    :block="telaInteira"
    :loading="loading"
    :variant="variant"
  >
    {{ text }}
  </v-btn>
</template>
