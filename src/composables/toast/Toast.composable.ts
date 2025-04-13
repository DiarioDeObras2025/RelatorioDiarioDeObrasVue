import { ref } from "vue";

type ToastColor = "primary" | "red" | "green" | "orange" | "blue" | string;

interface ToastData {
  show: boolean;
  text: string;
  color: ToastColor;
  progressColor: string;
  timeout: number;
}

const toast = ref<ToastData>({
  show: false,
  text: "",
  color: "primary",
  progressColor: "white",
  timeout: 3000,
});

const showToast = (
  text: string,
  color: ToastColor = "primary",
  timeout: number = 3000,
  progressColor: string = "white",
) => {
  toast.value = {
    show: true,
    text,
    color,
    progressColor,
    timeout,
  };
};

export function useToast() {
  return {
    toast,
    showToast,
  };
}
