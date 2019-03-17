#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 生成静态文
# npm run build

# 进入生成的文件夹
# cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME
# npm run list

npm run build

# tar -cvjpf pack.tar.bz2 .vuepress/dist
scp -r .vuepress/dist root@woniu:/root/sheng

git add -A
git commit -m 'deploy'

git push origin master
# ssh root@woniu "cd /root/shengxinjing.cn;git pull;npm run build"
exit
