define(
function(){
var commonFaceObj = {};    
var commonFacesBase = 'http://www.sinaimg.cn/dy/deco/2012/1217/face/';
			var allFacesBase = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/';
			var commonFaces = {
				'\u54C8\u54C8': 'haha',
				'\u5077\u7B11': 'tx',
				'\u6CEA': 'lei',
				'\u563B\u563B': 'xixi',
				'\u7231\u4F60': 'aini',
				'\u6316\u9F3B\u5C4E': 'wbs',
				'\u5FC3': 'xin'
			};
			var allFaces = {
				'\u56FD\u65D7': 'dc/flag_thumb',
				'\u8D70\u4F60': 'ed/zouni_thumb',
				'\u7B11\u54C8\u54C8': '32/lxhwahaha_thumb',
				'\u6C5F\u5357style': '67/gangnamstyle_thumb',
				'\u5410\u8840': '8c/lxhtuxue_thumb',
				'\u597D\u6FC0\u52A8': 'ae/lxhjidong_thumb',
				'lt\u5207\u514B\u95F9': '73/ltqiekenao_thumb',
				'moc\u8F6C\u53D1': 'cb/moczhuanfa_thumb',
				'ala\u8E66': 'b7/alabeng_thumb',
				'gst\u8010\u4F60': '1b/gstnaini_thumb',
				'xb\u538B\u529B': 'e0/xbyali_thumb',
				'din\u63A8\u649E': 'dd/dintuizhuang_thumb',
				'\u8349\u6CE5\u9A6C': '7a/shenshou_thumb',
				'\u795E\u9A6C': '60/horse2_thumb',
				'\u6D6E\u4E91': 'bc/fuyun_thumb',
				'\u7ED9\u529B': 'c9/geili_thumb',
				'\u56F4\u89C2': 'f2/wg_thumb',
				'\u5A01\u6B66': '70/vw_thumb',
				'\u718A\u732B': '6e/panda_thumb',
				'\u5154\u5B50': '81/rabbit_thumb',
				'\u5965\u7279\u66FC': 'bc/otm_thumb',
				'\u56E7': '15/j_thumb',
				'\u4E92\u7C89': '89/hufen_thumb',
				'\u793C\u7269': 'c4/liwu_thumb',
				'\u5475\u5475': 'ac/smilea_thumb',
				'\u563B\u563B': '0b/tootha_thumb',
				'\u54C8\u54C8': '6a/laugh',
				'\u53EF\u7231': '14/tza_thumb',
				'\u53EF\u601C': 'af/kl_thumb',
				'\u6316\u9F3B\u5C4E': 'a0/kbsa_thumb',
				'\u5403\u60CA': 'f4/cj_thumb',
				'\u5BB3\u7F9E': '6e/shamea_thumb',
				'\u6324\u773C': 'c3/zy_thumb',
				'\u95ED\u5634': '29/bz_thumb',
				'\u9119\u89C6': '71/bs2_thumb',
				'\u7231\u4F60': '6d/lovea_thumb',
				'\u6CEA': '9d/sada_thumb',
				'\u5077\u7B11': '19/heia_thumb',
				'\u4EB2\u4EB2': '8f/qq_thumb',
				'\u751F\u75C5': 'b6/sb_thumb',
				'\u592A\u5F00\u5FC3': '58/mb_thumb',
				'\u61D2\u5F97\u7406\u4F60': '17/ldln_thumb',
				'\u53F3\u54FC\u54FC': '98/yhh_thumb',
				'\u5DE6\u54FC\u54FC': '6d/zhh_thumb',
				'\u5618': 'a6/x_thumb',
				'\u8870': 'af/cry',
				'\u59D4\u5C48': '73/wq_thumb',
				'\u5410': '9e/t_thumb',
				'\u6253\u54C8\u6B20': 'f3/k_thumb',
				'\u62B1\u62B1': '27/bba_thumb',
				'\u6012': '7c/angrya_thumb',
				'\u7591\u95EE': '5c/yw_thumb',
				'\u998B\u5634': 'a5/cza_thumb',
				'\u62DC\u62DC': '70/88_thumb',
				'\u601D\u8003': 'e9/sk_thumb',
				'\u6C57': '24/sweata_thumb',
				'\u56F0': '7f/sleepya_thumb',
				'\u7761\u89C9': '6b/sleepa_thumb',
				'\u94B1': '90/money_thumb',
				'\u5931\u671B': '0c/sw_thumb',
				'\u9177': '40/cool_thumb',
				'\u82B1\u5FC3': '8c/hsa_thumb',
				'\u54FC': '49/hatea_thumb',
				'\u9F13\u638C': '36/gza_thumb',
				'\u6655': 'd9/dizzya_thumb',
				'\u60B2\u4F24': '1a/bs_thumb',
				'\u6293\u72C2': '62/crazya_thumb',
				'\u9ED1\u7EBF': '91/h_thumb',
				'\u9634\u9669': '6d/yx_thumb',
				'\u6012\u9A82': '89/nm_thumb',
				'\u5FC3': '40/hearta_thumb',
				'\u4F24\u5FC3': 'ea/unheart',
				'\u732A\u5934': '58/pig',
				'ok': 'd6/ok_thumb',
				'\u8036': 'd9/ye_thumb',
				'good': 'd8/good_thumb',
				'\u4E0D\u8981': 'c7/no_thumb',
				'\u8D5E': 'd0/z2_thumb',
				'\u6765': '40/come_thumb',
				'\u5F31': 'd8/sad_thumb',
				'\u8721\u70DB': '91/lazu_thumb',
				'\u86CB\u7CD5': '6a/cake',
				'\u949F': 'd3/clock_thumb',
				'\u8BDD\u7B52': '1b/m_thumb'
			};
			var customFacesBase = 'http://sjs1.sinajs.cn/astro/xuyuanxing/images/pages/'
			var customFaces ={
                 '\u94b1\u5e01':'coin'
			}
                        
commonFaceObj.loadFace = function(data){
    var faceArry =  data.match(/\[[^\]]*\]/g)
    if(faceArry==null){return data;}
    var resultArry = [];
    for(var i=0;i<faceArry.length;i++){
        faceArry[i] = faceArry[i].replace('[','')
         faceArry[i] = faceArry[i].replace(']','')
        if(allFaces[faceArry[i]]){
         resultArry.push(allFacesBase+allFaces[faceArry[i]])
        }else{
         resultArry.push(customFacesBase+customFaces[faceArry[i]])	
        }
     }
     for(var i=0;i<resultArry.length;i++){
        data= data.replace(/\[[^\]]*\]/,'<img src="'+resultArry[i]+'.gif"/>') 
     }
  return  data
}                        
 
commonFaceObj.renderAllFaces = function(){
    var data = ''
    data+='<ul>'
    for (var key in allFaces){    
        data+='<li><a href="javascript:;" node-type="addFace" data-bind="['+key+']" title="'+key+'"><img src="'+allFacesBase+allFaces[key]+'.gif"/></a></li>' 
    }
    data+='</ul>'
    return data
} 
 
return commonFaceObj;                
})