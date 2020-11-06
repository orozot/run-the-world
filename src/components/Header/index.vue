<template>
  <div class="header">
    <header>
      <span>
        Basic Communication
      </span>
    </header>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style lang="less" scoped>
.header {
  background-color: @default-blue;
  color: @deep-font-color;
  height: 55px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>
