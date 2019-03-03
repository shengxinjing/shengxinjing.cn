

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


// 函数


// 嘴角向上
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


// 嘴角向下
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}

export default {
  methods: {

    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};



class Imooc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}



import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}


import { useState, useEffect } from 'react';
// 自定义Hooks
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}


function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}


const element = <h1>Hello, world!</h1>;
// babel编译为
var element = React.createElement(
  "h1",
  null,
  "Hello, world!"
);