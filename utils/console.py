#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/6/16 2:47 下午
# @File    : console.py
# @Project : jd_scripts
# @Desc    :
from rich.console import Console
from config import JD_DEBUG

__all__ = ('println',)

console = Console()


def println(*args, **kwargs):
    """
    控制台打印数据
    :return:
    """
    style = kwargs.get('style', 'bold red')
    kwargs['style'] = style

    if JD_DEBUG:
        console.print(*args, **kwargs)


if __name__ == '__main__':
    pass
