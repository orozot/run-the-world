<template>
  <div class="videoContainer">
    <template v-for="stream in streamList">
      <div class="videContent" :key="generateDomID(stream)">
        <video-player :stream="stream"></video-player>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VideoPlayer from "@/components/VideoContainer/components/VideoPlayer";
export default {
  name: "VideoContainer",
  components: {
    VideoPlayer
  },
  computed: {
    ...mapState({
      localStream: state => state.LOCAL_STREAM,
      remoteStreams: state => state.REMOTE_STREAMS
    }),
    streamList() {
      if (this.localStream) {
        return [this.localStream].concat(this.remoteStreams);
      } else {
        return [];
      }
    }
  },
  methods: {
    generateDomID(stream) {
      return `videoDom${stream.getId()}`;
    }
  }
};
</script>

<style lang="less" scoped>
.videoContainer {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  .videContent {
    height: 240px;
    width: 320px;
    margin: 0 10px;
  }
}
</style>
