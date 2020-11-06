export default class EventEmitter {
  constructor() {
    this.event = {};
  }
  on(key, listener) {
    if (typeof listener === "function") {
      if (!this.event[key]) {
        this.event[key] = [];
      }
      if (this.event[key].indexOf(listener) === -1) {
        this.event[key].unshift(listener);
      }
    }
  }
  off(key, cb) {
    if (!this.event[key]) {
      console.log("Cannot find this type of function");
    } else {
      this.event[key] = this.event[key].filter(fn => {
        return fn !== cb;
      });
    }
  }
  emit(key, data) {
    if (Array.isArray(this.event[key])) {
      this.event[key].forEach(fn => {
        fn(data);
      });
    } else {
      console.log("Cannot find this type of function");
    }
  }
}
