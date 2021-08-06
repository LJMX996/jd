cd /ql/ninja/backend
rm -rf .env
wget https://raw.githubusercontent.com/LJMX996/jd/help/.env
git checkout .
git pull
pnpm install
pm2 start
cp sendNotify.js /ql/scripts/sendNotify.js
cd /ql/ninja/backend/static
rm -rf index.html
rm -rf push.jpg
wget https://raw.githubusercontent.com/LJMX996/jd/help/index.html
wget https://raw.githubusercontent.com/LJMX996/jd/help/push.jpg
