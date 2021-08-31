# 25 1-23/3 * * *
# 在这里输入青龙面板用户名密码，如果不填写，就自动从auth.json中读取
username = ""
password = ""

import requests
import time
import json
import re
requests.packages.urllib3.disable_warnings()

token=""
if username == "" or password == "":
    f = open("/ql/config/auth.json")
    auth = f.read()
    auth = json.loads(auth)
    username = auth["username"]
    password = auth["password"]
    token=auth["token"]
    f.close()


def gettimestamp():
    return str(int(time.time() * 1000))


def login(username, password):
    url = "http://127.0.0.1:5700/api/login?t=%s" % gettimestamp()
    data = {"username": username, "password": password}
    r = s.post(url, data)
    s.headers.update({"authorization": "Bearer " + json.loads(r.text)["data"]["token"]})


def getitem(key):
    url = "http://127.0.0.1:5700/api/envs?searchValue=%s&t=%s" % (key, gettimestamp())
    r = s.get(url)
    item = json.loads(r.text)["data"]
    return item


def wstopt(wskey):
    try:
        url = "https://jdsign.tk/getck"
        headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
        }
        data = {"wskey": wskey, "key": "xb3z4z2m3n847"}
        r = requests.post(url, headers=headers, data=json.dumps(data), verify=False)
        return r.text
    except:
        return "error"


def update(text, qlid):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = {
        "name": "JD_COOKIE",
        "value": text,
        "_id": qlid
    }
    r = s.put(url, data=json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


def insert(text):
    url = "http://127.0.0.1:5700/api/envs?t=%s" % gettimestamp()
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    data = []
    data_json = {
        "value": text,
        "name": "JD_COOKIE"
    }
    data.append(data_json)
    r = s.post(url, json.dumps(data))
    if json.loads(r.text)["code"] == 200:
        return True
    else:
        return False


if __name__ == '__main__':
    s = requests.session()
    if token =="":
        login(username, password)
    else:
        s.headers.update({"authorization": "Bearer " + token})
    wskeys = getitem("JD_WSCK")
    count = 1
    for i in wskeys:
        ptck = wstopt(i["value"])
        if ptck == "wskey错误":
            print("第%s个wskey可能过期了" % count)
        elif ptck == "未知错误":
            print("第%s个wskey发生了未知错误" % count)
        else:
            ptpin = re.findall(r"pt_pin=(.*?);", ptck)[0]
            item = getitem("pt_pin=" + ptpin)
            if item != []:
                qlid = item[0]["_id"]
                if update(ptck, qlid):
                    print("第%s个wskey更新成功" % count)
                else:
                    print("第%s个wskey更新失败" % count)
            else:
                if insert(ptck):
                    print("第%s个wskey添加成功" % count)
                else:
                    print("第%s个wskey添加失败" % count)
        count += 1
