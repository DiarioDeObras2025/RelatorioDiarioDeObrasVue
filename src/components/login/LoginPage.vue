<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
      </div>

      <h2 class="titulo">Diário de Obras</h2>
      <span class="description"> Digite seus dados abaixo </span>
      <text-field
        variant="underlined"
        label="E-mail"
        v-model="userName"
        type="email"
        :rules="[emailValido]"
        required
      />
      <text-field
        variant="underlined"
        type="password"
        required
        label="Senha"
        v-model="password"
        @enter="logar"
      />
      <btn text="Entrar" @click="logar" :tela-inteira="true" :loading="isLoading" />
      <btn
        class="mt-3"
        text="Criar novo Usuário"
        @click="goToCreateEmpresa"
        :tela-inteira="true"
        variant="plain"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TextField from "@/@shared/components/text-field/TextField.vue";
import btn from "@/@shared/components/button/Btn.vue";
import { Login } from "@/domain/entities/login/Login";
import { LoginService } from "@/services/LoginServices";
import { useToast } from "@/composables/toast/Toast.composable";
import { useNavigation } from "@/composables/navigation/Navigation.composable";

const { showToast } = useToast();

const userName = ref("");
const password = ref("");
const service = new LoginService();
const isLoading = ref(false);

const { goToListObra, goToCreateEmpreas } = useNavigation();

const emailValido = (v: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(v) || "E-mail inválido";
};

async function logar() {
  isLoading.value = true;
  const login = new Login(0, userName.value, password.value);
  const result = await service.logar(login);
  if (result.success) {
    goToListObra();
  } else {
    showToast(result.message!, "red");
  }
  isLoading.value = false;
}

function goToCreateEmpresa() {
  goToCreateEmpreas();
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

.description {
  color: rgb(139, 137, 137);
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
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary);
}
</style>
