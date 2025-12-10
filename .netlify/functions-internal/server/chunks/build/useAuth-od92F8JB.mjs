import { u as useState } from './state-C15HQ2wM.mjs';
import { computed } from 'vue';
import { u as useFetch } from './fetch-Cc0ziM8v.mjs';
import { n as navigateTo } from './server.mjs';

const useAuth = () => {
  const user = useState("auth-user", () => null);
  const isLoading = useState("auth-loading", () => true);
  const isAuthenticated = computed(() => !!user.value);
  const fetchUser = async () => {
    try {
      isLoading.value = true;
      const response = await $fetch("/api/auth/me");
      if (response?.success) {
        user.value = response.user;
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  };
  const login = async (identifier, password) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: { identifier, password }
      });
      if (response?.success) {
        user.value = response.user;
        return response;
      }
      throw new Error("Login gagal");
    } catch (err) {
      throw new Error(err.data?.message || "Login gagal");
    }
  };
  const register = async (name, emailOrPhone, password) => {
    const isEmail = emailOrPhone.includes("@");
    const body = {
      name,
      email: isEmail ? emailOrPhone : null,
      phone: !isEmail ? emailOrPhone : null,
      password
    };
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body
      });
      if (response?.success) {
        user.value = response.user;
        return response;
      }
      throw new Error("Registrasi gagal");
    } catch (err) {
      throw new Error(err.data?.message || "Registrasi gagal");
    }
  };
  const logout = async () => {
    await useFetch("/api/auth/logout", { method: "POST" }, "$D-Rn2xP1Ph");
    user.value = null;
    await navigateTo("/login");
  };
  return {
    user,
    isLoading,
    isAuthenticated,
    fetchUser,
    login,
    register,
    logout
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-od92F8JB.mjs.map
