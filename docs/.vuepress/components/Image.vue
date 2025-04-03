<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <img :src="src" :alt="title" />
    <span style="margin-top: 4px; font-size: 12px; color: #666">{{
      title
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    title: String,
  },
};
</script>
