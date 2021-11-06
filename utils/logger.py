#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/6/14 15:12
# @File    : logger.py
# @Project : jd_scripts
import os
import sys
from loguru import logger
from config import LOG_DIR

log_path = os.path.join(LOG_DIR, 'logger_{time:YYYY-MM-DD}.log')

logger.remove(None)
logger.add(log_path,
           level='INFO',
           rotation='00:00',
           retention="7 days",
           compression="zip",
           format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {file}:{name}:{function}:{line} | {message}",
           enqueue=True,
           encoding="utf-8",
           colorize=True,
           #  serialize=True,  # 是否转成json
           backtrace=True,
           diagnose=True,
           catch=True)
logger.add(sys.stdout, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> <level>{message}</level>")
