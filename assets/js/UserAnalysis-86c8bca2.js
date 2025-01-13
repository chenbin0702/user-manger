import{_ as N,r as h,v as O,N as T,a as o,o as L,c as F,e as s,b as a,w as t,p as k,u as j,M as I,f as g,t as d,O as V}from"./index-58786321.js";import"./index-17409aec.js";import{u as b,w as X,F as q}from"./xlsx-01326c6b.js";const G={class:"user-analysis"},H={class:"header"},J={class:"actions"},K={class:"card-content"},P={class:"card-content"},Q={class:"card-content"},W={class:"card-content"},Y={__name:"UserAnalysis",setup(Z){const y=h([]),R=[{text:"最近一周",value:()=>{const n=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*7),[e,n]}},{text:"最近一月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-1),[e,n]}},{text:"最近三月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-3),[e,n]}}],f=h({totalUsers:12580,newUsers:256,activeUsers:3680,conversionRate:35.8}),x=h([{behavior:"浏览商品",count:15680,percentage:35.6,trend:"up",trendValue:12.5,description:"用户浏览商品详情页的次数"},{behavior:"加入购物车",count:5890,percentage:13.4,trend:"up",trendValue:8.3,description:"用户将商品加入购物车的次数"},{behavior:"下单",count:2360,percentage:5.4,trend:"down",trendValue:3.2,description:"用户成功提交订单的次数"}]),m=h(null),w=h(null);let i=null,c=null;const A=()=>{if(m.value){i=V(m.value);const n=Array.from({length:7},(e,p)=>{const _=new Date;return _.setDate(_.getDate()-p),_.toLocaleDateString()}).reverse();i.setOption({tooltip:{trigger:"axis"},xAxis:{type:"category",data:n},yAxis:{type:"value"},series:[{name:"新增用户",type:"line",smooth:!0,data:[120,132,101,134,90,230,210]}]})}w.value&&(c=V(w.value),c.setOption({tooltip:{trigger:"item",formatter:"{b}: {c} ({d}%)"},legend:{orient:"vertical",left:"left"},series:[{type:"pie",radius:"50%",data:[{value:45,name:"个人用户"},{value:25,name:"企业用户"},{value:15,name:"培训机构"},{value:15,name:"其他"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}))},M=()=>{try{const n=b.book_new(),e=b.json_to_sheet(x.value);b.book_append_sheet(n,e,"用户行为分析");const p=X(n,{bookType:"xlsx",type:"array"});q.saveAs(new Blob([p],{type:"application/octet-stream"}),"用户分析报告.xlsx"),k.success("导出成功")}catch{k.error("导出失败")}},S=()=>{D()},D=()=>{A()};O(()=>{D(),window.addEventListener("resize",C)}),T(()=>{window.removeEventListener("resize",C),i&&i.dispose(),c&&c.dispose()});const C=()=>{i&&i.resize(),c&&c.resize()};return(n,e)=>{const p=o("el-date-picker"),_=o("el-icon"),z=o("el-button"),r=o("el-card"),u=o("el-col"),U=o("el-row"),v=o("el-table-column"),B=o("el-tag"),E=o("el-table");return L(),F("div",G,[s("div",H,[e[2]||(e[2]=s("h2",null,"用户分析",-1)),s("div",J,[a(p,{modelValue:y.value,"onUpdate:modelValue":e[0]||(e[0]=l=>y.value=l),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:R,onChange:S},null,8,["modelValue"]),a(z,{type:"primary",onClick:M},{default:t(()=>[a(_,null,{default:t(()=>[a(j(I))]),_:1}),e[1]||(e[1]=g("导出数据 "))]),_:1})])]),a(U,{gutter:20,class:"statistics-cards"},{default:t(()=>[a(u,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[3]||(e[3]=[s("div",{class:"card-header"},[s("span",null,"总用户数")],-1)])),default:t(()=>[s("div",K,d(f.value.totalUsers),1)]),_:1})]),_:1}),a(u,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[4]||(e[4]=[s("div",{class:"card-header"},[s("span",null,"新增用户")],-1)])),default:t(()=>[s("div",P,d(f.value.newUsers),1)]),_:1})]),_:1}),a(u,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[5]||(e[5]=[s("div",{class:"card-header"},[s("span",null,"活跃用户")],-1)])),default:t(()=>[s("div",Q,d(f.value.activeUsers),1)]),_:1})]),_:1}),a(u,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[6]||(e[6]=[s("div",{class:"card-header"},[s("span",null,"转化率")],-1)])),default:t(()=>[s("div",W,d(f.value.conversionRate)+"%",1)]),_:1})]),_:1})]),_:1}),a(U,{gutter:20,class:"chart-row"},{default:t(()=>[a(u,{span:12},{default:t(()=>[a(r,{class:"chart-card"},{header:t(()=>e[7]||(e[7]=[s("div",{class:"card-header"},[s("span",null,"用户增长趋势")],-1)])),default:t(()=>[s("div",{ref_key:"growthChartRef",ref:m,class:"chart"},null,512)]),_:1})]),_:1}),a(u,{span:12},{default:t(()=>[a(r,{class:"chart-card"},{header:t(()=>e[8]||(e[8]=[s("div",{class:"card-header"},[s("span",null,"用户分布")],-1)])),default:t(()=>[s("div",{ref_key:"distributionChartRef",ref:w,class:"chart"},null,512)]),_:1})]),_:1})]),_:1}),a(r,{class:"behavior-card"},{header:t(()=>e[9]||(e[9]=[s("div",{class:"card-header"},[s("span",null,"用户行为分析")],-1)])),default:t(()=>[a(E,{data:x.value,style:{width:"100%"}},{default:t(()=>[a(v,{prop:"behavior",label:"行为类型",width:"150"}),a(v,{prop:"count",label:"次数",width:"120"}),a(v,{prop:"percentage",label:"占比",width:"120"},{default:t(({row:l})=>[g(d(l.percentage)+"% ",1)]),_:1}),a(v,{prop:"trend",label:"趋势",width:"180"},{default:t(({row:l})=>[a(B,{type:l.trend==="up"?"success":"danger"},{default:t(()=>[g(d(l.trend==="up"?"上升":"下降")+" "+d(l.trendValue)+"% ",1)]),_:2},1032,["type"])]),_:1}),a(v,{prop:"description",label:"描述"})]),_:1},8,["data"])]),_:1})])}}},ae=N(Y,[["__scopeId","data-v-3f72edb5"]]);export{ae as default};
