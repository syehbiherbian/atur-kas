export default defineNuxtRouteMiddleware(async (to) => {
    const { user, fetchUser, isLoading } = useAuth()

    // Fetch user if not loaded
    if (!user.value && !isLoading.value) {
        await fetchUser()
    }

    // Redirect to login if not authenticated
    if (!user.value) {
        return navigateTo('/login')
    }
})
