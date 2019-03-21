# Vue秩序白银 —构建自己的Vuex

![image-20190321163740602](https://ws4.sinaimg.cn/large/006tKfTcly1g1ai6q0alsj31im0p4e00.jpg)

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
    incrementAsync({commit}){
      setTimeout(()=>{
        commit('increment',2)
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



## 2. 实现自己Vuex

要实现Vue，首先要实现的 就是Vue.use(Vuex)，这是vue安装插件的机制，需要Vuex对外暴露一个install方法，会把Vue传递给install这个函数，咱们来小小的测试一下下



## 3. 实现插件机制

新建zhao(赵政委).js 对外暴露install 方法，内部在Vue的组件上挂载一个$store变量 




[vuex的install源码](<https://github.com/vuejs/vuex/blob/dev/src/mixin.js#L5>)

```js

class Store {
  constructor() {
    this.name = '赵政委'
  }
}


function install(Vue) {
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

## 4. 传递store

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



## 5. state

单纯的数据渲染比较easy

```js
// zhao.js
class Store {
  constructor(options={}) {
    // this.name = '赵政委'
    this.state = options.state
  }
}
```

![image-20190321163916001](https://ws2.sinaimg.cn/large/006tKfTcly1g1ai8aicnbj30om0jq1b9.jpg)

## 6. mutation

修改数据，并且需要通知到组件，这个需要数据是响应式的，我们需要Vue的响应式支持，所以这里也可以看到Vuex是和Vue强绑定的，不能脱离vue单独使用

由于install的时候会传递一个Vue，我们维护一个全局变量，就不用再import vue了，如果zhao.js单独发布，减小包体积

mutation实现也比较简单，记录一下mutation的函数，commit的时候更新数据即可

```js

// zhao.js

let Vue
class Store {
  constructor(options={}) {
    // this.name = '赵政委'
    this.state = options.state || {}
    this.mutations = options.mutations || {}
  }
  commit(type,arg){
    if(!this.mutations[type]){
      console.log('不合法的mutation')
      return 
    }
    this.mutations[type](this.state,arg)
  }
}

function install(_Vue) {
  // 这样store执行的时候，就有了Vue，不用import
  // 这也是为啥 Vue.use必须在新建store之前
  Vue = _Vue
  _Vue.mixin({
    beforeCreate(){
      // 这样才能获取到传递进来的store
      // 只有root元素才有store，所以判断一下
      if(this.$options.store){
        _Vue.prototype.$store = this.$options.store

      }
    }
  })
}
export default { Store, install }
```

```js
// store.js
import Vue from 'vue'
import Vuex from './zhao'

Vue.use(Vuex)
export default new Vuex.Store({
  state:{
    count:0
  },
  mutations:{
    increment (state,n=1) {
      state.count += n
    }
  }
})
```

每次点击 count都变了，页面并没有相应

![01](https://ws2.sinaimg.cn/large/006tKfTcly1g1ai9skvskg30f109pt9j.gif)

## 7. 响应式state

想响应式通知到页面，最方面的莫过于使用Vue的响应式机制，让state编程相应式

```js
    this.state = new Vue({
      data:options.state
    })
```



## 8. action

异步actions，**mutation 必须同步执行**这个限制么？Action 就不受约束！由于有异步任务，commit单独执行，所以需要用箭头函数，确保内部的this指向

```js

let Vue
class Store {
  constructor(options={}) {
    // this.name = '赵政委'
    this.state = new Vue({
      data:options.state
    })
    this.mutations = options.mutations || {}
    this.actions = options.actions
  }
  commit = (type,arg)=>{
    this.mutations[type](this.state,arg)
  }
  dispatch(type, arg){
    this.actions[type]({
      commit:this.commit,
      state:this.state
    }, arg)
  }
}

```

bingo

![02](https://ws2.sinaimg.cn/large/006tKfTcly1g1aiapswtrg30f109pta6.gif)

 

一个贼拉迷你的vuex基本完成，还有几个概念，需要继续完善

## 9. getter 

类似computed，实现也不难 ,使用Object.defineProperty代理一个getter即可，获取getter内部的值，直接执行函数计算。挂载在store.getters之上

```js
  handleGetters(getters){
    this.getters = {}
    Object.keys(getters).forEach(key=>{
      Object.defineProperty(this.getters,key,{
        get:()=>{
          return getters[key](this.state)
        }
      })

    })
  }
```

```js
//store.js
  state:{
    count:0
  },
  getters:{
    killCount(state){
      return state.count * 2
    }
  },
```

```html
    <div>炸死了{{$store.getters.killCount}}个柜子</div>

```



## 10. modules

vuex支持拆包，每个module有自己的state，getter，mutations，和actions，所以需要专门引入喝安装modules，并且递归支持深层嵌套，之前的handleGetters之类的东东，每个module都得执行一下

深层次嵌套，state需要getter代理一下



![image-20190321123937642](https://ws2.sinaimg.cn/large/006tKfTcly1g1ai9xe6e4j314o0tw421.jpg)

## 11. 注册modules



挂载到root上

```js
  register(path, module){
    const newModule = {
      children: {},
      module: module,
      state: module.state
    }
    if(path.length){
      // path有值，子模块
      const parent = path.slice(0, -1).reduce((module, key) => {
        return module.children(key);
      }, this.root);
      parent.children[path[path.length - 1]] = newModule;
    }else{
      // 空 就是根目录
      this.root = newModule
    }
    if(module.modules){
      this.forEachObj(module.modules,(name,mod)=>{
        // console.log(123,name,mod)
        this.register([...path,name],mod)
      })
    }
  }
```

## 12. 启动modules



```js
  installModules(state,path,module){
    // 安装所有的module的mutation，actions，
    if(path.length>0){
      const moduleName = this.last(path);
    // 默认名字都注册在一个命名空间里
      Vue.set(state, moduleName,module.state)
    }
    
    this.forEachObj(module.children, (key,child)=>{
      this.installModules(state, [...path,key],child)
    })
  }
```

```js
  constructor(options={}) {
    // this.name = '赵政委'
    this._vm = new Vue({
      data:{
        state:options.state
      }
    })
    // 根模块
    this.root = null
    this.mutations = options.mutations || {}
    this.actions = options.actions
    this.handleGetters(options.getters)
    // 注册一下module，递归，变成一个大的对象 挂载到root
    this.register([], options)
    this.installModules(options.state, [], this.root)
    // this.installModules(options.modules)

    
  }
  get state(){
    return this._vm._data.state
  }
```



```js
  installModules(state,path,module){
    // 安装所有的module的mutation，actions，
    if(path.length>0){
      const moduleName = this.last(path);
    // 默认名字都注册在一个命名空间里
      Vue.set(state, moduleName,module.state)
    }
    // 设置上下文，获取state要遍历 path
    const context = {
      dispatch: this.dispatch,
      commit: this.commit,
    }
    Object.defineProperties(context, {
      getters: {
        get: () => this.getters
      },
      state: {
        get: () => {
          let state = this.state;
          return path.length ? path.reduce((state, key) => state[key], state) : state
        }
      }
    })
    // 注册mutations 传递正确的state
    this.registerMutations(module.module.mutations,context)
    // 注册action
    this.registerActions(module.module.actions,context)

    // 注册getters
    this.registerGetters(module.module.getters,context)

    // 递归
    this.forEachObj(module.children, (key,child)=>{
      this.installModules(state, [...path,key],child)
    })
  }
```



## 13. store.js

```js

// zhao.js

let Vue
class Store {
  constructor(options={}) {
    // this.name = '赵政委'
    this._vm = new Vue({
      data:{
        state:options.state
      }
    })
    // 根模块
    this.root = null
    this.mutations = {}
    this.actions = {}
    this.getters = {}
    // 注册一下module，递归，变成一个大的对象 挂载到root
    this.register([], options)
    this.installModules(options.state, [], this.root)
  }
  get state(){
    return this._vm._data.state
  }
  register(path, module){
    const newModule = {
      children: {},
      module: module,
      state: module.state
    }
    if(path.length){
      // path有值，子模块
      const parent = path.slice(0, -1).reduce((module, key) => {
        return module.children(key);
      }, this.root);
      parent.children[path[path.length - 1]] = newModule;
    }else{
      // 空 就是根目录
      this.root = newModule
    }
    if(module.modules){
      this.forEachObj(module.modules,(name,mod)=>{
        // console.log(123,name,mod)
        this.register([...path,name],mod)
      })
    }
  }
  forEachObj(obj={},fn){
    Object.keys(obj).forEach(key=>{
        fn(key, obj[key])
    })
  }
  commit = (type,arg)=>{
    this.mutations[type](this.state,arg)
  }
  dispatch(type, arg){
    this.actions[type]({
      commit:this.commit,
      state:this.state
    }, arg)
  }
  last(arr){
    return arr[arr.length-1]
  }
  installModules(state,path,module){
    // 安装所有的module的mutation，actions，
    if(path.length>0){
      const moduleName = this.last(path);
    // 默认名字都注册在一个命名空间里
      Vue.set(state, moduleName,module.state)
    }
    // 设置上下文，获取state要遍历 path
    const context = {
      dispatch: this.dispatch,
      commit: this.commit,
    }
    Object.defineProperties(context, {
      getters: {
        get: () => this.getters
      },
      state: {
        get: () => {
          let state = this.state;
          return path.length ? path.reduce((state, key) => state[key], state) : state
        }
      }
    })
    // 注册mutations 传递正确的state
    this.registerMutations(module.module.mutations,context)
    // 注册action
    this.registerActions(module.module.actions,context)

    // 注册getters
    this.registerGetters(module.module.getters,context)

    // 递归
    this.forEachObj(module.children, (key,child)=>{
      this.installModules(state, [...path,key],child)
    })
  }
  handleGetters(getters){
    Object.keys(getters).forEach(key=>{
      Object.defineProperty(this.getters,key,{
        get:()=>{
          return getters[key](this.state)
        }
      })
    })
  }
  registerGetters(getters, context){
    this.forEachObj(getters,(key,getter)=>{
      Object.defineProperty(this.getters,key,{
        get:()=>{
          return getter(
            // module的state
            context.state,
            context.getters,
            // 最外层的store
            this.state
          )
        }
      })
    })

  }
  registerMutations(mutations, context){
    if(mutations){
      this.forEachObj(mutations, (key,mutation)=>{
        this.mutations[key] = ()=>{
          mutation.call(this, context.state)
        }
      })
    }
  }
  registerActions(actions,context){
    if(actions){
      this.forEachObj(actions, (key,action)=>{
        this.actions[key] = ()=>{
          action.call(this, context)
        }
      })
    }
  }
}

function install(_Vue) {
  // 这样store执行的时候，就有了Vue，不用import
  // 这也是为啥 Vue.use必须在新建store之前
  Vue = _Vue
  _Vue.mixin({
    beforeCreate(){
      // 这样才能获取到传递进来的store
      // 只有root元素才有store，所以判断一下
      if(this.$options.store){
        _Vue.prototype.$store = this.$options.store

      }
    }
  })
}
export default { Store, install }
```

## 14. store.js

```js
// store.js
import Vue from 'vue'
import Vuex from './zhao'

Vue.use(Vuex)

const commander = {
  state: {
      num: 17
  },
  mutations: {
      fire(state) {
          state.num -= 1
      }
  },
  getters:{
    fireCount(state){
      return (17-state.num) *100 
    },
    totalCount(state,getters,rootState){
      return getters.fireCount + rootState.count*2
    }
  },
  actions: {
      fireAsync({commit}) {
        setTimeout(()=>{
          commit('fire');
        },2000)
      }
  }
}

export default new Vuex.Store({
  modules:{
    commander
  },
  state:{
    count:0
  },
  getters:{
    killCount(state){
      return state.count * 2
    }
  },
  mutations:{
    increment (state,n=1) {
      state.count += n
    }
  },
  actions:{
    incrementAsync(context){
      console.log(context,123)
      setTimeout(()=>{
        context.commit('increment',2)
      },1000)
    }
  }
})

```

## 15. 组件使用

```html
<template>
  <div id="app">
    <p>冲啊，手榴弹扔了{{$store.state.count}}个</p>
    <p>炸死了{{$store.getters.killCount}}个柜子</p>
    <p>
      <button @click="add">扔一个</button>
    <button @click="addAsync">蓄力扔俩</button>

    </p>
    <Battalion></Battalion>
  </div>
</template>
<script>
import Battalion from '@/components/Battalion'
export default {
  name: 'app',
  components:{
    Battalion
  },
  created(){
  },
  methods:{
    add(){
      this.$store.commit('increment')
      console.log(this.$store.state)
      console.log(this.$store.state.getters)
      
    },
    addAsync(){
      this.$store.dispatch('incrementAsync')
    }
  }
}
</script>
<style>

div{
  border:1px solid red;
  margin:20px;
  padding:20px;
}
</style>


```

```html
子组件
<template>
    <div>
      <p> 意大利炮还有{{$store.state.commander.num}}发炮弹 </p>
      <p> 意大利炮炸死了{{$store.getters.fireCount}}个鬼子 和手榴弹一起是{{$store.getters.totalCount}} </p>
        <button @click="fire">开炮</button>
        <button @click="fireAsync">一会再开炮</button>
    </div>
</template>

<script>
export default {
  name: 'pageA',
  mounted(){
  },
  methods:{
    fire(){
      this.$store.commit('fire')
    },
    fireAsync(){
      this.$store.dispatch('fireAsync')
    }
  }
}
</script>

```

![03](https://ws1.sinaimg.cn/large/006tKfTcly1g1aia4f645g30iv0aeta7.gif)



## 16. mapState

其实很简单，直接返回对应的值就可以了，computed内部可以通过this.$store拿到，代码就呼之欲出了

```js
function mapState(obj){
  const ret = {}
  Object.keys(obj).forEach((key)=>{
    // 支持函数
    let val = obj[key]
    ret[key] = function(){
      const state = this.$store.state
      return typeof val === 'function'
                          ? val.call(this, state)
                          : state[val]
    } 

  })
  return ret
}
```





## 17. mapMutations

```js
function mapMutations(mutations){
  const ret = {}
  mutations.forEach((key)=>{
    ret[key] = function(){
      const commit = this.$store.commit
      commit(key)
    } 

  })
  return ret
}
```



mapGetters和mapActions原理类似 不赘述了 白白

## 代码和在线演示





