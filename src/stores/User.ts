import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    nomeUser: null as string | null,
    email: null as string | null,
  }),
  actions: {
    setUserAtual(nomeUser: string, email: string) {
      this.nomeUser = nomeUser;
      this.email = email;
    },
    clearRegistrationData() {
      this.nomeUser = null;
      this.email = null;
    },
  },
});
