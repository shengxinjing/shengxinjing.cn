new Set([...document.querySelectorAll('*')].map(v=>v.nodeName)).size



let res = Object.entries([...document.querySelectorAll('*')].map(v=>v.nodeName).reduce((ret,a)=>{
    ret[a] = (a in ret)?ret[a]+1:1
    return ret
},{}))
res.sort((a,b)=>b[1]-a[1])
console.table(res.slice(0,3))



