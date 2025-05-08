<template>
    <div class="login-container">
      <div class="login-card">
        <div class="logo-wrapper">
          <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
        </div>
  
        <h2 class="titulo">Recuperar minha senha</h2>
        <span class="description">Digite seu e-mail para receber o link de recuperação</span>
  
        <text-field
          variant="underlined"
          label="E-mail"
          v-model="userName"
          type="email"
          :rules="[emailValido]"
          required
        />
  
        <btn
          text="Enviar E-mail"
          @click="enviarEmail"
          :tela-inteira="true"
          :loading="isLoading"
         :disabled="isEmailInvalido"
        />
      </div>
    </div>
  </template>
  
  
  <script lang="ts" setup>
import { computed, ref } from "vue";
import TextField from "@/@shared/components/text-field/TextField.vue";
import btn from "@/@shared/components/button/Btn.vue";
import { useToast } from "@/composables/toast/Toast.composable";
import { LoginService } from "@/services/LoginServices";

const { showToast } = useToast();
const userName = ref("");
const isLoading = ref(false);
const service = new LoginService();

const emailValido = (v: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(v) || "E-mail inválido";
};

const isEmailInvalido = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !regex.test(userName.value);
});

async function enviarEmail() {
  if (!emailValido(userName.value)) {
    showToast("E-mail inválido", "red");
    return;
  }

  isLoading.value = true;
  const result = await service.enviarLinkRecuperacaoSenha(userName.value); 
  if (result.success) {
    showToast("E-mail de recuperação enviado!", "green");
  } else {
    showToast(result.message || "Erro ao enviar e-mail", "red");
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
