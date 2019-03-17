let request = require('request')
let fs = require('fs')
const url = 'https://api.github.com/repos/shengxinjing/my_blog/issues?access_token=51bf627bf7f9a5a02b6b567e3bccee09633402e3&labels=Gitalk'

// 发送Get请求
// 第一个参数:请求的完整URL,包括参数
// 第二个参数:请求结果回调函数,会传入3个参数,第一个错误,第二个响应对象,第三个请求数据
request({
    url,
    headers:{
        'User-Agent': 'shengxinjing.cn'
    }

},function (error, response, data) {
    console.log(data)
    fs.writeFileSync('.vuepress/theme/article.json',data)
});

