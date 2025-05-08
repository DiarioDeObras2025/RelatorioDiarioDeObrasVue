<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-wrapper">
                <img src="@/assets/image/LogoRelatorioSemfundo.png" alt="Logo" class="logo" />
            </div>

            <h2 class="titulo">Redefinir senha</h2>
            <span class="description">Crie sua nova senha abaixo</span>

            <text-field v-model="novaSenha" label="Nova senha" type="password" :rules="[senhaValida]" required />

            <text-field v-model="confirmarSenha" label="Confirmar senha" type="password" :rules="[confirmarSenhaValida]"
                required />


            <btn text="Redefinir senha" :disabled="!senhaValidaCheck" :loading="isLoading" @click="redefinirSenha"
                :tela-inteira="true" />

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "@/composables/toast/Toast.composable";
import { LoginService } from "@/services/LoginServices";
import TextField from "@/@shared/components/text-field/TextField.vue";
import btn from "@/@shared/components/button/Btn.vue";

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const email = route.query.email as string;
const token = route.query.token as string;

const senhaValidaCheck = computed(() =>
    /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(novaSenha.value) &&
    novaSenha.value === confirmarSenha.value
);

const novaSenha = ref("");
const confirmarSenha = ref("");
const isLoading = ref(false);

const senhaValida = (v: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return (
        regex.test(v) ||
        "Senha deve ter ao menos 6 caracteres, uma letra maiúscula e um caractere especial"
    );
};

const confirmarSenhaValida = (v: string) => {
    return v === novaSenha.value || "As senhas não coincidem";
};


async function redefinirSenha() {
    isLoading.value = true;
    const service = new LoginService();
    try {
        //   await service.resetarSenha(email, token, novaSenha.value);
        showToast("Senha redefinida com sucesso!", "green");
        router.push("/login");
    } catch (error: any) {
        showToast(error?.response?.data?.message || "Erro ao redefinir senha", "red");
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