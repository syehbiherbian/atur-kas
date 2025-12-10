import type { AuthUser } from '~/server/utils/auth'

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth-user', () => null)
    const isLoading = useState<boolean>('auth-loading', () => true)
    const isAuthenticated = computed(() => !!user.value)

    const fetchUser = async () => {
        try {
            isLoading.value = true
            const response = await $fetch('/api/auth/me')
            if (response?.success) {
                user.value = response.user
            } else {
                user.value = null
            }
        } catch {
            user.value = null
        } finally {
            isLoading.value = false
        }
    }

    const login = async (identifier: string, password: string) => {
        try {
            const response = await $fetch('/api/auth/login', {
                method: 'POST',
                body: { identifier, password },
            })

            if (response?.success) {
                user.value = response.user
                return response
            }

            throw new Error('Login gagal')
        } catch (err: any) {
            throw new Error(err.data?.message || 'Login gagal')
        }
    }

    const register = async (name: string, emailOrPhone: string, password: string) => {
        const isEmail = emailOrPhone.includes('@')
        const body = {
            name,
            email: isEmail ? emailOrPhone : null,
            phone: !isEmail ? emailOrPhone : null,
            password,
        }

        try {
            const response = await $fetch('/api/auth/register', {
                method: 'POST',
                body,
            })

            if (response?.success) {
                user.value = response.user
                return response
            }

            throw new Error('Registrasi gagal')
        } catch (err: any) {
            throw new Error(err.data?.message || 'Registrasi gagal')
        }
    }

    const logout = async () => {
        await useFetch('/api/auth/logout', { method: 'POST' })
        user.value = null
        await navigateTo('/login')
    }

    return {
        user,
        isLoading,
        isAuthenticated,
        fetchUser,
        login,
        register,
        logout,
    }
}
