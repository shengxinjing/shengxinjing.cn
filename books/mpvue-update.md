# mpvue课程更新


由于小程序和mpvue都在迅猛发展，导致课程老的代码出现了很多不兼容，这里总结一下不兼容的点  保证代码目录下面的/newest目录能在最新的环境下跑起来


##  mpvue版本更新

app.json分拆 其实就是把之前`main.js`里的`export default`里面的config变成json拷贝到文件`app.json`里，和官方小程序的配置一致 [参考链接](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/file.html#json-%E9%85%8D%E7%BD%AE)

## 直接拷贝src目录报错

* 由于我们还安装了其他以来，比如sass 和wafer2 执行一下 `npm install node-sass sass-loader wafer2-client-sdk --save ` 再拷贝src即可

## 如何获取课程源码
之前在问答区提问，现在请直接用慕课自己的git，访问git.imooc.com 用自己的慕课账号登录即可


## mysql初始化报错

mysql初始化报错有两个可能

* 需要自己手动创建数据库，执行create database cAuth
* 版本问题，请不要用mysql8的版本，我们统一用5.7的版本(腾讯云线上版本)

## koa报错

通常是async+await没支持，需要把node的版本升级为7.6+ 最好是直接8.0版本

## 本地开发环境不能真机预览

本地开发不支持真机，因为真机的请求，没法转发到电脑上，想真机预览，需要测试环境

## 用的什么编辑器
因为小程序自带编辑器，不支持vue语法，所以我们使用了vscode，大家使用擅长的编辑器即可，比如sublime webstorm都是OK的

## 其他

未找到 app.json 中的定义的 pages "page/books/main" 对应的 WXML 文件
新增page页面后，需要重新执行 npm run dev






## 分享
之前默认页面就是可以分享的，现在改成主动添加生命周期，才可以分享，在onShow生命周期里加一行代码`wx.showShareMenu()`即可

``` js
  onShow () {
    wx.showShareMenu()
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  }
```


## 登录
登录经历了小程序官方api修改，官网sdk（wafer）的接口修改 很是蛋疼，现在重新梳理一下登录逻辑

以前获取用户信息，是通过wx.getUserInfo，然后就会弹出授权窗口，现在必须通过button ，才能实现，登录的js逻辑暂时不用改, 大家来到`src/pages/me/Me.vue` 现在我们来完善一下登录的逻辑，加上拒绝的处理，这些修改不涉及到server端的修改

``` html

<div class="container">
  <div class="userinfo" @click='login'>
    <img  class="userinfo-avatar" :src="userinfo.avatarUrl" alt="">
    <p class="userinfo-nickname">{{userinfo.nickName}}</p>
  </div>
    <YearProgress></YearProgress>
    <button v-if="userinfo.openId" @click='scanBook' class='btn btn-addbook' >
      添加图书
    </button>
</div>

```
重点是userinfo那里，我们在@click=login里已经弹不出授权信息 ，需要用按钮 并且设置open-type属性,[文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject)，
我们吧头像上的登录取消，登录按钮下面加一行按钮代码

``` html
<button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>
```

然后再把data里的nickName设置为空即可

更改后的代码如下，只修改了html和js里的nickName 其他并没有变化
当然官方的wafer的sdk新增了requestLogin方法，我们使用[wafer-client-sdk](https://github.com/tencentyun/wafer2-client-sdk)

之前登录的逻辑贼简单，调用一下login之后使用request即可，后面更新一次 加了验证用户允许的逻辑，后来直接改为button，不需要getSettings，最终逻辑如下
``` js

function login(){
    显示loading
    qcloud.setLoginUrl设置登录url
    用qcloud.Session.get()获取用户登录是否过期
    if(没过期){
        使用qcloud.loginWithCode 成功后设置setStorageSync和this.userinfo
    }else{
        过期了 使用qcloud.login，成功后设置setStorageSync和this.userinfo
    }
}



```

最终的`Me.vue`代码

``` vue

<template>


  <div class="container">
    <div class="userinfo" >
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>
    <button v-if='userinfo.openId' @click='scanBook' class='btn'>添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>

  </div>

</template>
<script>
import qcloud from 'wafer2-client-sdk'
import YearProgress from '@/components/YearProgress'
import {showSuccess} from '@/util'
import config from '@/config'
export default {
  components: {
    YearProgress
  },
  data () {
    return {
      userinfo: {
        avatarUrl: 'http://image.shengxinjing.cn/rate/unlogin.png',
        nickName: ''
      }
    }
  },
  methods: {

    scanBook () {
      wx.scanCode({
        success: (res) => {
          if (res.result) {
            console.log(res.result)
          }
        }
      })
    },
    loginSuccess (res) {
      showSuccess('登录成功')
      wx.setStorageSync('userinfo', res)
      this.userinfo = res
    },
    login () {
      wx.showToast({
        title: '登录中',
        icon: 'loading'
      })
      qcloud.setLoginUrl(config.loginUrl)
      const session = qcloud.Session.get()
      if (session) {
        qcloud.loginWithCode({
          success: res => {
            console.log('没过期的登录', res)
            this.loginSuccess(res)
          },
          fail: err => {
            console.error(err)
          }
        })
      } else {
        qcloud.login({
          success: res => {
            console.log('登录成功', res)
            this.loginSuccess(res)
          },
          fail: err => {
            console.error(err)
          }
        })
      }
    }
  },
  onShow () {
    wx.showShareMenu()
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  }
}
</script>

<style lang='scss'>
.container{
  padding:0 30rpx;

}  
.userinfo{
  margin-top:100rpx;
  text-align:center;
  img{
    width: 150rpx;
    height:150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
}


</style>


```

 






