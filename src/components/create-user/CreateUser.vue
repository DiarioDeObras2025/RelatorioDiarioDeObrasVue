<template>
  <div class="cadastro-container">
    <div class="cadastro-card">
      <div class="logo-wrapper">
        <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
      </div>
      <h2 class="titulo">Criar Conta</h2>

      <text-field label="Nome" v-model="userName" required />
      <text-field label="E-mail" v-model="email" type="email" :rules="[emailValido]" required />

      <div class="senha-row" :class="{ row: isDesktop }">
        <text-field
          label="Senha"
          v-model="password"
          :rules="[senhaValida]"
          type="password"
          required
          class="senha-field"
        />
        <text-field
          label="Confirmar senha"
          v-model="confirmarSenha"
          :rules="[confirmarSenhaValida]"
          type="password"
          required
          class="senha-field"
        />
      </div>

      <text-field
        label="Telefone"
        v-model="phoneNumber"
        required
        :rules="[telefoneValido]"
        :mask="{ mask: ['(##) ####-####', '(##) #####-####'], eager: true }"
        placeholder="(11) 91111-1111"
      />

      <btn class="mt-3" text="CRIAR USUÁRIO" :tela-inteira="true" @click="CreateUser" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TextField from "@/@shared/components/text-field/TextField.vue";
import btn from "@/@shared/components/button/Btn.vue";
import { useDimession } from "@/composables/dimension/Dimension.composable";
import { User } from "@/domain/entities/user/User";
import { UserService } from "@/services/UserService";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
import { useToast } from "@/composables/toast/Toast.composable";

const { showToast } = useToast();

const { isDesktop } = useDimession();

const userName = ref("");
const email = ref("");
const password = ref("");
const confirmarSenha = ref("");
const phoneNumber = ref("");
const nomeEmpresa = ref("");
const isLoading = ref(false);
const service = new UserService();

const senhaValida = (v: string) => {
  const regex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
  return (
    regex.test(v) ||
    "Senha deve ter ao menos 6 caracteres, uma letra maiúscula e um caractere especial"
  );
};

const confirmarSenhaValida = (v: string) => {
  return v === password.value || "As senhas não coincidem";
};

const emailValido = (v: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(v) || "E-mail inválido";
};

const telefoneValido = (v: string) => {
  const somenteNumeros = v.replace(/\D/g, "");
  return /^\d{10,11}$/.test(somenteNumeros) || "Telefone inválido";
};

const { goToLogin } = useNavigation();

async function CreateUser() {
  isLoading.value = true;
  const user = new User(
    0,
    userName.value,
    password.value,
    email.value,
    phoneNumber.value,
    nomeEmpresa.value,
  );
  const result = await service.criarUsuario(user);
  if (result.success) {
    showToast("Aguarde que vamos te levar para login", "primary");
    setTimeout(() => {
      goToLogin();
    }, 2000);
  } else {
    showToast(result.message!, "red");
  }
  isLoading.value = false;
}
</script>

<style scoped lang="scss">
.cadastro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c4f0df;
  height: 100vh;
  padding: 16px;
}

.cadastro-card {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
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

.row {
  display: flex;
  gap: 1rem;
}

.senha-field {
  flex: 1;
}
</style>
