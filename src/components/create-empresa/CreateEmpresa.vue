<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
      </div>
      <h2 class="titulo">Diário de Obras</h2>
      <text-field variant="underlined" label="Nome da sua empresa" required v-model="nomeEmpresa" />
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

const { showToast } = useToast();
const empresaStore = useEmpresaStore(); // Use o store

const nomeEmpresa = ref("");
const isLoading = ref(false);
const service = new EmpresaService();

const { goToCreateUser } = useNavigation();

async function logar() {
  isLoading.value = true;
  const empresa = new Empresa(0, nomeEmpresa.value);
  const result = await service.createEmpresa(empresa);
  
  if (result.success) {
    // Armazena a empresa no store antes de navegar
    empresaStore.setEmpresaAtual(result.data); // Assumindo que result.data contém a empresa criada
    goToCreateUser();
  } else {
    showToast(result.message!, "red");
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
