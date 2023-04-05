# -*- coding: utf-8 -*


'''
12 */4 * * *
new Env('检测更新ck');

'''
import socket  # 用于端口检测
import base64  # 用于编解码
import json  # 用于Json解析
import os  # 用于导入系统变量
import sys  # 实现 sys.exit
import logging  # 用于日志输出
import time  # 时间
import re  # 正则过滤
import hmac
import struct

WSKEY_MODE = 0
# 0 = Default / 1 = Debug!

if "WSKEY_DEBUG" in os.environ or WSKEY_MODE:  # 判断调试模式变量
    logging.basicConfig(level=logging.DEBUG, format='%(message)s')  # 设置日志为 Debug等级输出
    logger = logging.getLogger(__name__)  # 主模块
    logger.debug("\nDEBUG模式开启!\n")  # 消息输出
else:  # 判断分支
    logging.basicConfig(level=logging.INFO, format='%(message)s')  # Info级日志
    logger = logging.getLogger(__name__)  # 主模块

try:  # 异常捕捉
    import requests  # 导入HTTP模块
except Exception as e:  # 异常捕捉
    logger.info(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")  # 日志输出
    sys.exit(1)  # 退出脚本
os.environ['no_proxy'] = '*'  # 禁用代理
requests.packages.urllib3.disable_warnings()  # 抑制错误
try:  # 异常捕捉
    from notify import send  # 导入青龙消息通知模块
except Exception as err:  # 异常捕捉
    logger.debug(str(err))  # 调试日志输出
    logger.info("无推送文件")  # 标准日志输出

ver = 21212  # 版本号


# def ql_2fa():
#     ''' Demo
#     if "WSKEY_TOKEN" in os.environ:
#     url = 'http://127.0.0.1:{0}/api/user'.format(port)  # 设置 URL地址
#     try:  # 异常捕捉
#         res = s.get(url)  # HTTP请求 [GET] 使用 session
#     except Exception as err:  # 异常捕捉
#         logger.debug(str(err))  # 调试日志输出
#     else:  # 判断分支
#         if res.status_code == 200 and res.json()["code"] == 200:
#             twoFactorActivated = str(res.json()["data"]["twoFactorActivated"])
#             if twoFactorActivated == 'true':
#                 logger.info("青龙 2FA 已开启!")
#     url = 'http://127.0.0.1:{0}/api/envs?searchValue=WSKEY_Client'.format(port)  # 设置 URL地址
#     res = s.get(url)
#     if res.status_code == 200 and res.json()["code"] == 200:
#         data = res.json()["data"]
#         if len(data) == 0:
#             url = 'http://127.0.0.1:{0}/api/apps'
#             data = json.dumps({
#                 "name": "wskey",
#                 "scopes": ["crons", "envs", "configs", "scripts", "logs", "dependencies", "system"]
#             })
#             res = s.post(url, data=data)
#             if res.status_code == 200 and res.json()["code"] == 200:
#                 logger.info("OpenApi创建成功")
#                 client_id = res.json()["data"]["client_id"]
#                 client_secret = res.json()["data"]["client_secret"]
#                 wskey_value = 'client_id={0}&client_secret={1}'.format(client_id, client_secret)
#                 data = [{"value": wskey_value, "name": "WSKEY_Client", "remarks": "WSKEY_OpenApi请勿删除"}]
#                 data = json.dumps(data)  # Json格式化数据
#                 url = 'http://127.0.0.1:{0}/api/envs'.format(port)  # 设置 URL地址
#                 s.post(url=url, data=data)  # HTTP[POST]请求 使用session
#                 logger.info("\nWSKEY_Client变量添加完成\n--------------------\n")  # 标准日志输出
#     '''

def ttotp(key):
    key = base64.b32decode(key.upper() + '=' * ((8 - len(key)) % 8))
    counter = struct.pack('>Q', int(time.time() / 30))
    mac = hmac.new(key, counter, 'sha1').digest()
    offset = mac[-1] & 0x0f
    binary = struct.unpack('>L', mac[offset:offset + 4])[0] & 0x7fffffff
    return str(binary)[-6:].zfill(6)


def ql_send(text):
    if "WSKEY_SEND" in os.environ and os.environ["WSKEY_SEND"] == 'disable':
        return True
    else:
        try:  # 异常捕捉
            send('WSKEY转换', text)  # 消息发送
        except Exception as err:  # 异常捕捉
            logger.debug(str(err))  # Debug日志输出
            logger.info("通知发送失败")  # 标准日志输出


# 登录青龙 返回值 token
def get_qltoken(username, password, twoFactorSecret):  # 方法 用于获取青龙 Token
    logger.info("Token失效, 新登陆\n")  # 日志输出
    if twoFactorSecret:
        try:
            twoCode = ttotp(twoFactorSecret)
        except Exception as err:
            logger.debug(str(err))  # Debug日志输出
            logger.info("TOTP异常")
            sys.exit(1)
        url = ql_url + "api/user/login"  # 设置青龙地址 使用 format格式化自定义端口
        payload = json.dumps({
            'username': username,
            'password': password
        })  # HTTP请求载荷
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }  # HTTP请求头 设置为 Json格式
        try:  # 异常捕捉
            res = requests.post(url=url, headers=headers, data=payload)  # 使用 requests模块进行 HTTP POST请求
            if res.status_code == 200 and res.json()["code"] == 420:
                url = ql_url + 'api/user/two-factor/login'
                data = json.dumps({
                    "username": username,
                    "password": password,
                    "code": twoCode
                })
                res = requests.put(url=url, headers=headers, data=data)
                if res.status_code == 200 and res.json()["code"] == 200:
                    token = res.json()["data"]['token']  # 从 res.text 返回值中 取出 Token值
                    return token
                else:
                    logger.info("两步校验失败\n")  # 日志输出
                    sys.exit(1)
            elif res.status_code == 200 and res.json()["code"] == 200:
                token = res.json()["data"]['token']  # 从 res.text 返回值中 取出 Token值
                return token
        except Exception as err:
            logger.debug(str(err))  # Debug日志输出
            sys.exit(1)
    else:
        url = ql_url + 'api/user/login'
        payload = {
            'username': username,
            'password': password
        }  # HTTP请求载荷
        payload = json.dumps(payload)  # json格式化载荷
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }  # HTTP请求头 设置为 Json格式
        try:  # 异常捕捉
            res = requests.post(url=url, headers=headers, data=payload)  # 使用 requests模块进行 HTTP POST请求
            if res.status_code == 200 and res.json()["code"] == 200:
                token = res.json()["data"]['token']  # 从 res.text 返回值中 取出 Token值
                return token
            else:
                ql_send("青龙登录失败!")
                sys.exit(1)  # 脚本退出
        except Exception as err:
            logger.debug(str(err))  # Debug日志输出
            logger.info("使用旧版青龙登录接口")
            url = ql_url + 'api/login'  # 设置青龙地址 使用 format格式化自定义端口
            payload = {
                'username': username,
                'password': password
            }  # HTTP请求载荷
            payload = json.dumps(payload)  # json格式化载荷
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }  # HTTP请求头 设置为 Json格式
            try:  # 异常捕捉
                res = requests.post(url=url, headers=headers, data=payload)  # 使用 requests模块进行 HTTP POST请求
                token = json.loads(res.text)["data"]['token']  # 从 res.text 返回值中 取出 Token值
            except Exception as err:  # 异常捕捉
                logger.debug(str(err))  # Debug日志输出
                logger.info("青龙登录失败, 请检查面板状态!")  # 标准日志输出
                ql_send('青龙登陆失败, 请检查面板状态.')
                sys.exit(1)  # 脚本退出
            else:  # 无异常执行分支
                return token  # 返回 token值
        # else:  # 无异常执行分支
        #     return token  # 返回 token值


# 返回值 Token
def ql_login():  # 方法 青龙登录(获取Token 功能同上)
    path = '/ql/config/auth.json'  # 设置青龙 auth文件地址
    if not os.path.isfile(path):
        path = '/ql/data/config/auth.json'  # 尝试设置青龙 auth 新版文件地址
    if os.path.isfile(path):  # 进行文件真值判断
        with open(path, "r") as file:  # 上下文管理
            auth = file.read()  # 读取文件
            file.close()  # 关闭文件
        auth = json.loads(auth)  # 使用 json模块读取
        username = auth["username"]  # 提取 username
        password = auth["password"]  # 提取 password
        token = auth["token"]  # 提取 authkey
        try:
            twoFactorSecret = auth["twoFactorSecret"]
        except Exception as err:
            logger.debug(str(err))  # Debug日志输出
            twoFactorSecret = ''
        if token == '':  # 判断 Token是否为空
            return get_qltoken(username, password, twoFactorSecret)  # 调用方法 get_qltoken 传递 username & password
        else:  # 判断分支
            url = ql_url + 'api/user'  # 设置URL请求地址 使用 Format格式化端口
            headers = {
                'Authorization': 'Bearer {0}'.format(token),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36 Edg/94.0.992.38'
            }  # 设置用于 HTTP头
            res = requests.get(url=url, headers=headers)  # 调用 request模块发送 get请求
            if res.status_code == 200:  # 判断 HTTP返回状态码
                return token  # 有效 返回 token
            else:  # 判断分支
                return get_qltoken(username, password, twoFactorSecret)  # 调用方法 get_qltoken 传递 username & password
    else:  # 判断分支
        logger.info("没有发现auth文件, 你这是青龙吗???")  # 输出标准日志
        sys.exit(0)  # 脚本退出




def ql_check(port):  # 方法 检查青龙端口
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Socket模块初始化
    sock.settimeout(2)  # 设置端口超时
    try:  # 异常捕捉
        sock.connect(('127.0.0.1', port))  # 请求端口
    except Exception as err:  # 捕捉异常
        logger.debug(str(err))  # 调试日志输出
        sock.close()  # 端口关闭
        return False  # 返回 -> False[Bool]
    else:  # 分支判断
        sock.close()  # 关闭端口
        return True  # 返回 -> True[Bool]







def check_id():  # 方法 兼容青龙老版本与新版本 id & _id的问题
    url = ql_url + 'api/envs'
    try:  # 异常捕捉
        res = s.get(url).json()  # HTTP[GET] 请求 使用 session
    except Exception as err:  # 异常捕捉
        logger.debug(str(err))  # 调试日志输出
        logger.info("\n青龙环境接口错误")  # 标准日志输出
        sys.exit(1)  # 脚本退出
    else:  # 判断分支
        if '_id' in res['data'][0]:  # 判断 [_id]
            logger.info("使用 _id 键值")  # 标准日志输出
            return '_id'  # 返回 -> '_id'
        else:  # 判断分支
            logger.info("使用 id 键值")  # 标准日志输出
            return 'id'  # 返回 -> 'id'


def ql_update(e_id, n_ck):  # 方法 青龙更新变量 传递 id cookie
    url = ql_url + 'api/envs'
    data = {
        "name": "JD_COOKIE",
        "value": n_ck,
        ql_id: e_id
    }  # 设置 HTTP POST 载荷
    data = json.dumps(data)  # json模块格式化
    s.put(url=url, data=data)  # HTTP [PUT] 请求 使用 session
    ql_enable(eid)  # 调用方法 ql_enable 传递 eid


def ql_enable(e_id):  # 方法 青龙变量启用 传递值 eid
    url = ql_url + 'api/envs/enable'
    data = '["{0}"]'.format(e_id)  # 格式化 POST 载荷
    res = json.loads(s.put(url=url, data=data).text)  # json模块读取 HTTP[PUT] 的返回值
    if res['code'] == 200:  # 判断返回值为 200
        logger.info("\n账号启用\n--------------------\n")  # 标准日志输出
        return True  # 返回 ->True
    else:  # 判断分支
        logger.info("\n账号启用失败\n--------------------\n")  # 标准日志输出
        return False  # 返回 -> Fasle


def ql_disable(e_id):  # 方法 青龙变量禁用 传递 eid
    url = ql_url + 'api/envs/disable'
    data = '["{0}"]'.format(e_id)  # 格式化 POST 载荷
    res = json.loads(s.put(url=url, data=data).text)  # json模块读取 HTTP[PUT] 的返回值
    if res['code'] == 200:  # 判断返回值为 200
        logger.info("\n账号禁用成功\n--------------------\n")  # 标准日志输出
        return True  # 返回 ->True
    else:  # 判断分支
        logger.info("\n账号禁用失败\n--------------------\n")  # 标准日志输出
        return False  # 返回 -> Fasle


def ql_insert(i_ck):  # 方法 插入新变量
    data = [{"value": i_ck, "name": "JD_COOKIE"}]  # POST数据载荷组合
    data = json.dumps(data)  # Json格式化数据
    url = ql_url + 'api/envs'
    s.post(url=url, data=data)  # HTTP[POST]请求 使用session
    logger.info("\n账号添加完成\n--------------------\n")  # 标准日志输出


def cloud_info():  # 方法 云端信息
    url = str(base64.b64decode(url_t).decode()) + 'api/check_api'  # 设置 URL地址 路由 [check_api]
    for i in range(3):  # For循环 3次
        try:  # 异常捕捉
            headers = {"authorization": "Bearer Shizuku"}  # 设置 HTTP头
            res = requests.get(url=url, verify=False, headers=headers, timeout=20).text  # HTTP[GET] 请求 超时 20秒
        except requests.exceptions.ConnectTimeout:  # 异常捕捉
            logger.info("\n获取云端参数超时, 正在重试!" + str(i))  # 标准日志输出
            time.sleep(1)  # 休眠 1秒
            continue  # 循环继续
        except requests.exceptions.ReadTimeout:  # 异常捕捉
            logger.info("\n获取云端参数超时, 正在重试!" + str(i))  # 标准日志输出
            time.sleep(1)  # 休眠 1秒
            continue  # 循环继续
        except Exception as err:  # 异常捕捉
            logger.info("\n未知错误云端, 退出脚本!")  # 标准日志输出
            logger.debug(str(err))  # 调试日志输出
            sys.exit(1)  # 脚本退出
        else:  # 分支判断
            try:  # 异常捕捉
                c_info = json.loads(res)  # json读取参数
            except Exception as err:  # 异常捕捉
                logger.info("云端参数解析失败")  # 标准日志输出
                logger.debug(str(err))  # 调试日志输出
                sys.exit(1)  # 脚本退出
            else:  # 分支判断
                return c_info  # 返回 -> c_info


def check_cloud():  # 方法 云端地址检查
    url_list = ['aHR0cHM6Ly9hcGkubW9tb2UubWwv', 'aHR0cHM6Ly9hcGkubGltb2UuZXUub3JnLw==', 'aHR0cHM6Ly9hcGkuaWxpeWEuY2Yv']  # URL list Encode
    for i in url_list:  # for循环 url_list
        url = str(base64.b64decode(i).decode())  # 设置 url地址 [str]
        try:  # 异常捕捉
            requests.get(url=url, verify=False, timeout=10)  # HTTP[GET]请求 超时 10秒
        except Exception as err:  # 异常捕捉
            logger.debug(str(err))  # 调试日志输出
            continue  # 循环继续
        else:  # 分支判断
            info = ['HTTPS', 'Eu_HTTPS', 'CloudFlare']  # 输出信息[List]
            logger.info(str(info[url_list.index(i)]) + " Server Check OK\n--------------------\n")  # 标准日志输出
            return i  # 返回 ->i
    logger.info("\n云端地址全部失效, 请检查网络!")  # 标准日志输出
    ql_send('云端地址失效. 请联系作者或者检查网络.')  # 推送消息
    sys.exit(1)  # 脚本退出


def check_port():  # 方法 检查变量传递端口
    logger.info("\n--------------------\n")  # 标准日志输出
    if "QL_PORT" in os.environ:  # 判断 系统变量是否存在[QL_PORT]
        try:  # 异常捕捉
            port = int(os.environ['QL_PORT'])  # 取值 [int]
        except Exception as err:  # 异常捕捉
            logger.debug(str(err))  # 调试日志输出
            logger.info("变量格式有问题...\n格式: export QL_PORT=\"端口号\"")  # 标准日志输出
            logger.info("使用默认端口5700")  # 标准日志输出
            return 5700  # 返回端口 5700
    else:  # 判断分支
        port = 5700  # 默认5700端口
    if not ql_check(port):  # 调用方法 [ql_check] 传递 [port]
        logger.info(str(port) + "端口检查失败, 如果改过端口, 请在变量中声明端口 \n在config.sh中加入 export QL_PORT=\"端口号\"")  # 标准日志输出
        logger.info("\n如果你很确定端口没错, 还是无法执行, 在GitHub给我发issus\n--------------------\n")  # 标准日志输出
        sys.exit(1)  # 脚本退出
    else:  # 判断分支
        logger.info(str(port) + "端口检查通过")  # 标准日志输出
        return port  # 返回->port


if __name__ == '__main__':  # Python主函数执行入口
    port = check_port()  # 调用方法 [check_port]  并赋值 [port]
    ql_url = 'http://127.0.0.1:{0}/'.format(port)
    token = ql_login()  # 调用方法 [ql_login]  并赋值 [token]
    s = requests.session()  # 设置 request session方法
    s.headers.update({"authorization": "Bearer " + str(token)})  # 增加 HTTP头认证
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})  # 增加 HTTP头 json 类型

    logger.info("执行完成\n--------------------")  # 标准日志输出
    sys.exit(0)  # 脚本退出
    # Enjoy
