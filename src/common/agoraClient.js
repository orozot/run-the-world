import AgoraRTC from "agora-rtc-sdk";
import EventEmitter from "@/common/eventEmitter";

const _eventList = Symbol();
const _listenStream = Symbol();
export default class AgoraClient {
  constructor() {
    this.params = {
      appId: "",
      channel: "",
      uid: "",
      token: ""
    };
    this.joined = false;
    this.published = false;
    this.stream = null;
    this.client = null;
    this.eventBus = new EventEmitter();
    this[_eventList] = ["stream-added", "stream-subscribed", "stream-removed", "peer-online", "peer-leave"];
  }

  //join a room
  async joinRoom(params) {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

    await this._initClient(params.appId).catch(err => {
      console.error("client init failed", err);
      throw new Error(err);
    });
    this[_listenStream]();

    const uid = await this._joinClient(params).catch(err => {
      console.error("client join failed", err);
      throw new Error(err);
    });
    console.log("join channel: " + params.channel + " success, uid: " + uid);
    this.params = {
      appId: params.appId,
      channel: params.channel,
      token: params.token,
      uid: uid
    };
    this.joined = true;
    return "SUCCESS";
  }

  async _initClient(appId) {
    return new Promise((resolve, reject) => {
      if (this.joined) {
        console.error("you have init");
        reject("INIT");
      }
      this.client.init(
        appId,
        () => {
          resolve("SUCCESS");
        },
        err => {
          reject(err);
        }
      );
    });
  }

  async _joinClient(params) {
    return new Promise((resolve, reject) => {
      if (this.joined) {
        console.error("you have joined");
        reject("JOINED");
      }
      this.client.join(
        params.token ? params.token : null,
        params.channel,
        params.uid ? +params.uid : null,
        uid => {
          resolve(uid);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  // create a local stream
  async createStream() {
    return new Promise((resolve, reject) => {
      this.stream = AgoraRTC.createStream({
        streamID: this.params.uid,
        audio: true,
        video: true,
        screen: false
      });

      this.stream.init(
        () => {
          console.log("init local stream success");
          this.publishStream().catch(err => {
            reject(err);
          });
          resolve(this.stream);
        },
        err => {
          console.error("init local stream failed ", err);
          reject(err);
        }
      );
    });
  }

  async publishStream() {
    return new Promise((resolve, reject) => {
      this.client.publish(this.stream, err => {
        console.error("publish failed ", err);
        reject(err);
      });
      this.published = true;
      resolve("SUCCESS");
    });
  }

  async unpublishStream() {
    return new Promise((resolve, reject) => {
      this.client.unpublish(this.stream, err => {
        console.error("unpublish failed", err);
        reject(err);
      });
      this.published = false;
      resolve("SUCCESS");
    });
  }

  async onMute(value) {
    return new Promise((resolve, reject) => {
      if (value) {
        const result = this.stream.muteAudio();
        if (result) {
          console.log("mute success");
          resolve("SUCCESS");
        } else {
          reject();
        }
      } else {
        const result = this.stream.unmuteAudio();
        if (result) {
          console.log("unmute success");
          resolve("SUCCESS");
        } else {
          reject();
        }
      }
    });
  }

  listen(eventName, cb) {
    if (this[_eventList].includes(eventName)) {
      this.eventBus.on(eventName, cb);
    } else {
      console.error("event name not right");
    }
  }

  // listen remote
  [_listenStream]() {
    this[_eventList].forEach(item => {
      this.client.on(item, evt => {
        this.eventBus.emit(item, evt);
      });
    });
  }

  async leaveRoom() {
    return new Promise((resolve, reject) => {
      if (this.published) {
        this.client.unpublish(this.stream, err => {
          console.error(err);
          reject(err);
        });
      }

      this.client.leave(
        () => {
          if (this.stream.isPlaying()) {
            this.stream.stop();
          }
          this.stream.close();
          this.joined = false;
          console.log("channel leave success");
          resolve("SUCCESS");
        },
        err => {
          console.error("channel leave failed", err);
          reject(err);
        }
      );
    });
  }
}
