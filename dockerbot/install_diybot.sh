cd /ql/repo && git clone -b aaron https://github.com/LJMX996/jd.git 

cd /ql/repo/jd && git pull

cd /ql/repo && git clone -b main https://github.com/ccwav/QLScript2.git ccwav_QLScript2

cd /ql/repo/ccwav_QLScript2 && git pull

cp -rfv /ql/repo/jd/dockerbot/ /ql/repo/

cp -rfv /ql/repo/jd/dockerbot/jbot/bot /ql/jbot/

ql bot

cp -rfv /ql/repo/jd/dockerbot/ /ql/repo/

cp -rfv /ql/repo/jd/dockerbot/jbot/bot /ql/jbot/