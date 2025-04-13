<script lang="ts" setup>
import { computed } from "vue";
import type { VTextField } from "vuetify/components";
import { vMaska } from "maska/vue";

interface Props {
  label?: string;
  hideDetails?: boolean;
  prependInnerIcon?: string;
  appendInnerIcon?: string;
  id?: string;
  disabled?: boolean;
  type?: string;
  variant?: any;
  rules?: Array<(v: any) => boolean | string>;
  required?: boolean;
  mask?: string | { mask: string[]; eager?: boolean };
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  hideDetails: false,
  type: "text",
  variant: "outlined",
  rules: () => [],
  mask: "",
});

const emit = defineEmits<{
  appendInnerClick: [void];
  enter: [void];
}>();

const hideDetailCmpt = computed(() => props.disabled || props.hideDetails);

const onKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Enter") emit("enter");
};

defineExpose({
  hideDetailCmpt,
});

defineOptions({
  directives: {
    maska: vMaska,
  },
});

const computedRules = computed(() => {
  const baseRules = [...props.rules]; // regras vindas de fora
  if (props.required) {
    baseRules.unshift((v: any) => !!v || "Campo obrigatório");
  }
  return baseRules;
});
</script>

<template>
  <v-text-field
    v-maska="mask"
    :id="id"
    :label="label"
    :hide-details="hideDetailCmpt"
    :disabled="disabled"
    :type="type"
    :rules="computedRules"
    color="primary"
    :variant="variant"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="appendInnerIcon"
    :placeholder="placeholder"
    @keyup="onKeyUp"
    dark
    @click:append-inner="emit('appendInnerClick')"
    :class="{ 'fake-details': disabled && !hideDetails }"
  ></v-text-field>
</template>

<style lang="scss" scoped>
.fake-details {
  margin-bottom: 22px;
}
</style>
