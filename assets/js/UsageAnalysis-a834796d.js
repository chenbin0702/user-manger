import{_ as q,r as f,v as L,N,a as o,o as O,c as T,e as s,b as a,w as t,p as R,u as F,M as j,f as w,t as d,O as U}from"./index-58786321.js";import"./index-17409aec.js";import{u as b,w as I,F as X}from"./xlsx-01326c6b.js";const G={class:"usage-analysis"},H={class:"header"},J={class:"actions"},K={class:"card-content"},P={class:"card-content"},Q={class:"card-content"},W={class:"card-content"},Y={__name:"UsageAnalysis",setup(Z){const x=f([]),E=[{text:"最近一周",value:()=>{const n=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*7),[e,n]}},{text:"最近一月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-1),[e,n]}},{text:"最近三月",value:()=>{const n=new Date,e=new Date;return e.setMonth(e.getMonth()-3),[e,n]}}],h=f({averageUsage:75.8,peakUsage:95.2,totalEquipment:156,inUseEquipment:128}),g=f([{type:"多旋翼无人机",totalCount:80,usageRate:85.5,avgDuration:"5.8小时/天",trend:12.5,description:"主要用于航拍任务"},{type:"固定翼无人机",totalCount:45,usageRate:72.3,avgDuration:"4.2小时/天",trend:8.3,description:"主要用于测绘任务"},{type:"垂直起降无人机",totalCount:31,usageRate:68.9,avgDuration:"3.9小时/天",trend:-3.2,description:"主要用于巡检任务"}]),m=f(null),y=f(null);let i=null,u=null;const A=()=>{if(m.value){i=U(m.value);const n=Array.from({length:7},(e,_)=>{const v=new Date;return v.setDate(v.getDate()-_),v.toLocaleDateString()}).reverse();i.setOption({tooltip:{trigger:"axis"},xAxis:{type:"category",data:n},yAxis:{type:"value",axisLabel:{formatter:"{value}%"}},series:[{name:"使用率",type:"line",smooth:!0,data:[65,70,75,82,78,85,80]}]})}y.value&&(u=U(y.value),u.setOption({tooltip:{trigger:"item",formatter:"{b}: {c}%"},legend:{orient:"vertical",left:"left"},series:[{type:"pie",radius:"50%",data:g.value.map(n=>({name:n.type,value:n.usageRate})),emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]}))},M=()=>{try{const n=b.book_new(),e=b.json_to_sheet(g.value);b.book_append_sheet(n,e,"设备使用率分析");const _=I(n,{bookType:"xlsx",type:"array"});X.saveAs(new Blob([_],{type:"application/octet-stream"}),"设备使用率分析.xlsx"),R.success("导出成功")}catch{R.error("导出失败")}},S=()=>{D()},D=()=>{A()};L(()=>{D(),window.addEventListener("resize",C)}),N(()=>{window.removeEventListener("resize",C),i&&i.dispose(),u&&u.dispose()});const C=()=>{i&&i.resize(),u&&u.resize()};return(n,e)=>{const _=o("el-date-picker"),v=o("el-icon"),V=o("el-button"),l=o("el-card"),c=o("el-col"),k=o("el-row"),p=o("el-table-column"),z=o("el-tag"),B=o("el-table");return O(),T("div",G,[s("div",H,[e[2]||(e[2]=s("h2",null,"设备使用率分析",-1)),s("div",J,[a(_,{modelValue:x.value,"onUpdate:modelValue":e[0]||(e[0]=r=>x.value=r),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:E,onChange:S},null,8,["modelValue"]),a(V,{type:"primary",onClick:M},{default:t(()=>[a(v,null,{default:t(()=>[a(F(j))]),_:1}),e[1]||(e[1]=w("导出数据 "))]),_:1})])]),a(k,{gutter:20,class:"statistics-cards"},{default:t(()=>[a(c,{span:6},{default:t(()=>[a(l,{shadow:"hover"},{header:t(()=>e[3]||(e[3]=[s("div",{class:"card-header"},[s("span",null,"平均使用率")],-1)])),default:t(()=>[s("div",K,d(h.value.averageUsage)+"%",1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(l,{shadow:"hover"},{header:t(()=>e[4]||(e[4]=[s("div",{class:"card-header"},[s("span",null,"高峰使用率")],-1)])),default:t(()=>[s("div",P,d(h.value.peakUsage)+"%",1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(l,{shadow:"hover"},{header:t(()=>e[5]||(e[5]=[s("div",{class:"card-header"},[s("span",null,"设备总数")],-1)])),default:t(()=>[s("div",Q,d(h.value.totalEquipment),1)]),_:1})]),_:1}),a(c,{span:6},{default:t(()=>[a(l,{shadow:"hover"},{header:t(()=>e[6]||(e[6]=[s("div",{class:"card-header"},[s("span",null,"在用设备")],-1)])),default:t(()=>[s("div",W,d(h.value.inUseEquipment),1)]),_:1})]),_:1})]),_:1}),a(k,{gutter:20,class:"chart-row"},{default:t(()=>[a(c,{span:12},{default:t(()=>[a(l,{class:"chart-card"},{header:t(()=>e[7]||(e[7]=[s("div",{class:"card-header"},[s("span",null,"使用率趋势")],-1)])),default:t(()=>[s("div",{ref_key:"trendChartRef",ref:m,class:"chart"},null,512)]),_:1})]),_:1}),a(c,{span:12},{default:t(()=>[a(l,{class:"chart-card"},{header:t(()=>e[8]||(e[8]=[s("div",{class:"card-header"},[s("span",null,"设备类型使用率")],-1)])),default:t(()=>[s("div",{ref_key:"typeChartRef",ref:y,class:"chart"},null,512)]),_:1})]),_:1})]),_:1}),a(l,{class:"details-card"},{header:t(()=>e[9]||(e[9]=[s("div",{class:"card-header"},[s("span",null,"设备使用率详情")],-1)])),default:t(()=>[a(B,{data:g.value,style:{width:"100%"}},{default:t(()=>[a(p,{prop:"type",label:"设备类型",width:"150"}),a(p,{prop:"totalCount",label:"设备数量",width:"120"}),a(p,{prop:"usageRate",label:"使用率",width:"120"},{default:t(({row:r})=>[w(d(r.usageRate)+"% ",1)]),_:1}),a(p,{prop:"avgDuration",label:"平均使用时长",width:"150"}),a(p,{prop:"trend",label:"趋势",width:"150"},{default:t(({row:r})=>[a(z,{type:r.trend>=0?"success":"danger"},{default:t(()=>[w(d(r.trend>=0?"+":"")+d(r.trend)+"% ",1)]),_:2},1032,["type"])]),_:1}),a(p,{prop:"description",label:"说明"})]),_:1},8,["data"])]),_:1})])}}},ae=q(Y,[["__scopeId","data-v-1f65a764"]]);export{ae as default};
