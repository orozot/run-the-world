import Vue from "vue";
import { Message, Card, Form, FormItem, Button, Input } from "element-ui";

Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Input);
Vue.prototype.$message = Message;
