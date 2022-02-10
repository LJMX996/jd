# 注意:本仓库偷助力，偷CK，一觉醒来服务器都给你偷走，慎用！！！


# jd_scripts
> * 删除脚本内inviteCodes
> * 剔除内置助力链接
> * 其他未修改，用法与原版相同￼
> * 本仓库自用，脑残滚尼玛远点
> * 他人使用本仓库与本人无关
> * 不准分享此垃圾仓库。
> * 这么垃圾的仓库也不会有人用的吧！

# 使用方法

### 新建容器

#### 使用docker-compose
   ```diff
version: "2.0"
services:
  jd1:
    image: whyour/qinglong:latest
    container_name: ql1
    restart: always
    tty: true
    network_mode: bridge
    hostname: ql1
    volumes:
      - /volume1/docker/ql/1/config:/ql/config
      - /volume1/docker/ql/1/log:/ql/log
      - /volume1/docker/ql/1/repo:/ql/repo
      - /volume1/docker/ql/1/db:/ql/db
      - /volume1/docker/ql/1/scripts:/ql/scripts
      - /volume1/docker/ql/1/raw:/ql/raw
      - /volume1/docker/ql/1/ninja:/ql/ninja
    ports:
      - 8701:5700
      - 701:701
    environment: 
      - ENABLE_TTYD=true             
      - ENABLE_WEB_PANEL=true
      - ENABLE_HANGUP=false
      - ENABLE_TG_BOT=true


  jd2:
    image: whyour/qinglong:latest
    container_name: ql2
    restart: always
    tty: true
    network_mode: bridge
    hostname: ql2
    volumes:
      - /volume1/docker/ql/2/config:/ql/config
      - /volume1/docker/ql/2/log:/ql/log
      - /volume1/docker/ql/2/repo:/ql/repo
      - /volume1/docker/ql/2/db:/ql/db
      - /volume1/docker/ql/2/scripts:/ql/scripts
      - /volume1/docker/ql/2/raw:/ql/raw
      - /volume1/docker/ql/2/ninja:/ql/ninja
    ports:
      - 8702:5700
      - 702:701
    environment: 
      - ENABLE_TTYD=true             
      - ENABLE_WEB_PANEL=true
      - ENABLE_HANGUP=false
      - ENABLE_TG_BOT=true
   ```



## 使用仓库提醒(重要❗❗❗❗)

> * 把仓库目录下的pull.sh文件发给机器人运行一次即可，或者复制里面第一行内容，去面板添加定时执行，执行以后记得删除定时，用下面的定时👇🏻

## 去面板添加这四个任务
### 更新仓库必须用下面定时，不要直接用ql repo，我可以更新pull.sh文件让你们容器自动安装需要的依赖以及文件，不需要自己手动装依赖。

> * 名称:更新仓库
> * 定时:25 * * * *
> * 命令:ql raw https://raw.githubusercontent.com/LJMX996/jd/aaron/pull.sh && task raw_aaron_pull.sh

> * 名称:更新仓库备用
> * 定时:10,40 * * * *
> * 命令:task /ql/config/pull.sh


> * 名称:助力导出
> * 定时: 52 3-23/3 * * *
> * 命令:task /ql/repo/LJMX996_jd_aaron/code.sh

> * 名称:依赖安装
> * 定时: 00
> * 命令:task /ql/repo/LJMX996_jd_aaron/yilai.sh
> * 只需要运行一次。
> * 2.10开始可以使用面板安装依赖

## 面板安装依赖

   ```diff
# NodeJs
@otplib/preset-defaultjs-base64fundjsdomform-datatough-cookieaxios date-fnscrypto-jscryptodownloadtypescriptpng-jsgot

# Python3
requestsjieba
aiohttp  #安装这个会导致重启容器以后bot死掉

# Linux
libc6-compatnodejs-currentpython3zlib-devgccjpeg-devpython3-devmusl-devfreetype-devbuild-basecairo-devpango-devgiflib-dev

   ```


### 自动互助提示
使用上面定时导出助力默认是助力前20个账号
如果想助力其他数量账号，请添加变量，例如👇🏻

   ```diff
export code_num="10"   
   ```
   
然后编辑config下 → task_before.sh文件

内容如下

   ```diff
#!/usr/bin/env bash
if [[ $(ls $dir_code) ]]; then
    latest_log=$(ls -r $dir_code | head -1)
    . $dir_code/$latest_log
fi
   ```


# ninja安装参考(已经彻底挂逼，可以忽略)
机器人命令如下

> * 名称:安装ninja
> * 命令:nohup task /ql/repo/LJMX996_jd_aaron/install-ninja.sh


> * 名称:更新&启动ninja
> * 命令:nohup task /ql/repo/LJMX996_jd_aaron/up-ninja.sh


# 机器人扫码(已经彻底挂逼，可以忽略)

> * /cmd cd /ql/repo/dockerbot/jbot/bot/ && rm -rf getcookie.py && wget https://raw.githubusercontent.com/LJMX996/jd/help/getcookie.py


