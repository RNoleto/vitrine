import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeedbackStore = defineStore('feedback', () => {
  const isOpen = ref(false)
  const type = ref('info') // 'success' | 'error' | 'info' | 'confirm'
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Confirmar')
  const cancelText = ref('Cancelar')

  let resolvePromise = null

  const show = (options) => {
    type.value = options.type || 'info'
    title.value = options.title || ''
    message.value = options.message || ''
    confirmText.value = options.confirmText || 'Confirmar'
    cancelText.value = options.cancelText || 'Cancelar'
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const showSuccess = (msg, t = 'Sucesso') => {
    return show({ type: 'success', title: t, message: msg, confirmText: 'OK' })
  }

  const showError = (msg, t = 'Erro') => {
    return show({ type: 'error', title: t, message: msg, confirmText: 'OK' })
  }

  const showInfo = (msg, t = 'Aviso') => {
    return show({ type: 'info', title: t, message: msg, confirmText: 'OK' })
  }

  const confirm = (options = {}) => {
    return show({
      type: 'confirm',
      title: options.title || 'Confirmação',
      message: options.message || 'Deseja realmente prosseguir?',
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar'
    })
  }

  const handleConfirm = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    isOpen,
    type,
    title,
    message,
    confirmText,
    cancelText,
    showSuccess,
    showError,
    showInfo,
    confirm,
    handleConfirm,
    handleCancel
  }
})
