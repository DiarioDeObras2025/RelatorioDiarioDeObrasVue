import { defineStore } from 'pinia'
import { Empresa } from '@/domain/entities/empresa/Empresa'

export const useEmpresaStore = defineStore('empresa', {
  state: () => ({
    empresaAtual: null as any | null,
    registrationToken: null as string | null
  }),
  actions: {
    setEmpresaAtual(empresa: Empresa) {
      this.empresaAtual = empresa
    },
    setRegistrationToken(token: string) {
      this.registrationToken = token
    },
    clearRegistrationData() {
      this.empresaAtual = null
      this.registrationToken = null
    }
  }
})