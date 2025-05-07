<template>
  <v-container>
    <v-card elevation="3" class="pa-4">
      <!-- Título + Botão Novo Usuário -->
      <v-card-title>
        <v-row class="w-100" align="center">
          <v-col cols="6" class="d-flex align-center">
            <v-icon class="mr-2">mdi-account-multiple</v-icon>
            <span class="text-h6 font-weight-bold">Lista de Usuários</span>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-btn color="primary" dark @click="onNovoUsuario">
              <v-icon left>mdi-plus</v-icon>
              Novo Usuário
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- Tabela de usuários -->
      <v-data-table
        :headers="headers"
        :items="usuarios"
        class="elevation-1 mt-4"
        :items-per-page="5"
      >
        <template v-slot:header.userName><strong>Nome</strong></template>
        <template v-slot:header.email><strong>E-mail</strong></template>
        <template v-slot:header.phoneNumber><strong>Telefone</strong></template>
        <template v-slot:header.actions><strong>Ações</strong></template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="onEdit(item)">
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="onDelete(item)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de cadastro/edição -->
    <v-dialog v-model="modalOpen" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEditing ? "Editar Usuário" : "Novo Usuário" }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field label="Nome" v-model="usuarioForm.nome" required />
            <v-text-field
              label="E-mail"
              v-model="usuarioForm.email"
              required
              :disabled="isEditing"
            />
            <text-field
              label="Telefone"
              v-model="usuarioForm.phoneNumber"
              variant="underlined"
              required
              :rules="[telefoneValido]"
              :mask="{ mask: ['(##) ####-####', '(##) #####-####'], eager: true }"
              placeholder="(11) 91111-1111"
            />
            <text-field
              label="Senha"
              v-model="usuarioForm.senha"
              :type="'password'"
              :required="!isEditing"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="modalOpen = false">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarUsuario">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { useToast } from "@/composables/toast/Toast.composable";
import { User, type UserResumido } from "@/domain/entities/user/User";
import { UserRepository } from "@/domain/repositories/user/UserRepository";
import { onMounted, ref } from "vue";
import TextField from "@/@shared/components/text-field/TextField.vue";

const usuarios = ref<UserResumido[]>([]);
const userRepo = new UserRepository();
const modalOpen = ref(false);
const isEditing = ref(false);

const usuarioForm = ref({
  id: 0,
  nome: "",
  email: "",
  phoneNumber: "",
  senha: "",
});

const telefoneValido = (v: string) => {
  const somenteNumeros = v.replace(/\D/g, "");
  return /^\d{10,11}$/.test(somenteNumeros) || "Telefone inválido";
};

const headers = [
  { text: "Nome", value: "nome" },
  { text: "E-mail", value: "email" },
  { text: "Telefone", value: "phoneNumber" },
  { text: "Ações", value: "actions", sortable: false },
];

async function getAll() {
  try {
    usuarios.value = await userRepo.ListUser();
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

onMounted(() => getAll());

function onNovoUsuario() {
  isEditing.value = false;
  usuarioForm.value = {
    id: 0,
    nome: "",
    email: "",
    phoneNumber: "",
    senha: "",
  };
  modalOpen.value = true;
}

function onEdit(user: UserResumido) {
  isEditing.value = true;
  usuarioForm.value = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    phoneNumber: user.phoneNumber,
    senha: "",
  };
  modalOpen.value = true;
}

const { showToast } = useToast();

function onDelete(user: UserResumido) {
  showToast("você não tem permissão para excluir usuário", "red");
}

async function salvarUsuario() {
  try {
    if (isEditing.value) {
      await userRepo.AtualizaUser(usuarioForm.value.id, {
        id: usuarioForm.value.id,
        nome: usuarioForm.value.nome,
        email: usuarioForm.value.email,
        phoneNumber: usuarioForm.value.phoneNumber,
        senha: usuarioForm.value.senha,
      });

      showToast("Usuário atualizado com sucesso!", "green");
    } else {
      const novoUser = new User(
        null,
        usuarioForm.value.nome,
        usuarioForm.value.senha,
        usuarioForm.value.email,
        usuarioForm.value.phoneNumber,
        "", // empresaId será resolvido no backend via token
      );

      await userRepo.CadastrarUsuarioInterno(novoUser);
      showToast("Usuário criado com sucesso!", "green");
    }

    modalOpen.value = false;
    await getAll();
  } catch (error: any) {
    showToast(error?.message || "Erro ao salvar usuário", "red");
  }
}
</script>

<style scoped>
.v-data-table .v-btn {
  padding: 4px;
}

.v-data-table thead {
  display: table-header-group !important;
}
</style>
