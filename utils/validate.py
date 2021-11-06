#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/8/3 下午8:08
# @Project : jd_scripts
# @File    : validate.py
# @Cron    :
# @Desc    :
import os
import random
import asyncio
from utils.image import *
from utils.console import println
from config import IMAGES_DIR


async def puzzle_validate(self, page, validator_selector):
    """
    拼图验证
    :param validator_selector:
    :param self:
    :param page:
    :return:
    """
    validator = await page.querySelector(validator_selector)
    if not validator:
        println('{}, 不需要拼图验证...'.format(self.account))
        return True
    else:
        box = await validator.boundingBox()
        if not box:
            println('{}, 不需要拼图验证...'.format(self.account))
            return True

    println('{}, 需要进行拼图验证...'.format(self.account))

    bg_img_selector = '#man-machine-box > div > div.JDJRV-img-panel.JDJRV-embed > div.JDJRV-img-wrap > ' \
                      'div.JDJRV-bigimg > img'

    slider_img_selector = '#man-machine-box > div > div.JDJRV-img-panel.JDJRV-embed > div.JDJRV-img-wrap > ' \
                          'div.JDJRV-smallimg > img'

    for i in range(10):
        println('{}, 正在进行第{}次拼图验证...'.format(self.account, i + 1))
        println('{}, 等待加载拼图验证背景图片...'.format(self.account))
        await page.waitForSelector(bg_img_selector)

        bg_img_ele = await page.querySelector(bg_img_selector)

        println('{}, 等待加载拼图验证滑块图片...'.format(self.account))
        await page.waitForSelector(slider_img_selector)
        slider_img_ele = await page.querySelector(slider_img_selector)

        bg_img_content = await (await bg_img_ele.getProperty('src')).jsonValue()
        slider_img_content = await (await slider_img_ele.getProperty('src')).jsonValue()

        bg_image_path = os.path.join(IMAGES_DIR, 'jd_pet_dog_bg_{}.png'.format(self.account))
        slider_image_path = os.path.join(IMAGES_DIR, 'jd_pet_dog_slider_{}.png'.format(self.account))

        try:
            println('{}, 保存拼图验证背景图片:{}!'.format(self.account, bg_image_path))
            save_img(bg_img_content, bg_image_path)

            println('{}, 保存拼图验证滑块图片:{}!'.format(self.account, slider_image_path))
            save_img(slider_img_content, slider_image_path)
            offset = detect_displacement(slider_image_path, bg_image_path)
        except Exception as e:
            println('{}, 保存拼图图片失败或计算偏移量错误:{}!'.format(self.account, e.args))
            continue

        println('{}. 拼图偏移量为:{}'.format(self.account, offset))

        slider_btn_selector = '#man-machine-box > div > div.JDJRV-slide-bg > div.JDJRV-slide-inner.JDJRV-slide-btn'
        ele = await page.querySelector(slider_btn_selector)
        box = await ele.boundingBox()

        println('{}, 开始拖动拼图滑块...'.format(self.account))

        await page.hover(slider_btn_selector)
        await page.mouse.down()

        cur_x = box['x']
        cur_y = box['y']
        first = True
        total_delay = 0
        shake_times = 2  # 左右抖动的最大次数

        while offset > 0:
            if first:
                # 第一次先随机移动偏移量的%60~80%
                x = int(random.randint(6, 8) / 10 * offset)
                first = False
            elif total_delay >= 2000:  # 时间大于2s了， 直接拉满
                x = offset
            else:  # 随机滑动5~30px
                x = random.randint(5, 30)

            if x > offset:
                offset = 0
                x = offset
            else:
                offset -= x

            cur_x += x

            delay = random.randint(100, 500)
            steps = random.randint(1, 20)
            total_delay += delay
            # println('{}, 拼图offset:{}, delay:{}, steps:{}'.format(self.account, cur_x, delay, steps))
            await page.mouse.move(cur_x, cur_y,
                                  {'delay': delay, 'steps': steps})

            if shake_times <= 0:
                continue

            if total_delay >= 2000:
                continue

            num = random.randint(1, 10)  # 随机选择是否抖动
            if num % 2 == 1:
                continue

            shake_times -= 1
            px = random.randint(1, 20)  # 随机选择抖动偏移量
            delay = random.randint(100, 500)
            steps = random.randint(1, 20)
            total_delay += delay
            # 往右拉
            cur_x += px
            # println('{}, 拼图向右滑动:offset:{}, delay:{}, steps:{}'.format(self.account, px, delay, steps))
            await page.mouse.move(cur_x, cur_y,
                                  {'delay': delay, 'steps': steps})

            delay = random.randint(100, 500)
            steps = random.randint(1, 20)
            total_delay += delay

            # 往左拉
            cur_x -= px
            # println('{}, 拼图向左滑动:offset:{}, delay:{}, steps:{}'.format(self.account, px, delay, steps))
            await page.mouse.move(cur_x, cur_y,
                                  {'delay': delay, 'steps': steps})
        println('{}, 第{}次拼图验证, 耗时:{}s.'.format(self.account, i + 1, total_delay / 1000))
        await page.mouse.up()
        await asyncio.sleep(3)

        validator = await page.querySelector(validator_selector)

        if not validator:
            println('{}, 已完成拼图验证...'.format(self.account))
            return True
        else:
            box = await validator.boundingBox()
            if not box:
                println('{}, 已完成拼图验证...'.format(self.account))
                return True
            else:
                println('{}, 无法完成拼图验证...'.format(self.account))
                continue

    return False


def puzzle_validate_decorator(cls):
    """
    拼图验证
    :param cls:
    :return:
    """
    cls.puzzle_validate = puzzle_validate
    return cls
