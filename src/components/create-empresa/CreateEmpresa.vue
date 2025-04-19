<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
      </div>
      <h2 class="titulo">Diário de Obras</h2>
      <text-field variant="underlined" label="Nome da sua empresa" required v-model="nomeEmpresa" />
      <text-field
        variant="underlined"
        label="Responsável pela empresa"
        required
        v-model="responsavel"
      />
      <text-field
        variant="underlined"
        label="Telefone"
        v-model="telefone"
        required
        :rules="[telefoneValido]"
        :mask="{ mask: ['(##) ####-####', '(##) #####-####'], eager: true }"
        placeholder="(11) 91111-1111"
      />
      <btn
        class="mt-3"
        text="Proximo"
        @click="logar"
        :tela-inteira="true"
        :loading="isLoading"
        append-inner-icon="mdi-arrow-right-thick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TextField from "@/@shared/components/text-field/TextField.vue";
import btn from "@/@shared/components/button/Btn.vue";
import { EmpresaService } from "@/services/EmpresaServices";
import { useToast } from "@/composables/toast/Toast.composable";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
import { Empresa } from "@/domain/entities/empresa/Empresa";
import { useEmpresaStore } from "@/stores/Empresa"; // Importe o store
import { EmpresaRepository } from "@/domain/repositories/empresa/EmpresaRepository";

const { showToast } = useToast();
const empresaStore = useEmpresaStore(); // Use o store

const nomeEmpresa = ref("");
const telefone = ref("");
const responsavel = ref("");
const isLoading = ref(false);
const service = new EmpresaService();

const { goToCreateUser } = useNavigation();

const telefoneValido = (v: string) => {
  const somenteNumeros = v.replace(/\D/g, "");
  return /^\d{10,11}$/.test(somenteNumeros) || "Telefone inválido";
};

async function logar() {
  isLoading.value = true;
  try {
    const empresa = new Empresa(0, nomeEmpresa.value, telefone.value, responsavel.value);
    const result = await service.createEmpresa(empresa);
    if (result.success) {
      empresaStore.setEmpresaAtual(result.data);
      goToCreateUser();
    } else {
      showToast(result.message!, "red");
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Erro desconhecido", "red");
  } finally {
    isLoading.value = false;
  }
  isLoading.value = false;
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c4f0df;
  height: 100vh;
  padding: 16px;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo {
  width: 80px;
  height: auto;
}

.titulo {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary);
}
</style>
