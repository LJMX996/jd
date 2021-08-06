cd /ql
git clone https://github.com/MoonBegonia/ninja.git /ql/ninja
cd /ql/ninja/backend
pnpm install
pm2 start
cp sendNotify.js /ql/scripts/sendNotify.js
