# jd_scripts
> * 删除脚本内inviteCodes
> * 剔除内置助力链接
> * 其他未修改，用法与原版相同

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



## 将下面这个发给机器人，一次

> * /cmd ql repo https://github.com/LJMX996/jd.git "pull.sh" "" "" "aaron"

## 去面板添加这四个任务

> * 名称:更新仓库
> * 定时:3,33 * * * *
> * 命令:task /ql/repo/LJMX996_jd_aaron/pull.sh

> * 名称:更新仓库备用
> * 定时:25 * * * *
> * 命令:task /ql/config/pull.sh

> * 名称:依赖安装
> * 定时: 10 13 * * * *
> * 命令:task /ql/repo/LJMX996_jd_aaron/yilai.sh
> * 只需要运行一次

> * 名称:2.8.1助力导出
> * 定时: 10 0-23/4 * * * *
> * 命令:task /ql/repo/LJMX996_jd_aaron/code.sh

### 2.8.*自动互助提示
编辑config下 → task_before.sh文件

内容如下

   ```diff
#!/usr/bin/env bash
if [[ $(ls $dir_code) ]]; then
    latest_log=$(ls -r $dir_code | head -1)
    . $dir_code/$latest_log
fi
   ```


# ninja安装参考
机器人命令如下

> * 名称:安装ninja
> * 命令:nohup task /ql/repo/LJMX996_jd_aaron/install-ninja.sh


> * 名称:更新&启动ninja
> * 命令:nohup task /ql/repo/LJMX996_jd_aaron/up-ninja.sh


# 机器人扫码

> * /cmd cd /ql/repo/dockerbot/jbot/bot/ && rm -rf getcookie.py && wget https://raw.githubusercontent.com/LJMX996/jd/help/getcookie.py


