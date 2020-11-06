<template>
  <div class="videoPlayer" :id="id"></div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    stream: {
      type: Object,
      required: true
    }
  },
  data() {
    const id = this.generateDomID(this.stream);
    return {
      id
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.stream && !this.stream.isPlaying()) {
        this.stream.play(this.id, { fit: "cover" }, err => {
          if (err && err.status !== "aborted") {
            console.warn("trigger autoplay policy");
          }
        });
      }
    });
  },
  methods: {
    generateDomID(stream) {
      return `videoDom${stream.getId()}`;
    }
  },
  beforeDestroy() {
    if (this.stream) {
      if (this.stream.isPlaying()) {
        this.stream.stop();
      }
      this.stream.close();
    }
  }
};
</script>

<style lang="less" scoped>
.videoPlayer {
  height: 100%;
  width: 100%;
}
</style>
