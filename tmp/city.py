# -*- coding:utf-8 -*-
import requests, random, datetime, sys, time, os
from jd_Cookie import jdCookiePython

name = '城城领现金'
cookie=''
index = ''
nickName = ''
pinName = ''
UA=''
helpShareFlag='false' #是否优先助力[助力池]，默认true | 优先[内部助力]改为 false
inviteIdCodesArr=[]
shareCodesArr=[]
newShareCodes=[]
inviteCodes=['RtGKopT-F2LfA_7eb71omiWNcu9b8Nvl91kpR3xLLLoB5GEz','RtGKu7jsI2j6K-r9Sq5Amqdna1eQxqHek8v9VhzyzRZhoIqR','RtGKnbXCMHTaAvb9Zb11mkP6SK9lt5_0ZKMW_WlW0K3jYA85']
requests.packages.urllib3.disable_warnings()
if "JD_CITY_HELPSHARE" in os.environ.keys():
    helpShareFlag = os.environ["JD_CITY_HELPSHARE"]
def main():
    """  """
    try:
        global UA
        global cookie
        global pinName
        global nickName
        global index
        global inviteIdCodesArr
        global shareCodesArr
        cookieArr = jdCookiePython()
        if helpShareFlag+"" == "true":
            setLog('脚本优先助力[助力池] 如需开启优先助力[内部账号]，请设置环境变量  JD_CITY_HELPSHARE 为false\n')
        else:
            setLog('脚本优先助力[内部账号] 如需开启优先助力[助力池]，请设置环境变量  JD_CITY_HELPSHARE 为true\n')
        for i in range(len(cookieArr)):
            index = i + 1
            nickName=cookieArr[i]["userName"]
            pinName=cookieArr[i]["pinName"]
            cookie = cookieArr[i]["cookie"]
            UA = f"jdapp;iPhone;10.1.2;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/3364463029;appBuild/167802;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            inviteIdCodesArr.append('')
            getInviteId()
            # setLog(inviteIdCodesArr)
            time.sleep(1)
        if len(inviteIdCodesArr) > 0:
            for i in range(len(cookieArr)):
                pinName=cookieArr[i]["pinName"]
                index = i + 1
                code = []
                for s in range(len(cookieArr)):
                    if s != index-1 and inviteIdCodesArr[s]: code.append(inviteIdCodesArr[s])
                if len(code) > 0: shareCodesArr.append('@'.join(code))

        for i in range(len(cookieArr)):
            index = i + 1
            nickName=cookieArr[i]["userName"]
            pinName=cookieArr[i]["pinName"]
            cookie = cookieArr[i]["cookie"]
            UA = f"jdapp;iPhone;10.1.2;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/3364463029;appBuild/167802;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
            setLog(f"\n******开始【京东账号{index}】{nickName if nickName else pinName}*********\n")
            shareCodesFormat()
            for a in range(len(newShareCodes)):
                setLog(f'\n开始助力【{newShareCodes[a]}】')
                msg = getInfo(newShareCodes[a])
                if msg == True: break
                time.sleep(2)
            getInviteInfo()
            msg = city_lotteryAward()
            if msg and msg > 0:
                for i in msg:
                    msg = city_lotteryAward()
                    if msg == 0: break
                    time.sleep(2)
            time.sleep(3)
            # break

    except Exception as e:
        setLog(f"城城领现金 {e}")
def getInfo(inviteId):
    msg=False
    try:
        getUrl='https://api.m.jd.com/client.action'
        headers = {
            'accept': '*/*',
            'user-agent': UA,
            'accept-language': 'zh-Hans-CN;q=1',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': f'{cookie} shshshfpb=z%20Pe%2FxmIr50rNCsyxisjWiA%3D%3D;'
        }
        data = 'functionId=city_getHomeData&body={"lbsCity":"16","realLbsCity":"1315","inviteId":"'+inviteId+'","headImg":"","userName":"","taskChannel":"1"}&client=wh5&clientVersion=1.0.0'
        proxies = None
        response = requests.post(getUrl, headers=headers, data=data, timeout=20, verify=False, proxies=proxies)
        response.encoding = 'utf8'
        # setLog(response.text)
        res = response.json()
        if res["code"] == 0:
            if "data" in res.keys() and res["data"]["bizCode"] == 0:
                if "toasts" in res["data"]["result"].keys() and len(res["data"]["result"]["toasts"]) > 0:
                    if int(res["data"]["result"]["toasts"][0]["status"]) == 3: msg=True
                    setLog(res["data"]["result"]["toasts"][0]["msg"])
                setLog("待提现:￥"+res["data"]["result"]["userActBaseInfo"]["poolMoney"])
                for vo in res["data"]["result"]["popWindows"]:
                    if vo["type"] == "dailycash_second":
                        receiveCash()
                        time.sleep(2)
                for vo in res["data"]["result"]["mainInfos"]:
                    if "remaingAssistNum" in vo.keys() and int(vo["remaingAssistNum"]) == 0 and int(vo["status"]) == 1:
                        setLog(vo["roundNum"])
                        receiveCash(vo["roundNum"])
                        time.sleep(2)
            else:
                setLog(f'\n助力失败{res["data"]["bizMsg"]}')
        else:
            setLog(f'\n助力失败:{response.text}')
    except Exception as e:
        setLog(f"助力 {e}")
    return msg


def getInviteId():
    try:
        global inviteIdCodesArr
        getUrl='https://api.m.jd.com/client.action'
        headers = {
            'accept': '*/*',
            'user-agent': UA,
            'accept-language': 'zh-Hans-CN;q=1',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': f'{cookie}'
        }
        data = 'functionId=city_getHomeData&body={"lbsCity":"16","realLbsCity":"1315","inviteId":"","headImg":"","userName":"","taskChannel":"1"}&client=wh5&clientVersion=1.0.0'
        proxies = None
        response = requests.post(getUrl, headers=headers, data=data, timeout=20, verify=False, proxies=proxies)
        response.encoding = 'utf8'
        res = response.json()
        if res["code"] == 0:
            if "data" in res.keys() and res["data"]["bizCode"] == 0:
                if "inviteId" in res["data"]["result"]["userActBaseInfo"].keys():
                    setLog(f"\n【京东账号{index}（{pinName}）的{name}好友互助码】"+res["data"]["result"]["userActBaseInfo"]["inviteId"])
                    inviteIdCodesArr[index - 1] = res["data"]["result"]["userActBaseInfo"]["inviteId"]
            else:
                setLog(f'\n获取邀请码失败{res["data"]["bizMsg"]}')
        else:
            setLog(f'\n获取助力码失败:{response.text}')
    except Exception as e:
        setLog(f"获取助力码 {e}")

def receiveCash(roundNum=''):
    try:
        getUrl='https://api.m.jd.com/client.action'
        headers = {
            'accept': '*/*',
            'user-agent': UA,
            'accept-language': 'zh-Hans-CN;q=1',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': f'{cookie}'
        }
        body = '{"cashType":2}'
        if roundNum: body = '{"cashType":1,"roundNum":'+str(roundNum)+'}'
        if roundNum == -1: body = '{"cashType":4}'
        data = 'functionId=city_receiveCash&body='+body+'&client=wh5&clientVersion=1.0.0'
        proxies = None
        response = requests.post(getUrl, headers=headers, data=data, timeout=20, verify=False, proxies=proxies)
        response.encoding = 'utf8'
        res = response.json()
        if res["code"] == 0:
            if "data" in res.keys() and res["data"]["bizCode"] == 0:
                setLog(f'获得 {res["data"]["result"]["currentTimeCash"]} 元，共计 {res["data"]["result"]["totalCash"]} 元')

    except Exception as e:
        setLog(f"领红包 {e}")

def getInviteInfo():
    try:
        getUrl='https://api.m.jd.com/client.action'
        headers = {
            'accept': '*/*',
            'user-agent': UA,
            'accept-language': 'zh-Hans-CN;q=1',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': f'{cookie}'
        }
        body = ''
        data = 'functionId=city_masterMainData&body={'+body+'}&client=wh5&clientVersion=1.0.0'
        proxies = None
        response = requests.post(getUrl, headers=headers, data=data, timeout=20, verify=False, proxies=proxies)
        response.encoding = 'utf8'
        res = response.json()
        if res["code"] == 0:
            if "data" in res.keys() and res["data"]["bizCode"] == 0:
                if int(res["data"]["result"]["masterData"]["actStatus"]) == 2:
                    setLog('领取赚赏金')
                    receiveCash(-1)

    except Exception as e:
        setLog(f"领取赚赏金 {e}")

def city_lotteryAward():
    msg = 0
    try:
        getUrl='https://api.m.jd.com/client.action'
        headers = {
            'accept': '*/*',
            'user-agent': UA,
            'accept-language': 'zh-Hans-CN;q=1',
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': f'{cookie}'
        }
        body = ''
        data = 'functionId=city_lotteryAward&body={'+body+'}&client=wh5&clientVersion=1.0.0'
        proxies = None
        response = requests.post(getUrl, headers=headers, data=data, timeout=20, verify=False, proxies=proxies)
        response.encoding = 'utf8'
        setLog(f'抽奖结果:\n{response.text}')
        res = response.json()
        if res["code"] == 0:
            if "data" in res.keys() and res["data"]["bizCode"] == 0:
                msg = res['data']['result']['lotteryNum']

    except Exception as e:
        setLog(f"抽奖 {e}")
    return msg

def shareCodesFormat():
    try:
        global shareCodesArr
        global newShareCodes
        newShareCodes = []
        if helpShareFlag != "true":
            if shareCodesArr[index-1]:
                newShareCodes = shareCodesArr[index-1].split('@')
        response = requests.get("https://jd.smiek.tk/city", timeout=20, verify=False)
        response.encoding = 'utf8'
        res = response.json()
        if res["code"] == 200:
            if "data" in res.keys():
                newShareCodes = newShareCodes+res["data"]
        if index == 1:
            newShareCodes = inviteCodes+newShareCodes
        setLog(f'第{index}个京东账号将要助力的好友{str(newShareCodes)}')
    except Exception as e:
        setLog(f"助力码获取 {e}")

def setLog(str_msg='',sj=None):
    dt = ''
    if sj != None:
        dt=datetime.datetime.now().strftime('[%Y-%m-%d %H:%M:%S] ')
    else:
        dt = ''
        # dt=datetime.datetime.now().strftime('[%Y-%m-%d %H:%M:%S] ')
    print(f"{dt}{str_msg}")
    sys.stdout.flush()


def randomString(n):
    """
    #### 随机生成字符
    :n 生成字符的长度 | int 
    """
    s = [random.choice("abcdef0123456789") for i in range(n)]
    return "".join(s)

if __name__ == '__main__':
    main()