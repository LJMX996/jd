#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Author   : Chiupam
# @Data     : 2021-06-13
# @Version  : v 1.0
# @Updata   :
# @Future   :


from .. import chat_id, jdbot, logger, TOKEN, _JdbotDir
from ..bot.utils import press_event, backfile, _DiyDir, V4, QL, split_list, row
from telethon import events, Button
from asyncio import exceptions
import requests, os, asyncio


bot_id = int(TOKEN.split(':')[0])


@jdbot.on(events.NewMessage(from_users=chat_id, pattern=r'^/start$'))
async def myhello(event):
    try:
        hello = [
            "自定义机器人使用方法如下：",
            "\t/start 开始使用此机器人",
            "\t/restart 重启机器人",
            "\t/install 扩展此机器人功能",
            "\t/uninstall 删除此机器人功能"
        ]
        if os.path.isfile(f"{_JdbotDir}/diy/checkcookie.py"):
            hello.append("\t/checkcookie 检查cookie过期情况")
        if os.path.isfile(f"{_JdbotDir}/diy/addrepo.py"):
            hello.append("发送以.git结尾的链接开始添加仓库")
        if os.path.isfile(f"{_JdbotDir}/diy/addexport.py"):
            hello.append("发送格式为 key=\"value\" 或者 key='value' 的消息开始添加环境变量")
        # hello.append("\n频道：[👬和东哥做兄弟](https://t.me/joinchat/kTJGWeHx5aAyYjBl)")
        await asyncio.sleep(0.5)
        await jdbot.send_message(chat_id, str('\n'.join(hello)))
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))


@jdbot.on(events.NewMessage(from_users=chat_id, pattern=r'^/help$'))
async def myhelp(event):
    try:
        diy_help = [
            "restart - 重启机器人",
            "install - 扩展此机器人功能",
            "uninstall - 删除此机器人功能"
        ]
        if os.path.isfile(f"{_JdbotDir}/diy/checkcookie.py"):
            diy_help.append("checkcookie - 检查cookie过期情况")
        if os.path.isfile(f"{_JdbotDir}/diy/addexport.py"):
            diy_help.append("export - 修改环境变量")
        await asyncio.sleep(0.5)
        await jdbot.send_message(chat_id, str('\n'.join(diy_help)))
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))


@jdbot.on(events.NewMessage(from_users=chat_id, pattern=r'^/restart$'))
async def myrestart(event):
    try:
        await restart()
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))


@jdbot.on(events.NewMessage(from_users=chat_id, pattern=r'^/install'))
async def myinstall(event):
    try:
        SENDER = event.sender_id
        furl_startswith = "https://raw.githubusercontent.com/chiupam/JD_Diy/master/jbot/"
        btns = [
                Button.inline("检查cookie过期", data="checkcookie.py"),
                Button.inline("升级机器人", data="upbot.py"),
                Button.inline("下载文件", data="download.py"),
                Button.inline("添加仓库", data="addrepo.py"),
                Button.inline("添加环境变量", data="addexport.py"),
                Button.inline("修改环境变量", data="editexport.py"),
                Button.inline("帮我取消对话", data='cancel')
        ]
        async with jdbot.conversation(SENDER, timeout=60) as conv:
            msg = await conv.send_message("请问你需要下载什么功能的机器人文件？", buttons=split_list(btns, row))
            convdata = await conv.wait_event(press_event(SENDER))
            await jdbot.delete_messages(chat_id, msg)
            fname = bytes.decode(convdata.data)
            if fname == 'cancel':
                await jdbot.send_message(chat_id, '对话已取消，感谢你的使用')
                conv.cancel()
                return
            conv.cancel()
        msg = await jdbot.send_message(chat_id, "开始下载文件")
        speeds, botresp = ["http://ghproxy.com/", "https://mirror.ghproxy.com/", ""], False
        for speed in speeds:
            resp = requests.get(f"{speed}{furl_startswith}{fname}").text
            if "#!/usr/bin/env python3" in resp:
                botresp = resp
                break
        if botresp:
            await jdbot.delete_messages(chat_id, msg)
            path = f"{_JdbotDir}/diy/{fname}"
            backfile(path)
            with open(path, 'w+', encoding='utf-8') as f:
                f.write(resp)
            await jdbot.send_message(chat_id, f"下载{fname}成功")
            await restart()
        else:
            await jdbot.delete_messages(chat_id, msg)
            await jdbot.send_message(chat_id, "下载失败，请自行拉取文件进/jbot/diy目录")
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))


@jdbot.on(events.NewMessage(from_users=chat_id, pattern=r'^/uninstall'))
async def myuninstall(event):
    try:
        SENDER = event.sender_id
        mydiy = {
            "checkcookie.py": "检查cookie过期",
            "upbot.py": "升级机器人",
            "download.py": "下载文件",
            "addrepo.py": "添加仓库",
            "addexport.py": "添加环境变量",
            "editexport.py": "修改环境变量",
            "user.py": "user.py"
        }
        btns = []
        dirs = os.listdir(f"{_JdbotDir}/diy")
        for dir in dirs:
            if dir in mydiy:
                btns.append(Button.inline(mydiy[f'{dir}'], data=dir))
        btns.append(Button.inline("帮我取消对话", data='cancel'))
        async with jdbot.conversation(SENDER, timeout=60) as conv:
            msg = await conv.send_message("请问你需要删除机器人的哪个功能？", buttons=split_list(btns, row))
            convdata = await conv.wait_event(press_event(SENDER))
            await jdbot.delete_messages(chat_id, msg)
            fname = bytes.decode(convdata.data)
            if fname == 'cancel':
                await jdbot.send_message(chat_id, '对话已取消，感谢你的使用')
                conv.cancel()
                return
            conv.cancel()
        fpath = f"{_JdbotDir}/diy/{fname}"
        msg = await jdbot.send_message(chat_id, "开始删除机器人功能")
        os.system(f'rm {fpath}')
        await asyncio.sleep(1.5)
        await jdbot.delete_messages(chat_id, msg)
        if not os.path.isfile(fpath):
            await jdbot.send_message(chat_id, "删除成功")
        else:
            await jdbot.send_message(chat_id, f"删除失败，请手动删除{fpath}文件")
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))


async def restart():
    try:
        if V4:
            await jdbot.send_message(chat_id, "v4用户，准备重启机器人")
            os.system("pm2 restart jbot")
        elif QL:
            await jdbot.send_message(chat_id, "青龙用户，准备重启机器人")
            os.system("ql bot")
        else:
            await jdbot.send_message(chat_id, "未知用户，自行重启机器人")
    except Exception as e:
        await jdbot.send_message(chat_id, 'something wrong,I\'m sorry\n' + str(e))
        logger.error('something wrong,I\'m sorry\n' + str(e))
