
/**
 * @fileoverview Template to compose HTTP reqeuest.
 * 
 */

const url = `https://api.m.jd.com/client.action`;
const method = `POST`;
const headers = {
'Accept' : `application/json, text/plain, */*`,
'Origin' : `https://bunearth.m.jd.com`,
'Accept-Encoding' : `gzip, deflate, br`,
'Cookie' : `__jd_ref_cls=Babel_dev_adv_Withdrawal2; mba_muid=1634696034816101535130.67.1634696114593; mba_sid=67.25; joyytoken=50074MDJGTlZhbTAxMQ==.d3hlVVt/eGZSW3J/YR88FiQvAzsLNmJVE3diYE1Van8oUxN3MCdVGmk5MTcvL3wQGA8WAH0FCykJEFk8e3Mo.9956ede0; shshshfpb=q4w%2FwgVBi2FybPN%20dfoGF8Q%3D%3D; unpl=V2_ZzNtbUNWEBFyAURcc0oLVmILEg8RB0QVdA9PBnwaDg1iBkUPclRCFnUURlVnGVgUZwQZWUdcQR1FCEZkexhdBmUHF11LXnMldQlHV3gRWQRmCyJeQmdCJXUPRFZ8Hl4CYgMQX0tXQxxwDERUfxBUNVcDGlpyV0IUdg5BVXMbWgBnAxZtclZzFXUPRFZLGGxECQUXXkBSR1h1D0RWfB5eAmIDEF9LV0MccAxEVH8QVDVmMxE%3D%7CV2_ZzNtbURVFxV2AUAAfkxZBmIHQA1LBEsTIg8WB35MVQAzUUUJclRCFnUURlVnGVQUZAEZX0ZcRhRFCEJkexhdBm8DEF1BUXMldQkoOn8aMlUmQiJeQmdCJSFdTgZ7EVoCMlEVCUdUFEYiWBEDehEOUWNUF11CV0QccAtEUX4ZX1BXMxtccl5EF3UPQ1JLay5gE3NwKHJWcxRFCXYWFc32qrONpYvN6JqF59zTzDZNCQ01AxpbRQIREiENRQMoTgxSMAIaDxZTFBB1CEZTchxfB2IGEl4XZ0IldQ%253d%253d; __jda=122270672.1634696034816101535130.1634696034.1634696034.1634696034.1; __jdb=122270672.1.1634696034816101535130|1.1634696034; __jdc=122270672; __jdv=122270672%7Cdirect%7C-%7Cnone%7C-%7C1633941518374; pre_seq=23; pre_session=ed9c1976dc6e42fbfaff09ce5f4111684234412d|182; pt_key=app_openAAJhb3tcADCwLfUkdUdJrdISJL1PJoWOs4prYJfKGJY9kmNhWEPloQryP_gPvkOWryyR31PLocc; pt_pin=jd_413898b7fccbf; pwdt_id=jd_413898b7fccbf; shshshfp=c3c791cfe743bbb2e28a92ab834a1f05; shshshfpa=4177a4f2-fe42-dfdf-a598-6a2299eb0b68-1634659463; shshshsID=720d04d594e843d28a96c8918bd127c3_1_1634696034919; sid=e99efc2cb31d78c5b9fe70343ddb2b8w; wxa_level=1`,
'Content-Type' : `application/x-www-form-urlencoded`,
'Host' : `api.m.jd.com`,
'Connection' : `keep-alive`,
'User-Agent' : `jdapp;iPhone;10.2.0;15.0.2;ed9c1976dc6e42fbfaff09ce5f4111684234412d;M/5.0;network/4g;ADID/;model/iPhone13,2;addressid/3905603545;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`,
'Referer' : `https://bunearth.m.jd.com/`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`
};
const body = `functionId=city_withdraw&body={"channel":1,"code":"041ZjTkl2B3EX74Ktbll2Y44bx3ZjTkV"}&client=wh5&clientVersion=1.0.0&uuid=ed9c1976dc6e42fbfaff09ce5f4111684234412d`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
