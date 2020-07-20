import Vue from 'vue'

// 将‘消息提示组件’引入并挂载在‘vue的原型对象’上的自定义‘ $message ’
import { Message } from 'element-ui'

// 将‘弹框组件’引入并挂载在‘vue的原型对象’上的自定义‘ $confirm ’
import { MessageBox } from 'element-ui'

import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Backtop,
  Icon,
  Cascader,
  Image,
  Upload,
  DatePicker
} from 'element-ui'
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Backtop)
Vue.use(Icon)
Vue.use(Cascader)
Vue.use(Image)
Vue.use(Upload)
Vue.use(DatePicker)