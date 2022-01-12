# -*- coding:utf-8 -*-
import requests
import json
import time
import os
import re
import sys
import random
import string
import urllib


t=str(round(time.time() * 1000))
choujiangurl='https://api.m.jd.com/?functionId=spring_reward_receive&body={"inviter":"","linkId":"7ya6o83WSbNhrbYJqsMfFA"}&_t='+t+'&appid=activities_platform'
tixianxinxiurl='https://api.m.jd.com/?functionId=spring_reward_list&body={"pageNum":1,"pageSize":10,"linkId":"7ya6o83WSbNhrbYJqsMfFA","inviter":""}&_t='+t+'&appid=activities_platform'
tixianurl='https://api.m.jd.com/'


#以下部分参考Curtin的脚本：https://github.com/curtinlv/JD-Script


def randomuserAgent():
    global uuid,addressid,iosVer,iosV,clientVersion,iPhone,area,ADID
    uuid=''.join(random.sample(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','a','b','c','z'], 40))
    addressid = ''.join(random.sample('1234567898647', 10))
    iosVer = ''.join(random.sample(["15.1.1","14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1"], 1))
    iosV = iosVer.replace('.', '_')
    clientVersion=''.join(random.sample(["10.3.0", "10.2.7", "10.2.4"], 1))
    iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
    area=''.join(random.sample('0123456789', 2)) + '_' + ''.join(random.sample('0123456789', 4)) + '_' + ''.join(random.sample('0123456789', 5)) + '_' + ''.join(random.sample('0123456789', 4))
    ADID = ''.join(random.sample('0987654321ABCDEF', 8)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 12))
    UserAgent=''
    if not UserAgent:
        return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/{ADID};model/iPhone{iPhone},1;addressid/{addressid};appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1'
    else:
        return UserAgent

#以上部分参考Curtin的脚本：https://github.com/curtinlv/JD-Script

def printf(text):
    print(text)
    sys.stdout.flush()


def load_send():
    global send
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(cur_path + "/sendNotify.py"):
        try:
            from sendNotify import send
        except:
            send=False
            printf("加载通知服务失败~\n")
    else:
        send=False
        printf("加载通知服务失败~\n")
load_send()
    
def get_remarkinfo():
    url='http://127.0.0.1:5600/api/envs'
    try:
        with open(os.getcwd().replace('scripts','config')+'/auth.json', 'r') as f:
            token=json.loads(f.read())['token']
        headers={
            'Accept':'application/json',
            'authorization':'Bearer '+token,
            }
        response=requests.get(url=url,headers=headers)

        for i in range(len(json.loads(response.text)['data'])):
            if json.loads(response.text)['data'][i]['name']=='JD_COOKIE':
                try:
                    if json.loads(response.text)['data'][i]['remarks'].find('@@')==-1:
                        remarkinfos[json.loads(response.text)['data'][i]['value'].split(';')[1].replace('pt_pin=','')]=json.loads(response.text)['data'][i]['remarks'].replace('remark=','').replace(';','')
                    else:
                        remarkinfos[json.loads(response.text)['data'][i]['value'].split(';')[1].replace('pt_pin=','')]=json.loads(response.text)['data'][i]['remarks'].split("@@")[0].replace('remark=','').replace(';','')
                except:
                    pass
    except:
        printf('读取auth.json文件出错，跳过获取备注\n')

def choujiang(ck):
    headers={
        'Accept':'application/json, text/plain, */*',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-CN,zh-Hans;q=0.9',
        'Connection':'keep-alive',
        'Cookie':ck,
        'Host':'api.m.jd.com',
        'Origin':'https://prodev.m.jd.com',
        'Referer':'https://prodev.m.jd.com/',
        'User-Agent':UserAgent
        }

    try:
        response=requests.get(url=choujiangurl,headers=headers)
        amount=json.loads(response.text)['data']['received']['amount']
        useLimit=json.loads(response.text)['data']['received']['useLimit']
        if useLimit!='':
            printf(f'获得{useLimit}-{amount}的优惠券\n')
        else:
            printf(f'获得{amount}现金')
    except:
        printf('抽奖失败，可能是次数用完或者黑号了\n')
def tixianxinxi(ck):
    global tixianliebiao
    tixianliebiao=[]
    headers={
        'Accept':'application/json, text/plain, */*',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-CN,zh-Hans;q=0.9',
        'Connection':'keep-alive',
        'Cookie':ck,
        'Host':'api.m.jd.com',
        'Origin':'https://prodev.m.jd.com',
        'Referer':'https://prodev.m.jd.com/',
        'User-Agent':UserAgent
        }
    try:
        response=requests.get(url=tixianxinxiurl,headers=headers)
        for i in range(len(json.loads(response.text)['data']['items'])):
            if not json.loads(response.text)['data']['items'][i]['couponKind'] and int(json.loads(response.text)['data']['items'][i]['state'])==3 and int(json.loads(response.text)['data']['items'][i]['prizeType']==4):
                tixianliebiao.append(str(json.loads(response.text)['data']['items'][i]['id'])+'@'+str(json.loads(response.text)['data']['items'][i]['poolBaseId'])+'@'+str(json.loads(response.text)['data']['items'][i]['prizeGroupId'])+'@'+str(json.loads(response.text)['data']['items'][i]['prizeBaseId']))
    except:
        printf('获取提现列表出错，可能是黑号了\n')
def tixian(ck,couponId,poolBaseId,prizeGroupId,prizeBaseId):
    headers={
        'Host':'api.m.jd.com',
        'Content-Type':'application/x-www-form-urlencoded',
        'Origin':'https://prodev.m.jd.com',
        'Accept-Encoding':'gzip, deflate, br',
        'Cookie':ck,
        'Connection':'keep-alive',
        'Accept':'application/json, text/plain, */*',
        'User-Agent':UserAgent,
        'Referer':'https://prodev.m.jd.com/',
        'Content-Length':'277',
        'Accept-Language':'zh-CN,zh-Hans;q=0.9'
        }
    data='functionId=apCashWithDraw&body={"businessSource":"SPRING_FESTIVAL_RED_ENVELOPE","base":{"id":%s,"business":null,"poolBaseId":%s,"prizeGroupId":%s,"prizeBaseId":%s,"prizeType":4},"linkId":"7ya6o83WSbNhrbYJqsMfFA","inviter":""}&_t=%s&appid=activities_platform'%(couponId,poolBaseId,prizeGroupId,prizeBaseId,t)
    try:
        response=requests.post(url=tixianurl,headers=headers,data=data)
        printf(response.text+'\n')
    except:
        printf('提现失败')
if __name__ == '__main__':
    remarkinfos={}
    get_remarkinfo()#获取备注
    UserAgent=randomuserAgent()
    try:
        cks = os.environ["JD_COOKIE"].split("&")#获取cookie
    except:
        f = open("/jd/config/config.sh", "r", encoding='utf-8')
        cks = re.findall(r'Cookie[0-9]*="(pt_key=.*?;pt_pin=.*?;)"', f.read())
        f.close()
    for ck in cks:
        ptpin = re.findall(r"pt_pin=(.*?);", ck)[0]
        try:
            if remarkinfos[ptpin]!='':
                printf("--账号:" + remarkinfos[ptpin] + "--")
            else:
                printf("--无备注账号:" + urllib.parse.unquote(ptpin) + "--")
        except:
            printf("--账号:" + urllib.parse.unquote(ptpin) + "--")
        for i in range(3):
            choujiang(ck)
        tixianxinxi(ck)
        if tixianliebiao:
            for i in range(len(tixianliebiao)):
                tixian(ck,tixianliebiao[i].split('@')[0],tixianliebiao[i].split('@')[1],tixianliebiao[i].split('@')[2],tixianliebiao[i].split('@')[3])
        printf('\n\n\n')
        time.sleep(30)
