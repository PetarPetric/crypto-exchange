<template>
  <div class="basic-card">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.basic-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
