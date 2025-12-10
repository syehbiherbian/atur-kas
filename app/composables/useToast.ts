export const useToast = () => {
    const toasts = useState<Array<{
        id: string
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
        duration?: number
    }>>('toasts', () => [])

    const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9)
        toasts.value.push({ id, message, type, duration })

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (message: string) => addToast(message, 'success')
    const error = (message: string) => addToast(message, 'error')
    const warning = (message: string) => addToast(message, 'warning')
    const info = (message: string) => addToast(message, 'info')

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    }
}
