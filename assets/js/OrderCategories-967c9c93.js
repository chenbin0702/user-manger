import{_ as L,r as f,v as N,N as Y,a as n,o as w,c as O,e as t,b as s,w as a,p as B,u as v,M as T,f as h,F as U,d as j,t as r,O as R,g as I}from"./index-58786321.js";import"./index-17409aec.js";import{u as x,w as X,F as q}from"./xlsx-01326c6b.js";import{f as C}from"./format-44ea9176.js";const G={class:"order-categories"},H={class:"header"},J={class:"actions"},K={class:"card-header"},P={class:"card-content"},Q={class:"stat-item"},W={class:"value"},Z={class:"stat-item"},$={class:"value"},ee={class:"stat-item"},te={class:"value"},ae={__name:"OrderCategories",setup(se){const k=f([]),d=f([{type:"航拍任务",count:156,amount:78e3,percentage:35},{type:"测绘任务",count:89,amount:53400,percentage:25},{type:"巡检任务",count:67,amount:40200,percentage:20},{type:"其他任务",count:45,amount:27e3,percentage:20}]),g=f(null),y=f(null);let c=null,p=null;const S=()=>{if(g.value&&(c=R(g.value),c.setOption({tooltip:{trigger:"item",formatter:"{b}: {c} ({d}%)"},legend:{orient:"vertical",left:"left"},series:[{type:"pie",radius:"50%",data:d.value.map(l=>({name:l.type,value:l.count})),emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})),y.value){p=R(y.value);const l=Array.from({length:7},(e,i)=>{const u=new Date;return u.setDate(u.getDate()-i),u.toLocaleDateString()}).reverse();p.setOption({tooltip:{trigger:"axis"},legend:{data:d.value.map(e=>e.type)},xAxis:{type:"category",data:l},yAxis:{type:"value"},series:d.value.map(e=>({name:e.type,type:"line",smooth:!0,data:Array.from({length:7},()=>Math.floor(Math.random()*50))}))})}},V=()=>{D()},z=()=>{try{const l=x.book_new(),e=x.json_to_sheet(d.value);x.book_append_sheet(l,e,"订单分类统计");const i=X(l,{bookType:"xlsx",type:"array"});q.saveAs(new Blob([i],{type:"application/octet-stream"}),"订单分类统计.xlsx"),B.success("导出成功")}catch{B.error("导出失败")}},D=()=>{S()};N(()=>{D(),window.addEventListener("resize",A)}),Y(()=>{window.removeEventListener("resize",A),c&&c.dispose(),p&&p.dispose()});const A=()=>{c&&c.resize(),p&&p.resize()};return(l,e)=>{const i=n("el-date-picker"),u=n("el-icon"),E=n("el-button"),m=n("el-card"),b=n("el-col"),M=n("el-row"),_=n("el-table-column"),F=n("el-table");return w(),O("div",G,[t("div",H,[e[2]||(e[2]=t("h2",null,"订单分类统计",-1)),t("div",J,[s(i,{modelValue:k.value,"onUpdate:modelValue":e[0]||(e[0]=o=>k.value=o),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"YYYY-MM-DD",onChange:V},null,8,["modelValue"]),s(E,{type:"primary",onClick:z},{default:a(()=>[s(u,null,{default:a(()=>[s(v(T))]),_:1}),e[1]||(e[1]=h("导出数据 "))]),_:1})])]),s(M,{gutter:20,class:"statistics-cards"},{default:a(()=>[(w(!0),O(U,null,j(d.value,o=>(w(),I(b,{span:6,key:o.type},{default:a(()=>[s(m,{shadow:"hover"},{header:a(()=>[t("div",K,[t("span",null,r(o.type),1)])]),default:a(()=>[t("div",P,[t("div",Q,[e[3]||(e[3]=t("span",{class:"label"},"订单数量",-1)),t("span",W,r(o.count),1)]),t("div",Z,[e[4]||(e[4]=t("span",{class:"label"},"订单金额",-1)),t("span",$,"¥"+r(v(C)(o.amount)),1)]),t("div",ee,[e[5]||(e[5]=t("span",{class:"label"},"占比",-1)),t("span",te,r(o.percentage)+"%",1)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),s(M,{gutter:20,class:"chart-row"},{default:a(()=>[s(b,{span:12},{default:a(()=>[s(m,{class:"chart-card"},{header:a(()=>e[6]||(e[6]=[t("div",{class:"card-header"},[t("span",null,"订单类型分布")],-1)])),default:a(()=>[t("div",{ref_key:"pieChartRef",ref:g,class:"chart"},null,512)]),_:1})]),_:1}),s(b,{span:12},{default:a(()=>[s(m,{class:"chart-card"},{header:a(()=>e[7]||(e[7]=[t("div",{class:"card-header"},[t("span",null,"订单趋势")],-1)])),default:a(()=>[t("div",{ref_key:"lineChartRef",ref:y,class:"chart"},null,512)]),_:1})]),_:1})]),_:1}),s(m,{class:"table-card"},{header:a(()=>e[8]||(e[8]=[t("div",{class:"card-header"},[t("span",null,"分类详细数据")],-1)])),default:a(()=>[s(F,{data:d.value,style:{width:"100%"}},{default:a(()=>[s(_,{prop:"type",label:"订单类型"}),s(_,{prop:"count",label:"订单数量"}),s(_,{prop:"amount",label:"订单金额"},{default:a(({row:o})=>[h(" ¥"+r(v(C)(o.amount)),1)]),_:1}),s(_,{prop:"percentage",label:"占比"},{default:a(({row:o})=>[h(r(o.percentage)+"% ",1)]),_:1}),s(_,{prop:"avgAmount",label:"平均金额"},{default:a(({row:o})=>[h(" ¥"+r(v(C)(o.amount/o.count)),1)]),_:1})]),_:1},8,["data"])]),_:1})])}}},de=L(ae,[["__scopeId","data-v-4a16d7a1"]]);export{de as default};
