import{_ as ae,r as p,v as oe,a as n,o as g,c as se,e as r,b as e,w as t,u as h,s as ne,f as s,t as u,g as N,z as x,p as F,q as re}from"./index-58786321.js";import{f as B}from"./format-44ea9176.js";const ue={class:"certificate-orders"},de={class:"header"},ie={class:"actions"},pe={class:"card-content"},ce={class:"card-content"},me={class:"card-content"},_e={class:"card-content"},fe={class:"dialog-footer"},ve={__name:"CertificateOrders",setup(ge){const b=p({keyword:"",status:""}),y=p(1),z=p(10),P=p(0),V=p({totalOrders:1256,totalAmount:298600,monthlyOrders:156,completionRate:85}),A=p([{orderNo:"CER20240120001",certificateType:"无人机驾驶员合格证",studentName:"张三",phone:"13800138000",amount:1999,examDate:"2024-02-15",status:"待支付",createTime:"2024-01-20 10:00:00"},{orderNo:"CER20240120002",certificateType:"无人机维修资质证",studentName:"李四",phone:"13900139000",amount:2999,examDate:"2024-02-20",status:"已支付",createTime:"2024-01-20 11:30:00"}]),v=p(!1),T=p(!1),d=p(null),U=p(null),m=p({result:"pass",certificateNo:"",remarks:""}),M={result:[{required:!0,message:"请选择处理结果",trigger:"change"}],certificateNo:[{required:!0,message:"请输入证书编号",trigger:"blur"}],remarks:[{required:!0,message:"请输入备注",trigger:"blur"}]},D=i=>({待支付:"warning",已支付:"primary",已完成:"success",已取消:"info"})[i]||"info",I=()=>{y.value=1},j=i=>{d.value=i,m.value={result:"pass",certificateNo:"",remarks:""},v.value=!0},G=async()=>{U.value&&await U.value.validate(i=>{i&&(F.success("处理成功"),v.value=!1)})},H=i=>{d.value=i,T.value=!0},J=i=>{re.confirm(`确定要取消订单 ${i.orderNo} 吗？`,"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{F.success("订单已取消")})},K=i=>{z.value=i},L=i=>{y.value=i};return oe(()=>{}),(i,l)=>{const Q=n("el-icon"),O=n("el-input"),k=n("el-option"),W=n("el-select"),f=n("el-button"),w=n("el-card"),C=n("el-col"),X=n("el-row"),_=n("el-table-column"),R=n("el-tag"),Y=n("el-table"),Z=n("el-pagination"),E=n("el-radio"),ee=n("el-radio-group"),S=n("el-form-item"),te=n("el-form"),$=n("el-dialog"),c=n("el-descriptions-item"),le=n("el-descriptions");return g(),se("div",ue,[r("div",de,[l[11]||(l[11]=r("h2",null,"考证订单管理",-1)),r("div",ie,[e(O,{modelValue:b.value.keyword,"onUpdate:modelValue":l[0]||(l[0]=a=>b.value.keyword=a),placeholder:"搜索订单号/学员姓名",clearable:"",class:"search-input"},{prefix:t(()=>[e(Q,null,{default:t(()=>[e(h(ne))]),_:1})]),_:1},8,["modelValue"]),e(W,{modelValue:b.value.status,"onUpdate:modelValue":l[1]||(l[1]=a=>b.value.status=a),placeholder:"订单状态",clearable:""},{default:t(()=>[e(k,{label:"待支付",value:"待支付"}),e(k,{label:"已支付",value:"已支付"}),e(k,{label:"已完成",value:"已完成"}),e(k,{label:"已取消",value:"已取消"})]),_:1},8,["modelValue"]),e(f,{type:"primary",onClick:I},{default:t(()=>l[10]||(l[10]=[s("搜索")])),_:1})])]),e(X,{gutter:20,class:"statistics-cards"},{default:t(()=>[e(C,{span:6},{default:t(()=>[e(w,{shadow:"hover"},{header:t(()=>l[12]||(l[12]=[r("div",{class:"card-header"},[r("span",null,"总订单数")],-1)])),default:t(()=>[r("div",pe,u(V.value.totalOrders),1)]),_:1})]),_:1}),e(C,{span:6},{default:t(()=>[e(w,{shadow:"hover"},{header:t(()=>l[13]||(l[13]=[r("div",{class:"card-header"},[r("span",null,"总金额")],-1)])),default:t(()=>[r("div",ce,"¥"+u(h(B)(V.value.totalAmount)),1)]),_:1})]),_:1}),e(C,{span:6},{default:t(()=>[e(w,{shadow:"hover"},{header:t(()=>l[14]||(l[14]=[r("div",{class:"card-header"},[r("span",null,"本月订单")],-1)])),default:t(()=>[r("div",me,u(V.value.monthlyOrders),1)]),_:1})]),_:1}),e(C,{span:6},{default:t(()=>[e(w,{shadow:"hover"},{header:t(()=>l[15]||(l[15]=[r("div",{class:"card-header"},[r("span",null,"完成率")],-1)])),default:t(()=>[r("div",_e,u(V.value.completionRate)+"%",1)]),_:1})]),_:1})]),_:1}),e(Y,{data:A.value,style:{width:"100%"}},{default:t(()=>[e(_,{prop:"orderNo",label:"订单编号",width:"120"}),e(_,{prop:"certificateType",label:"证书类型",width:"150"}),e(_,{prop:"studentName",label:"学员姓名",width:"120"}),e(_,{prop:"phone",label:"联系电话",width:"120"}),e(_,{prop:"amount",label:"订单金额",width:"120"},{default:t(({row:a})=>[s(" ¥"+u(h(B)(a.amount)),1)]),_:1}),e(_,{prop:"examDate",label:"考试日期",width:"120"}),e(_,{prop:"status",label:"状态",width:"100"},{default:t(({row:a})=>[e(R,{type:D(a.status)},{default:t(()=>[s(u(a.status),1)]),_:2},1032,["type"])]),_:1}),e(_,{prop:"createTime",label:"创建时间",width:"180"}),e(_,{label:"操作",width:"200",fixed:"right"},{default:t(({row:a})=>[a.status==="已支付"?(g(),N(f,{key:0,size:"small",type:"primary",onClick:o=>j(a)},{default:t(()=>l[16]||(l[16]=[s(" 处理 ")])),_:2},1032,["onClick"])):x("",!0),e(f,{size:"small",onClick:o=>H(a)},{default:t(()=>l[17]||(l[17]=[s("查看")])),_:2},1032,["onClick"]),a.status==="待支付"?(g(),N(f,{key:1,size:"small",type:"danger",onClick:o=>J(a)},{default:t(()=>l[18]||(l[18]=[s(" 取消 ")])),_:2},1032,["onClick"])):x("",!0)]),_:1})]),_:1},8,["data"]),e(Z,{"current-page":y.value,"onUpdate:currentPage":l[2]||(l[2]=a=>y.value=a),"page-size":z.value,"onUpdate:pageSize":l[3]||(l[3]=a=>z.value=a),total:P.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",class:"pagination",onSizeChange:K,onCurrentChange:L},null,8,["current-page","page-size","total"]),e($,{modelValue:v.value,"onUpdate:modelValue":l[8]||(l[8]=a=>v.value=a),title:"处理考证订单",width:"500px"},{footer:t(()=>[r("span",fe,[e(f,{onClick:l[7]||(l[7]=a=>v.value=!1)},{default:t(()=>l[21]||(l[21]=[s("取消")])),_:1}),e(f,{type:"primary",onClick:G},{default:t(()=>l[22]||(l[22]=[s("确定")])),_:1})])]),default:t(()=>[e(te,{ref_key:"processFormRef",ref:U,model:m.value,rules:M,"label-width":"100px"},{default:t(()=>[e(S,{label:"处理结果",prop:"result"},{default:t(()=>[e(ee,{modelValue:m.value.result,"onUpdate:modelValue":l[4]||(l[4]=a=>m.value.result=a)},{default:t(()=>[e(E,{label:"pass"},{default:t(()=>l[19]||(l[19]=[s("通过")])),_:1}),e(E,{label:"fail"},{default:t(()=>l[20]||(l[20]=[s("不通过")])),_:1})]),_:1},8,["modelValue"])]),_:1}),m.value.result==="pass"?(g(),N(S,{key:0,label:"证书编号",prop:"certificateNo"},{default:t(()=>[e(O,{modelValue:m.value.certificateNo,"onUpdate:modelValue":l[5]||(l[5]=a=>m.value.certificateNo=a)},null,8,["modelValue"])]),_:1})):x("",!0),e(S,{label:"备注",prop:"remarks"},{default:t(()=>[e(O,{modelValue:m.value.remarks,"onUpdate:modelValue":l[6]||(l[6]=a=>m.value.remarks=a),type:"textarea",rows:3},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),e($,{modelValue:T.value,"onUpdate:modelValue":l[9]||(l[9]=a=>T.value=a),title:"订单详情",width:"600px"},{default:t(()=>[e(le,{column:2,border:""},{default:t(()=>{var a;return[e(c,{label:"订单编号"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.orderNo),1)]}),_:1}),e(c,{label:"证书类型"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.certificateType),1)]}),_:1}),e(c,{label:"学员姓名"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.studentName),1)]}),_:1}),e(c,{label:"联系电话"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.phone),1)]}),_:1}),e(c,{label:"订单金额"},{default:t(()=>{var o;return[s("¥"+u(h(B)((o=d.value)==null?void 0:o.amount)),1)]}),_:1}),e(c,{label:"考试日期"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.examDate),1)]}),_:1}),e(c,{label:"订单状态"},{default:t(()=>{var o;return[e(R,{type:D((o=d.value)==null?void 0:o.status)},{default:t(()=>{var q;return[s(u((q=d.value)==null?void 0:q.status),1)]}),_:1},8,["type"])]}),_:1}),e(c,{label:"创建时间"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.createTime),1)]}),_:1}),(a=d.value)!=null&&a.certificateNo?(g(),N(c,{key:0,label:"证书编号"},{default:t(()=>{var o;return[s(u((o=d.value)==null?void 0:o.certificateNo),1)]}),_:1})):x("",!0),e(c,{label:"备注",span:2},{default:t(()=>{var o;return[s(u(((o=d.value)==null?void 0:o.remarks)||"无"),1)]}),_:1})]}),_:1})]),_:1},8,["modelValue"])])}}},Ve=ae(ve,[["__scopeId","data-v-3dd3028b"]]);export{Ve as default};
