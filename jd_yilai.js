/*
安装依赖

5 12 * * * jd_yilai.js, tag=aaron依赖
 */
cp -r /ql/repo/LJMX996_jd_aaron/utils /ql/scripts

npm install axios date-fns


cd scripts && npm i -S png-js

apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev

cd /ql/scripts && npm install canvas --build-from-source
