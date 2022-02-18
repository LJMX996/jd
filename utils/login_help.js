const $ = new API('jd_ck_remark'),
  APIKey = 'CookiesJD',
  CacheKey = `#${APIKey}`,
  remark_key = `remark`,
  searchKey = 'keyword'

;($.url = $request.url), ($.html = $response.body)

const cookieIndex = $.read(`#CookieIndex`) || 0

try {
  ;($.html.includes && $.html.includes('</body>')) || $.done({ body: $.html })
} catch (n) {
  $.done()
}

const isLogin = $.url.indexOf('/login/login') > -1
function getRem(n) {
  return `${25 * n}vw`
}

function getUsername(str) {
  if (!str) return ''
  return decodeURIComponent(str)
}

// 初始化 boxjs 数据
function initBoxJSData() {
  const CookiesJD = JSON.parse($.read(CacheKey) || '[]')

  let cookiesRemark = JSON.parse($.read(remark_key) || '[]')
  const keyword = ($.read(searchKey) || '').split(',')

  const cookiesFormat = {}

  cookiesRemark.forEach((item) => {
    cookiesFormat[item.username] = item
  })

  cookiesRemark = CookiesJD.map((item) => ({
    ...item,
    username: getUsername(item.userName),
    nickname: getUsername(item.userName),
    ...cookiesFormat[item.userName],
  })).filter((item) => !!item.cookie)

  cookiesRemark = cookiesRemark.filter((item, index) => {
    return keyword[0]
      ? keyword.indexOf(`${index}`) > -1 ||
          keyword.indexOf(item.username) > -1 ||
          keyword.indexOf(item.nickname) > -1 ||
          keyword.indexOf(item.status) > -1
      : true
  })

  return cookiesRemark
}

$.headers = $response.headers
const cookiesRemark = initBoxJSData()
function createStyle() {
  return `
<style>
   #cus-mask .iconfont{
     font-size: ${getRem(0.2)};
   }
   #cus-mask p,#cus-mask span{
    padding: 0;
    margin: 0;
   }
  .tool_bars{
    position: fixed;
    top:50%;
    right: 0;
    z-index: 999;
    transform: translateY(-50%);
  }
  .tool_bar_jf{
    position: fixed;
    top: 80%;
    right: 0;
    z-index: 999;
    transform: translateY(-50%);
  }
  .tool_bar{
    display: flex;
    height:33px;
    width:33px;
    align-items: center;
    background: #f7bb10;
    padding-left: 2px;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
    padding-right: 3px;
    color: #fff;
    font-size: ${getRem(0.1)};
    margin-bottom: ${getRem(0.1)};
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
  }
  .tool_bar_jf{
    position: fixed;
    top: 80%;
    right: 0;
    z-index: 999;
    transform: translateY(-50%);
  }
  .tool_bar img,.tool_bar span{
    border-radius: 50%;
    border:1px solid #fff;
    width: 27px;
    height: 27px;
    line-height: 27px;
    text-align: center;
    display: block;
    font-size: 24px;
  }
  .cus-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0,0,0,.6);
  }
  .cus-mask_view{
    width: 85%;
    background: #fff;
    border-radius: ${getRem(0.25)};
    overflow: hidden;
    position: relative;
    top: 50%;
    left: 50%;
    color: #2e2d2d;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
  }
  .cus-view{
    font-size: ${getRem(0.16)};
    font-family: PingFangSC-Semibold;
    text-align: center;
    padding: 0 ${getRem(0.13)} 0;
    position: absolute;
    top: ${getRem(0.1)};
    background: #fff;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    display:flex;
    align-items: center;
    border-radius: ${getRem(0.1)};
    box-shadow: 0 2px 5px #ecc4d8;
  }
  .cus-content{
    font-family: PingFangSC-Regular;
    font-size: ${getRem(0.14)};
    line-height: ${getRem(0.22)};
    padding: ${getRem(0.25)} ${getRem(0.1)} 0;
    position: relative;
  }
  .cus-content label{
    color: rgba(0,0,0,.4);
    font-size: ${getRem(0.16)};
    margin-bottom: ${getRem(0.2)};
    display: block
  }
  .cus-content ul{
    padding-left: ${getRem(0.2)};
    color: rgba(0,0,0,.4);
    margin-top: ${getRem(0.1)};
    font-size: ${getRem(0.1)}
  }
  .cus-content li{
    list-style-type: cjk-ideographic;
  }
  .cus-footer{
    margin-top: ${getRem(0.09)};
    border-radius: ${getRem(0.1)};
    -webkit-box-shadow: 0 -${getRem(0.025)} ${getRem(0.05)} 0 rgb(0 0 0/10%);
    box-shadow: 0 -${getRem(0.025)} ${getRem(0.05)} 0 rgb(0 0 0/10%);
  }
  .cus-footer .abtn{
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: ${getRem(0.15)};
    color: #2e2d2d;
    text-align: center;
    height: ${getRem(0.45)};
    line-height: ${getRem(0.45)};
    width: 50%;
    border-top: 1px solid #eaeaea;
  }
  .cus-footer span{
    font-size: ${getRem(0.15)};
  }
  .border-btn{
    border-left: 1px solid #eaeaea;
    border-top: 1px solid #eaeaea;
  }
  .cus-footer .btn-ok{
    color: #fff;
    background-image: -webkit-gradient(linear,left top,right top,from(#f7bb10),to(#ff4f18));
    background-image: -webkit-linear-gradient(left,#f7bb10,#ff4f18);
    background-image: -o-linear-gradient(left,#f7bb10,#ff4f18);
    background-image: linear-gradient(90deg,#f7bb10,#ff4f18);
    border-radius: 0 0 ${getRem(0.1)} 0;
  }
  #cus-tip{
    position: fixed;
    z-index: 9999;
    background: rgba(0,0,0,.5);
    color: #fff;
    min-width: ${getRem(1)};
    min-height:${getRem(0.35)} ;
    max-width: 80%;
    max-height: 50%;
    overflow-y: scroll;
    top:50%;
    left: 50%;
    text-align: center;
    padding: ${getRem(0.1)};
    box-sizing: border-box;
    font-size: ${getRem(0.1)};
    border-radius: ${getRem(0.1)};
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
  }
  #account_list{
    border: 4px solid #f7bb10;
    border-radius: ${getRem(0.3)};
    max-height: ${getRem(3.69)};
    min-height: ${getRem(1.98)};
    overflow-x: hidden;
    overflow-y: scroll;
    padding: ${getRem(0.06)} ${getRem(0.1)};
    box-sizing: border-box;
  }
  .cus-avatar{
     padding: ${getRem(0.05)};
     display: flex;
     align-items: center;
     border: 1px solid #eee;
     border-radius: ${getRem(0.2)};
     box-sizing: border-box;
     position: relative;
     margin-bottom: ${getRem(0.1)};
     height: ${getRem(0.5)};
  }
  .avatar_img{
    width:100%;
    height:100%;
    border-radius: 50%;
    font-size: ${getRem(0.1)};
    border: 1px solid #f7bb10;
    overflow: hidden;
    padding: ${getRem(0.1)};
    white-space: nowrap;
    background-size: contain;
    box-sizing: border-box;   
    position: absolute;
    z-index: 1; 
  }
  .cususer_info{
    margin-left: ${getRem(0.1)};
    display: flex;
    align-items: start;
    flex-direction: column;
    flex:1 0;
  }
  .cus-icon{
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    border: 1px solid #52c41a;
    position: absolute;
    font-size: ${getRem(0.05)};
    right: ${getRem(0.15)};
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    line-height: ${getRem(0.3)};
    box-shadow: 0 0 4px #52c41a;
    animation: flash 2s linear infinite;
  }
  .cususer_info p {
    font-weight: bold;
    font-size: ${getRem(0.1)};
    line-height: 1.8;
  }
  .cususer_info span{
    font-weight: unset;
    color: #666;
    font-size: ${getRem(0.08)};
    line-height: 1.8;
  }
  .not_content{
    text-align: center;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cus-err{
    border-color: red;
    animation: flashred 2s linear infinite;
    box-shadow: 0 0 4px red;
  }

  .cus-active{
    border-color: #91d5ff;
    box-shadow: 0 0 4px #91d5ff;
  }

  .cus-now_active{
    border-color: #a0d911;
    box-shadow: unset;
  }

  @keyframes flashred{
    0%{ box-shadow: 0 0 4px red}
    25%{ box-shadow: 0 0 6px red}
    50%{ box-shadow: 0 0 10px red}
    75%{ box-shadow: 0 0 6px red}
    100%{ box-shadow: 0 0 4px red}
  }

  @keyframes flash{
    0%{ box-shadow: 0 0 4px #52c41a}
    25%{ box-shadow: 0 0 6px #52c41a}
    50%{ box-shadow: 0 0 10px #52c41a}
    75%{ box-shadow: 0 0 6px #52c41a}
    100%{ box-shadow: 0 0 4px #52c41a}
  }
  .ant-tag{
   font-size: ${getRem(0.08)} !important;
   margin-right:${getRem(0.3)} !important;
  }
  .ant-tag-cyan{
    color: #ffa39e !important;
  }
  .ant-tag-magenta{
    color: #adc6ff !important;
  }
  
  .cus_input {
    border: none;
    background: none;
    flex: 1 0;
  }
  #cu_search{
    display: flex;
    height: ${getRem(0.25)};
    align-items: center;
  }
  .input{
    display: inline-block;
    width: 100%;
    border: none;
    background: #fff;
    font-size: ${getRem(0.1)};
    -webkit-box-align: center;
    line-height: ${getRem(0.32)};
    padding-left: 10px;
    box-sizing: border-box;
    border-radius: ${getRem(0.1)};
    height: ${getRem(0.32)};
    overflow: hidden;
  }
  .cu_search_input{
    display: flex;
  }
  #cus_cancel{
    font-weight: unset;
    margin-left: 3px !important;
    white-space: nowrap;
    font-size: ${getRem(0.1)};
  }
  .hidden {
    display: none !important;
  }
  #cus-mask .ant-ribbon {
    box-sizing: border-box;
    margin: 0 5px 0 0;
    color: #eb2f96;
    border-radius: 50%;
    opacity: 0.5;
    text-align: center;
    display:inline-block;
    transform: scale(0.7);
  }
  .avatar_container{
    position: relative;
    width: ${getRem(0.35)};
    height: ${getRem(0.35)};
    margin-left: ${getRem(0.05)};
  }
  .isPlus{
    width: ${getRem(0.4)};
z-index:99;    height: ${getRem(0.4)};
    position: absolute;
    left: -1px;
    top: -3px;
    pointer-events: none;
    background:url(https://img12.360buyimg.com/img/s115x118_jfs/t1/127010/39/7866/7131/5f18f9afE8e5c1d37/1713cb8c5a329d3f.png) no-repeat scroll 50%/cover
  }
  .avatar_img img{
    min-width: 1px;
    min-height: 1px;
    border-radius: 50%;
    width: 100%;
    height: auto;
    transform: translate3d(-50%,-50%,0);
    position: absolute;
    left: 50%;
    top: 50%;
    z-index:1;
  }
  .plus .avatar_img{
    border:none;
  }
  .jinfen_group li{
    margin-bottom:10px;
    list-style-type:none !important;
    display:flex;
    font-size: 14px;
  }

  .jinfen_group .iconfont{
    font-size: 18px;
  }

  .jinfen_group li span{
    margin-right:10px;
  }

  .jinfen_group li s{
     color: #888;
     transform: scale(0.7);
  }

  .jinfen_group .price{
    color:#f5222d !important;
  }

  .jinfen_group .commission{
    color: #faad14 !important;
  }

  .jinfen_group .coupon,.jinfen_group .coupon a{
    color: #13c2c2 !important;
  }

  .jinfen_group .cart,.jinfen_group .cart a{
    color: #1890ff !important;
  }
</style>
`
}
const accounts = cookiesRemark
  .map((n, e) => {
    const t = '正常' === n.status,
      i = n.wskey ? 'ant-tag-cyan' : 'ant-tag-magenta',
      s = n.wskey ? 'APP' : 'WEB'
    return `
<div class="cus-avatar" data-value="${n.mobile || ''}" data-name="${
      n.username
    }">
  
  <div class="avatar_container ${'1' === n.isPlusVip ? 'plus' : ''}">
    <div class="avatar_img">
      <img src="${
        n.avatar ||
        '//img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png'
      }" alt="${n.username}" />
    </div>
    ${'1' === n.isPlusVip ? `<div class="isPlus"></div>` : ''}
  </div>
  <div class="cususer_info">
     <p>${decodeURIComponent(n.nickname)} </p>
     <span><b class="ant-ribbon">${e + 1}</b>${decodeURIComponent(
      n.username
    )}</span>
  </div>
  
  <span class="ant-tag ${i}">${s}</span>
  <span class="cus-icon ${t ? '' : 'cus-err'}"></span>
</div>`
  })
  .join('')
function createHTML() {
  return `
<div id="cus-mask" class="cus-mask" style="visibility:hidden">
  <div class="cus-mask_view">
    <div class="cus-content">
      <div class="cus-view">
        <div id="cu_search_input" class="cu_search_input input hidden">
           <input placeholder="请输入昵称" type="text" class="cus_input"/>
           <span id="cu_search_close" class="iconfont icon-close"></span>
        </div>
        <span id="cus_cancel" class="hidden">取消</span>
       <div id="cu_search">
          <span id="cus-username">京东账号列表</span>
          <span class="iconfont icon-search"></span>
        </div>
      </div>
      <div id="account_list">
          ${
            accounts.length
              ? accounts
              : '<div class="not_content">未找到账号</div>'
          }
      </div>
    </div>
    <div class="cus-footer">
        <div class="btn-wrap" style="display: flex">
          <span class="abtn iconfont icon-cancel" id="cus-mask-cancel"></span>
          <span class="abtn border-btn iconfont icon-dengchu" id="clear-ck"></span>
          <span class="abtn border-btn iconfont icon-fuzhi" id="copyCk"></span>
          <span class="abtn btn-ok iconfont ${
            isLogin ? 'icon-denglu' : 'icon-zhuanhuan'
          }" id="cus-mask-ok" ></span>
        </div>
    </div>
  </div>
</div>
<div class="cus-mask" id="jf_mask" style="visibility:hidden">
    <div class="cus-mask_view" style="overflow: hidden;"></div>
</div>
<div id="cus-tip" style="display: none;"></div>
<div class="tool_bars" id="tool-bars">
  <div id="boxjs" class="tool_bar">
   <img  src="https://raw.githubusercontent.com/chavyleung/scripts/master/BOXJS.png" />
  </div>
</div>
  `
}
const fillMobile = `<span class="abtn border-btn iconfont icon-shouye" id="fill-input"></span>`
function createScript() {
  return `
<script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"><\/script>  
<script type="text/javascript">
  var pk = getCookie("pt_key");
  var pp = decodeURIComponent(getCookie("pt_pin"));
  var isLogin = window.location.href.indexOf("/login/login")>-1;
  const head = document.getElementsByTagName("head")[0];
  head.insertAdjacentHTML('beforeEnd', \`
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
  <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_2100531_3yc4kgu1xc6.css" charset="utf-8"/>
  \`);

  const jd_ck = ${JSON.stringify(cookiesRemark)};
  const boxjs_btn = document.querySelector("#boxjs");
  let fill_btn = document.querySelector("#fill-input");
  const copyCk_btn = document.querySelector("#copyCk");
  const cancel_btn = document.querySelector("#cus-mask-cancel");
  const ok_btn = document.querySelector("#cus-mask-ok");
  let clear_btn = document.querySelector("#clear-ck");
  const tip_view = document.querySelector("#cus-tip");
  let avatarView = document.querySelectorAll(".cus-avatar");
  const usernameView = document.querySelector("#cus-username");
  const toolView = document.querySelector("#tool-bars");
  const account_list = document.querySelector("#account_list");
  const cu_search = document.querySelector("#cu_search");
  const cu_search_close = document.querySelector("#cu_search_close");
  const cu_search_input = document.querySelector("#cu_search_input");
  const $input = document.querySelector("#cu_search_input input");
  const cus_cancel = document.querySelector("#cus_cancel");
  
  function classFunc(element,str){
    let newClass = element.className.split(" ");
    if(newClass.indexOf(str)>-1){
      element.className = newClass.filter(item => item!==str).join(" ");
      return
    }
    newClass.push(str);
    return element.className = newClass.join(" ")
  }
  
  cu_search.addEventListener("click",function(){
     classFunc(cu_search, "hidden");
     classFunc(usernameView,"hidden");
     classFunc(cu_search_input, "hidden");
     classFunc(cus_cancel,"hidden");
  })
  
  cus_cancel.addEventListener("click",function(){
    cu_search.click();
    cu_search_close.click();
    registerClick();
  })
  
  cu_search_close.addEventListener("click",function(){
    $input.value = "";
    account_list.innerHTML = getAccountList(jd_ck);
  })
  
  function getAccountList(cks){
   return  cks.map((item,index) => {
  const status = item.status === '正常';
  const className = item.wskey ? 'ant-tag-cyan' : 'ant-tag-magenta';
  const tag = item.wskey ? 'APP' : 'WEB';
  return \`
<div class="cus-avatar" data-value="\${item.mobile||''}" data-name="\${item.username}">
  <div class="avatar_container \${item.isPlusVip==='1' ? 'plus' : ''}">
    <div class="avatar_img">
      <img src="\${
        item.avatar ||
        '//img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png'
      }" alt="\${item.username}" />
    </div>
    \${item.isPlusVip==='1' ? \`<div class="isPlus"></div>\` : ''}
  </div>

  <div class="cususer_info">
     <p>\${decodeURIComponent(item.nickname)}</p>
     <span><b class="ant-ribbon">\${index + 1}</b>\${decodeURIComponent(item.username)}</span>
  </div>
  <span class="ant-tag \${className}">\${tag}</span>
  <span class="cus-icon \${status ? '' : 'cus-err'}"></span>
</div>\`;
}).join('')
  }
  
  let timer = null;
  function inputChange(event){
   const value = event.target.value;
   if(!value) return;
   let newList = [];
   if(timer) clearTimeout(timer);
   timer = setTimeout(()=>{ 
     newList = jd_ck.filter(item=>item.username.indexOf(value)>-1 || item.nickname.indexOf(value)>-1)
     if(!newList.length) return;
     account_list.innerHTML = getAccountList(newList);
     registerClick()
    },500);
  }
  
   $input.addEventListener("input",inputChange)
   const avatarItem = jd_ck.find(item=> item.username === pp);
   if(avatarItem && avatarItem.avatar){
     boxjs_btn.innerHTML = "<img src='"+ avatarItem.avatar +"' />";
   }
   if(pk === "" || !pk){
    copyCk_btn.style.display="none";
    clear_btn.style.display="none";
   }
   
   if(pp){
      usernameView.innerHTML= pp;
      var preIndex = null;
      var nextIndex = null;
      var current = null
      jd_ck.forEach((item,index)=>{
        if(item.username === pp){
          current = index;
          preIndex = index !== 0 ? index - 1 : null;
          nextIndex = index !== jd_ck.length - 1 ? index + 1 : null;
        }
      })
      if(preIndex!==null){
        toolView.insertAdjacentHTML('afterbegin','<div id="preCK" class="tool_bar"><span class="iconfont icon-shangjiantou" /></div>')
      }
      if(nextIndex!==null){
        toolView.insertAdjacentHTML('beforeEnd','<div id="nextCK" class="tool_bar"><span class="iconfont icon-xiajiantou" /></div>')
      }

      if(current) animateScroll(current);
   };


   function animateScroll(key) {
      account_list.scrollTo({top: 52 * key});
   }

   var preCK = document.getElementById("preCK");
   var nextCK = document.getElementById("nextCK");
   if(preCK){
     preCK.addEventListener('click',function() {
      if(preIndex !== null) changeIndex(preIndex);
     });
   }

   if(nextCK){
     nextCK.addEventListener('click',function() {
      if(nextIndex !== null) changeIndex(nextIndex);
     });
   }

   function changeIndex(key){
      avatarView.forEach((item,index)=>{
        if(index === key){
          item.className = "cus-avatar cus-active";
          item.id = "jd_account";
        } else {
           item.className = "cus-avatar";
           item.id = "";
        }
      });
      btnSubmit();
   }

    function registerClick(){
      avatarView = document.querySelectorAll(".cus-avatar");
      fill_btn = document.querySelector("#fill-input");
      clear_btn = document.querySelector("#clear-ck");

      avatarView.forEach(item=>{
       const username = item.getAttribute('data-name');
        if(username === pp){
          item.className = "cus-avatar cus-now_active";
          item.id = "jd_account";
        }
        item.onclick = function (){
          avatarView.forEach(item=>{
              item.className = "cus-avatar";
              item.id = "";
          })
          const mobile = this.getAttribute('data-value');
          this.className = "cus-avatar cus-active";
          this.id = "jd_account";
          $("#fill-input").remove();
          if(mobile){
            copyToClipMobile(mobile);
            if(isLogin) $("#cus-mask-cancel").after(\`${fillMobile}\`);
            registerClick();
          }
        }
      })

      if(fill_btn){
        fill_btn.addEventListener('click',function(){
          fillInput();
        });
      }

      if(clear_btn){
        clear_btn.addEventListener('click',function(){
           sessionStorage.clear();
           localStorage.clear();
           setCookie('pt_key',"");
           setCookie("pt_pin","");
           window.location.reload();
        })
      }
    }
    
    registerClick();

    boxjs_btn.addEventListener('click', function(){
      maskVisible(true);
    });

    cancel_btn.addEventListener('click', function(){
      maskVisible(false);
    });

    ok_btn.addEventListener('click', function(){
      btnSubmit();
    });


    copyCk_btn.addEventListener('click',function(){
      copyToClip();
    })

    function toast(message,time= 2000){
       tip_view.style.display = "block";
       tip_view.innerHTML = message;
       setTimeout(function() {
         tip_view.style.display = "none";
          tip_view.innerHTML = "";
       },parseInt(time || "2000"));
    }

    function maskVisible(visible){
      const cusmsk = document.getElementById("cus-mask");
      cusmsk.style.visibility = visible? "visible" : "hidden";
    }

    function fillInput(){
      const sbBtn= document.getElementById('jd_account');
      const cuMobile = sbBtn.getAttribute('data-value');
      console.log('快速填充号码：'+ cuMobile);
      const input = document.getElementsByClassName('acc-input mobile J_ping')[0];
      input.value = cuMobile;
      ev = document.createEvent("HTMLEvents");
      ev.initEvent("input", true,false );
      input.dispatchEvent(ev);
      maskVisible(false);
    }

    function clearAllCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\\=)/g);
        if (keys) {
            for (var i = keys.length; i--;){
              document.cookie = keys[i] + '=;path=/;domain=.jd.com;expires=' + new Date(0).toUTCString()
            }
        }
    }

   function btnSubmit(){
    const sbBtn= document.getElementById('jd_account');
    if(!sbBtn) return alert("请选择需要登陆的账号");
    const cuName = sbBtn.getAttribute('data-name');
    const login_ck = jd_ck.find(item=>item.username===cuName);
    if(!login_ck) return alert("未找到相关账号");
    let [ pt_key , pt_pin ] = login_ck.cookie.split(";");
    pt_key = pt_key.split("=");
    pt_pin = pt_pin.split("=");
    clearAllCookie();
    setCookie(pt_key[0],pt_key[1]);
    setCookie(pt_pin[0],pt_pin[1]);
    window.location.reload();
  }


  function setCookie(cname,cvalue){
      var ed = new Date();
      const mt = ed.getMonth()+1;
      ed.setMonth(mt);
      var expires = "expires="+ed.toGMTString();
      document.cookie = cname+"="+cvalue+"; "+expires+"; path=/; domain=.jingxi.com";
      document.cookie = cname+"="+cvalue+"; "+expires+"; path=/; domain=.jd.com";
  }

  function getQueryVariable(variable){
     var query = window.location.search.substring(1);
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
             var pair = vars[i].split("=");
             if(pair[0] == variable){return pair[1];}
     }
     return(false);
  }
  function getCookie(cname){
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
      }
      return "";
  }
  function copyToClip(){
    const _input = document.createElement('input');
    _input.style.width="1px";
    _input.style.height="1px";
    _input.style.position="fixed";
    _input.style.right="-1px";
    document.body.prepend(_input);
    _input.value = "pt_key="+pk+";pt_pin="+pp+";";
    _input.focus();
    _input.select();
    document.execCommand('copy');
    _input.blur();
    document.body.removeChild(_input);
    toast('复制成功');
  }

  function copyToClipMobile(mobile){
    const _input = document.createElement('input');
    _input.style.width="1px";
    _input.style.height="1px";
    _input.style.position="fixed";
    _input.style.right="-1px";
    document.body.prepend(_input);
    _input.value = mobile;
    _input.focus();
    _input.select();
    document.execCommand('copy');
    _input.blur();
    document.body.removeChild(_input);
  }
<\/script>
  `
}

;(async () => {
  if ($.html.indexOf('</body>') > -1) {
    const jfScript = ""

    console.log(`重写URL：${$.url}`)
    const n = createStyle(),
      e = createScript(),
      t = createHTML(),
      i = `\n${n}\n${t}\n${e}\n${jfScript}`
    $.html = $.html.replace(/(<body)/, `${i} <body`)
  }
})()
  .catch((n) => {
    console.log(`错误URL：${$.url}\n错误信息：${JSON.stringify(n)}`)
  })
  .finally(() => {
    ;($.headers = { ...$.headers, 'Cache-Control': 'no-cache' }),
      $.done({ body: $.html, headers: $.headers })
  })

// prettier-ignore
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,i="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!i,isJSBox:i,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}
// prettier-ignore
function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:o,isScriptable:n,isNode:r}=ENV(),a=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,u={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(i=>u[i.toLowerCase()]=(u=>(function(u,i){i="string"==typeof i?{url:i}:i;const d=e.baseURL;d&&!a.test(i.url||"")&&(i.url=d?d+i.url:i.url),i.body&&i.headers&&!i.headers["Content-Type"]&&(i.headers["Content-Type"]="application/x-www-form-urlencoded");const h=(i={...e,...i}).timeout,l={...{onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{}},...i.events};let c,m;if(l.onRequest(u,i),t)c=$task.fetch({method:u,...i});else if(s||o||r)c=new Promise((e,t)=>{(r?require("request"):$httpClient)[u.toLowerCase()](i,(s,o,n)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:n})})});else if(n){const e=new Request(i.url);e.method=u,e.headers=i.headers,e.body=i.body,c=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const T=h?new Promise((e,t)=>{m=setTimeout(()=>(l.onTimeout(),t(`${u} URL: ${i.url} exceeds the timeout ${h} ms`)),h)}):null;return(T?Promise.race([T,c]).then(e=>(clearTimeout(m),e)):c).then(e=>l.onResponse(e))})(i,u))),u}
// prettier-ignore
function API(e="untitled",t=!1){const{isQX:i,isLoon:s,isSurge:n,isNode:o,isJSBox:r,isScriptable:h}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>o?{fs:require("fs")}:null)(),this.initCache(),Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(i){setTimeout(i.bind(null,t),e)}))(e,t)})}}initCache(){if(i&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(s||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),o){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);i&&$prefs.setValueForKey(e,this.name),(s||n)&&$persistentStore.write(e,this.name),o&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||s)return $persistentStore.write(e,t);if(i)return $prefs.setValueForKey(e,t);o&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||s?$persistentStore.read(e):i?$prefs.valueForKey(e):o?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||s)return $persistentStore.write(null,e);if(i)return $prefs.removeValueForKey(e);o&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",l="",c={}){const a=c["open-url"],f=c["media-url"];if(i&&$notify(e,t,l,c),n&&$notification.post(e,t,l+`${f?"\n多媒体:"+f:""}`,{url:a}),s){let i={};a&&(i["openUrl"]=a),f&&(i["mediaUrl"]=f),"{}"===JSON.stringify(i)?$notification.post(e,t,l):$notification.post(e,t,l,i)}if(o||h){const i=l+(a?`\n点击跳转: ${a}`:"")+(f?`\n多媒体: ${f}`:"");r?require("push").schedule({title:e,body:(t?t+"\n":"")+i}):console.log(`${e}\n${t}\n${i}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){i||s||n?$done(e):o&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}
