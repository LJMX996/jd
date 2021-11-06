#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/8/15 上午10:03
# @Project : jd_scripts
# @File    : jd_common.py
# @Cron    : 31 1,17 * * *
# @Desc    : 京东临时活动通用做任务
import asyncio
import json
import re
from urllib.parse import quote

import aiohttp

from config import USER_AGENT
from db.model import Code
from utils.jd_init import jd_init
from utils.console import println
from utils.logger import logger


@jd_init
class JdCommon:
    # 请求头
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT
    }

    @logger.catch
    async def request(self, session, function_id, body=None):
        """
        请求数据
        """
        try:
            await asyncio.sleep(1)

            if body is None:
                body = {}
            url = 'https://api.m.jd.com/client.action?functionId={}&body={}&client=wh5&clientVersion=1.0.0' \
                .format(function_id, quote(json.dumps(body)))
            response = await session.post(url=url)
            text = await response.text()
            data = json.loads(text)
            if data['code'] != 0:
                return data
            else:
                return data['data']

        except Exception as e:
            println('{}, 访问服务器出错:{}!'.format(self.account, e.args))

    @logger.catch
    async def get_task_list(self, session):
        """
        获取任务列表
        """
        data = await self.request(session, 'healthyDay_getHomeData', {"appId": self.appid,
                                                                      "taskToken": "", "channelId": 1})
        if 'bizCode' not in data or data['bizCode'] != 0:
            println('{}, 无法获取首页数据!'.format(self.account))
            return None
        println('{}, 成功获取任务列表!'.format(self.account))
        return data['result']['taskVos']

    @logger.catch
    async def receive_task(self, session, task_id, task_token, task_name):
        """
        领取任务
        :param task_name:
        :param task_token:
        :param task_id:
        :param session:
        :return:
        """
        res = await self.request(session, 'harmony_collectScore', {
            "appId": self.appid,
            "taskToken": task_token,
            "taskId": task_id,
            "actionType": 1
        })
        if res['bizCode'] != 0 and res['bizCode'] != 1:
            println('{}, 领取任务《{}》失败, {}!'.format(self.account, task_name, res['bizMsg']))
        else:
            println('{}, 领取任务《{}》成功!'.format(self.account, task_name))

    @logger.catch
    async def finish_task(self, session, task_id, task_token, task_name):
        """
        完成任务
        :param task_name:
        :param task_token:
        :param task_id:
        :param session:
        :return:
        """
        res = await self.request(session, 'harmony_collectScore', {
            "appId": self.appid,
            "taskToken": task_token,
            "taskId": task_id,
            "actionType": 0
        })
        if res['bizCode'] != 0 and res['bizCode'] != 1:
            println('{}, 完成任务《{}》失败, {}!'.format(self.account, task_name, res['bizMsg']))
        else:
            println('{}, 完成任务《{}》成功!'.format(self.account, task_name))

    @logger.catch
    async def lottery(self, session, task_id=None):
        """
        抽奖
        """
        while True:
            body = {"appId": self.appid}

            if task_id:
                body['taskId'] = task_id

            res = await self.request(session, 'interact_template_getLotteryResult', body)

            if res['bizCode'] != 0:
                println('{}, 抽奖失败, {}!'.format(self.account, res['bizMsg']))
                break
            else:
                award_info = res['result']['userAwardsCacheDto']
                if 'jBeanAwardVo' in award_info:
                    message = award_info['jBeanAwardVo']
                else:
                    message = award_info

                println('{}, 抽奖成功, 获得:{}!'.format(self.account, message))
            await asyncio.sleep(1)
            if task_id:
                break

    @logger.catch
    async def run_help(self):
        """
        助力入口
        :return:
        """
        async with aiohttp.ClientSession(cookies=self.cookies, headers=self.headers) as session:
            item_list = Code.get_code_list(self.code_key)

            for item in item_list:
                friend_account, friend_code = item.get('account'), item.get('code')
                if friend_account == self.account:
                    continue
                res = await self.request(session, 'harmony_collectScore', {
                    "appId": self.appid,
                    "taskToken": friend_code,
                    "taskId": 4,
                    "actionType": 1,
                })
                if res.get('bizCode', -1) != 0:
                    println('{}, 助力好友:{}失败, {}'.format(self.account, friend_account, res['bizMsg']))
                    if res['bizCode'] == 108:  # 助力已上限
                        break
                else:
                    println('{}, 成功助力好友:{}!'.format(self.account, friend_account))
                await asyncio.sleep(1)

    @logger.catch
    async def browser_task(self, session, task):
        """
        浏览任务
        :param session:
        :param task:
        :return:
        """
        task_name = task.get('taskName')
        task_id = task.get('taskId')

        if 'shoppingActivityVos' in task:
            item_list = task['shoppingActivityVos']
        elif 'productInfoVos' in task:
            item_list = task['productInfoVos']
        elif 'followShopVo' in task:
            item_list = task['followShopVo']
        elif 'brandMemberVos' in task:
            item_list = task['brandMemberVos']
        else:
            item_list = []

        timeout = task.get('waitDuration')
        if not timeout:
            timeout = 1
        for item in item_list:
            # task_token = re.search(r"'taskToken': '(.*?)'", str(ii)).group(1)
            task_token = item.get('taskToken')
            await self.receive_task(session, task_id, task_token, task_name)
            await asyncio.sleep(1)

        println('{}, 等待{}秒后去领取任务《{}》奖励!'.format(self.account, timeout, task_name))

        await asyncio.sleep(timeout)

        for item in item_list:
            task_token = item.get('taskToken')
            await self.finish_task(session, task_id, task_token, task_name)
            await asyncio.sleep(1)

    @logger.catch
    async def get_share_code(self, task):
        """
        获取助力码
        :param task:
        :return:
        """
        code = task['assistTaskDetailVo']['taskToken']
        println('{}, 助力码:{}!'.format(self.account, code))
        Code.insert_code(code_key=self.code_key, code_val=code, account=self.account, sort=self.sort)

    @logger.catch
    async def do_tasks(self, session, task_list):
        """
        做任务
        :param session:
        :param task_list:
        :return:
        """
        for task in task_list:

            task_type, task_name, status = task['taskType'], task['taskName'], task['status']

            if task_type == 14:  # 邀请好友助力
                await self.get_share_code(task)

            if task_type in [3, 27] and task_type == 3:
                await self.lottery(session, task['taskId'])
            if status >= 2:
                println('{}, 任务:《{}》今日已做完!'.format(self.account, task_name))
                continue

            elif task_type in [13, 12]:  # 签到
                task_id = task['taskId']
                task_token = re.search(r"'taskToken': '(.*?)'", str(task)).group(1)
                await self.finish_task(session, task_id, task_token, task_name)
            elif task_type == 21:  # 入会任务不做
                println('{}, 跳过入会任务!'.format(self.account))
            else:
                await self.browser_task(session, task)

    @logger.catch
    async def run(self):
        """
        :return:
        """
        async with aiohttp.ClientSession(headers=self.headers, cookies=self.cookies) as session:
            task_list = await self.get_task_list(session)
            if task_list:
                await self.do_tasks(session, task_list)
            await self.lottery(session)
