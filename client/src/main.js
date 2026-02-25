import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import {
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Field,
  Form,
  PasswordInput,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Switch,
  Stepper,
  Slider,
  Uploader,
  DropdownMenu,
  DropdownItem,
  Popup,
  Picker,
  DatetimePicker,
  Calendar,
  Toast,
  Dialog,
  Notify,
  Loading,
  Empty,
  Badge,
  Tag,
  Icon,
  Divider,
  Card,
  List,
  PullRefresh,
  ActionSheet,
  ShareSheet,
  SwipeCell,
  Sidebar,
  SidebarItem,
  Grid,
  GridItem,
  Image as VanImage,
  ImagePreview,
  Progress,
  Circle,
  CountDown,
  IndexBar,
  IndexAnchor,
  Search
} from 'vant'

const app = createApp(App)

app.use(router)
app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Tab)
app.use(Tabs)
app.use(Cell)
app.use(CellGroup)
app.use(Field)
app.use(Form)
app.use(Input)
app.use(PasswordInput)
app.use(CaptchaInput)
app.use(RadioGroup)
app.use(Radio)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Switch)
app.use(Stepper)
app.use(Slider)
app.use(Uploader)
app.use(DropdownMenu)
app.use(DropdownItem)
app.use(Popup)
app.use(Picker)
app.use(DatetimePicker)
app.use(Calendar)
app.use(Toast)
app.use(Dialog)
app.use(Notify)
app.use(Loading)
app.use(Empty)
app.use(Badge)
app.use(Tag)
app.use(Icon)
app.use(Divider)
app.use(Card)
app.use(List)
app.use(PullRefresh)
app.use(ActionSheet)
app.use(ShareSheet)
app.use(SwipeCell)
app.use(Sidebar)
app.use(SidebarItem)
app.use(Grid)
app.use(GridItem)
app.use(VanImage)
app.use(ImagePreview)
app.use(Progress)
app.use(Circle)
app.use(CountDown)
app.use(IndexBar)
app.use(IndexAnchor)

app.use(Search)
app.mount('#app')
