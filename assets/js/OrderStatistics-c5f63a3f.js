import{_ as G,r as p,v as H,N as J,a as s,o as g,c as K,e as o,b as a,w as t,p as M,u as x,M as P,f as m,t as _,g as C,z as D,O as B}from"./index-58786321.js";import"./index-17409aec.js";import{u as R,w as Q,F as W}from"./xlsx-01326c6b.js";import{f as A}from"./format-44ea9176.js";const Y={class:"pilot-order-statistics"},Z={class:"header"},$={class:"actions"},ee={class:"card-content"},te={class:"card-content"},ae={class:"card-content"},oe={class:"card-content"},ne={class:"card-header"},se={__name:"OrderStatistics",setup(le){const V=p([]),E=[{text:"最近一周",value:()=>{const n=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*7),[e,n]}},{text:"最近一月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-1),[e,n]}},{text:"最近三月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-3),[e,n]}}],w=p({totalOrders:1256,completionRate:95.8,averageDuration:4.5,totalIncome:298600}),f=p("orders"),O=p([{name:"张三",orderCount:156,income:58600,completionRate:98.5,rating:4.8,mainTask:"航拍任务"},{name:"李四",orderCount:142,income:52400,completionRate:97.2,rating:4.7,mainTask:"测绘任务"},{name:"王五",orderCount:128,income:48900,completionRate:96.8,rating:4.6,mainTask:"巡检任务"}]),y=p(null),b=p(null);let i=null,u=null;const N=()=>{if(y.value){i=B(y.value);const n=Array.from({length:7},(e,v)=>{const h=new Date;return h.setDate(h.getDate()-v),h.toLocaleDateString()}).reverse();i.setOption({tooltip:{trigger:"axis"},xAxis:{type:"category",data:n},yAxis:{type:"value"},series:[{name:"接单数",type:"line",smooth:!0,data:[42,45,38,50,42,48,45]}]})}b.value&&(u=B(b.value),u.setOption({tooltip:{trigger:"item",formatter:"{b}: {c}单 ({d}%)"},legend:{orient:"vertical",left:"left"},series:[{type:"pie",radius:"50%",data:[{value:580,name:"航拍任务"},{value:420,name:"测绘任务"},{value:256,name:"巡检任务"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}))},U=()=>{try{const n=R.book_new(),e=R.json_to_sheet(O.value);R.book_append_sheet(n,e,"飞手接单统计");const v=Q(n,{bookType:"xlsx",type:"array"});W.saveAs(new Blob([v],{type:"application/octet-stream"}),"飞手接单统计.xlsx"),M.success("导出成功")}catch{M.error("导出失败")}},I=()=>{S()},S=()=>{N()};H(()=>{S(),window.addEventListener("resize",T)}),J(()=>{window.removeEventListener("resize",T),i&&i.dispose(),u&&u.dispose()});const T=()=>{i&&i.resize(),u&&u.resize()};return(n,e)=>{const v=s("el-date-picker"),h=s("el-icon"),L=s("el-button"),r=s("el-card"),c=s("el-col"),z=s("el-row"),k=s("el-radio-button"),F=s("el-radio-group"),d=s("el-table-column"),j=s("el-rate"),X=s("el-table");return g(),K("div",Y,[o("div",Z,[e[3]||(e[3]=o("h2",null,"飞手接单统计",-1)),o("div",$,[a(v,{modelValue:V.value,"onUpdate:modelValue":e[0]||(e[0]=l=>V.value=l),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:E,onChange:I},null,8,["modelValue"]),a(L,{type:"primary",onClick:U},{default:t(()=>[a(h,null,{default:t(()=>[a(x(P))]),_:1}),e[2]||(e[2]=m("导出数据 "))]),_:1})])]),a(z,{gutter:20,class:"statistics-cards"},{default:t(()=>[a(c,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[4]||(e[4]=[o("div",{class:"card-header"},[o("span",null,"总接单数")],-1)])),default:t(()=>[o("div",ee,_(w.value.totalOrders),1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[5]||(e[5]=[o("div",{class:"card-header"},[o("span",null,"完成率")],-1)])),default:t(()=>[o("div",te,_(w.value.completionRate)+"%",1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[6]||(e[6]=[o("div",{class:"card-header"},[o("span",null,"平均时长")],-1)])),default:t(()=>[o("div",ae,_(w.value.averageDuration)+"h",1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(r,{shadow:"hover"},{header:t(()=>e[7]||(e[7]=[o("div",{class:"card-header"},[o("span",null,"总收入")],-1)])),default:t(()=>[o("div",oe,"¥"+_(x(A)(w.value.totalIncome)),1)]),_:1})]),_:1})]),_:1}),a(z,{gutter:20,class:"chart-row"},{default:t(()=>[a(c,{span:12},{default:t(()=>[a(r,{class:"chart-card"},{header:t(()=>e[8]||(e[8]=[o("div",{class:"card-header"},[o("span",null,"接单趋势")],-1)])),default:t(()=>[o("div",{ref_key:"trendChartRef",ref:y,class:"chart"},null,512)]),_:1})]),_:1}),a(c,{span:12},{default:t(()=>[a(r,{class:"chart-card"},{header:t(()=>e[9]||(e[9]=[o("div",{class:"card-header"},[o("span",null,"任务类型分布")],-1)])),default:t(()=>[o("div",{ref_key:"typeChartRef",ref:b,class:"chart"},null,512)]),_:1})]),_:1})]),_:1}),a(r,{class:"ranking-card"},{header:t(()=>[o("div",ne,[e[13]||(e[13]=o("span",null,"飞手排行榜",-1)),a(F,{modelValue:f.value,"onUpdate:modelValue":e[1]||(e[1]=l=>f.value=l),size:"small"},{default:t(()=>[a(k,{label:"orders"},{default:t(()=>e[10]||(e[10]=[m("接单数")])),_:1}),a(k,{label:"income"},{default:t(()=>e[11]||(e[11]=[m("收入")])),_:1}),a(k,{label:"completion"},{default:t(()=>e[12]||(e[12]=[m("完成率")])),_:1})]),_:1},8,["modelValue"])])]),default:t(()=>[a(X,{data:O.value,style:{width:"100%"}},{default:t(()=>[a(d,{type:"index",label:"排名",width:"80"}),a(d,{prop:"name",label:"飞手姓名",width:"120"}),f.value==="orders"?(g(),C(d,{key:0,prop:"orderCount",label:"接单数",width:"120"})):D("",!0),f.value==="income"?(g(),C(d,{key:1,prop:"income",label:"收入",width:"150"},{default:t(({row:l})=>[m(" ¥"+_(x(A)(l.income)),1)]),_:1})):D("",!0),f.value==="completion"?(g(),C(d,{key:2,prop:"completionRate",label:"完成率",width:"120"},{default:t(({row:l})=>[m(_(l.completionRate)+"% ",1)]),_:1})):D("",!0),a(d,{prop:"rating",label:"评分",width:"120"},{default:t(({row:l})=>[a(j,{modelValue:l.rating,"onUpdate:modelValue":q=>l.rating=q,disabled:"","show-score":"","text-color":"#ff9900"},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),a(d,{prop:"mainTask",label:"主要任务类型"})]),_:1},8,["data"])]),_:1})])}}},ce=G(se,[["__scopeId","data-v-848c19ff"]]);export{ce as default};
