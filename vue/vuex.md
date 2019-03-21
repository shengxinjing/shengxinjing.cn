# Vue秩序白银 --使用vuex管理数据



## 1. Vuex实战

上次文章介绍了Vue组件化之间通信的各种姿势，其中vuex基本算是终极解决方案了，这个没啥说的，直接贴代码把 

所谓各大框架的数据管理框架，原则上来说，就是独立团大了，所有事都团长处理太累了，所以老李只管军事，枪弹烟酒面这些数据，交给赵政委，赵政委就是咱们的Vuex，从此以后 全团共享的数据，都必须得经过赵政委统一进行调配

我的风格就是用过的东西，都喜欢造个轮子，实战使用 只是基础而已，话不多说看代码

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state,n=1) {
      state.count += n
    }
  },
  actions:{
    incrementAsync(){
      setTimeout(()=>{
        this.commit('increment',2)
      },1000)
    }
  }
})
```

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
```

```html
<template>
  <div id="app">
    <div>冲啊，手榴弹扔了{{$store.state.count}}个</div>
    <button @click="add">扔一个</button>
    <button @click="addAsync">蓄力扔俩</button>
  </div>
</template>
<script>

export default {
  name: 'app',

  methods:{
    add(){
      this.$store.commit('increment')
    },
    addAsync(){
      this.$store.dispatch('incrementAsync')
    }
  }
}
</script>

```



## 实现自己Vuex

要实现Vue，首先要实现的 就是Vue.use(Vuex)，这是vue安装插件的机制，需要Vuex对外暴露一个install方法，会把Vue传递给install这个函数，咱们来小小的测试一下下



## 实现插件机制

新建zhao(赵政委).js 对外暴露install 方法，内部在Vue的组件上挂载一个$store变量 




[vuex的install源码](<https://github.com/vuejs/vuex/blob/dev/src/mixin.js#L5>)

```js

class Store {
  constructor() {
    this.name = '赵政委'
  }
}


function install(Vue) {
    console.log(this)
  Vue.prototype.$store = new Store()
}
export default { Store, install }
```

```html
// app.vue
<template>
  <div id="app">
  </div>
</template>
<script>

export default {
  name: 'app',
  created(){
    console.log(this.$store)
  }
}
</script>
// output Store {name: "赵政委"}
```

## 传递store

真正使用的时候，store是通过new Vue传递进来的，我们需要使用mixin在beforeCreated来挂载，这样才能通过this.$option获取传递进来的store

```js

// zhao.js
class Store {
  constructor() {
    this.name = '赵政委'
  }
}

function install(Vue) {
  Vue.mixin({
    beforeCreate(){
      // 这样才能获取到传递进来的store
      // 只有root元素才有store，所以判断一下
      if(this.$options.store){
        Vue.prototype.$store = store

      }
    }
  })
  // console.log(this)
}
export default { Store, install }
```



```js
// store.js
import Vue from 'vue'
import Vuex from './zhao'

Vue.use(Vuex)
export default new Vuex.Store()
```

