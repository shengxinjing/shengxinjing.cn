---
description: Vue进阶必备 哈哈哈

---
# Vue青铜-入门和组件化通信

## 入门

<!-- <iframe src="https://scrimba.com/p/pnyzgAP/cqKK4psq"></iframe> -->

[TOC]



作为前端最容易上手的框架，Vue入门其实没啥说的，我放一段清单的代码，大家能看懂就说明能上手了

![todos](https://ws3.sinaimg.cn/large/006tKfTcly1g13gw7ldl0g30c307hjtl.gif)

```js
<template>
  <div id="app">
    <h1>{{title}}</h1>
    <div>
      <input type="text" v-model="val">
      <button @click="add">添加</button>
      <button @click="clear">清空</button>
    </div>
    <ul>
      <li v-for="todo in todos" :key="todo.title" :class="{done:todo.done}">
        <input type="checkbox" v-model="todo.done">
        {{todo.title}}
      </li>
    </ul>
    <p>{{active}} / {{all}}</p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      title: "蜗牛老湿很骚气",
      val: "",
      todos: []
    };
  },
  mounted() {
    const todos = localStorage.getItem("todos");
    if (todos) {
      this.todos = JSON.parse(todos);
    } else {
      this.todos = [
        { title: "吃饭", done: true },
        { title: "睡觉", done: false },
        { title: "写代码", done: false }
      ];
    }
  },
  computed: {
    active() {
      return this.todos.filter(v => !v.done).length;
    },
    all() {
      return this.todos.length;
    }
  },
  watch: {
    todos: {
      deep: true,
      handler(todos) {
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
  },
  methods: {
    clear() {
      this.todos = this.todos.filter(v => !v.done);
    },
    add() {
      if (this.val) {
        this.todos.push({ title: this.val, done: false });
        this.val = "";
      }
    }
  }
};
</script>
<style>
li.done {
  color: red;
  text-decoration: line-through;
}
</style>
```



大概包含的内容如下，对这个例子熟悉后，才是我们的正文，如果上面代码有没看懂的地方，快去Vuejs官网回顾一下吧

1. 变量渲染
2. 循环渲染
3. class渲染
4. 计算属性
5. 监听器
6. 绑定事件
7. 生命周期



## 组件化

Vue单文件组件。Vue的单文件组件相信大家都体验过，通过vue-cli初始化的项目自动就支持了，新建Child1.vue



```html
<template>
    <div>Child1</div>
</template>
<script>
export default {
    
}
</script>


```

App中使用



```html
<template>
  <div id="app">
    <Child1></Child1>
  </div>
</template>

<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  components:{Child1}

}

</script>
```



下面就迎来了第一个常见问题， 如果组件多了，他们之间如何通信唠嗑呢，不要小看这个问题，骚气的面试官，比如我，就经常喜欢问，下面我们来演示一下Vue组件之间常用的通信收件



## 1. 父传子组件



父子组件传值，最简单的就是通过props传递，话不多说看代码



```html
// App
<template>
  <div id="app">
    <Child1 :title="title1"></Child1>
  </div>
</template>

<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  data(){
    return {
      title1:'我是你爸爸'
    }
  },
  components:{Child1}

}
</script>
```





```html
// Child1
<template>
    <div>
        <h2>Child2</h2>
        <div>{{title}}</div>
    </div>
</template>
<script>
export default {
    props:['title']
    
}
</script>


```



## 2. 子传父

Vue更推荐单向数据流，所以子组件像修改传递的数据，需要通知父组件来修改，使用$emit触发父元素传递的事件



```html
<template>
  <div id="app">
    <h2>Parent</h2>
    <h3>{{msg}}</h3>
    <Child1 :title="title1" @getmsg="getmsg"></Child1>
  </div>
</template>

<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  data(){
    return {
      msg:'',
      title1:'我是你爸爸'
    }
  },
  methods:{
    getmsg(msg){
      console.log(msg)
      this.msg = msg
    }
  },
  components:{Child1}

}

</script>
<style>

div{
  border:1px red solid;
  padding:20px;
}
</style>
```





```html
// child1
<template>
    <div>
        <h2>Child2</h2>
        <p>{{title}}</p>
        <button @click="toParent">传递到父元素</button>
    </div>
</template>
<script>
export default {
    props:['title'],
    methods:{
        toParent(){
            this.$emit('getmsg','爸爸,我知道错了')
        }
    }
    
}
</script>
```



![image-20190315144914257](https://ws1.sinaimg.cn/large/006tKfTcly1g13hby4oaxj311u0lqjsw.jpg)





## 3. 兄弟组件

兄弟组件不能直接通信，只需要父元素搭个桥即可，大家自己体验即可



## 4. 祖先后代  provide & inject



props一层层传递，爷爷给孙子还好，如果嵌套了五六层还这么写，感觉自己就是一个沙雕，所以这里介绍一个 稍微冷门的API， [provice/inject](https://cn.vuejs.org/v2/api/#provide-inject),类似React中的上下文，专门用来跨层级提供数据



现在很多开源库都使用这个api来做跨层级的数据共享，比如element-ui的[tabs](https://github.com/ElemeFE/element/blob/efcfbdde0f06e3e1816f1a8cd009a4e413e6e290/packages/tabs/src/tabs.vue#L26) 和 [select](https://github.com/ElemeFE/element/blob/f55fbdb051f95d52e92f7a66aee9a58e41025771/packages/select/src/select.vue#L161)



```html


<script>
import Child1 from '@/components/Child1'
export default {
  name: "app",
  provide:{
    woniu:'我是蜗牛'
  },
  components:{Child1}

}

</script>
<style>
```



```html
// 子孙元素
<template>
    
    <div>
        <h3>Grandson1</h3>
        <p>
            祖先元素提供的数据 : {{woniu}}
        </p>
    </div>
</template>
<script>
export default {
    
    inject:['woniu']
}
</script>
```



![image-20190315145836185](https://ws4.sinaimg.cn/large/006tKfTcly1g13hlof1c5j310i0su760.jpg)



但是provider和inject不是响应式的，如果子孙元素想通知祖先，就需要hack一下，Vue1中有dispatch和boardcast两个方法，但是vue2中被干掉了，我们自己可以模拟一下

原理就是可以通过this.$parent和this.$children来获取父组件和子组件，我们递归一下就可以了





## 5. dispatch

递归获取$parent即可  比较简单



```html
<button @click="dispatch('dispatch','哈喽 我是GrandGrandChild1')">dispatch</button>
```

```js
  methods: {

    dispatch(eventName, data) {
      let parent = this.$parent
      // 查找父元素
      while (parent ) {
        if (parent) {
          // 父元素用$emit触发
          parent.$emit(eventName,data)
          // 递归查找父元素
          parent = parent.$parent
        }else{
          break

        }
      }
 
    }
  }
```



![dispatch](https://ws2.sinaimg.cn/large/006tKfTcly1g13ju4cl41g30ra0f0t9y.gif)



注意只向上传递了，并没有影响别的元素



## 6. boardcast

和dispatch类似，递归获取$children 来向所有子元素广播

```html
<button @click="$boardcast('boardcast','我是Child1')">广播子元素</button>
```



```js
function boardcast(eventName, data){
  this.$children.forEach(child => {
    // 子元素触发$emit
    child.$emit(eventName, data)
    if(child.$children.length){
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data)
    }
  });
}
{
  methods: {

    $boardcast(eventName, data) {
      boardcast.call(this,eventName,data)
    }
  }
}
```

![boardcast](https://ws3.sinaimg.cn/large/006tKfTcly1g13lhw3yhvg30ra0f00tz.gif)





## 7. 全局挂载dispatch和boardcast

想用的时候，需要自己组件内部定理dispatch和boardcast太烦了，我们挂载到Vue的原型链上，岂不是很high,找到main.js



```js
Vue.prototype.$dispatch =  function(eventName, data) {
  let parent = this.$parent
  // 查找父元素
  while (parent ) {
    if (parent) {
      // 父元素用$emit触发
      parent.$emit(eventName,data)
      // 递归查找父元素
      parent = parent.$parent
    }else{
      break
    }
  }
}

Vue.prototype.$boardcast = function(eventName, data){
  boardcast.call(this,eventName,data)
}
function boardcast(eventName, data){
  this.$children.forEach(child => {
    // 子元素触发$emit
    child.$emit(eventName, data)
    if(child.$children.length){
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data)
    }
  });
}

```

这样组件里直接就可以用了 无压力



## 8. 没啥关系的组件：event-bus

如果俩组件没啥关系呢，我们只能使用订阅发布模式来做，并且挂载到Vue.protytype之上，我们来试试，我们称呼这种机制为总线机制，也就是喜闻乐见的 event-bus

```js

class Bus{
  constructor(){
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {}
  }
  $on(name,fn){
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }
  $emit(name,args){
    if(this.callbacks[name]){
      // 存在 遍历所有callback
      this.callbacks[name].forEach(cb=> cb(args))
    }
  }
}

Vue.prototype.$bus = new Bus()
```



使用

```js
// 使用
eventBus(){
    this.$bus.$emit('event-bus','测试eventBus')
}

// 监听
this.$bus.$on("event-bus",msg=>{
    this.msg = '接收event-bus消息:'+ msg
})
```

![eventbus](https://ws1.sinaimg.cn/large/006tKfTcly1g13lwdg3q2g30rd0f8mxw.gif)



其实本身Vue就是一个订阅发布的实现，我们偷个懒，把Bus这个类可以删掉，新建一个空的Vue实例就可以啦

```js
Vue.prototype.$bus = new Vue()
```



## 9. vuex

总结了那么多，其实最佳实践就是vuex，这个后面再专门写文章学习吧



看完这个文章，Vue组件化通信应该就难不住你了，也恭喜你度过青铜，正式迈入Vue秩序白银级别

文章代码都在 https://github.com/shengxinjing/my_blog/tree/master/vue-communicate

