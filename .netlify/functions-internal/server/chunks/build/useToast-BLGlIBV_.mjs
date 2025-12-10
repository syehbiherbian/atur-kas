import { u as useState } from './state-C15HQ2wM.mjs';

const useToast = () => {
  const toasts = useState("toasts", () => []);
  const addToast = (message, type = "info", duration = 4e3) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts.value.push({ id, message, type, duration });
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };
  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };
  const success = (message) => addToast(message, "success");
  const error = (message) => addToast(message, "error");
  const warning = (message) => addToast(message, "warning");
  const info = (message) => addToast(message, "info");
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

export { useToast as u };
//# sourceMappingURL=useToast-BLGlIBV_.mjs.map
