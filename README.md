---
home: true
heroImage: /logo.png
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You

---

# 蜗牛的博客

### 老子的意大利炮呢 轰他娘的

{{ $page }}

[[toc]]

::: tip 嘿嘿
This is a tip
:::

::: warning 哈哈
This is a warning
:::

::: danger 出错了
This is a dangerous warning
:::

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
:tada: :100:


``` js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```