/*
1 0,1,8 * * * jd_dpqd.js

店铺签到，各类店铺签到，有新的店铺直接添加token即可
============Quantumultx===============
[task_local]
#店铺签到
15 2,14 * * * https://raw.githubusercontent.com/KingRan/JDJB/main/jd_shop_sign.js, tag=店铺签到, enabled=true
===========Loon============
[Script]
cron "15 2,14 * * *" script-path=https://raw.githubusercontent.com/KingRan/JDJB/main/jd_shop_sign.js,tag=店铺签到
============Surge=============
店铺签到 = type=cron,cronexp="15 2,14 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/KingRan/JDJB/main/jd_shop_sign.js
===========小火箭========
店铺签到 = type=cron,script-path=https://raw.githubusercontent.com/KingRan/JDJB/main/jd_shop_sign.jss, cronexpr="15 2,14 * * *", timeout=3600, enable=true
*/
const $ = new Env('店铺签到');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', allMessage = '', message;
const JD_API_HOST = 'https://api.m.jd.com/api?appid=interCenter_shopSign';

let activityId=''
let vender=''
let num=0
let shopname=''
const token = [
//"16A0F17464EED8E9C2A50E3EEDCF6CEA",
	"11937264100CB592B372CD3555397F1B",
	"59FA562DAEFF1373A73921BBA278FC99",
	//"A983B845EC2BD57A87E46FE1CFDE3A7C",
	"632361E3B25D75BA6B657994DE33EB4D",
	//"34B11E7D978A29BE0DFC09F9B73A0C8F",
	"9FD546A7E2B512FC3B74E98D457DD333",
	"9FA12AA68637A1907637E5D4068555ED",
	//"9EAF3D015C3FEDC65B0BC04CAE249383",
	"158B1CE2044B1A928D808FBA3E949AA1",
	"81F4CDAB5E499E4750F7F75037BA79CF",
	"234E1DFAE215F1D5ED53E1B5C27706FD",
	"A21BA0DB7584E43F9D9CBE6F20466656",
	"C91EE5757C2E4291096C32D50EDD45FA",
	"4C24412A2682A2858DD13037C526933A",
	"10102E60699E7733569654135BEE59E4",
	"350650CBD8EED2147A26D75AF4CCC0EC",
	"376BC4F995EE541F358A158AD57D8AB1",
	"B1123E7629515EA2962C087AD5C2FD1F",
	"411FD8C051988BAFDF90991A126019B1",
	"8C3133EB9F75B234254A91A6201C8343",
	"2F34FC72870D700678F75B05FEAFA6F0",
	"388DB1F15A55BE08BBB127C2A48E5845",
	"1071B720BDB54B6ED8163A6B4116F35F",
	"CDD838001908106F790FC7B5D02BC590",
	"ED2E65C791A9DF6AD4BE853C5FDE9780",
	"C33F0F14F93E40A0425A424A3EF09977",
	"573447D25E34F32B526BFDB0A00743C0",
	"8856FD32E06C6CAC0BD20D0B9D0BAB55",
	"FDD24A96A99BFC7D585D784D88691947",
	"95DF85CBC8F3FBFCE1E0B6A210B4ECC4",
	"C1D6FD9D924377864648B2DFE7CDF240",
	"1925BD83EF764692207327D4EE94E1BC",
	"2BA45F4BD2E415B73B3F4A19A56D51C0",
	"D815ACA109CD6F8517A3A6F486D71D70",
	"06B36DEC992C6A220FE62B75AB3C8019",
	"B0E8F5F15DAADC7EF1CE6C2ED6921151",
	"A029F64ED06EB1671E26459AC6CBEF2D",
	"A6C9FDCF6BB022F6138A821E8F954EA9",
	"724C4970DEDC093C8B1FADC470159A98",
	"03FB1D65AE229A12D177985BE023373A",
	"A0CAC6CCAA078DAEB8115F3413E9C2E3",
	"260A5E41BA972D777320DE391E00EEE4",
	"C4DD7CB2CAA17A2011FD96597064447D",
	"F403A38505BA861C165FE40D1ED5D8C0",
	"5A9AC468F19C70AF7EEDCBA81A36B555",
	"9A9F529DC6EFE217BC561B89CAE944F4",
	"860CA4E3366A71A9DABA97C521FBD419",
	"BB55A94DD1CBE0AE3483361165D34328",
	"331CA5C558AEF6D94681435EC0B96624",
	"5F8880D8C7118B422FF327C44CD03055",
	"0A8A396D0B268FC25F4C05580140A87A",
	"4C72161D2126F2EC0910C6690C508042",
	"E8E02FD5BAA6C8192E6D4ED856319BBA",
	"1663CCDF042615F8BF3411CD2B022240",
	"A85579025763BF49D901363BA2FA2E20",
	"955FE73BFAD12C360B7019C359DCAAA8",
	"B6BE8FC07842F7D6C2ECC4C383AA8750",
	"E79917CCC97780BBFAF42A85A2F45A19",
	"DDE5547C19A1F40349EE77A775C87232",
	"17574DBD062087D216CA8F23EEA529CA",
	"E834FECD552683528938298A565EF9D6",
	"AD86EB3FBB3112C9804318FEAD1E1FB7",
	"EA31E7CADC14A5471038EF1D043DD2AD",
	"52A1FB4328756F96B1E938B7F9AB80F5",
	"72A4D4520358656807FBC5033BAC6D19",
	"B3855AA4C203EB79F222EFAFE68535FC",
	"196053609510B6C02D9B4E4AD00E6427",
	"7846216AD9170CD10DF12F5A72A0BC36",
	"EE19DA0EE109843655ED51468D6F1A20",
	"6C715A5FBFF0363D9DB160FDA098FA82",
	"2210427302E6BD3A8DB4AEF95FC5FAFD",
	"464BCAB36EF8F2165B75CE0C3814159E",
	"AA67D817973DC8DF1148465AEB6E4222",
	"FD21DD9CA4CC7497EBB2134C99608AA6",
	"C572095085D3611B04D17161F020C41B",
	"39B9C6729A17D740AB60BFFF70FDBE7E",
	"F565EE187E5B44814DAEA6B2C57BD272",
	"6640262827D8B69AE78C514D2B5634EA",
	"70D70223D491AA1C9402446459DE72CD",
	"F5D83C3698600180FA29A2A7C1FBA9E6",
	"650A0175DA1703BC513BB0D57FF98E7F",
	"265C8235206F8B7E5350F3F49DD78E05",
	"1BE75A9A336D7C30D31DC0F8B6BAE55F",
	"56D1774F29F6888FC05133B9F5B359EF",
	"4479A3903002F78C861E049B123D85FC",
	"021082CA5B9E809E3B54B4FF6013D7F2",
	"AF0C06E164866E8A3BF1A4B4176216E0",
	"2BE5269B0ADC4939A2FF7FFEB270BD90",
	"D3188C4FC585D5C8669AEC3797F8C981",
	"72F914CCEE7B28664560ADC797AD3C76",
	"B929C8F08884E569F97061F0703C680E",
	"83DCD93CFF8EECBBC8D09AA791E01BBF",
	"9A62017CBF8794DA8199A35856894A4C",
	"B27A5EF79990AA5137B9F4865BEAC88A",
	"6B2E5356A65B0FB3C35BD5CE44C8BCA3",
	"CEA5CFC0BB6B42B3C8027C3C75BBC75F",
	"70DFC0CB134433F414A5A262F2999DEF",
	"2E53EB2DAA497FA22BB2ED12B84807D7",
	"E8CDE0F5981EE6FA0E653875E4FA87F9",
	"CD167BE73B7642A18C78563CE52915B8",
	"D0E20055093D5700C59D57413979B45B",
	"43632BF017E8FF5A1257C31AF460CCF7",
	"EE3789883C00AC3991A2B2027CDDA57D",
	"A2B272A599974E9D3E4F3B4324F1599F",
	"F0F72D2DBA2CE236B5337010C42465E7",
	"AF5461B410545392DF13BA3C96773D57",
	"0223B4C9D12E63290F42EBAC0402B20A",
	"97903BED870491042249F915F360D49C",
	"255EE348465871F57DAE7CFFF90438E6",
	"D6ED6704626FC64FEC3E2D1600406AC4",
	"9ED266C16552C0A78F724B041CF28D5C",
	"8B810BCC68E0E19AE7FAF510230F9272",
	"8E9C0158EC51CAA24F6AB2B595E70F90",
	"75B3BF14F352E019688839B07F554149",
	"3D731D1A88C87843BA3BB8CB54E951B3",
	"AC6FE1196A6C0161EADA797803758461",
	"B790B033D3B3372116DD8C35D9DCE17F",
	"62B1C2AC2626B80D9773D88459D98535",
	"9710DA8F4DE57279C5CED66DEA2B0496",
	"33B404A35D3FE376FDD29C7CC1D89E5B",
	"EACCECF9724297DA56B49B772D1F3D0B",
	"6767192C5BEFF6E4681018190FF039D8",
	"BF13773A5C6F761E11AFC802E8FE44A3",
	"FC90490817CD3F03D790EB93C2D7E74A",
	"7A4E6CCBB842B50ACA43A8566540730C",
	"1272A31C7B63CE8B6DE740D98F0B7F85",
	"B6AC2DD10E4455EAEB15C7BDCB47682A",
	"C61CDC7925ACB963B382BA64961415A4",
	"B3AA7D743489803B5DAE6D1302B63BAF",
	"D8B58FF79C4BE374AA3E47A36C536AC7",
	"F5CDA0A7B093BE09F8550A1A9FD4C219",
	"0B75651392D55AB8CA4F8696D661D64F",
	"C7304918D1C7C9604DE668379B37925C",
	"EE25074D8FEA3AA4BC164C4A17C10625",
	"2BE13B299522E9F5F1C05857D70E58C9",
	"0D736A04805F21E373BFDD138D4576A0",
	"C3981E4D94B051ABF769DD18158CA0B5",
	"DB39ED3964F4AA2F08C14CC21DA3C81E",
	"DF38B6088BCA9661283ACBEAE84C7B4D",
	"E2A623A7FE513309358B5A1316C81623",
	"80A1E03C3FC19117FA92DA8A6DB3C13F",
	"D096B02D4B8BFDD5452BACC6D26ED136",
	"83C9760001000A6C103B291EF6C54FDC",
	"917622A46F9F2CED00D87DEE493A81D3",
	"9F7DEB24304701E0A162447CF5CF5F44",
	"A8A9F0F3ECADE8896FD5EDE3EF4BFE33",
	"DAB262A82B58D2CA3BB64B3EA21154D8",
	"00F03A1AB4AD57D04C2EA39F0E913D68",
	"245A045ACE0B4BDE158F8DD690A231E3",
	"857A263C79F85FB2BEA197B24C52689C",
	"57112DB5DEA46FE9F0DA11C8EDEE8013",
	"EFF56BEF326C263395D14BF67A266F4D",
	"E43A5A5DABE48C09EE5E264218FF6A75",
	"D7184660DC71C7D4786C6BB79A571007",
	"32631B9EC1913F63B6B8F4E0E1B62811",
	"649E6E0BACE014DCFB200EA17511BD0D",
	"2FB868C5EECA6778C66F5A0C7AA1493D",
	"B087BA3B08904A3F1E6AEADE1801DEB9",
	"4AE89D858165D1D63B7FADBCF4528769",
	"E721F9C8B1EA20826756EDD25AD960B5",
	"CEF55D195E2475186933C31F80062ECC",
	"3608F43C04330BB63DF00832A8AA0B33",
	"2DF1D19089D063E4AD43318C428A282C",
	"B8CCB2EF3A909C6B6818F48B140D77D3",
	"91C45BD4E51013276076709ABC3D9F9A",
	"61B9DBD14EF85E76E6F6CD48BCCA8588",
	"BE9F04E58269B72609CBF65299C5EB19",
	"3B1A35BD112B8EB50465EC1511943F69",
	"98533BDC3C020823CC19B59E75D944DD",
	"84039BDC32233C659CB313A656974313",
	"73B30C50F18C2130D1976B90E7EF9FEB",
	"605FF459F1AC82D3D016DFBBF28ADCA3",
	"D735DFD63FCEDF72A51101A13CAE84AB",
	"87126FEFC5990DB72CF4FF5674041EF6",
	"C07E2C2AE1C4D15DB9FB95CD96D81525",
	"8D118EF4F3806B1F68E5145E88ADE561",
	"6F314E9A46B501313DEF0BBCEA4F84AF",
	"BC6128628AAADA87015DC965539177F4",
	"DB008E81E619959BB7BA02DFE3DD478D",
	"EDDEC3265AA4AA5AB434B5C134B0EC67",
	"A87E96E5273E78EA7F240B72F7B9B722",
	"1519FB039E8162181BAC2A84F19BECA8",
	"E043FED713B4184C7DE648D58D7F1EE4",
	"9ABB4A15F7F991640BEA16DA08774FDA",
	"F4B0BCC2FF5B3772F6D2DA51697BC5AA",
	"E67D96B291DAE894695860D945025EA4",
	"988AED1683DCD6936801B0AA5D024920",
	"60E3327C3F632A7CC4BD28E8898AA295",
	"F6F8EFE92A06D4A4888B4C4AF8FBF1D7",
	"1D8BEA80D891B89496B2B53B86403B1F",
	"BD1F5BDF41AABE4508F3D61C030CF893",
	"6F74B9552D206DD58921E1A4926D0562",
	"069B8CC7575BA016C740597D85109110",
	"0DBDC497306C1E663458DC622D2AE0C4",
	"F2DA30F5A5D2744CE826581D905BC80B",
	"51E639813A63DB0591B294D8DE1AEC6F",
	"AD600841AA9A7ADCF45E4821335AAD6F",
	"D7C07E609E276A4D19B3C2C2A85EFBC0",
	"1EA160AE7BA11D8CEA4014A6322BCEC0",
	"C18533C9ACD2A105AFB84E1E3B0AF593",
	"F1D909C673DEDCA317D8907C68F4B5FF",
	"D2B4F5B2AEB63902C87E5B2B164C9100",
	"8CC6F3E63FBD25EF6C4B03C0F844F7B0",
	"9BA09DF1D4A359C88D815CB720E36E15",
	"052843C3866165E9CEB99C87CFCB1C1F",
	"92E371C26CA766D23BD5EBB60CCCEC71",
	"A692DD63CA3E818F69DC9DECF20FE580",
	"9235742A3291C96DCBE23421AFFD9A08",
	"240CFE4D10DA3FF55B4755E8E7643637",
	"1FEB1CBB9AF7AD583428AA50A4A8CCE3",
	"6FEBBD72BF2F3A24443271826E3D22E6",
	"349C15A48663247964FBB45BEBC8BF3E",
	"4DCD6A81255F89417768CFDDDCF4D43C",
	"D525BFB2CB6E54E76730F22D0ED7305E",
	"D480F11474C23C2AB053C633B943C69F",
	"A9616BA854DE84B84CA51F61DE3F383F",
	"9A62017CBF8794DA8199A35856894A4C",
	"0A34FCE398530218A0CB7E62028576D3",
	"AADA2E6A2A5C5F77B0C581E26A251ACE",
	"4E67B82B2B99DF7F038E4BCF7E05BC01",
	"C08A965E2A0500DD7AEC47C607F1B553",
	"8DABE7001DC92890951BE85CCA41B1D7",
	"C9544D9D2182E95CDFF48635554F4BF5",
	"F02ABA7BAC0F02D12542A90394D00D14",
	"BDAEFD6F5721C207325F7D601946CF98",
	"122013D24CEC2170D45EEEE87CC66226",
	"5BA7A709B1AC7A08E322738527CFAF3A",
	"1DBE0659506137B3BA3974BF4AD6F550",
	"26876A49DA46A7EE198D738A691F414A",
	"A1CD65F387F6E7A6098B614A44A3D570",
	"24ABF10AE91A25670B7BD963E78A9EDF",
	"2113E54FE69FBA0A745D20CC09315912",
	"07DD7AED241641F9400CFE08D2B8B114",
	"AB64F6C331B4C09DB241506A3B9CCC42",
	"9EC5E039D53B6CBA62E9C77CB7BFC736",
	"5616097BEADD3E665F82908E5883A6C8",
	"5DD1520103E3C489FC3529F5F2E98AC9",
	"F384F46AC921E87BBEB822B29AD56E49",
	"62255F7C1DF54FA969928D8CA2CBFAD8",
	"3847774B7EC36D1B8F6EFC52F6C9EE25",
	"987BDBBBE8A834F6F980139C48CF61F3",
	"2F56EB53CF89F08B441402850A5695BE",
	"0628C00268FC9F0CC64BEB4DF3457912",
	"274AB50366D58CD2D78D3CF848B26772",
	"DB8B5D46E1AE21A6D73F31322D3C64D5",
	"4059FB9989E61AB23444DBC25ABC3750",
	"90A893143EA519064A5AD59BCFE3B161",
	"2AB380B6A6970F8B4B3645806F8C88FA",
	"186BF80D987137DD28684D56DA201400",
	"DDAA5AE712E05247BFFEA472DE19351C",
	"3600C706DEC63CAA0F10B62B96D65818",
	"A758F2B44A7776C2714883495A7AE3C0",
	"F6D129D4A646E36411DA4E89DCC1F9B9",
	"59B3135F79D8D630BA1EF61C4870FDA0",
	"C4FB10EC184E49AFBF5B093FF5138ACA",
	"3984ED3EFDBC4E1CFFF8D447767C7213",
	"87A86CB76BE06DB3B2CE21824193299F",
	"E7D73E2E80A80742BB938BD69716ADB6",
	"7F0B2193A11B5121599769513DD4BF01",
	"AC866FD3FCA6EC1D1935B4516F29DF33",
	"C9A3A82825A6D974831B906963726EEF",
	"4727D52427A6D8BA4D0FA297F96CB51D",
	"F6322652DAE979C6EA9E9D10D85AC821",
	"D30461CEEF76DC5A8E9E6BA858C5246C",
	"120636E269DAF1F981BBA00446CE5140",
	"EBAF1788D8A808151F1F63C72413D33E",
	"03AAB71941ED85B40411FCEE72B917E4",
	"6C1773F076C4717A539A1BE103CFBF5B",
	"703EE8E04D80FE95B9FD2F18C2CD7D08",
	"847A1EA1601EB07E8C0F0A01EE195F2E",
	"099DA342CA225655A0D8DC9E72D3F56C",
	"348A158D7928009DA071CD068D2363D5",
	"F99414FA20B0F56B77D3CAC3AFAADBB1",
	"AD81EA55BA04DF15ACB7265DB8B049BF",
	"B7A781EC32F4F91793E9B5D9C9F1F40E",
	"21788355AE9392322B5474A3C0AA7ABA",
	"94FE65BDB4E3CA06E11D5C2933B8C2B4",
	"4DDDBBBF38C8CA6F82FCEA7D75DEBD91",
	"F6BB275A8DFD86BF3FD798031483B280",
	"EE25074D8FEA3AA4BC164C4A17C10625",
	"0C1819F234C64564DB28644762B16AEE",
	"50CEC46FF0CDD92B080757224719076D",
	"E7032CD0E6CA60EA0D5CE72D7D793586",
	"B8167EC9BAC16BBD9284DD3C757D60D3",
	"202B6F98E5D7A8A381EC918D1D140B52",
	"E4B3CC65155F29636D23126757FC9B04",
	"7CC34DF60C51DFC475D34DD7ABD069C0",
	"33FC20941C464C73E1C30FF06392C486",
	"C7900822994BAA6A533B7EECB3445B32",
	"F658709F1069375C7F7EB1D2DB8A85DD",
	"1F80F7ECBA82E553419876B7AB362F32",
	"1CAF109D45547097258C03146B8A911F",
	"65C4358D95B5BD1D89A8F2E982A191AF",
	"0D04DFF51E5CC9AAE57D0115061AE4CF",
	"9CE7AA24284218E6DD0D9CCA11C13104",
	"5514CC04EDC3B3D7871DB572EAFD7571",
	"D2FF61BCE10497CE265569DCD710D206",
	"50E6C8027488FE343B04706764059687",
	"632507B2FFD3B6E7896E97D921A0B28D",
	"9DE8A8B117731DC61792321285B908F1",
	"59B137AD11B60CA24D23BC9A4A0DB1DE",
	"D3DBE26834E5D75E73D4EDA9D2F2E23B",
	"8B5991A617697F751689157A190DD91D",
	"46B93553F8A840979B740C35744D68CE",
	"EFF56BEF326C263395D14BF67A266F4D",
	"FDACF5DC077ABB78C4B2ABF8519194A3",
	"5B564B1AEE9A824CF4ED9453493E724D",
	"EA34CAA829AB1853199092BAAEA9DC1D",
	"A85BBC9D435B2AC0C8157DF2EBB11AC4",
	"DDBE2FC62D1C4C26C004A1FC84B3FA46",
	"2ED0789B164637102C6070D0A75DD5A3",
	"AB52897A53BB6DC1134FEF11FB808848",
	"E797050953894B55534A99E950C652BF",
	"F6ACFFEA1B0235A78226B8B317BB418E",
	"C10C09B09CA16DF507A2B8B79C47C1E0",
	"8C858975B59B54AD359F180FF8ADFC97",
	"43087B8B2ACA1134A6D0E30450C930BF",
	"757474E54BEE48B5AEADD441E88C42B6",
	"6C44F271F49531829E1563E08536D176",
	"E41F418E40F0A9026A19676954669FE7",
	"BD28AE0478EAA05509D0FD9AAC72D85F",
	"43F0D3CA719F4718EF15AEC62374B841",
	"4092528AEA26C2AB254048BB732FF020",
	"72E769FB69161C316290AC0E9B8C1FAF",
	"18943AABF8EE856FB09C7B0DD8ADDC2D",
	"956902B533DEF80483FE6E1521367A96",
	"AA15363B0F3AF28930A0F26216E1D71F",
	"33CCFCC13A3F63762F9B06C648BF4F71",
	"267EDDAA45CBEBCFDFC1D67D620FD534",
	"C721F1909BE3CF8930C50F6FE2126A42",
	"6E180F6D832681524C43F8EEF47F430E",
	"9824314A8536398BF7D206B8E63F0666",
	"1BDDBC55B475F503773A564793F84BF2",
	"AC3DB42FEE685CFC38A4B2EE9A9CE5D9",
	"B1544667093A1D7EA5C9A1606DCDD108",
	"9BA09DF1D4A359C88D815CB720E36E15",
	"DFA78E721DA9149ABAC8E755B5919D68",
	"F387477640A46307C675EE67EAC27D8B",
	"8C4E35ECDBF325410F62F16BE32902B5",
	"2A7B39D6D5FDA9B03E613D7ACECA5D48",
	"4207BDEAC239F8AB331C201D6BE7210F",
	"705A5AC90FDA966177F00329335CCAB6",
	"06677504873BD7DEF5338C080368985D",
	"F242DD75FC7FC586E0F7E89EB1AB4270",
	"DAD974FE0D52F6BF1E81D896D875848D",
	"FC88CA51CCCD6F89439946C86C8F11C5",
	"4FB6A933B9C9CE76A7CDCF6E90FD6518",
	"F41DC7D8A60BE91C36A6FFEB449A1CFE",
	"7D4C6B68C749C4C4DD5676A9305DBE9A",
	"D78E287B3B065790BEBB61DCD1B83E8E",
	"4F124E696F9E470D8ADC758A9E37359B",
	"6EDBA01D9F214E0B9CB4624E9B52BB28",
	"802041FA19609D608815DCC2919BBC16",
	"33B04BB9BB4380150E6CBA1C0A835D47",
	"1CCB3095A93EC5A70FB18DFB69DA8106",
	"A379F0042C7A730A960AF1587473918E",
	"2646CFAB37C91CE0CF8FBC2AD81B219E",
	"FAE75BF8A6C0B04DB90D855F183E3BA5",
	"6973B3EA883549EE67EBFBFAF9F2D8C8",
	"B2C5D1BB765391DB56B0CDEDEA2601B3",
	"BCD30A98F927F30AA83F5E0C5277F79C",
	"023D024CFD924765FF95EB063A08EDA5",
	"C9003045FF1B1F708C17F5F3EBC637D7",
	"BFABBE1433D242DDF165C114A68AE211",
	"34E8E8F35AA350A40AA2D23605372E20",
	"37DB9E1E01AF7CF1984990B0C7FC510A",
	"B8EB0ABCCE78B44754A714D8A40858B4",
	"3B8A98371C8E9B575BCF74E4D339DC4E",
	"63DB28DE76D647512A7A978969CADE3F",
	"485DE52145D74206831E807846167CED",
	"4912194BFDB4FD4CCE7795BDFDE0131D",
	"C160741ADFA84AAEF97EA6AEA1560ADE",
	"65E8A04545F3961D74055DC82CB49387",
	"6CBB61FAB2DE48ED08A0ACB1A35581DA",
	"CD2BB1C8B13248075173F7ED17490DF1",
	"005353DFA6E5810DD77B7E309CC5DD99",
	"7CACFF90583E26AA2F1B441D7D0967F4",
	"0C58D55D59A87AC896273DF39AAD8983",
	"8BDACA0393745B3C63A00E71ACC3AFA3",
	"36DEAD96A1C8281366C5B84434ED54DC",
	"6610DA6BC81BDA6DE1D9798B84BAE472",
	"CE59A9C4C3A1FD80DCDA118634F4EC99",
	"695C6C868A72852058741516CAACC2C0",
	"F38C61F0008EA993B02A63E5DF00C1AC",
	"B91971D03E9D36AD413687C53380E972",
	"97B29A62453206B857FFE3F4B3487440",
	"5244E4DDCC669905BC2C040C7F8FB3A8",
	"4FB1462BE1772F029E9B77850D1C7DD4",
	"0117F29D581E0E23A281A05317515DFC",
	"FFD60F935D9E4C57B74F3678F93EEADD",
	"CE55F43111AC1193ADC63C3F16C39D6A",
	"5468ECAEC265327CC34358863C71AE50",
	"4DDDBBBF38C8CA6F82FCEA7D75DEBD91",
	"A153E9EE7D5A38924DC790FEF94250BD",
	"9087AEA8E56C6D3777BC2C57BB7A4112",
	"B34EBA589CCA3B81530CCAB1178349E1",
	"4D59D47E9A0B7DEDEB30CFE5DA1ACC39",
	"12680DE625D13EC367865609A7386FAF",
	"33B254844203308FC44BC4C1E63D6186",
	"9B9A2B3171D5D28AF4EB5C19080D2B59",
	"F9A4A9FFBDC0AB307A20FD01223B8AEF",
	"D8DF8394135F32ADB315005D6C3E15DF",
	"A321315EC1B6E4CD921EAD975635BEB6",
	"E13C4EFB0C5B4AB637B5DEB41034BBDC",
	"0C9CE3A14045259696E055552AF386A3",
	"627FE5C240CA532760B8256712FD4DA7",
	"273D8AEBECBB9BAA57F413EAD72B9756",
	"69B31DB107B9FE242E286E4E8B3E0E75",
	"E2A4CC8D9DD2D6EF7E37EAADE708A04B",
	"E9646726E1C7CC740313EA2B1565B9E8",
	"3B1D2E5EB89983C7D771DA277420B581",
	"9CE7AA24284218E6DD0D9CCA11C13104",
	"17BC2C1847C2ED1EFBA1F01593DA4BEB",
	"8D4AB206A248FF42D4F5B77EF213D4F0",
	"5D6089DBB22F92A3FCA712058B2B9417",
	"273E5D8746AAD59C542587174AC1522F",
	"32BC097720EF00D5D5FA6B0E278CD539",
	"159D1BB0D7BB59321E988DAEF0AB6577",
	"26C18FC4BFC54088DB098E00CEB5B0E5",
	"098FF8B0ADC3652EA2A6391587FB08A4",
	"C8C0237FE44F70D59024DA859B260B19",
	"6F70890AEC643D2FB3EB3480D607AB38",
	"8D69DAC52915C64531928152746D193A",
	"6348B9E85BBC7F852DDE1F4AAC8991C7",
	"0A5CCE03451C4F3F3795A52FED1C9262",
	"0BDABC504B34C7C7476C8A8EAB0B499B",
	"A9303807B76DAF0E019EFBF7C43E93FB",
	"3FBBD8F986A0F11E15BA4F45C352C03F",
	"69EED2F95C4BBEDA2CA36D3DC770EA10",
	"AA7D4CCE3FB6FE67B80C69FCC254DC73",
	"41DEE4CEDFD5C13D4B05E710005C88DC",
	"86304795DBBCBB81D461C5562CE08BDF",
	"107511FA6822D0D305F5D80523B7A667",
	"65F30E3CE0A59505E801E42CFBF911D0",
	"DDB212ECCD5308E0201FFA97517B9392",
	"48EFFFB013643787200BA4CBAE9C9ACD",
	"D8FBBB03E5B3F7671BDCB73728957C56",
	"63DA7FBD52C2EAAB8B2465894CF88EA7",
	"9340C582677FFD3079C8E00608BDEDE5",
	"4AE38875C030C792A62ED4FCCF9362C1",
	"BE0FA5D1CF946E15337ABFE58EA83653",
	"3F83EC40A17C4E67A2D22D1A371DF7B0",
	"D4889ACB3CF71982046C83929DCF5C3A",
	"62AF9371186EA79DAAD2F7A7F93DF513",
	"1E3762B2680D8A19FA2E74D267448EE0",
	"BFCD21C47CC98F150F7AF5AD1C08E205",
	"48EA4D5E78AF728675FAB801E8BF225A",
	"05E07DB336E8113D34C61539CBCD68FD",
	"3277D2D95B07783A4EF9A5E4047825B0",
	"4092528AEA26C2AB254048BB732FF020",
	"9CB5F82A947BABE7CC69DB0E25A52E8B",
	"956902B533DEF80483FE6E1521367A96",
	"BBDF6DCBC07A233A704ED3AD0D3E1D5C",
	"94CB8F61348FC7FF23AC54057D5BD09B",
	"8B501557A0D2763408D69FBF0A051D04",
	"A8406FA7BDB6B64A192C5A18AC33F1D7",
	"0FA06CDDB52AE05A98F572BC102C051F",
	"6C3278EFE1DEB21624AB0D912E1B09BA",
	"7A88A87CC4798D4D8A7FC059B54794F9",
	"7300571E0FE6973F9C73905BAB8E2F12",
	"229108BE0708808D3C740C569F8C12C6",
	"CAFF24EB642F4BB7438EDBBE9323E5B8",
	"23E256C2570137B52ECF8C67306DF537",
	"445BC40231243D40FC90988BFE1DA920",
	"45F267067737BC50F80C33E73437C683",
	"111FB402D4BE49A10F8E1E72AA5D29AC",
	"3B265D16FAE16ABF038ACD82431E6DCF",
	"1CCB3095A93EC5A70FB18DFB69DA8106",
	"87C5148EBDEA510EDD6981885AD7F336",
	"4A495413CB2C113AB6134F75BC48B681",
	"07F172E279AD61656144DBAF90453FAC",
	"6CBB61FAB2DE48ED08A0ACB1A35581DA",
	"6610DA6BC81BDA6DE1D9798B84BAE472",
	"0719A94A3B475FC8CC4079D6F634220C",
	"84E7AF64B889678BD72CA94590A76C7F",
	"EDC641E937BB9F038C8AC73EAAD8857E",
	"E636EC83748EE276FCF6C901A944D5D9",
]

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await dpqd()
      await showMsg()
      await $.wait(1500)
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

//开始店铺签到
async function dpqd(){
  for (var j = 0; j < token.length; j++) {
    num=j+1
    if (token[j]=='') {continue}
    getUA()
    await getvenderId(token[j])
    if (vender=='') {continue}
    await getvenderName(vender)
    await getActivityInfo(token[j],vender)
    await signCollectGift(token[j],vender,activityId)
    await taskUrl(token[j],vender)
    console.log(`延迟5s，等待中……`)
    await $.wait(5000);
  }
}

//获取店铺ID
function getvenderId(token) {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/api?appid=interCenter_shopSign&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getActivityInfo&body={%22token%22:%22${token}%22,%22venderId%22:%22%22}&jsonp=jsonp1000`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": 'https://h5.m.jd.com/',
        "User-Agent": $.UA
        // "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //console.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
          if (data.code==402) {
            vender=''
            console.log(`第`+num+`个店铺签到活动已失效`)
            message +=`第`+num+`个店铺签到活动已失效\n`
          }else{
            vender=data.data.venderId
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//获取店铺名称
function getvenderName(venderId) {
  return new Promise(resolve => {
    const options = {
      url: `https://wq.jd.com/mshop/QueryShopMemberInfoJson?venderId=${venderId}`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "User-Agent": $.UA
        // "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //console.log(data)
          data = JSON.parse(data)
          shopName = data.shopName
          console.log(`【`+shopName+`】`)
          message +=`【`+shopName+`】`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}


//获取店铺活动信息
function getActivityInfo(token,venderId) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getActivityInfo&body={%22token%22:%22${token}%22,%22venderId%22:${venderId}}&jsonp=jsonp1005`,
      headers: {
        "accept": "accept",
        "accept-encoding": "gzip, deflate",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/2PAAf74aG3D61qvfKUM5dxUssJQ9/index.html?token=${token}&sceneval=2&jxsid=16105853541009626903&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1001280291_&utm_term=fa3f8f38c56f44e2b4bfc2f37bce9713`,
        "User-Agent": $.UA
        // "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          // console.log(data)
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //console.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
          activityId=data.data.id
          //console.log(data)
          let mes='';
          for (let i = 0; i < data.data.continuePrizeRuleList.length; i++) {
            const level=data.data.continuePrizeRuleList[i].level
            const discount=data.data.continuePrizeRuleList[i].prizeList[0].discount
            mes += "签到"+level+"天,获得"+discount+'豆'
          }
          // console.log(message+mes+'\n')
          // message += mes+'\n'
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//店铺签到
function signCollectGift(token,venderId,activitytemp) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_signCollectGift&body={%22token%22:%22${token}%22,%22venderId%22:688200,%22activityId%22:${activitytemp},%22type%22:56,%22actionType%22:7}&jsonp=jsonp1004`,
      headers: {
        "accept": "accept",
        "accept-encoding": "gzip, deflate",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/2PAAf74aG3D61qvfKUM5dxUssJQ9/index.html?token=${token}&sceneval=2&jxsid=16105853541009626903&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1001280291_&utm_term=fa3f8f38c56f44e2b4bfc2f37bce9713`,
        "User-Agent": $.UA
        // "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //console.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//店铺获取签到信息
function taskUrl(token,venderId) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getSignRecord&body={%22token%22:%22${token}%22,%22venderId%22:${venderId},%22activityId%22:${activityId},%22type%22:56}&jsonp=jsonp1006`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/`,
        "User-Agent": $.UA
        // "user-agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //console.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
          console.log(`已签到：`+data.data.days+`天`)
          message +=`已签到：`+data.data.days+`天\n`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

async function showMsg() {
  if ($.isNode()) {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    allMessage += `【京东账号${$.index}】${$.nickName}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": `jdapp;android;9.3.5;10;3353234393134326-3673735303632613;network/wifi;model/MI 8;addressid/138719729;aid/3524914bc77506b1;oaid/274aeb3d01b03a22;osVer/29;appBuild/86390;psn/Mp0dlaZf4czQtfPNMEfpcYU9S/f2Vv4y|2255;psq/1;adk/;ads/;pap/JA2015_311210|9.3.5|ANDROID 10;osv/10;pv/2039.1;jdv/0|androidapp|t_335139774|appshare|QQfriends|1611211482018|1611211495;ref/com.jingdong.app.mall.home.JDHomeFragment;partner/jingdong;apprpd/Home_Main;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = data['base'].nickname;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function getUA() {
  $.UA = `jdapp;iPhone;10.2.2;13.1.2;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
