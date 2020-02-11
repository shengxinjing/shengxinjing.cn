<template>
  <div>
    <textarea class="weibo" v-model="text" name id cols="60" rows="5"></textarea>
    <div class="tip custom-block">
      <p class="custom-block-title">输出</p>
      <p ref="container" id="container">{{transformText}}</p>
    </div>
    <div>
      <button @click="handleClick" class="submit">复制</button>
    </div>
  </div>
</template>




<script>
// import Vue from 'vue'
import shuffle from "lodash/shuffle";
// import VueClipboard from 'vue-clipboard2'
// Vue.use(VueClipboard)

console.log(shuffle([1, 2, 3]));
export default {
  data() {
    return {
      text:
        "这几天微博关键字封的太狠了，试一下这个阅读体验，打乱顺序但是不影响阅读，是不是能很好的越过这个AI检测"
    };
  },
  computed: {
    transformText() {
      let sentence_list = [];
      let sentence = "";
      let reordered_txt = [];
      // return this.
      this.text.split("").forEach(c => {
        if (this.isSeperator(c)) {
          reordered_txt = reordered_txt.concat(
            this.reorder(this.tokenize(sentence))
          );
          reordered_txt.push(c);
          sentence = "";
        } else {
          sentence += c;
        }
      });

      if (sentence != "") {
        reordered_txt = reordered_txt.concat(
          this.reorder(this.tokenize(sentence))
        );
      }
      return reordered_txt.join("");
    }
  },
  methods: {
    copy(id, attr) {
      let target = null;

      if (attr) {
        target = document.createElement("div");
        target.id = "tempTarget";
        target.style.opacity = "0";
        if (id) {
          let curNode = document.querySelector("#" + id);
          target.innerText = curNode[attr];
        } else {
          target.innerText = attr;
        }
        document.body.appendChild(target);
      } else {
        target = document.querySelector("#" + id);
      }

      try {
        let range = document.createRange();
        range.selectNode(target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        console.log("复制成功");
      } catch (e) {
        console.log("复制失败");
      }

      if (attr) {
        // remove temp target
        target.parentElement.removeChild(target);
      }
    },
    handleClick() {
    //   let container = this.$refs.container;
      this.copy('container');
      alert("拷贝成功");
    },
    isAscii(c) {
      return c.charCodeAt() < 128;
    },
    isSeperator(c) {
      return (
        [" ", "，", "。", ",", ";", ",", "?", ".", "？", "；"].indexOf(c) > -1
      );
    },
    reorder(token_list) {
      let n_grams = [2, 3];
      let i = 0;
      let token_list_reordered = [];
      while (i < token_list.length) {
        let n_gram = n_grams[Math.round(Math.random())];
        let j = Math.min(i + n_gram, token_list.length);
        n_gram = token_list.slice(i, j);
        n_gram = shuffle(n_gram);
        token_list_reordered = token_list_reordered.concat(n_gram);
        i = j;
      }
      console.log(token_list_reordered);
      return token_list_reordered;
    },
    tokenize(srcText) {
      let token_list = [];
      let token = "";
      srcText.split("").forEach(c => {
        if (this.isAscii(c)) {
          token += c;
        } else {
          if (token != "") {
            token_list.push(token);
            token = "";
          }
          token_list.push(c);
        }
      });
      if (token != "") {
        token_list.push(token);
      }
      return token_list;
    }
  }
};
</script>


<style lang="stylus" scoped>
.weibo {
  -webkit-font-smoothing: antialiased;
  font-family: inherit;
  font-weight: inherit;
  resize: none;
  vertical-align: middle;
  color: #808080;
  text-decoration: none;
  background: transparent;
  width: 100%;
  word-wrap: break-word;
  border: 1px solid #fa7d3c;
  box-shadow: none;
  min-height: 68px;
  height: 68px;
  margin: 0px;
  padding: 0px;
  font-size: 14px;
  overflow-wrap: break-word;
  line-height: 18px;
  overflow: hidden;
  outline: none;
}

.submit {
  font: 12px / 1.3 Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif;
  -webkit-font-smoothing: antialiased;
  letter-spacing: normal;
  word-spacing: normal;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  padding: 0 10px 0 10px;
  white-space: nowrap;
  border-radius: 2px;
  text-decoration: none;
  min-width: 40px;
  text-align: center;
  outline: none;
  background: #ff8140;
  border: 1px solid #f77c3d;
  color: #fff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  display: inline-block;
  height: 28px;
  line-height: 29px;
  width: 60px;
  font-size: 14px;
}
</style>