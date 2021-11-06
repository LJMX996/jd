#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/6/28 5:00 下午
# @File    : image.py
# @Project : jd_scripts
# @Desc    :
import re
import base64
import cv2
import numpy as np


def save_img(b64_str, img_path=''):
    """
    base64字符串保存为图片
    :param img_path:
    :param b64_str:
    :return:
    """
    b64_str = re.sub('^data:image/.+;base64,', '', b64_str)
    img_str = base64.b64decode(b64_str)
    with open(img_path, 'wb') as f:
        f.write(img_str)
    return img_path


def _tran_canny(image):
    """消除噪声"""
    image = cv2.GaussianBlur(image, (3, 3), 0)
    return cv2.Canny(image, 50, 150)


def detect_displacement(img_slider_path, image_background_path, img_slider_dim=(50, 50), img_bg_dim=(360, 140)):
    """detect displacement"""
    # # 参数0是灰度模式
    image = cv2.imread(img_slider_path, 0)
    template = cv2.imread(image_background_path, 0)

    image = cv2.resize(image, img_slider_dim, interpolation=cv2.INTER_AREA)
    template = cv2.resize(template, img_bg_dim, interpolation=cv2.INTER_AREA)

    # 寻找最佳匹配
    res = cv2.matchTemplate(_tran_canny(image), _tran_canny(template), cv2.TM_CCOEFF_NORMED)

    # 最大值
    min_val = np.argmax(res)

    _, x = np.unravel_index(min_val, res.shape)
    w, _ = res.shape[::-1]

    return int(x) + int(img_slider_dim[0] / 2)
