<template>
  <div class="home">
    <submit-form :agoraClient="agoraClient"></submit-form>
    <video-container></video-container>
  </div>
</template>

<script>
import SubmitForm from "@/components/SubmitForm/index";
import VideoContainer from "@/components/VideoContainer";
import AgoraClient from "@/common/agoraClient";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    SubmitForm,
    VideoContainer
  },
  computed: {
    ...mapState({
      remoteStreams: state => state.REMOTE_STREAMS
    })
  },
  data() {
    return {
      agoraClient: {}
    };
  },
  created() {
    this.initClient();
    this.initListenFn();
  },
  methods: {
    initClient() {
      this.agoraClient = new AgoraClient();
    },
    remoteAdd(evt) {
      const remoteStream = evt.stream;
      const id = remoteStream.getId();
      if (!this.remoteStreams.find(item => item.getId() === id)) {
        const remote = this.remoteStreams.concat([remoteStream]);
        this.$message({
          message: `${id}加入聊天`,
          type: "success"
        });
        this.$store.commit("UPDATE_REMOTE_STREAMS", remote);
      }
    },
    remoteLeave(evt) {
      const remoteStream = evt.stream;
      const id = remoteStream.getId();
      const remote = this.remoteStreams.filter(item => item.getId() !== id);
      this.$message({
        message: `${id}离开聊天`,
        type: "success"
      });
      this.$store.commit("UPDATE_REMOTE_STREAMS", remote);
    },
    initListenFn() {
      this.agoraClient.listen("stream-added", evt => {
        const remoteStream = evt.stream;
        const id = remoteStream.getId();
        if (id !== this.agoraClient.params.uid) {
          this.agoraClient.client.subscribe(remoteStream, err => {
            console.log("stream subscribe failed", err);
          });
        }
        console.log("stream-added remote-uid: ", id);
      });

      this.agoraClient.listen("stream-subscribed", evt => {
        this.remoteAdd(evt);
      });

      this.agoraClient.listen("stream-removed", evt => {
        this.remoteLeave(evt);
      });
      this.agoraClient.listen("peer-online", evt => {
        this.remoteAdd(evt);
      });

      this.agoraClient.listen("peer-leave", evt => {
        this.remoteLeave(evt);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  margin: 0 12px;
  display: flex;
}
</style>
