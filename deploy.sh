# 终止错误
set -e

# 构建
vuepress build docs

# 进入生成的构建文件夹
cd docs/.vuepress/dist

# 部署到自定义域名
echo 'www.tangj.xyz' > CNAME

git init 
git add -A
git commit -m "deploy"

# 部署到根目录
git push -f git@gitee.com:umatang/umatang.git master

cd -