#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/7/28 2:06 下午
# @File    : dj_init.py
# @Project : jd_scripts
# @Desc    :
import hashlib
import hmac
import json
import time
import math
import random
import urllib3
import asyncio
from requests import Session

from urllib.parse import urlencode, unquote
from utils.console import println

from config import USER_AGENT

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def dj_sign(data):
    """
    :param data:
    :return:
    """
    key = '923047ae3f8d11d8b19aeb9f3d1bc200'
    data = dict(sorted(data.items(), key=lambda x: x[0]))
    values = [v for k, v in data.items() if k != 'functionId' and v]
    obj = hmac.new(key.encode(), '&'.join(values).encode(), hashlib.sha256)
    return obj.hexdigest()


def uuid():
    """
    生成设备ID
    :return:
    """

    def s4():
        return hex(math.floor((1 + random.random()) * 0x10000))[3:]

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()


def get_dj_ck_by_jd_ck(headers, cookies):
    """
    :return:
    """

    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    session = Session()
    session.cookies.update(cookies)
    session.headers.update(headers)
    login_url = 'https://daojia.jd.com/client?functionId=login/passport&platCode=H5&appName=paidaojia&appVersion' \
                '=6.4.0&body=%7B%22returnLink%22%3A%20%22https%3A%2F%2Fdaojia.jd.com%2Ftaro2orchard%2Fh5dist%2F' \
                '%23%2Fpages%2Forchard-t%2Findex%22%7D'
    try:
        session.get(url=login_url, verify=False)
        session_cookies = session.cookies.get_dict()
        result = dict()
        for key, val in session_cookies.items():
            result[key] = val
        return result
    except Exception as e:
        println(e.args)
        return None


async def request(self, session, function_id='', body=None, method='GET'):
    """
        请求数据
        :param self:
        :param session:
        :param function_id:
        :param body:
        :param method:
        :return:
        """
    try:
        if not body:
            body = {}
        params = {
            '_jdrandom': str(int(time.time() * 1000)),
            '_funid_': function_id,
            'functionId': function_id,
            'body': json.dumps(body),
            'tranceId': self.trace_id,
            'deviceToken': self.device_id,
            'deviceId': self.device_id,
            'deviceModel': 'appmodel',
            'appName': 'paidaojia',
            'appVersion': '6.6.0',
            'platCode': 'h5',
            'platform': '6.6.0',
            'channel': 'h5',
            'city_id': self.city_id,
            'lng_pos': self.lng,
            'lat_pos': self.lat,
            'lng': self.lng,
            'lat': self.lat,
            'isNeedDealError': 'true',
        }

        if function_id == 'xapp/loginByPtKeyNew':
            params['code'] = '011UYn000apwmL1nWB000aGiv74UYn03'

        if method == 'GET':
            params['signKeyV1'] = dj_sign(params)
            url = 'https://daojia.jd.com/client?' + urlencode(params)
            response = await session.get(url=url)
        else:
            params['method'] = 'POST'
            params['signKeyV1'] = dj_sign(params)
            url = 'https://daojia.jd.com/client?' + urlencode(params)
            response = await session.post(url=url)

        text = await response.text()
        data = json.loads(text)

        # 所有API等待1s, 避免操作繁忙
        await asyncio.sleep(1)

        return data
    except Exception as e:
        println('{}, 无法获取服务器数据, {}!'.format(self.account, e.args))
        return None


async def get(self, session, function_id, body=None):
    """
    get 方法
    :param session:
    :param function_id:
    :param body:
    :return:
    """
    return await request(self, session, function_id, body, method='GET')


async def post(self, session, function_id, body=None):
    """
        post 方法
        :param session:
        :param function_id:
        :param body:
        :return:
        """
    return await request(self, session, function_id, body, method='POST')


async def wx_request(self, session, function_id='', body=None, method='GET'):
    """
    请求微信小程序端数据
    :param session:
    :param function_id:
    :param body:
    :param method:
    :return:
    """
    try:
        if not body:
            body = {}
        params = {
            '_jdrandom': int(time.time() * 1000),
            '_funid_': function_id,
            'functionId': function_id,
            'body': json.dumps(body),
            'tranceId': self.trace_id,
            'deviceToken': self.device_id,
            'deviceId': self.device_id,
            'deviceModel': 'appmodel',
            'appName': 'paidaojia',
            'appVersion': '5.0.0',
            'platform': '5.0.0',
            'platCode':	'mini',
            'channel':	'wx_xcx',
            'mpChannel': 'wx_xcx',
            'xcxVersion':	'8.10.1',
            'business':	'djgyzhuli',
            'city_id': self.city_id,
            'lng_pos': self.lng,
            'lat_pos': self.lat,
            'lng': self.lng,
            'lat': self.lat,
            'isNeedDealError': 'true',
        }
        if method == 'GET':
            params['signKeyV1'] = dj_sign(params)
            url = 'https://daojia.jd.com/client?' + urlencode(params)
            response = await session.get(url=url)
        else:
            params['method'] = 'POST'
            params['signKeyV1'] = dj_sign(params)
            url = 'https://daojia.jd.com/client?' + urlencode(params)
            response = await session.post(url=url)

        text = await response.text()
        data = json.loads(text)

        # 所有API等待1s, 避免操作繁忙
        await asyncio.sleep(1)

        return data
    except Exception as e:
        println('{}, 无法获取服务器数据, {}!'.format(self.account, e.args))
        return None


async def wx_post(self, session, function_id, body=None):
    """
        post 方法
        :param session:
        :param function_id:
        :param body:
        :return:
        """
    return await self.wx_request(session, function_id, body, method='POST')


async def wx_get(self, session, function_id, body=None):
    """
    get 方法
    :param session:
    :param function_id:
    :param body:
    :return:
    """
    return await self.wx_request(session, function_id, body, method='GET')


async def login(self, session):
    """
    用京东APP获取京东到家APP的cookies
    :return:
    """
    println('{}, 正在登录京东到家!'.format(self.account))
    ck = get_dj_ck_by_jd_ck(self.headers, self.cookies)
    if ck and 'PDJ_H5_PIN' in ck:
        self.dj_pin = ck['PDJ_H5_PIN']
    return ck

    # body = {"fromSource": 5, "businessChannel": 150, "subChannel": "", "regChannel": ""}
    # res = await self.get(session, 'xapp/loginByPtKeyNew', body)
    # if res['code'] != '0':
    #     println('{}, 登录失败, 退出程序!'.format(self.account))
    #     return False
    # if 'nickname' in res['result']:
    #     self.nickname = res['result']['nickname']
    # else:
    #     self.nickname = self.account
    #
    # self.dj_pin = res['result']['PDJ_H5_PIN']
    #
    # cookies = {
    #     'o2o_m_h5_sid': res['result']['o2o_m_h5_sid'],
    #     'deviceid_pdj_jd': self.device_id,
    #     'PDJ_H5_PIN': res['result']['PDJ_H5_PIN'],
    # }
    # return cookies


async def finish_task(self, session, task_name, body):
    """
    完成任务
    :param body:
    :param task_name:
    :param session:
    :return:
    """
    res = await self.get(session, 'task/finished', body)
    if res.get('code') != '0':
        println('{}, 无法完成任务:《{}》!'.format(self.account, task_name))
    else:
        println('{}, 成功完成任务:《{}》!'.format(self.account, task_name))


async def receive_task(self, session, task):
    """
        领取任务
        :param session:
        :param task:
        :param body:
        :return:
        """
    task_name = task['taskName']
    if task['status']:
        println('{}, 任务:《{}》已领取!'.format(self.account, task_name))
        return

    body = {
        "modelId": task['modelId'],
        "taskId": task['taskId'],
        "taskType": task['taskType'],
        "plateCode": 3
    }

    res = await self.get(session, 'task/received', body)
    if res['code'] != '0':
        println('{}, 无法领取任务:《{}》！'.format(self.account, task_name))
    else:
        println('{}, 成功领取任务:《{}》!'.format(self.account, task_name))


async def browse_task(self, session, task):
    """
        浏览任务
        :param session:
        :param task:
        :return:
        """
    body = {
        "modelId": task['modelId'],
        "taskId": task['taskId'],
        "taskType": task['taskType'],
        "plateCode": 3,
    }
    if task['status'] == 0:  # 任务状态0: 待领取, 1待完成, 2待领奖, 3完成
        await self.receive_task(session, task)
    await asyncio.sleep(1)
    await self.finish_task(session, task['taskName'], body)


async def get_task_award(self, session, task):
    """
    获取任务奖励水滴
    :param task:
    :param session:
    :return:
    """
    body = {
        "modelId": task['modelId'],
        "taskId": task['taskId'],
        "taskType": task['taskType'],
        "plateCode": 4
    }
    res = await self.get(session, 'task/sendPrize', body)
    if res['code'] != '0':
        println('{}, 无法领取任务:《{}》奖励!'.format(self.account, task['taskName']))
    else:
        println('{}, 成功领取任务: 《{}》奖励!'.format(self.account, task['taskName']))


def dj_init(cls):
    """
    京东到家初始化
    :param cls:
    :return:
    """
    cls.headers = {
        'user-agent': USER_AGENT,
        'origin': 'https://daojia.jd.com',
        'referer': 'https://daojia.jd.com/taro2orchard/h5dist/',
        'content-type': 'application/x-www-form-urlencoded',
    }
    cls.lat = '23.' + str(math.floor(random.random() * (99999 - 10000) + 10000))
    cls.lng = '113.' + str(math.floor(random.random() * (99999 - 10000) + 10000))
    cls.city_id = str(math.floor(random.random() * (1500 - 1000) + 1000))
    cls.device_id = uuid()
    cls.trace_id = cls.device_id + str(int(time.time() * 1000))
    cls.nickname = None
    cls.dj_pin = None

    def init(self, **kwargs):

        self.account = kwargs.get('account', None)

        if not self.account:
            self.account = unquote(kwargs.get('pt_pin'))

        self.cookies = {
            'pt_pin': kwargs.get('pt_pin'),
            'pt_key': kwargs.get('pt_key'),
            'deviceid_pdj_jd': self.device_id
        }
        self.message = ''
        self.sort = kwargs.get('sort', 1)

    cls.request = request
    cls.get = get
    cls.post = post
    cls.get_task_award = get_task_award
    cls.browse_task = browse_task
    cls.login = login
    cls.browse_task = browse_task
    cls.receive_task = receive_task
    cls.finish_task = finish_task
    cls.wx_request = wx_request
    cls.wx_get = wx_get
    cls.wx_post = wx_post
    cls.__init__ = init

    return cls

