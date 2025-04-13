import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

export function useDimession() {
  const LG_SIZE = 1280;
  const SM_SIZE = 600;
  const LAPTOP = 1024;

  const windowsSize = ref(window.innerWidth);

  const isMobile = computed(() => {
    return windowsSize.value < SM_SIZE;
  });

  const isTablet = computed(() => {
    return !isMobile.value && windowsSize.value < LG_SIZE;
  });

  const isDesktop = computed(() => {
    return windowsSize.value >= LG_SIZE;
  });

  const isLaptop = computed(() => {
    return windowsSize.value >= LAPTOP && windowsSize.value <= LG_SIZE;
  });

  onMounted(() => {
    nextTick(() => {
      window.addEventListener("resize", onResize);
    });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });

  function onResize() {
    windowsSize.value = window.innerWidth;
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLaptop,
  };
}
