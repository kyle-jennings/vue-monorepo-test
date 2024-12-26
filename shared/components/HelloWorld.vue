<script setup>
  defineProps({
    name: {
      type: String,
      default: 'you'
    },
  })
</script>
<template>
  <h1>Hello, {{ name }}.</h1>
</template>