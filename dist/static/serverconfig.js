// 自研cdn地址 
// 仿真/生产 https://prod-cdn.xcsc.com/ 测试： http://test-cdn.xcsc.com/ 

//自研boss接口 ：
// 测试： https://openapisit.xcsc.com:9090/open
// 仿真： https://openapiuat.xcsc.com:9909/open
// 生产： https://openapi.xcsc.com:9909/open

// 通达信服务tp 资讯tp
// 测试：
// 资讯tp： http://10.1.41.102:7615 
// 服务tp： http://10.1.41.103:7620/TQLEX?Entry=HQServ.CombHQ
// 仿真：
// 资讯tp： http://175.6.12.36:7615  
// 服务tp： http://175.6.12.36:7620/TQLEX?Entry=HQServ.CombHQ
// 生产：
// 资讯tp： http://bbxpczxtp.xcsc.com:7615 
// 服务tp：http://bbxpcfwtp.xcsc.com:7620/TQLEX?Entry=HQServ.CombHQ

// Base_url : boss接口地址
// tdxFwBase_url：通达信服务tp
// tdxZxBase_url：通达信资讯tp
// cdn_url：资讯cdn地址
window.global_url = {
	Base_url: "https://openapi.xcsc.com:9909/open" ,
	tdxFwBase_url:'http://bbxpcfwtp.xcsc.com:7620/TQLEX?Entry=HQServ.CombHQ',
	tdxZxBase_url:'http://bbxpczxtp.xcsc.com:7615',
	cdn_url:'https://prod-cdn.xcsc.com/',
};
function refresh(){
	// alert('test');
	window.location.reload(); 
	// updateList();
}