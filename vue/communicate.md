Vue青铜4-入门和组件化通信


## 入门

作为前端最容易上手的框架，Vue入门其实没啥说的，我放一段清单的代码，大家能看懂就说明能上手了

![todos](assets/006tKfTcly1g13gh4efpgg30c307hjtl.gif)

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



