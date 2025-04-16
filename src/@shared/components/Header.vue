<template>
  <v-app-bar app color="primary" dark elevation="4">
    <!-- Botão do menu mobile -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex d-md-none"></v-app-bar-nav-icon>

    <!-- Logo e Nome do Sistema -->
    <v-toolbar-title class="d-flex align-center" @click="goToListObra" style="cursor: pointer">
      <v-img
        src="@/assets/image/LogoRelatorioSemfundoBranco.png"
        max-height="40"
        max-width="40"
        contain
        class="mr-2"
      ></v-img>
      <span class="font-weight-bold">Diário de Obras</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Menu Principal (Desktop) -->
    <div class="d-none d-md-flex">
      <v-btn text to="/obra" exact>
        <v-icon left>mdi-home</v-icon>
        Início
      </v-btn>

      <v-btn text @click="goToShowAllObras">
        <v-icon left>mdi-hard-hat</v-icon>
        Obras
      </v-btn>

      <v-btn text @click="showGeralRelatorio">
        <v-icon left>mdi-chart-bar</v-icon>
        Relatórios
      </v-btn>

      <v-btn text to="/configuracoes">
        <v-icon left>mdi-cog</v-icon>
        Configurações
      </v-btn>
    </div>

    <!-- Menu do Usuário -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="secondary" size="36">
            <span class="white--text">{{ userInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar color="secondary" size="36">
              <span class="white--text">{{ userInitials }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ userName }}</v-list-item-title>
            <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/perfil" disabled>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Meu Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" disabled>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- Menu Mobile -->
  <v-navigation-drawer v-model="drawer" absolute temporary>
    <v-list nav dense>
      <v-list-item-group>
        <v-list-item to="/" exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Início</v-list-item-title>
        </v-list-item>

        <v-list-item to="/obras">
          <v-list-item-icon>
            <v-icon>mdi-hard-hat</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Obras</v-list-item-title>
        </v-list-item>

        <v-list-item @click="showGeralRelatorio">
          <v-list-item-icon>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Relatórios</v-list-item-title>
        </v-list-item>

        <v-list-item to="/configuracoes">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Configurações</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useNavigation } from "@/composables/navigation/Navigation.composable";
import { useUserStore } from "@/stores/User";

const userStore = useUserStore();

const drawer = ref(false);
const { goToListGeralRelatorio, goToShowAllObras, goToListObra } = useNavigation();

const userName = computed(() => userStore.nomeUser || "Usuário");
const userEmail = computed(() => userStore.email);

function showGeralRelatorio() {
  goToListGeralRelatorio();
}
const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
});

const logout = () => {
  // store.dispatch('auth/logout');
  // router.push('/login');
};
</script>

<style scoped>
.v-app-bar {
  z-index: 1000 !important;
}

/* Efeito hover nos botões do menu */
.v-btn--active::before {
  opacity: 0.1 !important;
}

.v-btn--active {
  font-weight: bold;
}

/* Transição suave para o menu mobile */
.v-navigation-drawer {
  transition: transform 0.3s ease;
}
</style>
