#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# @Time    : 2021/8/2 11:32 上午
# @File    : jd_init.py
# @Project : jd_scripts
# @Desc    : 装饰器定义
from urllib.parse import unquote


def jd_init(cls):
    """
    :param cls:
    :return:
    """
    def init(self, **kwargs):
        """
        初始化方法
        :param self:
        :param kwargs:
        :return:
        """
        pt_pin = kwargs.get('pt_pin')
        pt_key = kwargs.get('pt_key')

        if not pt_pin or not pt_key:
            raise ValueError('Invalid Parameter!')

        self._account = kwargs.get('account', None)
        if not self._account:
            self._account = unquote(pt_pin)

        self._cookies = {   # cookies
            'pt_pin': pt_pin,
            'pt_key': pt_key,
        }
        self._sort = kwargs.get('sort', 1)
        self._message = ''

    @property
    def sort(self):
        return self._sort

    @sort.setter
    def sort(self, sort):
        self._sort = sort


    @property
    def message(self):
        return self._message

    @message.setter
    def message(self, message):
        self._message = message

    @property
    def cookies(self):
        """
        返回cookies
        :param self:
        :return:
        """
        return self._cookies

    @cookies.setter
    def cookies(self, cookies):
        """
        设置cookies
        :param self:
        :param cookies:
        :return:
        """
        self._cookies = cookies

    @property
    def account(self):
        """
        返回京东账号
        :param self:
        :return:
        """
        return self._account

    @account.setter
    def account(self, account):
        """
        设置账号
        :param self:
        :param account:
        :return:
        """
        self._account = account

    cls.message = message
    cls.account = account
    cls.cookies = cookies
    cls.sort = sort
    cls.__init__ = init

    return cls
