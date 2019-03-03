# 面试

## 整理ing

```js
// 获取所有标签
var doms = document.getElementsByTagName("*")

// 去重 
var obj = {}
var ret = []
for (var j = 0; j < doms.length; j++) {
  var name = doms[j].nodeName
  if(!obj[name]){
    ret.push(name)
    obj[name] = true
  }
}
console.log(ret.length)

// es6

const names = [...document.getElementsByTagName("*")].map(v=>v.nodeName)
console.log( new Set(names).size)

```

## 函数



```js
function dispatch(componentName, eventName, params) {
  let parent = this.$parent || this.$root;
  let name = parent.$options.name;
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.name;
    }
  }
  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
}

```