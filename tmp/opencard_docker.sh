docker run -d -m 128m \
--restart=always \
--name TTCARD \
-p 7411:7411    \
-e QQ_UID="465243525"   \
-e QL_URL="http://192.168.1.111:8705"  \
-e QL_CLIENT_ID="RkCk8zJd2kH-"  \
-e QL_CLIENT_SECRET="cZxLRZTcpM3-TW5GyVGARrCm"  \
-e TASK_COMMON="QU0bjfupGFDQ1WY7"   \
-e TASK_SHARE="UmWZ47V761LO6H0u"   \
-e TASK_CARD="kdBubb0wKGhMJQtv"   \
-e TASK_VIDEO="FrAP68hzp4ddavXb"   \
tsukasa007/jd_trigger:20211120