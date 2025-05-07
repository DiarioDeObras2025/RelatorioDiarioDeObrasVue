<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-wrapper">
        <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
      </div>
      <h2 class="titulo">Cadastro</h2>

      <text-field variant="underlined" label="Nome da sua empresa" required v-model="nomeEmpresa" />
      <text-field variant="underlined" label="Segmento da empresa" v-model="segmento" />
      <text-field
        variant="underlined"
        label="Responsável pela empresa"
        required
        v-model="responsavel"
      />
      <text-field variant="underlined" label="Cargo do responsável" v-model="cargo" />

      <text-field variant="underlined" label="Nome do usuário" required v-model="nomeUsuario" />
      <text-field
        variant="underlined"
        label="Email"
        required
        v-model="email"
        type="email"
        :rules="[emailValido]"
      />

      <div class="senha-row">
        <text-field
          variant="underlined"
          label="Senha"
          required
          v-model="password"
          type="password"
          :rules="[senhaValida]"
        />
        <text-field
          variant="underlined"
          label="Confirmar senha"
          required
          v-model="confirmarSenha"
          type="password"
          :rules="[confirmarSenhaValida]"
        />
      </div>

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
        text="Cadastrar"
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

const { showToast } = useToast();
const { goToLogin } = useNavigation();

const nomeEmpresa = ref("");
const segmento = ref("");
const responsavel = ref("");
const cargo = ref("");
const nomeUsuario = ref("");
const email = ref("");
const password = ref("");
const confirmarSenha = ref("");
const telefone = ref("");
const isLoading = ref(false);

const emailValido = (v: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(v) || "E-mail inválido";
};

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

const telefoneValido = (v: string) => {
  const somenteNumeros = v.replace(/\D/g, "");
  return /^\d{10,11}$/.test(somenteNumeros) || "Telefone inválido";
};

async function logar() {
  if (password.value !== confirmarSenha.value) {
    showToast("As senhas não coincidem", "red");
    return;
  }

  isLoading.value = true;
  try {
    const empresa = new Empresa(
      nomeEmpresa.value,
      nomeUsuario.value,
      email.value,
      password.value,
      segmento.value,
      cargo.value,
      telefone.value,
    );
    const result = await new EmpresaService().createEmpresa(empresa);
    if (result.success) {
      showToast("Cadastro realizado com sucesso! Bem-vindo!", "green");
      goToLogin();
    } else {
      showToast(result.message!, "red");
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Erro desconhecido", "red");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c4f0df;
  min-height: 100vh;
  padding: 24px;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
  overflow-y: auto;
  max-height: 95vh;
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
  color: var(--primary, #00695c);
}

.senha-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    .senha-field {
      flex: 1;
    }
  }
}

/* Para melhorar visual no mobile */
@media (max-width: 480px) {
  .login-card {
    padding: 1rem;
  }
}
</style>
