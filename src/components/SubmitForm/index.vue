<template>
  <div class="submitFrom">
    <el-card>
      <el-form :rules="rules" :label-position="position" :model="formData" ref="submitForm">
        <el-form-item label="AppId" prop="appId">
          <el-input v-model="formData.appId"></el-input>
        </el-form-item>
        <el-form-item label="Channel Name" prop="channel">
          <el-input v-model="formData.channel"></el-input>
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="formData.token"></el-input>
        </el-form-item>
        <el-form-item label="User ID" prop="token">
          <el-input v-model="formData.uid" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="join">Join</el-button>
          <el-button type="primary" size="small" @click="leave">Leave</el-button>
          <el-button type="primary" size="small" @click="publish">Publish</el-button>
          <el-button type="primary" size="small" @click="unPublish">Unpublish</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div v-if="$store.state.LOCAL_STREAM" class="controlPanel">
      <el-button
        :icon="audioDisable ? 'el-icon-turn-off-microphone' : 'el-icon-microphone'"
        type="danger"
        @click="muteAudio"
        >{{ audioDisable ? "解除静音" : "静音" }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubmitForm",
  props: {
    agoraClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        appId: [{ required: true, message: "appId不能为空" }],
        channel: [{ required: true, message: "Channel Name不能为空" }]
      },
      position: "top",
      audioDisable: false,
      formData: {
        appId: "59865d77b0774560b32e5772f0b9a592",
        token:
          "00659865d77b0774560b32e5772f0b9a592IADsu/Ei7eNf8nZkNenxhrkKzfB+0kfaSO9ACufpGV8wwB1nXEQAAAAAEABJgS3VYpKlXwEAAQBhkqVf",
        channel: "orozot",
        uid: ""
      }
    };
  },
  methods: {
    muteAudio() {
      this.agoraClient
        .onMute(!this.audioDisable)
        .then(() => {
          this.audioDisable = !this.audioDisable;
        })
        .catch(() => {
          this.$message.error("操作失败");
        });
    },
    join() {
      if (this.agoraClient.joined) {
        this.$message.error("您已经加入");
        return;
      }
      this.$refs["submitForm"].validate(valid => {
        if (valid) {
          this.agoraClient
            .joinRoom(this.formData)
            .then(() => {
              this.$message({
                message: "加入成功",
                type: "success"
              });

              this.agoraClient
                .createStream()
                .then(stream => {
                  this.$store.commit("SET_LOCAL_STREAM", stream);
                  this.$message({
                    message: "publish 成功",
                    type: "success"
                  });
                })
                .catch(() => {
                  this.$message.error("publish 失败");
                });
            })
            .catch(() => {
              this.$message.error("加入房间失败");
            });
        } else {
          this.$message.error("参数输入错误");
        }
      });
    },
    leave() {
      if (!this.agoraClient.joined) {
        this.$message.error("您还未加入");
        return;
      }
      this.agoraClient
        .leaveRoom()
        .then(() => {
          this.$store.commit("SET_LOCAL_STREAM", null);
          this.$store.commit("UPDATE_REMOTE_STREAMS", []);
          this.$message({
            message: "退出房间",
            type: "success"
          });
        })
        .catch(() => {
          this.$message.error("退出房间失败");
        });
    },
    publish() {
      if (this.agoraClient.published) {
        this.$message.error("您已经publish");
        return;
      }
      this.agoraClient
        .publishStream()
        .then(() => {
          this.$message({
            message: "publish 成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$message.error("publish 失败");
        });
    },
    unPublish() {
      if (!this.agoraClient.published) {
        this.$message.error("请先publish");
        return;
      }
      this.agoraClient
        .unpublishStream()
        .then(() => {
          this.$message({
            message: "unpublish 成功",
            type: "success"
          });
        })
        .catch(() => {
          this.$message.error("publish 失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.submitFrom {
  width: 400px;
  flex: 0 0 400px;
  .controlPanel {
    width: 100%;
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
