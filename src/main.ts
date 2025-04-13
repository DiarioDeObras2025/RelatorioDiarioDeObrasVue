import "./assets/main.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import axios from "axios";

import App from "./App.vue";
import router from "./router";

const configVuetify = {
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#3D7F66",
        },
      },
    },
  },
};

const vuetify = createVuetify(configVuetify);
const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.config.globalProperties.$axios = axios;

app.mount("#app");
