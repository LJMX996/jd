
cp -rf /ql/repo/LJMX996_jd_aaron/utils /ql/scripts/

npm install axios date-fns

cd /ql/scripts && npm i -S png-js

apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev && cd /ql/scripts && npm install canvas --build-from-source
