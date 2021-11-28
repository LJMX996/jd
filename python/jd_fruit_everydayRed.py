'''
cron: 5 5,20 * * * jd_fruit_everydayRed.py
new Env('东东农场-天天红包抽奖');
入口: 京东》我的>东东农场>天天红包
变量: JD_COOKIE
export JD_COOKIE="第1个cookie&第2个cookie"

'''

import os,json,random,time,re,string,functools
import sys
sys.path.append('../../tmp')
sys.path.append(os.path.abspath('.')) 
try:
    import requests
except Exception as e:
    print(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")
requests.packages.urllib3.disable_warnings()


run_send='yes'              # yes或no, yes则启用通知推送服务


# 获取pin
cookie_findall=re.compile(r'pt_pin=(.+?);')
def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        print('ck格式不正确，请检查')


# 读取环境变量
def get_env(env):
    try:
        if env in os.environ:
            a=os.environ[env]
        elif '/ql' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/ql/config/config.sh')
            except:
                a=eval(env)
        elif '/jd' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/jd/config/config.sh')
            except:
                a=eval(env)
        else:
            a=eval(env)
    except:
        a=''
    return a

# v4
def v4_env(env,paths):
    b=re.compile(r'(?:export )?'+env+r' ?= ?[\"\'](.*?)[\"\']', re.I)
    with open(paths, 'r') as f:
        for line in f.readlines():
            try:
                c=b.match(line).group(1)
                break
            except:
                pass
    return c


# 随机ua
def ua():
    sys.path.append(os.path.abspath('.'))
    try:
        from jdEnv import USER_AGENTS as a
    except:
        a='jdpingou;android;5.5.0;11;network/wifi;model/M2102K1C;appBuild/18299;partner/lcjx11;session/110;pap/JA2019_3111789;brand/Xiaomi;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36'
    return a

# 13位时间戳
def gettimestamp():
    return str(int(time.time() * 1000))

## 获取cooie
class Judge_env(object):
    def main_run(self):
        if '/jd' in os.path.abspath(os.path.dirname(__file__)):
            cookie_list=self.v4_cookie()
        else:
            cookie_list=os.environ["JD_COOKIE"].split('&')       # 获取cookie_list的合集
        if len(cookie_list)<1:
            print('请填写环境变量JD_COOKIE\n')    
        return cookie_list

    def v4_cookie(self):
        a=[]
        b=re.compile(r'Cookie'+'.*?=\"(.*?)\"', re.I)
        with open('/jd/config/config.sh', 'r') as f:
            for line in f.readlines():
                try:
                    regular=b.match(line).group(1)
                    a.append(regular)
                except:
                    pass
        return a
cookie_list=Judge_env().main_run()

## 获取通知服务
class Msg(object):
    def getsendNotify(self, a=1):
        try:
            url = 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/wuye999/myScripts/main/sendNotify.py'
            response = requests.get(url,timeout=10)
            with open(SCF_path+'sendNotify.py', "w+", encoding="utf-8") as f:
                f.write(response.text)
            return
        except:
            pass
        if a < 3:
            a += 1
            return self.getsendNotify(a)

    def main(self,f=1):
        global send,msg,initialize
        sys.path.append(os.path.abspath('.'))
        for n in range(3):
            try:
                from sendNotify import send,msg,initialize
                break
            except:
                self.getsendNotify()
        l=['BARK','SCKEY','TG_BOT_TOKEN','TG_USER_ID','TG_API_HOST','TG_PROXY_HOST','TG_PROXY_PORT','DD_BOT_TOKEN','DD_BOT_SECRET','Q_SKEY','QQ_MODE','QYWX_AM','PUSH_PLUS_TOKEN','PUSH_PLUS_USER','FSKEY','GOBOT_URL','GOBOT_QQ','GOBOT_TOKEN']
        d={}
        for a in l:
            try:
                d[a]=eval(a)
            except:
                d[a]=''
        try:
            initialize(d)
        except:
            self.getsendNotify()
            if f < 3:
                f += 1
                return self.main(f)
            else:
                print('获取通知服务失败，请检查网络连接...')
Msg().main()   # 初始化通知服务   

# type 和 抽奖次数
def initForTurntableFarm(cookie):
    url=f'https://api.m.jd.com/client.action?functionId=initForTurntableFarm&body=%7B%22version%22%3A4%2C%22channel%22%3A1%7D&appid=wh5'
    headers={
        'cookie': cookie,
        'origin': 'https://carry.m.jd.com',
        "user-agent": ua(),
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'accept': '*/*',
        'x-requested-with': 'com.jingdong.app.mall',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
    }
    for n in range(3):
        try:
            res=requests.get(url,headers=headers).json()
            break
        except:
            if n==2:
                print('API请求失败，请检查网路重试❗\n')
                return 
    try:              
        if res['code']=='0':
            remainLotteryTimes=res['remainLotteryTimes']        # 抽奖次数
            turntableInfos=res['turntableInfos']                # type
            global type_name_s
            type_name_s={type_name['type']:type_name['name'] for type_name in turntableInfos}     # type与name的映射
            msg(f'剩余抽奖次数为 {remainLotteryTimes}')
            return int(remainLotteryTimes)
    except:
        msg(f"错误\n{res}")

# 抽奖
def lotteryForTurntableFarm(cookie):
    url="https://api.m.jd.com/client.action?functionId=lotteryForTurntableFarm&body=%7B%22type%22%3A1%2C%22version%22%3A4%2C%22channel%22%3A1%7D&appid=wh5"
    headers={
        'cookie': cookie,
        'origin': 'https://carry.m.jd.com',
        "user-agent": ua(),
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'accept': '*/*',
        'x-requested-with': 'com.jingdong.app.mall',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
    }
    for n in range(3):
        try:
            res=requests.get(url,headers=headers).json()
            break
        except:
            if n==2:
                print('API请求失败，请检查网路重试❗\n')
                return 
    try:              
        if res['code']=='0':
            type_i=res['type']        # 奖品类型
            remainLotteryTimes=res['remainLotteryTimes']        # 剩余抽奖次数
            name=type_name_s[type_i]
            msg(f"本次抽到 {name}")
            msg(f'剩余抽奖次数为 {remainLotteryTimes}')
            if int(remainLotteryTimes)>0:
                return lotteryForTurntableFarm(cookie)
    except:
        msg(f"错误\n{res}")    

def main():
    msg('🔔东东农场-天天红包抽奖，开始！\n')
    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')
    for e,cookie in enumerate(cookie_list):
        msg(f'******开始【账号 {e}】 {get_pin(cookie)} *********\n')
        remainLotteryTimes=initForTurntableFarm(cookie)
        if remainLotteryTimes>0:
            lotteryForTurntableFarm(cookie)
        else:
            msg('抽奖次数不足\n')
    
    if run_send=='yes':
        send('东东农场-天天红包抽奖')   # 通知服务


if __name__ == '__main__':
    main()

