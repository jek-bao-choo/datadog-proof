<script setup>
const emit = defineEmits(['back-clicked'])

const handleClick = () => {
  emit('back-clicked')
}
</script>

<template>
  <button
    class="back-button"
    @click="handleClick"
    type="button"
  >
    <svg class="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
    Return to Home
  </button>
</template>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid var(--dark-gold);
  color: var(--dark-gold);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
}

.back-button:hover {
  background: var(--dark-gold);
  color: var(--text-light);
  transform: translateX(-3px);
}

.back-button:active {
  transform: translateX(-1px);
}

.back-button:focus {
  outline: 3px solid rgba(184, 134, 11, 0.4);
  outline-offset: 2px;
}

.back-icon {
  transition: transform 0.2s ease;
}

.back-button:hover .back-icon {
  transform: translateX(-2px);
}

@media (max-width: 767px) {
  .back-button {
    width: 100%;
    justify-content: center;
    font-size: 1rem;
    min-height: 48px;
  }
}
</style>