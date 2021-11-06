#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/8/27 9:55 上午
# @File    : jd_anmp.py
# @Project : jd_scripts
# @Desc    : https://anmp.jd.com/ 域名下的活动
import asyncio
import json
import re
import time

import aiohttp
from urllib3 import disable_warnings
from requests import Session
from urllib.parse import urlencode
from config import USER_AGENT
from utils.jd_init import jd_init
from utils.logger import logger
from utils.console import println

disable_warnings()


@jd_init
class JdAnmp:

    headers = {
        'USER-AGENT': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded;utf-8',
    }

    token = None
    active_id = None
    task_list = None
    url = ''

    @logger.catch
    async def get_activity_info(self):
        """
        :return:
        """
        try:
            session = Session()
            session.headers.update(self.headers)
            session.cookies.update(self.cookies)
            response = session.get(url=self.url, verify=False)
            text = response.content.decode('utf-8')
            temp = re.search('var snsConfig =(.*)var SharePlatforms', text, re.S).group(1)
            data = json.loads(temp)
            self.token = data.get('actToken')
            self.active_id = data.get('activeId')
            self.task_list = data['config']['tasks']

            return True
        except Exception as e:
            println('{}, 获取活动数据失败, {}'.format(self.account, e.args))
            return False

    async def request(self, session, path='', body=None, method='GET'):
        """
        :param method:
        :param body:
        :param path:
        :param session:
        :return:
        """
        try:
            if not body:
                body = dict()
            params = {
                'sceneval': 2,
                'activeid': self.active_id,
                'token': self.token,
                't': int(time.time() * 1000),
                'callback': '',
                '_': int(time.time() * 1000)
            }
            params.update(body)
            session.headers.add('referer', 'https://anmp.jd.com/babelDiy/Zeus/3pG9h6Buegznv8rhVMzMR753pUtY/index.html')
            url = 'https://wq.jd.com/{}?'.format(path) + urlencode(params)
            if method == 'GET':
                response = await session.get(url)
            else:
                response = await session.post(url)
            text = await response.text()
            text = re.search('{.*}', text).group()
            data = json.loads(text)
            return data
        except Exception as e:
            println('{}, 请求数据失败, {}'.format(self.account, e.args))
            return None

    async def get_user_info(self, session):
        """
        获取用户信息
        :param session:
        :return:
        """
        println('{}, 正在获取用户信息...'.format(self.account))
        await self.request(session, 'activet2/piggybank/query')

    async def run(self):
        """
        :return:
        """
        async with aiohttp.ClientSession(cookies=self.cookies, headers=self.headers) as session:
            success = await self.get_activity_info()
            await self.get_user_info(session)
            if not success:
                println('{}, 获取活动数据失败, 退出程序!'.format(self.account))
                return

            login_data = await self.request(session, 'mlogin/wxv3/LoginCheckJsonp', {
                'r': '0.192626983227462122',
                'callback': ''
            })

            await asyncio.sleep(1)

            if login_data.get('iRet') != '0':
                println('{}, 登录失败, 退出程序!'.format(self.account))
                return

            for task in self.task_list:
                res = await self.request(session, 'activet2/piggybank/completeTask', {
                    'task_bless': '10',
                    'taskid': task['_id'],
                    'callback': ''
                })

                if res.get('errcode') == 0:
                    println('{}, 完成任务:{}'.format(self.account, task['_id']))
                elif res.get('errcode') == 9005:
                    println('{}, 需要手动进入活动页面:{}'.format(self.account, self.url))
                    break
                await asyncio.sleep(1)

            while True:
                res = await self.request(session, '/activet2/piggybank/draw')
                if res.get('errcode') == 0:
                    println('{}, 抽奖成功!'.format(self.account))
                else:
                    println('{}, 抽奖失败!'.format(self.account))
                    break
                await asyncio.sleep(1)
