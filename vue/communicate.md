# Vue青铜-入门和组件化通信


## 入门

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



现在很多开源库都使用这个api来做跨层级的数据共享，比如element-ui



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





















