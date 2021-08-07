cd /ql/ninja/backend
git checkout .
git pull
pnpm install
pm2 start
cp sendNotify.js /ql/scripts/sendNotify.js
cd /ql/ninja/backend/static
rm -rf index.html
wget https://raw.githubusercontent.com/LJMX996/jd/help/index.html

