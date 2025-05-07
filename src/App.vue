<script setup lang="ts">
import RoutePath from "./router/route_patch";
import { useDimession } from "@/composables/dimension/Dimension.composable";
import Toast from "@/@shared/components/toast/Toast.vue";
import { useToast } from "./composables/toast/Toast.composable";
import { useRoute } from "vue-router";
import { computed } from "vue";
import Header from "./@shared/components/Header.vue";

const { toast } = useToast();
const { isDesktop } = useDimession();
const route = useRoute();

// rotas onde NÃO deve aplicar a classe container
const rotasSemContainer = [
  RoutePath.LOGIN.toLowerCase(),
  RoutePath.CREATE_USER.toLowerCase(),
  RoutePath.CREATE_EMPRESA.toLowerCase(),
];

const aplicarContainer = computed(() => !rotasSemContainer.includes(route.path.toLowerCase()));
</script>

<template>
  <v-app class="color-box">
    <div v-if="aplicarContainer" class="mt-16">
      <Header></Header>
    </div>

    <div :class="{ container: aplicarContainer && isDesktop }">
      <router-view />

      <!-- <footer v-if="!isDesktop && aplicarContainer" class="footer-nav">
        <router-link to="/obra">
          <v-icon>mdi-home</v-icon>
        </router-link>
        <router-link :to="RoutePath.CREATE_OBRA">
          <v-icon>mdi-plus</v-icon>
        </router-link>
        <router-link to="/perfil">
          <v-icon>mdi-account</v-icon>
        </router-link>
      </footer> -->
    </div>

    <Toast
      v-model="toast.show"
      :text="toast.text"
      :color="toast.color"
      :timeout="toast.timeout"
      :showProgress="true"
      :progressColor="toast.progressColor"
    />
  </v-app>
</template>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: white;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  border-top: 1px solid #eee;
}

.color-box {
  background-color: #f0f4f3;
}

.footer-nav a {
  color: #888;
  text-decoration: none;
  font-size: 24px;
}

.footer-nav a.router-link-exact-active {
  color: var(--primary);
}
</style>
