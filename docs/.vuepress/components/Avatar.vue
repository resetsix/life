<template>
  <img
    :src="src"
    :style="{ width: width, height: height }"
    :alt="alt"
    class="avatar"
  />
</template>

<script>
export default {
  props: {
    src: String,
    width: {
      type: String,
      default: '100px',
    },
    height: {
      type: String,
      default: '100px',
    },
    alt: {
      type: String,
      default: '头像',
    },
  },
};
</script>

<style>
.avatar {
  border-radius: 50%;
  object-fit: cover;
}
</style>
