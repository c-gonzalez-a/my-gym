/* Mi Gym 2.1 — vanilla JavaScript, no account, no server. */
'use strict';
const KEY='migym-v2', LEGACY_KEY='gymapp1', D=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const BF=['cintura','cadera','brazo','pierna','pecho'], CAP=3;
const $=sel=>document.querySelector(sel);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=(date=new Date())=>date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
const localDate=s=>new Date(s+'T12:00:00');
const shiftDay=(s,n)=>{const d=localDate(s);d.setDate(d.getDate()+n);return iso(d)};
const daysBetween=(a,b)=>Math.round((localDate(b)-localDate(a))/86400000);
const asNumber=x=>{if(x===null||x===undefined||String(x).trim()==='')return null;const n=Number(String(x).replace('½','.5').replace(',','.').trim());return Number.isFinite(n)?n:null};
const exerciseWeight=x=>{const m=String(x??'').replace('½','.5').replace(',','.').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):null};
const fmt=(x,d=0)=>Number.isFinite(x)?new Intl.NumberFormat('es-AR',{maximumFractionDigits:d}).format(x):'—';
const validDate=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&iso(localDate(x))===x;
const eNum=x=>Math.round((x+Number.EPSILON)*100)/100;
const uid=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2,9);
const maybe=(x,label='Sin datos')=>Number.isFinite(x)?fmt(x,1):label;
const pad=n=>String(n).padStart(2,'0');
const formatDuration=ms=>{const total=Math.max(0,Math.floor((ms||0)/1000));const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;return (h?pad(h)+':':'')+pad(m)+':'+pad(s)};

function seed(){let n=0;const ex=[],rt=[];
 const E=(name,m,u,w,r)=>{const id=++n;ex.push({id,name,ms:[].concat(m),u,note:'',s:w.map((x,i)=>({w:x,r:r[i]??r[0]}))});return id};
 const R=(id,name,day,ids,opt=[],need=ids.length)=>rt.push({id,name,day,need,items:ids.map(e=>({e,opt:opt.includes(e)}))});
 R(51,'Brazos, pecho y core',2,[E('Tríceps en polea','tríceps','kg',['23','23','23'],['10']),E('Vuelos laterales','hombro','kg',['3','4','6'],['10','10','8']),E('Bíceps 21','bíceps','kg',['10','12½','12½'],['21']),E('Pecho en barra','pecho','intensidad',['7','8','9'],['10']),E('Abdominales a 45° con disco 5kg','core','kg',['5','5','5'],['12'])]);
 R(52,'Glúteo y femoral',1,[E('Step ups en hack','glúteo','kg',['Sp','7½','7½','7½'],['10','10','10','12']),E('Peso muerto rumano con barra','femoral','kg',['30','30','30'],['10']),E('Abductor en máquina','glúteo','kg',['25','30','35','40'],['10']),E('Sentadilla en hack (kg totales)',['cuádriceps','glúteo'],'kg',['10','20','20','20'],['10'])]);
 R(53,'Espalda y core',6,[E('Jalón cerrado en polea','espalda','kg',['25','30','35','40'],['12']),E('Remo con apoyo','espalda','kg',['30','30','30'],['12']),E('Pull over con barra en polea','espalda','kg',['30','35','35'],['10','10','7']),E('Hiperextensiones','espalda baja','kg',['5','5','5'],['10']),E('Abs a 45°','core','kg',['0'],['14'])]);
 const c=E('Algo para el costado','glúteo','kg',['0'],['10']);
 R(54,'Glúteo y cuádriceps',5,[E('Prensa de piernas pies altos','cuádriceps','kg',['90','110','110','110'],['10','10','10','fallo']),E('Búlgara en smith','cuádriceps','kg',['10','10','15'],['8','8','fallo (7)']),E('Hip thrust máquina (10 – sostengo 10 – 10)','glúteo','kg',['15','20','25'],['10','10','fallo (10)']),E('Sillón de cuádriceps','cuádriceps','ladrillos',['4','5','6','dropset'],['12','10','8','7-5']),c,E('Patada de glúteo','glúteo','ladrillos',['3','3','4'],['12'])],[c]);
 return{ex,rt,hist:[],body:[],n:100}}
function seedChk(){return['Ir al gym','Tomar 2,5 litros de agua','No comer carbos simples','No comer azúcares agregados','No pasar el límite de kcal del día','Hacer todo el cardio del día'].map((t,i)=>({id:'c'+i,t}))}
function seedPlan(){const P=(max,...items)=>({max,items});return{0:P(1045,'Cardio y core en casa (~350 kcal)'),1:P(1225,'Cardio: salto de soga 22 min (40 s activos, 20 s pausa)','Gym: glúteo y femoral'),
 2:P(1350,'Gym a la tarde: brazos, pecho y core','Post gym: caminata de 30 min (~250 kcal)'),3:P(1045,'Salto de soga + cardio de YouTube (meta ~350 kcal en las sesiones de cardio en casa)'),
 4:P(1290,'Día libre, sin entrenamiento'),5:P(1130,'Ir caminando al gym','Gym: glúteo y cuádriceps'),6:P(1440,'Caminar al gym','Gym: espalda y core','Volver caminando a casa','Pileta 2 h')}}

/* ---------- Storage, migration and stages ---------- */
function normalFood(r,st){
 const n=x=>asNumber(x),k=n(r.kcal),burn=n(r.burn??r.gasto),p=n(r.p??r.prot),c=n(r.c??r.carb),g=n(r.g??r.grasa);
 return {d:r.d||r.fecha,stageId:r.stageId||st,kcal:k,p,c,g,burn:burn>0?burn:null,estimate:r.estimate!==false,notes:r.notes||''};
}
// Profile is independent from tracking stages and is always optional.
function normalizeProfile(raw){
 const r=raw&&typeof raw==='object'?raw:{};
 const heightCm=asNumber(r.heightCm);
 return {heightCm:heightCm!==null&&heightCm>=100&&heightCm<=230?heightCm:null,
  birthDate:validDate(r.birthDate)&&r.birthDate<=iso()?r.birthDate:'',
  formula:['female','male'].includes(r.formula)?r.formula:''};
}
function normalizeLegacy(raw){
 const defaults=seed(), s=raw&&typeof raw==='object'?raw:{};
 const oldEntries=[...(s.hist||[]),...(s.food||[]),...(s.body||[])].map(x=>x.d).filter(validDate).sort();
 const sid='stage-'+uid();const first=oldEntries[0]||iso();
 const oldBody=(s.body||[]).filter(x=>Number.isFinite(asNumber(x.kg))).sort((a,b)=>a.d.localeCompare(b.d));
 const initialWeight=oldBody.length?asNumber(oldBody[0].kg):null;
 const chkLog={};Object.entries(s.chkLog||{}).forEach(([d,values])=>{if(validDate(d))chkLog[sid+'|'+d]=values});
 const ex=Array.isArray(s.ex)?s.ex:defaults.ex;
 ex.forEach(x=>{if(!Array.isArray(x.ms))x.ms=[x.m||'otro'];if(!Array.isArray(x.s))x.s=[];x.note=x.note||'';x.u=x.u||'kg'});
 return {version:2,theme:'auto',profile:normalizeProfile(s.profile),ex,rt:Array.isArray(s.rt)?s.rt:defaults.rt,plan:s.plan||seedPlan(),chk:Array.isArray(s.chk)?s.chk:seedChk(),chkLog,
  n:Math.max(Number(s.n)||100,110),stages:[{id:sid,name:'Etapa inicial',start:first,archivedAt:null,baseWeight:initialWeight,checkpoints:[],targetNote:''}],activeId:sid,
  hist:(s.hist||[]).filter(x=>validDate(x.d)).map(x=>({...x,stageId:sid})),
  food:(s.food||[]).filter(x=>validDate(x.d)).map(x=>normalFood(x,sid)),
  body:(s.body||[]).filter(x=>validDate(x.d)).map(x=>({...x,stageId:sid})),prog:s.prog?{...s.prog,stageId:sid}:null};
}
function validateLoaded(obj){
 if(!obj||typeof obj!=='object')throw Error('El archivo no contiene datos válidos');
 if(obj.version===2){
  if(!Array.isArray(obj.stages)||!Array.isArray(obj.ex)||!Array.isArray(obj.rt)||!Array.isArray(obj.hist)||!Array.isArray(obj.food)||!Array.isArray(obj.body)||!Array.isArray(obj.chk)||!obj.stages.some(s=>s.id===obj.activeId))throw Error('El backup v2 está incompleto');
  return {...obj,profile:normalizeProfile(obj.profile),plan:obj.plan||seedPlan(),chkLog:obj.chkLog||{},prog:obj.prog||null,n:obj.n||100,theme:['auto','dark','light'].includes(obj.theme)?obj.theme:'auto'};
 }
 if(Array.isArray(obj.ex)&&Array.isArray(obj.rt))return normalizeLegacy(obj);
 throw Error('No es un backup de Mi Gym');
}
let STATE;
let storageOk=true;
try{
 const current=localStorage.getItem(KEY);
 const old=localStorage.getItem(LEGACY_KEY);
 STATE=current?validateLoaded(JSON.parse(current)):old?normalizeLegacy(JSON.parse(old)):normalizeLegacy({...seed(),plan:Object.fromEntries(Object.entries(seedPlan()).map(([day,p])=>[day,{...p,max:0}]))});
}catch(e){console.error('Error loading local data',e);STATE=normalizeLegacy({...seed(),plan:Object.fromEntries(Object.entries(seedPlan()).map(([day,p])=>[day,{...p,max:0}]))});storageOk=false}
const S=STATE;
const ui={page:'inicio',period:30,viewStage:null,calendarOffset:0,exerciseId:null,activityMonthOffset:0};
function persist(){
 try{localStorage.setItem(KEY,JSON.stringify(S));storageOk=true}
 catch(e){storageOk=false;console.error('No se pudieron guardar los datos',e);toast('No se pudieron guardar los datos: revisá el almacenamiento')}
}
function activeStage(){return S.stages.find(s=>s.id===S.activeId)||S.stages[0]}
function stage(){return S.stages.find(s=>s.id===(ui.viewStage||S.activeId))||activeStage()}
function editing(){return stage().id===S.activeId}
function rec(type){return (S[type]||[]).filter(r=>r.stageId===stage().id)}
function recActive(type){return (S[type]||[]).filter(r=>r.stageId===S.activeId)}
function byDay(type,d){return rec(type).filter(x=>x.d===d)}
function planOf(d){return S.plan[localDate(d).getDay()]||{items:[],max:0}}
function stageEnd(){return stage().archivedAt||iso()}
function validInputDate(s){return validDate(s)&&s<=iso()&&s>=activeStage().start}
function chkValues(d){return S.chkLog[stage().id+'|'+d]||{}}
function netData(){
 const f=rec('food');let total=0,complete=0;
 for(const r of f){if(r.kcal!==null&&r.kcal>0&&r.burn!==null&&r.burn>0){total+=r.burn-r.kcal;complete++}}
 return {total:Math.round(total),complete,logged:f.length,incomplete:f.length-complete};
}
function milestones(){
 const st=activeStage(), sum=recActive('food').reduce((acc,r)=>acc+(r.kcal>0&&r.burn>0?r.burn-r.kcal:0),0);
 const reached=Math.max(0,Math.floor((sum+1e-6)/7700));
 st.checkpoints=(st.checkpoints||[]).filter(c=>c.measuredKg!=null||c.number<=reached);
 const existing=new Set(st.checkpoints.map(c=>c.number));
 for(let i=1;i<=Math.min(reached,250);i++){
  if(!existing.has(i))st.checkpoints.push({id:uid(),number:i,targetNet:7700*i,dateReached:iso(),measuredKg:null,measurementDate:null});
 }
 return st.checkpoints.filter(c=>c.measuredKg==null);
}
function measureDue(){
 if(!editing())return false;
 const today=iso(), start=activeStage().start;
 const startPeriod=today.slice(0,8)+(Number(today.slice(8))>=15?'15':'01');
 const periodStart=start>startPeriod?start:startPeriod;
 return !rec('body').some(x=>x.kg!==null&&x.kg!==undefined&&x.d>=periodStart);
}
// The BMI needs only mass and height. The Mifflin-St Jeor estimate also
// requires adult age and an explicitly chosen reference coefficient.
function ageOn(birthDate,atDate){
 if(!validDate(birthDate)||!validDate(atDate))return null;
 const b=localDate(birthDate),now=localDate(atDate);
 let age=now.getFullYear()-b.getFullYear();
 if(now.getMonth()<b.getMonth()||(now.getMonth()===b.getMonth()&&now.getDate()<b.getDate()))age--;
 return age>=0&&age<=120?age:null;
}
function metabolicMetrics(){
 const profile=normalizeProfile(S.profile),weight=lastBody()?.kg??stage().baseWeight;
 const validWeight=Number.isFinite(weight)&&weight>=20&&weight<=500;
 const validHeight=Number.isFinite(profile.heightCm);
 const bmi=validWeight&&validHeight?weight/((profile.heightCm/100)**2):null;
 const age=ageOn(profile.birthDate,stageEnd());
 const tmb=validWeight&&validHeight&&age!==null&&age>=20&&profile.formula
  ?10*weight+6.25*profile.heightCm-5*age+(profile.formula==='male'?5:-161):null;
 const needsBMI=[...(!validWeight?['peso']:[]),...(!validHeight?['estatura']:[])];
 const needsTMB=[...needsBMI,...(!profile.birthDate?['fecha de nacimiento']:age===null?['edad válida para esta etapa']:age<20?['edad de 20 años o más']:[]),...(!profile.formula?['parámetro de fórmula']:[])];
 return {bmi,tmb,age,weight,needsBMI,needsTMB,profile,source:lastBody()?'Último pesaje':validWeight?'Peso inicial de la etapa':'Sin peso'};
}
function alertCount(){return (editing()&&milestones().length?1:0)+(measureDue()?1:0)}
function saveFood(obj){
 const d=String(obj.fecha||obj.d||iso());
 if(!validInputDate(d))throw Error('La fecha debe estar dentro de tu etapa actual y no puede ser futura');
 const n=k=>asNumber(obj[k]);
 const kcal=n('kcal'),burn=n('gasto')??n('burn'),p=n('prot')??n('p'),c=n('carb')??n('c'),g=n('grasa')??n('g');
 if(kcal===null||kcal<=0||kcal>20000)throw Error('Ingresá las kcal comidas (mayores que 0)');
 for(const [field,value] of [['gasto',burn],['proteínas',p],['carbohidratos',c],['grasas',g]])if(value!==null&&(value<0||value>30000))throw Error('Revisá el valor de '+field);
 const r={stageId:S.activeId,d,kcal,p,c,g,burn:burn>0?burn:null,estimate:true,notes:String(obj.notes||'').slice(0,300)};
 S.food=S.food.filter(x=>!(x.stageId===S.activeId&&x.d===d));S.food.push(r);S.food.sort((a,b)=>a.d.localeCompare(b.d));milestones();persist();return r;
}
function saveBody(d,kg,measurements){
 if(!validInputDate(d))throw Error('La fecha debe estar dentro de la etapa actual y no puede ser futura');
 if(kg!==null&&(kg<20||kg>500))throw Error('Revisá el peso ingresado');
 const hasMeasures=Object.keys(measurements).length>0;
 if(kg===null&&!hasMeasures)throw Error('Ingresá al menos un dato');
 S.body=S.body.filter(x=>!(x.stageId===S.activeId&&x.d===d));S.body.push({stageId:S.activeId,d,kg,m:measurements});
 S.body.sort((a,b)=>a.d.localeCompare(b.d));
 const st=activeStage();
 (st.checkpoints||[]).filter(c=>c.measurementDate===d).forEach(c=>{c.measuredKg=kg;c.measurementDate=kg===null?null:d});
 if(kg!==null){
  if((st.baseWeight===null||st.baseWeight===undefined)&&d===st.start&&!(st.checkpoints||[]).length)st.baseWeight=kg;
  (st.checkpoints||[]).filter(c=>c.measuredKg==null).forEach(c=>{c.measuredKg=kg;c.measurementDate=d});
 }
 persist();
}
function deleteRecord(type,d){
 if(!editing())return;
 S[type]=S[type].filter(x=>!(x.stageId===S.activeId&&x.d===d));
 if(type==='body'){(activeStage().checkpoints||[]).forEach(c=>{if(c.measurementDate===d){c.measuredKg=null;c.measurementDate=null}})}
 if(type==='food')milestones();
 persist();render();toast('Registro eliminado');
}
function escapeAttr(s){return escapeHtml(s)}
function progressBar(percent){return `<div class="progress"><i style="width:${Math.max(0,Math.min(100,percent)).toFixed(1)}%"></i></div>`}
function newStage(name,weight){
 const st=activeStage();st.archivedAt=iso();
 const next={id:'stage-'+uid(),name:name.trim()||'Nueva etapa',start:iso(),archivedAt:null,baseWeight:weight,checkpoints:[],targetNote:''};
 S.stages.push(next);S.activeId=next.id;S.prog=null;ui.viewStage=null;ui.page='inicio';ui.period=30;ui.calendarOffset=0;persist();render();toast('Nueva etapa creada. El historial quedó archivado.');
}
function toast(msg){const x=$('#toast');if(!x)return;x.textContent=msg;x.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>x.classList.remove('show'),3600)}
function exportBackup(){
 const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mi-gym-backup-'+iso()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function exportJSON(){exportBackup();toast('Se generó tu copia de seguridad')}
/* ---------- Calendars and time-correct SVG charts ---------- */
function rangeDates(n,end=stageEnd()){
 const start=shiftDay(end,-(n-1)),out=[];
 for(let i=0;i<n;i++)out.push(shiftDay(start,i));
 return out;
}
function activeDates(){
 const end=stageEnd();
 if(ui.period==='todo'){
  const all=[...rec('hist'),...rec('food'),...rec('body')].map(x=>x.d).filter(validDate).sort();
  const earliest=all[0]||stage().start;
  const dayCount=Math.max(1,daysBetween(earliest,end)+1);
  return rangeDates(Math.min(dayCount,730),end);
 }
 return rangeDates(ui.period,end);
}
function chartFrame(content,foot=''){
 return `<div class="chart-scroll"><svg class="spark-chart" viewBox="0 0 660 210" role="img" aria-label="Gráfico con eje temporal por días reales">${content}</svg></div>${foot?`<div class="no-data-note">${foot}</div>`:''}`;
}
function chartScaffold(dates){
 const n=dates.length,step=610/Math.max(1,n-1),labs=[];
 const tick=Math.max(1,Math.ceil(n/8));
 dates.forEach((day,i)=>{if(i%tick===0||i===n-1){const x=29+i*step;labs.push(`<text x="${x.toFixed(1)}" y="197" text-anchor="middle" fill="var(--muted)" font-size="10">${escapeHtml(day.slice(8))}/${escapeHtml(day.slice(5,7))}</text>`)}});
 return `<line x1="29" x2="639" y1="178" y2="178" stroke="var(--edge)"/>${labs.join('')}`;
}
function svgBalance(){
 const dates=activeDates(),by=new Map(rec('food').map(x=>[x.d,x])),values=dates.map(d=>by.get(d));
 const complete=values.map(v=>v&&v.kcal>0&&v.burn>0?v.burn-v.kcal:null),bound=Math.max(100,...complete.filter(Number.isFinite).map(Math.abs));
 const zero=97,H=73,step=610/Math.max(1,dates.length-1),width=Math.min(17,Math.max(2,step*.72)),bars=[];
 complete.forEach((v,i)=>{
  const x=29+i*step-width/2;
  if(v===null){bars.push(`<rect x="${x.toFixed(1)}" y="170" width="${width.toFixed(1)}" height="3" rx="1.5" fill="var(--edge)"/>`);return}
  const hh=Math.max(1,Math.abs(v)/bound*H),y=v>=0?zero-hh:zero;
  bars.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${hh.toFixed(1)}" rx="3" fill="${v>=0?'var(--accent)':'var(--blue)'}"><title>${escapeHtml(dates[i])}: ${fmt(Math.round(v))} kcal ${v>=0?'de déficit':'de superávit'}</title></rect>`);
 });
 return chartFrame(`<line x1="29" y1="${zero}" x2="639" y2="${zero}" stroke="var(--edge)" stroke-dasharray="4 4"/><text x="3" y="${zero-5}" fill="var(--muted)" font-size="9">0</text>${bars.join('')}${chartScaffold(dates)}`,'Cada posición es un día del calendario. Las rayas grises indican días sin balance completo.');
}
function svgFoodLines(){
 const dates=activeDates(),by=new Map(rec('food').map(x=>[x.d,x])),vals=dates.map(x=>by.get(x)||null);
 const biggest=Math.max(100,...vals.flatMap(v=>v?[v.kcal||0,v.burn||0]:[]));
 const step=610/Math.max(1,dates.length-1),toX=i=>29+i*step,toY=v=>171-v/biggest*150;
 let result='';
 for(const [key,color] of [['kcal','var(--accent)'],['burn','var(--blue)']]){
  for(let i=0;i<vals.length;i++){
   const a=vals[i]&&vals[i][key]>0?vals[i][key]:null;
   if(a===null)continue;
   if(i>0){const b=vals[i-1]&&vals[i-1][key]>0?vals[i-1][key]:null;
    if(b!==null)result+=`<line x1="${toX(i-1).toFixed(1)}" y1="${toY(b).toFixed(1)}" x2="${toX(i).toFixed(1)}" y2="${toY(a).toFixed(1)}" stroke="${color}" stroke-width="2.5"/>`;
   }
   result+=`<circle cx="${toX(i).toFixed(1)}" cy="${toY(a).toFixed(1)}" r="${dates.length>90?2:3.1}" fill="${color}"><title>${dates[i]}: ${fmt(a)} kcal ${key==='kcal'?'comidas':'gastadas (estimadas)'}</title></circle>`;
  }
 }
 return chartFrame(`<line x1="29" x2="639" y1="171" y2="171" stroke="var(--edge)"/>${result}${chartScaffold(dates)}`,'Las líneas se cortan cuando no hay registros; no se interpolan días ausentes.');
}
function svgMacroChart(){
 const dates=activeDates(),by=new Map(rec('food').map(x=>[x.d,x])),values=dates.map(d=>by.get(d)||null),series=[['p','Proteínas','var(--accent)'],['c','Carbos','var(--blue)'],['g','Grasas','var(--green)']];
 const known=values.flatMap(v=>v?series.map(s=>v[s[0]]).filter(Number.isFinite):[]);
 if(!known.length)return '<div class="nothing">Todavía no hay macros cargados para este período.</div>';
 const max=Math.max(30,...known),step=610/Math.max(1,dates.length-1),x=i=>29+i*step,y=v=>171-v/max*148;
 let paths='';
 for(const [field,name,color] of series){
  values.forEach((v,i)=>{
   if(!v||!Number.isFinite(v[field]))return;
   if(i&&values[i-1]&&Number.isFinite(values[i-1][field]))paths+=`<line x1="${x(i-1)}" y1="${y(values[i-1][field])}" x2="${x(i)}" y2="${y(v[field])}" stroke="${color}" stroke-width="2.5"/>`;
   paths+=`<circle cx="${x(i)}" cy="${y(v[field])}" r="${dates.length>90?2:3.1}" fill="${color}"><title>${dates[i]} · ${name}: ${fmt(v[field],1)} g</title></circle>`;
  });
 }
 return chartFrame(paths+chartScaffold(dates),'No se unen días separados sin anotaciones. Los macros no cargados no se interpretan como 0.');
}
function svgTimeSeries(items,extract,unit='kg'){
 const dates=activeDates(),start=dates[0],end=dates[dates.length-1],by=new Map();
 items.forEach(r=>{const v=extract(r);if(Number.isFinite(v)&&r.d>=start&&r.d<=end)by.set(r.d,v)});
 const data=[...by].sort((a,b)=>a[0].localeCompare(b[0]));
 if(!data.length)return `<div class="nothing">Aún no hay mediciones para este período.</div>`;
 const numbers=data.map(x=>x[1]),min=Math.min(...numbers),max=Math.max(...numbers),pad=Math.max((max-min)*.15,.4),lo=Math.max(0,min-pad),hi=max+pad;
 const y=v=>166-(v-lo)/(hi-lo)*135;
 const x=d=>29+(daysBetween(start,d)/Math.max(1,dates.length-1))*610;
 let p='';
 data.forEach(([d,v],i)=>{
  if(i){const [prev,pv]=data[i-1],gap=daysBetween(prev,d);
   // A long unmeasured interval is indicated with a dashed bridge, never a continuous observation.
   p+=`<line x1="${x(prev)}" y1="${y(pv)}" x2="${x(d)}" y2="${y(v)}" stroke="var(--accent)" stroke-width="2.5" ${gap>7?'stroke-dasharray="4 6" opacity=".5"':''}/>`;
  }
  p+=`<circle cx="${x(d)}" cy="${y(v)}" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="1.5"><title>${d}: ${fmt(v,2)} ${escapeHtml(unit)}</title></circle>`;
 });
 const markings=`<text x="10" y="31" fill="var(--muted)" font-size="10">${fmt(hi,1)}</text><text x="10" y="170" fill="var(--muted)" font-size="10">${fmt(lo,1)}</text>`;
 return chartFrame(markings+p+chartScaffold(dates),'Los tramos punteados separan mediciones con más de 7 días de diferencia.');
}
function calendar(monthOffset=ui.calendarOffset){
 const base=localDate(stageEnd());base.setDate(1);base.setMonth(base.getMonth()+monthOffset);
 const month=base.getMonth(),year=base.getFullYear(),firstDow=(base.getDay()+6)%7,
  days=new Date(year,month+1,0).getDate(),f=new Set(rec('food').map(x=>x.d)),h=new Set(rec('hist').map(x=>x.d)),b=new Set(rec('body').map(x=>x.d));
 let boxes=Array.from({length:firstDow},()=>'<div aria-hidden="true"></div>').join('');
 for(let i=1;i<=days;i++){
  const d=iso(new Date(year,month,i,12)),future=d>stageEnd()||d<stage().start,
   dots=`${f.has(d)?'<i class="dot food" title="Alimentación registrada"></i>':''}${h.has(d)?'<i class="dot gym" title="Gym registrado"></i>':''}${b.has(d)?'<i class="dot body" title="Peso o medidas registrados"></i>':''}`;
  boxes+=`<div class="day ${d===iso()?'today':''} ${future?'future':''}" title="${d}${!dots?' · Sin registros':''}"><span class="day-num">${i}</span><span class="dots">${dots}</span></div>`;
 }
 const title=base.toLocaleDateString('es-AR',{month:'long',year:'numeric'});
 return `<div class="card"><div class="card-title"><h2>Calendario de registros</h2><div class="btn-row"><button class="btn sm ghost" data-action="month-prev" aria-label="Mes anterior">‹</button><span class="pill neutral">${escapeHtml(title)}</span><button class="btn sm ghost" data-action="month-next" ${monthOffset>=0?'disabled':''} aria-label="Mes siguiente">›</button></div></div><div class="calendar-head">${['L','M','X','J','V','S','D'].map(a=>`<div>${a}</div>`).join('')}</div><div class="calendar">${boxes}</div><div class="calendar-legend"><span>🩷 Alimentación</span><span>🟣 Gym</span><span>🟢 Medidas</span><span>Sin puntos = sin registro</span></div></div>`;
}
function periodButtons(){return `<div class="btn-row">${[7,30,90,'todo'].map(n=>`<button class="choice ${ui.period===n?'active':''}" data-action="period" data-period="${n}">${n==='todo'?'Todo':n+' días'}</button>`).join('')}</div>`}
function coverageCount(type,dates=activeDates()){
 const logSet=new Set(rec(type).map(x=>x.d));return dates.filter(d=>d<=stageEnd()&&d>=stage().start&&logSet.has(d)).length;
}
function daysTracked(dates=activeDates()){return dates.filter(d=>d>=stage().start&&d<=stageEnd()).length}
/* ---------- Main screens ---------- */
const NAV=[['inicio','home','Inicio'],['gym','gym','Gym'],['alimentacion','food','Comidas'],['progreso','chart','Progreso'],['ajustes','settings','Ajustes']];
function navIcon(type){
 const paths={
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  gym:'<path d="M6 6v12M3 8v8M18 6v12M21 8v8M6 12h12"/>',
  food:'<path d="M4 3v6a4 4 0 0 0 8 0V3M8 3v18M18 3c3 4 3 9 0 12v6M15 15h3"/>',
  chart:'<path d="M3 3v18h18M6 16l5-5 4 3 6-8"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-1-.6-1.4.7-2.1-2.6-1.5-1.6 1.5h-1.8l-1.6-1.5-2.6 1.5.7 2.1-.6 1.4-2 1v3l2 1 .6 1.4-.7 2.1 2.6 1.5 1.6-1.5h1.8l1.6 1.5 2.6-1.5-.7-2.1.6-1.4z"/>'
 };
 return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]||paths.home}</svg>`;
}
function navHtml(mobile=false){
 return NAV.map(([id,icon,label])=>{const pending=id==='progreso'&&editing()&&alertCount()>0;return `<button class="${mobile?'':'nav-link '}${ui.page===id?'active':''}" data-action="nav" data-page="${id}" aria-label="${label}${pending?' (control pendiente)':''}"><span class="nav-icon">${navIcon(icon)}${pending?'<span class="nav-alert-dot" aria-hidden="true"></span>':''}</span><span>${label}</span></button>`}).join('');
}
function header(){const st=stage();return `<div class="topbar"><div><div class="eyebrow">MI GYM · PERSONAL</div><div class="row" style="margin-top:4px"><strong>Tu espacio, a tu ritmo</strong><span style="font-size:16px">💗</span></div></div><div class="topbar-right"><span class="pill neutral">${escapeHtml(st.name)}${!editing()?' · archivada':''}</span><button class="btn sm ghost" data-action="theme-cycle" title="Cambiar tema" aria-label="Cambiar tema">${S.theme==='light'?'☀️':S.theme==='dark'?'🌙':'◐'}</button></div></div>`}
function render(){
 document.documentElement.dataset.theme=S.theme||'auto';
 const screens={inicio:pageHome,gym:pageGym,alimentacion:pageFood,progreso:pageProgress,ajustes:pageSettings};
 const view=screens[ui.page]||pageHome;
 $('#app').innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand"><div class="brand-mark">🏋</div><div><div class="brand-name">Mi Gym</div><div class="brand-sub">TU PROGRESO</div></div></div><nav class="sidenav">${navHtml()}</nav><div class="sidebar-bottom"><div class="mini-status">🔒 Datos guardados en este dispositivo</div><div class="mini-status">${storageOk?'● Guardado local':'⚠ Error de almacenamiento'}</div></div></aside><div class="main">${header()}${!editing()?`<div class="alert warn" style="margin-bottom:18px"><div class="alert-ic">🗂</div><div class="grow"><h3>Estás consultando una etapa archivada</h3><p class="small muted">Podés ver el historial, pero no editarlo.</p></div><button class="btn sm" data-action="view-active">Volver a la actual</button></div>`:''}${view()}</div></div><div class="bottom-nav">${navHtml(true)}</div>`;
}
function sectionTitle(title,subtitle){return `<div class="page-heading"><div class="eyebrow">${escapeHtml(subtitle)}</div><h1>${escapeHtml(title)}</h1></div>`}
function pill(text,type='neutral'){return `<span class="pill ${type}">${escapeHtml(text)}</span>`}
function stat(label,value,unit='',sub=''){return `<div class="card"><div class="stat-label">${escapeHtml(label)}</div><div class="stat-value num">${value}<span class="stat-unit"> ${unit}</span></div>${sub?`<div class="stat-sub">${sub}</div>`:''}</div>`}
function promptAlerts(){
 if(!editing())return '';
 const due=measureDue(),pending=milestones();
 return `${pending.length?`<div class="alert warn"><div class="alert-ic">⚖️</div><div class="grow"><h3>¡Llegaste a un punto de control!</h3><p class="small muted">Acumulaste el equivalente energético teórico a ${fmt(pending[pending.length-1].number)} kg. Registrá un pesaje para comparar con tu evolución real.</p></div><button class="btn sm primary" data-action="body-add">Pesarme</button></div>`:''}
 ${due?`<div class="alert"><div class="alert-ic">📏</div><div class="grow"><h3>Control de peso y medidas</h3><p class="small muted">Tenés pendiente el control periódico de esta quincena.</p></div><button class="btn sm" data-action="body-add">Registrar</button></div>`:''}`;
}
function lastBody(){return rec('body').filter(x=>Number.isFinite(x.kg)).sort((a,b)=>b.d.localeCompare(a.d))[0]}
function pageHome(){
 const today=iso(),pl=planOf(today),todayFood=byDay('food',today)[0],week=rangeDates(7,stageEnd()),trained=new Set(rec('hist').map(x=>x.d)),nTrained=week.filter(d=>trained.has(d)).length;
 const {total,complete}=netData(),pending=editing()?milestones():[],towardNext=total>=0?total%7700:0,progress=pending.length?100:towardNext/7700*100,weight=lastBody();
 const plan=pl.items||[],todayList=editing()?`<div class="card"><div class="card-title"><div><h2>Tu plan de hoy</h2><div class="small muted">${escapeHtml(D[localDate(today).getDay()])} · ${escapeHtml(today)}</div></div><button class="btn sm ghost" data-action="plan-edit">Editar</button></div>${plan.length?`<div class="list-items">${plan.map(x=>`<div class="list-item"><span>✦</span><span>${escapeHtml(x)}</span></div>`).join('')}</div>`:'<p class="muted">Sin actividades planificadas para hoy.</p>'}${pl.max?`<div class="no-data-note">Referencia de kcal configurada: ${fmt(pl.max)} kcal. <strong>Revisá que sea adecuada para vos.</strong></div>`:''}</div>`:'';
 const checks=editing()?`<div class="card"><div class="card-title"><h2>Checklist de hoy</h2><button class="btn sm ghost" data-action="checklist-history">Ver constancia</button></div>${S.chk.map(c=>`<label class="checkline"><input type="checkbox" data-checkid="${escapeAttr(c.id)}" ${chkValues(today)[c.id]?'checked':''}><span>${escapeHtml(c.t)}</span></label>`).join('')||'<div class="nothing">Todavía no hay hábitos configurados.</div>'}<p class="small muted mt">No registrar un día no significa haber incumplido.</p></div>`:'';
 return `<div class="content"><div class="hero"><div><div class="eyebrow">${escapeHtml(new Date().toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'}))}</div><h1 style="margin-top:7px">Tu progreso,<br><span class="text-accent">paso a paso.</span></h1><p class="lead">Entrená, registrá y mirá cómo evolucionás. Sin presión por los días en blanco.</p><div class="hero-actions"><button class="btn primary" data-action="nav" data-page="gym">Ver mis rutinas</button><button class="btn" data-action="nav" data-page="alimentacion">Registrar comida</button></div></div><div class="hero-emoji">💗</div></div>${promptAlerts()}
 <div class="cards-3">${stat('Déficit neto',fmt(total),'kcal',`${complete} ${complete===1?'día completo':'días completos'} · dato estimado`)}${stat('Gym esta semana',fmt(nTrained),'/ 7 días','Solo días con ejercicios anotados')}${stat('Último peso',weight?fmt(weight.kg,1):'—','kg',weight?escapeHtml(weight.d):'Sin registros')}</div>
 <div class="card"><div class="card-title"><div><h2>Rumbo al próximo control</h2><div class="small muted">Equivalencia energética orientativa</div></div>${pill('7.700 kcal ≈ 1 kg')}</div><div class="row between"><strong class="num">${fmt(pending.length?7700:towardNext)} / 7.700 kcal</strong>${pill(total<0?'Balance en superávit':Math.floor(Math.max(0,total)/7700)+' umbral(es) alcanzados',total<0?'warn':'neutral')}</div>${progressBar(progress)}<p class="no-data-note">Las kcal no predicen exactamente el peso: líquidos, ciclo, actividad y errores de estimación influyen.</p></div>
 <div class="cards-2 home-columns">${todayList}<div class="card"><div class="card-title"><h2>Hoy en números</h2>${todayFood&&todayFood.kcal>0?pill('Registrado','good'):pill('Sin registrar')}</div><div class="stack"><div class="row between"><span class="muted">Comidas</span><strong>${todayFood?fmt(todayFood.kcal)+' kcal':'—'}</strong></div><div class="divider"></div><div class="row between"><span class="muted">Gasto estimado</span><strong>${todayFood&&todayFood.burn?fmt(todayFood.burn)+' kcal':'—'}</strong></div><div class="divider"></div><div class="row between"><span class="muted">Balance</span><strong>${todayFood&&todayFood.burn?fmt(todayFood.burn-todayFood.kcal)+' kcal':'Sin datos suficientes'}</strong></div></div>${editing()?'<button class="btn full mt" data-action="food-add">Cargar o editar día</button>':''}</div></div>${checks}${calendar()}</div>`;
}
function exerciseName(id){return S.ex.find(x=>x.id==id)?.name||'Ejercicio eliminado'}
function exercise(id){return S.ex.find(x=>x.id==id)}
function sessionElapsedMs(pg=S.prog){if(!pg?.startedAt)return 0;return Math.max(0,Date.now()-pg.startedAt+(pg.elapsedMs||0))}
function sessionDateTimeLabel(ts){if(!ts)return '—';return new Date(ts).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}
function seriesHTML(sets,e){const unit=(e?.u||'kg').trim();return `<div class="set-board">${(sets||e?.s||[]).map(s=>`<div class="set-card"><div class="set-col"><span class="set-label">${escapeHtml(unit)}</span><strong>${escapeHtml(s.w)}</strong></div><div class="set-col"><span class="set-label">Reps</span><strong>${escapeHtml(s.r)}</strong></div></div>`).join('')}</div>`}
function buildSessionSummary(pg){
 const routine=S.rt.find(r=>r.id==pg?.r);
 const allLogs=(S.hist||[]).filter(x=>x.stageId===S.activeId&&x.d===pg?.d&&pg?.done?.includes(x.e));
 const unique=new Map();
 allLogs.forEach(log=>{if(!unique.has(log.e))unique.set(log.e,log)});
 const logs=[...unique.values()];
 const duration=formatDuration(sessionElapsedMs(pg));
 const list=logs.map(log=>{const e=exercise(log.e);const unit=(e?.u||'').trim();const sets=(log.s||[]).map(x=>`${x.w}${unit?` ${unit}`:''} x ${x.r}`).join(' · ');return `- ${exerciseName(log.e)}: ${sets}`}).join('\n');
 const title=`Rutina: ${routine?.name||'Entrenamiento'} (${pg?.d||iso()})`;
 const summary=`${title}\nDuración: ${duration}\nEjercicios completados: ${logs.length} de ${pg?.sel?.length||logs.length}\n\n${list||'- Sin ejercicios registrados'}`;
 const prompt=`Tomá este resumen de entrenamiento y devolveme SOLO un JSON con este formato: {"fecha":"AAAA-MM-DD","kcal_quemadas_gym":0,"duracion_min":0,"resumen":""}. Si necesitás estimar calorías, hacelo en base a la duración y a los ejercicios realizados.\n\n${summary}`;
 return {routineName:routine?.name||'Entrenamiento',duration,completed:logs.length,total:pg?.sel?.length||logs.length,summary,prompt,startLabel:sessionDateTimeLabel(pg?.startedAt)}
}
function openSessionSummary(summary){
 showModal('Resumen del entrenamiento',`<div class="stack"><div class="cards-2"><div class="muted-box"><div class="stat-label">Rutina</div><strong>${escapeHtml(summary.routineName)}</strong></div><div class="muted-box"><div class="stat-label">Tiempo</div><strong>${escapeHtml(summary.duration)}</strong></div></div><div class="muted-box"><div class="stat-label">Resumen para vos</div><textarea readonly rows="8">${escapeHtml(summary.summary)}</textarea></div><div class="muted-box"><div class="stat-label">Prompt para IA</div><textarea readonly rows="12">${escapeHtml(summary.prompt)}</textarea><div class="field-note">Podés copiar esto y pegarlo en tu chat para pedir calorías quemadas o un bloque JSON.</div></div></div>`,[{label:'Cerrar',onClick:()=>{}},{label:'Copiar resumen',onClick:()=>navigator.clipboard?.writeText(summary.summary).then(()=>toast('Resumen copiado')).catch(()=>toast('No se pudo copiar'))},{label:'Copiar prompt IA',kind:'primary',onClick:()=>navigator.clipboard?.writeText(summary.prompt).then(()=>toast('Prompt copiado')).catch(()=>toast('No se pudo copiar'))}])
}
function routineCard(r){
 const count=(r.items||[]).length;
 return `<div class="list-item"><div class="badge-round large-icon">🏋</div><div class="maintext"><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(D[r.day])} · ${count} ejercicios · ${r.need||count} previstos</small></div>${editing()?`<button class="btn sm primary" data-action="routine-start" data-id="${r.id}">Empezar</button>`:''}</div>`;
}
function session(){
 const pg=S.prog;if(!pg||pg.stageId!==S.activeId||pg.d!==iso())return '';
 if(!pg.startedAt){pg.startedAt=Date.now();persist()}
 const r=S.rt.find(r=>r.id==pg.r);if(!r)return '';
 const sel=pg.sel||[],done=pg.done||[],remaining=Math.max(sel.length-done.length,0);
 return `<div class="content">${sectionTitle('Entrenamiento en curso',r.name)}
 <div class="card"><div class="session-overview"><div><h2>${done.length} / ${sel.length} ejercicios</h2><p class="small muted">Se guarda el progreso mientras entrenás.</p></div><div class="session-timer-box"><span class="set-label">Tiempo</span><strong class="session-timer" data-live-timer>${formatDuration(sessionElapsedMs(pg))}</strong><small class="muted">Empezaste ${sessionDateTimeLabel(pg.startedAt)}</small></div></div>${progressBar(done.length/Math.max(sel.length,1)*100)}<div class="row wrap between"><small class="muted">${remaining?remaining+' ejercicio(s) pendiente(s)':''}${!remaining?'¡Rutina lista para cerrar!':''}</small>${pill(D[r.day])}</div></div>
 <div class="card"><div class="card-title"><h2>Mis ejercicios</h2><button class="btn sm" data-action="session-add">+ Agregar</button></div><div class="session-list">${sel.map((id,i)=>{const e=exercise(id);if(!e)return '';return `<article class="session-card ${done.includes(id)?'done':''}"><div class="session-card-top"><div class="session-order">${done.includes(id)?'✓':i+1}</div><div class="grow"><strong>${escapeHtml(e.name)}</strong>${e.note?`<small>📝 ${escapeHtml(e.note)}</small>`:''}</div>${done.includes(id)?'<span class="pill good">Listo</span>':''}</div><div class="session-series">${seriesHTML(e.s,e)}</div>${!done.includes(id)?`<div class="item-actions stack-actions"><button class="btn sm primary" data-action="session-log" data-id="${id}">Hecho</button><button class="btn sm" data-action="session-edit" data-id="${id}">Editar</button><button class="btn sm ghost" data-action="session-skip" data-id="${id}">Quitar</button></div>`:''}</article>`}).join('')}</div></div>
 <div class="btn-row"><button class="btn primary" data-action="session-finish">Finalizar sesión</button><button class="btn ghost" data-action="session-cancel">Descartar sesión en curso</button></div></div>`;
}
function foodRow(r){const valid=r.kcal>0&&r.burn>0;return `<tr><td>${escapeHtml(r.d)}</td><td>${r.kcal!==null?fmt(r.kcal):'—'}</td><td>${r.burn!==null?fmt(r.burn):'—'}</td><td class="${valid?(r.burn>=r.kcal?'text-green':'text-amber'):'muted'}">${valid?fmt(r.burn-r.kcal):'Incompleto'}</td><td>${editing()?`<button class="btn sm ghost" data-action="food-edit" data-date="${r.d}">✎</button><button class="btn sm danger" data-action="food-delete" data-date="${r.d}" aria-label="Eliminar registro">×</button>`:''}</td></tr>`}
function pageFood(){
 const {total,complete,logged,incomplete}=netData(),dates=activeDates();
 const from=dates[0],to=dates.at(-1),subset=rec('food').filter(x=>x.d>=from&&x.d<=to),valid=subset.filter(x=>x.kcal>0&&x.burn>0),avg=valid.length?valid.reduce((s,r)=>s+r.burn-r.kcal,0)/valid.length:null;
 return `<div class="content">${sectionTitle('Alimentación','COMIDAS Y ENERGÍA')}<div class="row wrap between"><p class="muted">Los registros incompletos no entran en el balance.</p>${editing()?`<div class="btn-row"><button class="btn primary" data-action="food-add">+ Cargar día</button><button class="btn" data-action="food-paste">Pegar de Gemini</button></div>`:''}</div>
 <div class="cards-3">${stat('Déficit acumulado',fmt(total),'kcal','En toda la etapa')}${stat('Días completos',fmt(complete),'',`${logged} registros · ${incomplete} incompletos`)}${stat('Promedio del período',avg!==null?fmt(Math.round(avg)):'—','kcal/día','Solo días con datos completos')}</div>
 <div class="card"><div class="card-title"><div><h2>Balance energético</h2><p class="small muted">Déficit (+) · superávit (−)</p></div>${pill(coverageCount('food',dates)+' / '+daysTracked(dates)+' días anotados')}</div>${periodButtons()}<div class="mt">${svgBalance()}</div><div class="legend"><span><i style="background:var(--accent)"></i> Déficit</span><span><i style="background:var(--blue)"></i> Superávit</span><span><i style="background:var(--edge)"></i> Sin balance</span></div></div>
 <div class="card"><div class="card-title"><h2>Calorías: comidas vs. gasto</h2></div>${svgFoodLines()}<div class="legend"><span><i style="background:var(--accent)"></i> Comidas</span><span><i style="background:var(--blue)"></i> Gasto estimado por Gemini</span></div></div>
 <div class="card"><div class="card-title"><h2>Evolución de macronutrientes</h2></div>${svgMacroChart()}<div class="legend"><span><i style="background:var(--accent)"></i> Proteínas</span><span><i style="background:var(--blue)"></i> Carbohidratos</span><span><i style="background:var(--green)"></i> Grasas</span></div></div>
 <div class="card"><div class="card-title"><h2>Mis registros</h2>${pill(subset.length+' días registrados')}</div><div class="table-wrap"><table class="table"><thead><tr><th>Fecha</th><th>Comidas</th><th>Gasto est.</th><th>Balance</th><th></th></tr></thead><tbody>${subset.sort((a,b)=>b.d.localeCompare(a.d)).map(foodRow).join('')||'<tr><td colspan="5">Todavía no registraste días en este período.</td></tr>'}</tbody></table></div></div></div>`;
}
function measureChart(){const field=ui.chartMeasure||'kg';return svgTimeSeries(rec('body'),r=>field==='kg'?r.kg:r.m?.[field],field==='kg'?'kg':'cm')}
function checkpointStatus(){
 const st=stage(),cks=st.checkpoints||[],last=cks.at(-1),pending=cks.filter(x=>x.measuredKg==null),baseline=st.baseWeight,lastKg=lastBody()?.kg,
  observed=baseline!=null&&lastKg!=null?baseline-lastKg:null;
 return `<div class="card"><div class="card-title"><div><h2>Meta energética y pesajes</h2><p class="small muted">Comparación teórica, no promesa de descenso</p></div>${pill(pending.length?pending.length+' pendiente(s)':cks.length+' control(es)',pending.length?'warn':'neutral')}</div>
 <div class="weight-compare"><div class="box"><div class="stat-label">Equivalente energético</div><div class="stat-value">${fmt(netData().total/7700,2)} <span class="stat-unit">kg teóricos</span></div></div><div class="box"><div class="stat-label">Cambio observado</div><div class="stat-value">${observed===null?'—':fmt(observed,2)} <span class="stat-unit">kg menos</span></div></div></div>
 <div class="no-data-note">Peso inicial: ${baseline!=null?fmt(baseline,1)+' kg':'sin definir'} · Último peso: ${lastKg!=null?fmt(lastKg,1)+' kg':'sin registros'}</div>
 ${cks.length?`<div class="table-wrap mt"><table class="table"><thead><tr><th>Umbral</th><th>Alcanzado</th><th>Pesaje</th><th>Resultado real vs. inicial</th></tr></thead><tbody>${[...cks].reverse().map(c=>`<tr><td>${fmt(c.targetNet)} kcal</td><td>${c.dateReached}</td><td>${c.measuredKg===null?'<span class="text-amber">Pendiente</span>':fmt(c.measuredKg,1)+' kg'}</td><td>${c.measuredKg!==null&&baseline!==null?fmt(baseline-c.measuredKg,2)+' kg menos':'—'}</td></tr>`).join('')}</tbody></table></div>`:''}
 <p class="no-data-note">Unos 7.700 kcal equivalen aproximadamente a la energía de 1 kg de grasa, pero el peso total puede comportarse distinto. El gasto de Gemini es una estimación.</p></div>`;
}
function bmiInfo(bmi){
 if(!Number.isFinite(bmi))return null;
 if(bmi<18.5)return {label:'Bajo peso',color:'var(--blue)'};
 if(bmi<25)return {label:'Normal',color:'var(--green)'};
 if(bmi<30)return {label:'Sobrepeso',color:'var(--amber)'};
 return {label:'Obesidad',color:'var(--accent)'};
}
function bmiGauge(bmi){
 if(!Number.isFinite(bmi))return '';
 const min=15,max=40;
 const clamp=Math.max(min,Math.min(max,bmi));
 const pos=((clamp-min)/(max-min))*100;
 const info=bmiInfo(bmi);
 return `<div class="bmi-gauge-wrap"><div class="bmi-gauge" aria-hidden="true"><div class="bmi-seg low"></div><div class="bmi-seg normal"></div><div class="bmi-seg high"></div><div class="bmi-seg veryhigh"></div><div class="bmi-needle" style="left:${pos}%"></div></div><div class="bmi-scale"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div><div class="row wrap between" style="margin-top:8px;gap:8px"><span class="pill neutral" style="border:1px solid var(--edge)">${escapeHtml(info.label)}</span><small class="muted">Bajo peso &lt; 18.5 · Normal 18.5–24.9 · Sobrepeso 25–29.9 · Obesidad ≥ 30</small></div><p class="bmi-healthy-note"><strong>Rango de referencia considerado normal:</strong> IMC entre 18,5 y 24,9 en adultos. Es orientativo y no evalúa por sí solo tu salud ni tu composición corporal.</p></div>`
}

function metabolicCard(){
 const m=metabolicMetrics(),missingBMI=m.needsBMI,missingTMB=m.needsTMB;
 const card=(label,value,unit,details,pending)=>`<div class="metabolic-stat"><div class="stat-label">${label}</div><div class="metabolic-value num ${pending?'pending-value':''}">${pending?'Pendiente de carga':fmt(value,1)}${pending?'':` <span class="stat-unit">${unit}</span>`}</div><p class="stat-sub">${pending?`Falta: ${escapeHtml(details.join(', '))}`:escapeHtml(label==='IMC · Índice de masa corporal'?m.source+' · '+fmt(m.weight,1)+' kg':'Estimación en reposo · '+m.age+' años')}</p>${label==='IMC · Índice de masa corporal'&&!pending?bmiGauge(m.bmi):''}</div>`;
 return `<div class="card"><div class="card-title"><div><h2>Indicadores corporales</h2><p class="small muted">Se actualizan con tu peso más reciente y los datos de tu perfil.</p></div>${editing()?'<button class="btn sm" data-action="profile-edit">✎ Completar perfil</button>':''}</div>
 <div class="metabolic-grid">${card('IMC · Índice de masa corporal',m.bmi,'kg/m²',missingBMI,m.bmi===null)}${card('TMB · Metabolismo basal',m.tmb,'kcal/día',missingTMB,m.tmb===null)}</div>
 <p class="no-data-note">El IMC se calcula con peso y estatura, sin usar género. La TMB se estima con Mifflin-St Jeor usando peso, estatura, edad y el parámetro de fórmula elegido. La ecuación aproxima el gasto en reposo, no tu gasto total diario; ambos indicadores son orientativos.</p></div>`;
}
function pageProgress(){
 const end=stageEnd(),measures=rec('body'),weights=measures.filter(x=>Number.isFinite(x.kg)),dates=activeDates();
 return `<div class="content">${sectionTitle('Mi evolución','PROGRESO')}${promptAlerts()}
 <div class="row between wrap"><div class="btn-row">${periodButtons()}</div>${editing()?'<button class="btn primary" data-action="body-add">+ Cargar peso / medidas</button>':''}</div>
 <div class="cards-3">${stat('Peso inicial',stage().baseWeight!==null?fmt(stage().baseWeight,1):'—','kg','Inicio de etapa')}${stat('Último pesaje',lastBody()?fmt(lastBody().kg,1):'—','kg',lastBody()?.d||'Sin registros')}${stat('Cobertura',coverageCount('body',dates)+' / '+daysTracked(dates),'días','Días con mediciones')}</div>
 ${metabolicCard()}
 <div class="card"><div class="card-title"><h2>Evolución con fechas reales</h2><div class="btn-row"><button class="choice ${(!ui.chartMeasure||ui.chartMeasure==='kg')?'active':''}" data-action="measure-field" data-field="kg">Peso</button>${BF.map(f=>`<button class="choice ${ui.chartMeasure===f?'active':''}" data-action="measure-field" data-field="${f}">${f}</button>`).join('')}</div></div>${measureChart()}<div class="no-data-note">Las fechas son proporcionales al calendario, incluso si pasás semanas sin medirte.</div></div>
 ${checkpointStatus()}
 <div class="card"><div class="card-title"><h2>Historial de medidas</h2></div><div class="table-wrap"><table class="table"><thead><tr><th>Fecha</th><th>Peso</th><th>Medidas (cm)</th><th></th></tr></thead><tbody>${measures.slice().sort((a,b)=>b.d.localeCompare(a.d)).map(x=>`<tr><td>${x.d}</td><td>${x.kg!=null?fmt(x.kg,1)+' kg':'—'}</td><td>${Object.entries(x.m||{}).map(([k,v])=>escapeHtml(k)+': '+fmt(v,1)).join(' · ')||'—'}</td><td>${editing()?`<button class="btn sm ghost" data-action="body-edit" data-date="${x.d}">✎</button><button class="btn sm danger" data-action="body-delete" data-date="${x.d}" aria-label="Eliminar pesaje">×</button>`:''}</td></tr>`).join('')||'<tr><td colspan="4">Todavía no cargaste mediciones.</td></tr>'}</tbody></table></div></div>${calendar()}</div>`;
}
function pageSettings(){
 return `<div class="content">${sectionTitle('Configuración','MI ESPACIO')}
 <div class="card"><div class="card-title"><h2>Apariencia</h2></div><div class="btn-row">${[['auto','Automático'],['dark','Oscuro'],['light','Claro']].map(([v,l])=>`<button class="choice ${S.theme===v?'active':''}" data-action="theme" data-theme="${v}">${l}</button>`).join('')}</div><p class="no-data-note">Se guarda la preferencia en este dispositivo.</p></div>
 <div class="card"><div class="card-title"><div><h2>Mi perfil corporal</h2><p class="small muted">Datos opcionales para calcular IMC y TMB.</p></div>${editing()?'<button class="btn sm primary" data-action="profile-edit">Editar perfil</button>':''}</div>
 <div class="profile-summary"><div><div class="stat-label">Estatura</div><strong>${S.profile?.heightCm?fmt(S.profile.heightCm,1)+' cm':'Pendiente de carga'}</strong></div><div><div class="stat-label">Fecha de nacimiento</div><strong>${S.profile?.birthDate?escapeHtml(S.profile.birthDate):'Pendiente de carga'}</strong></div><div><div class="stat-label">Fórmula TMB</div><strong>${S.profile?.formula==='female'?'Referencia femenina':S.profile?.formula==='male'?'Referencia masculina':'Pendiente de carga'}</strong></div></div><p class="no-data-note">Los datos se guardan solo en este dispositivo. El peso se carga en Progreso → Peso y medidas.</p></div>
 <div class="card"><div class="card-title"><h2>Etapas e historial</h2>${editing()?'<button class="btn sm primary" data-action="stage-new">+ Nueva etapa</button>':''}</div><p class="small muted mb">Archivar una etapa no elimina sus registros ni altera tus rutinas.</p><div class="list-items">${S.stages.slice().reverse().map(st=>`<div class="list-item"><span style="font-size:19px">${st.id===S.activeId?'💗':'🗂'}</span><div class="maintext"><strong>${escapeHtml(st.name)}</strong><small>${escapeHtml(st.start)}${st.archivedAt?' → '+escapeHtml(st.archivedAt):' · actual'} · ${S.food.filter(x=>x.stageId===st.id).length} días de alimentación</small></div><button class="btn sm" data-action="stage-view" data-id="${escapeAttr(st.id)}">${st.id===stage().id?'Viendo':'Ver'}</button></div>`).join('')}</div></div>
 <div class="card"><div class="card-title"><h2>Mis ejercicios y rutinas</h2></div><div class="btn-row"><button class="btn" data-action="ex-list">🏋 Gestionar ejercicios (${S.ex.length})</button><button class="btn" data-action="routine-edit">📋 Editar rutinas (${S.rt.length})</button><button class="btn" data-action="plan-edit">📅 Plan semanal</button><button class="btn" data-action="checklist-config">☑️ Editar checklist</button></div></div>
 <div class="card"><div class="card-title"><h2>Datos y respaldo</h2>${pill('100% local','good')}</div><p class="small muted mb">Tus datos están guardados en este navegador. Al borrar sus datos, cambiar de celular o reinstalarlo, podés perderlos si no exportás un backup.</p><div class="btn-row"><button class="btn primary" data-action="export">⬇ Descargar backup JSON</button><button class="btn" data-action="import">⬆ Importar backup JSON</button></div><p class="no-data-note">Se mantiene intacta la clave anterior (<code>gymapp1</code>) si venías de la versión 1. Importar reemplaza los datos de v2 después de pedir confirmación.</p></div>
 <div class="card"><div class="card-title"><h2>Acerca de Mi Gym 2.1</h2></div><p class="small muted">HTML, CSS y JavaScript, sin bibliotecas externas. Instalable como PWA con uso offline. Sin cuenta, sin sincronización y sin enviar tus datos a ningún servidor.</p></div></div>`;
}
/* ---------- Accessible editing dialogs ---------- */
function closeModal(){const root=$('#modal-root');root.innerHTML='';document.body.style.overflow=''}
function showModal(title,html,actions=[],opts={}){
 const root=$('#modal-root');root.innerHTML=`<div class="modal-backdrop" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}"><header><div><h2>${escapeHtml(title)}</h2>${opts.description?`<p class="small muted">${escapeHtml(opts.description)}</p>`:''}</div><button class="x" data-close="true" aria-label="Cerrar">×</button></header><main>${html}</main><footer>${actions.map((a,i)=>`<button class="btn ${a.kind||''}" data-modal-action="${i}">${escapeHtml(a.label)}</button>`).join('')||'<button class="btn" data-close="true">Cerrar</button>'}</footer></div></div>`;
 document.body.style.overflow='hidden';
 const el=root.querySelector('.modal');
 root.querySelector('[data-close]').onclick=closeModal;
 root.querySelector('.modal-backdrop').addEventListener('click',e=>{if(e.target.dataset.backdrop)closeModal()});
 root.querySelectorAll('[data-modal-action]').forEach(btn=>btn.onclick=()=>{
  try{const result=actions[Number(btn.dataset.modalAction)].onClick(el);if(result!==false)closeModal()}
  catch(e){toast(e.message||'Revisá los datos');console.error(e)}
 });
 if(opts.onOpen)opts.onOpen(el);
 (el.querySelector('input:not([type=hidden]),textarea,select')||el.querySelector('button'))?.focus();
}
function field(label,key,value='',type='text',extra=''){
 return `<div class="field"><label for="f-${escapeAttr(key)}">${escapeHtml(label)}</label><input id="f-${escapeAttr(key)}" data-field="${escapeAttr(key)}" type="${type}" value="${escapeAttr(value??'')}" ${extra}></div>`;
}
function read(el,key){return el.querySelector(`[data-field="${key}"]`)?.value??''}
function confirmModal(title,description,yes,btnText='Confirmar',danger=false){
 showModal(title,`<p>${escapeHtml(description)}</p>`,[{label:'Cancelar',onClick:()=>{}},{label:btnText,kind:danger?'danger':'primary',onClick:yes}]);
}
function openFoodModal(date=iso()){
 if(!editing())return;
 const r=recActive('food').find(x=>x.d===date);
 showModal(r?'Editar alimentación':'Cargar alimentación',`
 ${field('Fecha','fecha',date,'date',`max="${iso()}" min="${activeStage().start}"`)}
 <div class="field-grid">${field('Kcal comidas *','kcal',r?.kcal??'','number','min="1" step="1" inputmode="decimal"')}${field('Gasto diario estimado por Gemini','gasto',r?.burn??'','number','min="0" step="1" inputmode="decimal"')}${field('Proteínas (g)','prot',r?.p??'','number','min="0" step="0.1"')}${field('Carbohidratos (g)','carb',r?.c??'','number','min="0" step="0.1"')}${field('Grasas (g)','grasa',r?.g??'','number','min="0" step="0.1"')}</div>
 <div class="muted-box small">Si no sabés el gasto, dejalo vacío. Ese día quedará registrado, pero no se usará para calcular el déficit hasta completarlo.</div>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar día',kind:'primary',onClick:el=>{
  const obj=Object.fromEntries([...el.querySelectorAll('[data-field]')].map(x=>[x.dataset.field,x.value]));
  const saved=saveFood(obj);if(saved.d!==date){S.food=S.food.filter(x=>!(x.stageId===S.activeId&&x.d===date));milestones();persist()}render();toast('Día guardado');
 }}]);
}
const GEMINI_PROMPT=`Al finalizar el día, devolveme SOLO un bloque JSON válido con este formato, sin texto adicional:\n{"fecha":"AAAA-MM-DD","kcal":null,"prot":null,"carb":null,"grasa":null,"gasto":null}\nLas kcal representan las calorías COMIDAS, los macros van en gramos y gasto son las kcal TOTALES estimadas que gasté ese día (metabolismo basal + movimiento + ejercicio). No uses solamente las calorías del entrenamiento. Estimá el gasto solo si tenés datos adecuados; si falta información, enviá null, no inventes un dato preciso. Podés enviarme un array JSON para varios días.`;
function parseGemini(text){
 let trimmed=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,'').trim();
 if(!trimmed.startsWith('{')&&!trimmed.startsWith('[')){
  const a=trimmed.indexOf('['),o=trimmed.indexOf('{'),start=a>=0&&(o<0||a<o)?a:o;
  if(start<0)throw Error('No encontré ningún JSON');trimmed=trimmed.slice(start);
 }
 const rs=JSON.parse(trimmed);const arr=Array.isArray(rs)?rs:[rs];if(!arr.length||arr.length>120)throw Error('Ingresá entre 1 y 120 días');
 const dates=new Set();
 arr.forEach(x=>{if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Formato de día inválido');const d=x.fecha||x.d;if(!validInputDate(d))throw Error('Fecha inválida o fuera de la etapa: '+d);if(dates.has(d))throw Error('El JSON incluye la misma fecha dos veces: '+d);dates.add(d);if((asNumber(x.kcal)||0)<=0)throw Error('Faltan las kcal comidas de '+d);});
 return arr;
}
function openPasteModal(){
 if(!editing())return;
 showModal('Importar desde Gemini',`<p class="small muted">Pegá un objeto JSON o un array de días. El gasto total debe incluir metabolismo basal y actividad, no solo ejercicio.</p><textarea data-field="json" spellcheck="false" placeholder='{"fecha":"2026-11-07","kcal":1800,"prot":105,"carb":180,"grasa":58,"gasto":2250}' rows="7"></textarea><div class="muted-box small">El gasto de Gemini es una estimación. Las fechas sin gasto se mostrarán como registros incompletos.</div><button class="btn sm" data-inline="prompt">📋 Copiar instrucción para Gemini</button>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Importar días',kind:'primary',onClick:el=>{
  const arr=parseGemini(read(el,'json'));
  // Validate the full batch before changing saved data.
  arr.forEach(x=>{const kcal=asNumber(x.kcal),burn=asNumber(x.gasto??x.burn);if(kcal<=0||kcal>20000||burn!==null&&(burn<0||burn>30000))throw Error('Valores inválidos en '+(x.fecha||x.d))});
  arr.forEach(x=>saveFood(x));render();toast(`${arr.length} día(s) importado(s)`);
 }}],{onOpen:el=>{el.querySelector('[data-inline=prompt]').onclick=async()=>{
  try{await navigator.clipboard.writeText(GEMINI_PROMPT);toast('Instrucción copiada')}catch(e){showModal('Instrucción para Gemini',`<textarea rows="11" readonly>${escapeHtml(GEMINI_PROMPT)}</textarea>`,[{label:'Cerrar',onClick:()=>{}}])}
 }}});
}
function openProfileModal(){
 if(!editing())return;
 const p=normalizeProfile(S.profile);
 showModal('Mi perfil corporal',`<p class="small muted">Completá los datos para calcular automáticamente el IMC y el metabolismo basal. Se guardan solo en este dispositivo.</p>
 ${field('Estatura (cm)','heightCm',p.heightCm??'','number','min="100" max="230" step="0.1" inputmode="decimal" placeholder="Ej.: 165"')}
 ${field('Fecha de nacimiento','birthDate',p.birthDate,'date',`max="${iso()}" min="1900-01-01"`)}
 <div class="field"><label for="f-formula">Parámetro de la fórmula de TMB</label><select id="f-formula" data-field="formula"><option value="" ${!p.formula?'selected':''}>Elegir más adelante</option><option value="female" ${p.formula==='female'?'selected':''}>Referencia femenina (−161)</option><option value="male" ${p.formula==='male'?'selected':''}>Referencia masculina (+5)</option></select><p class="field-note">La ecuación publicada tiene coeficientes masculino y femenino. Elegí el que corresponda para esta estimación; no define tu identidad de género.</p></div>
 <div class="muted-box small">Para el IMC solo se necesitan el peso y la estatura. Para la TMB también se necesita la edad y una referencia de fórmula. Esta estimación se aplica a adultos (20+).</div>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar perfil',kind:'primary',onClick:el=>{
  const heightCm=asNumber(read(el,'heightCm')),birthDate=read(el,'birthDate'),formula=read(el,'formula');
  if(heightCm!==null&&(heightCm<100||heightCm>230))throw Error('Revisá la estatura (100 a 230 cm)');
  if(birthDate&&(!validDate(birthDate)||birthDate>iso()||birthDate<'1900-01-01'))throw Error('Revisá la fecha de nacimiento');
  if(!['','female','male'].includes(formula))throw Error('Seleccioná una referencia válida');
  S.profile={heightCm,birthDate,formula};persist();render();toast('Perfil guardado');
 }}]);
}
function openBodyModal(d=iso()){ 
 if(!editing())return;
 const r=recActive('body').find(x=>x.d===d);
 showModal(r?'Editar peso y medidas':'Peso y medidas',`${field('Fecha','fecha',d,'date',`max="${iso()}" min="${activeStage().start}"`)}
 ${field('Peso (kg)','kg',r?.kg??'','number','min="20" max="500" step="0.1" inputmode="decimal"')}
 <div class="field-grid">${BF.map(k=>field(k[0].toUpperCase()+k.slice(1)+' (cm)',k,r?.m?.[k]??'','number','min="0" step="0.1"')).join('')}</div>
 ${milestones().length?'<div class="muted-box small">Tenés un punto de control energético pendiente. Este pesaje quedará asociado al control.</div>':''}`, [
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar medidas',kind:'primary',onClick:el=>{
  const kg=asNumber(read(el,'kg')),measures={};BF.forEach(k=>{const v=asNumber(read(el,k));if(v!==null){if(v<=0||v>500)throw Error('Revisá la medida '+k);measures[k]=v}});
  const updatedDate=read(el,'fecha');saveBody(updatedDate,kg,measures);if(updatedDate!==d){S.body=S.body.filter(x=>!(x.stageId===S.activeId&&x.d===d));(activeStage().checkpoints||[]).forEach(c=>{if(c.measurementDate===d)c.measurementDate=updatedDate});persist()}render();toast('Peso y medidas guardados');
 }}]);
}
function editExercise(id=null,afterSave=null){
 const e=id!==null?exercise(id):null;
 const rows=(e?.s||[{w:'0',r:'10'},{w:'0',r:'10'},{w:'0',r:'10'}]).map(s=>({...s}));
 const rowTemplate=(s,i)=>`<div class="series-edit"><span class="series-num">${i+1}</span><input data-w="${i}" aria-label="Peso serie ${i+1}" placeholder="Carga" value="${escapeAttr(s.w)}"><input data-r="${i}" aria-label="Repeticiones serie ${i+1}" placeholder="Reps" value="${escapeAttr(s.r)}"><button class="btn sm danger" data-del-series="${i}" aria-label="Quitar serie">×</button></div>`;
 const makeRows=(el)=>{el.querySelector('[data-sets]').innerHTML=rows.map(rowTemplate).join('');el.querySelectorAll('[data-w]').forEach(x=>x.oninput=()=>rows[+x.dataset.w].w=x.value);el.querySelectorAll('[data-r]').forEach(x=>x.oninput=()=>rows[+x.dataset.r].r=x.value);el.querySelectorAll('[data-del-series]').forEach(x=>x.onclick=()=>{if(rows.length<2)return;rows.splice(+x.dataset.delSeries,1);makeRows(el)})};
 showModal(e?'Editar ejercicio':'Crear ejercicio',`${field('Nombre','name',e?.name||'')}${field('Músculos separados por coma','ms',(e?.ms||[]).join(', '))}${field('Unidad','unit',e?.u||'kg')}${field('Nota para la próxima','note',e?.note||'')}
 <div class="field"><label>Series (carga y repeticiones)</label><div data-sets class="stack"></div><button class="btn sm" data-add-series="true">+ Agregar serie</button></div>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar ejercicio',kind:'primary',onClick:el=>{
  const name=read(el,'name').trim(),muscles=read(el,'ms').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean),unit=read(el,'unit').trim()||'kg';
  if(!name||!muscles.length)throw Error('Completá nombre y músculos');
  if(rows.some(x=>!String(x.w).trim()||!String(x.r).trim()))throw Error('Revisá las series');
  const obj=e||{id:++S.n};Object.assign(obj,{name,ms:muscles,u:unit,note:read(el,'note').trim(),s:rows});
  if(!e)S.ex.push(obj);persist();render();if(afterSave)afterSave(obj);else toast('Ejercicio guardado');
 }}],{onOpen:el=>{makeRows(el);el.querySelector('[data-add-series]').onclick=()=>{if(rows.length>=15)return toast('Máximo 15 series');rows.push({...rows.at(-1)});makeRows(el)}}});
}
function exerciseList(){
 if(!editing())return;
 showModal('Mis ejercicios',`<div class="row between"><p class="small muted">${S.ex.length} ejercicios disponibles</p><button class="btn sm primary" data-inline-add="true">+ Nuevo</button></div><div class="list-items">${S.ex.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<div class="list-item"><div class="maintext"><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.ms.join(' · '))}</small></div><button class="btn sm" data-exid="${x.id}">Editar</button></div>`).join('')}</div>`,[{label:'Cerrar',onClick:()=>{}}],{onOpen:el=>{el.querySelector('[data-inline-add]').onclick=()=>editExercise();el.querySelectorAll('[data-exid]').forEach(btn=>btn.onclick=()=>editExercise(+btn.dataset.exid))}});
}
function manageRoutineList(){
 if(!editing())return;
 showModal('Mis rutinas',`<div class="row between"><p class="small muted">Editá días, ejercicios y opciones.</p><button class="btn sm primary" data-routine-new="true">+ Nueva</button></div><div class="list-items">${S.rt.map(r=>`<div class="list-item"><div class="maintext"><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(D[r.day])} · ${r.items?.length||0} ejercicios</small></div><button class="btn sm" data-routine-id="${r.id}">Editar</button></div>`).join('')}</div>`,[{label:'Cerrar',onClick:()=>{}}],{onOpen:el=>{el.querySelector('[data-routine-new]').onclick=()=>editRoutine(null);el.querySelectorAll('[data-routine-id]').forEach(x=>x.onclick=()=>editRoutine(+x.dataset.routineId))}});
}
function editRoutine(id=null){
 if(!editing())return;
 const r=id!==null?S.rt.find(x=>x.id==id):null;
 const items=new Map((r?.items||[]).map(x=>[Number(x.e),!!x.opt]));
 showModal(r?'Editar rutina':'Nueva rutina',`${field('Nombre','name',r?.name||'')}
 <div class="field"><label>Día de la semana</label><select data-field="day">${[1,2,3,4,5,6,0].map(d=>`<option value="${d}" ${r?.day===d?'selected':''}>${D[d]}</option>`).join('')}</select></div>
 ${field('Cantidad prevista de ejercicios','need',r?.need??items.size,'number','min="0" max="50"')}
 <div class="field"><label>Elegí los ejercicios</label><div class="list-items" style="max-height:280px;overflow:auto">${S.ex.map(x=>`<div class="list-item"><label class="row grow"><input type="checkbox" data-routine-ex="${x.id}" ${items.has(Number(x.id))?'checked':''}><span class="small">${escapeHtml(x.name)}</span></label><label class="row small muted"><input type="checkbox" data-routine-optional="${x.id}" ${items.get(Number(x.id))?'checked':''}>Opcional</label></div>`).join('')}</div></div>`,[
 ...(r?[{label:'Borrar rutina',kind:'danger',onClick:()=>{confirmModal('Borrar rutina','Se eliminará esta rutina, pero no sus registros históricos ni los ejercicios.',()=>{S.rt=S.rt.filter(x=>x.id!==r.id);persist();render();toast('Rutina borrada')},'Borrar',true)}}]:[]),
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar rutina',kind:'primary',onClick:el=>{
  const name=read(el,'name').trim(),day=Number(read(el,'day')),
  selected=[...el.querySelectorAll('[data-routine-ex]:checked')].map(x=>({e:Number(x.dataset.routineEx),opt:!!el.querySelector(`[data-routine-optional="${x.dataset.routineEx}"]`)?.checked}));
  if(!name||!selected.length)throw Error('Completá nombre y al menos un ejercicio');
  const requested=asNumber(read(el,'need'))??selected.length,needed=Math.min(selected.length,Math.max(1,Math.round(requested)));
  const result=r||{id:++S.n};Object.assign(result,{name,day,need:needed,items:selected});if(!r)S.rt.push(result);
  persist();render();toast('Rutina guardada');
 }}]);
}
function planEdit(day=localDate(iso()).getDay()){
 if(!editing())return;
 const p=S.plan[day]||{max:0,items:[]};
 showModal('Plan del '+D[day],`<div class="field"><label>Día de la semana</label><select data-field="day">${[1,2,3,4,5,6,0].map(i=>`<option value="${i}" ${i===day?'selected':''}>${D[i]}</option>`).join('')}</select></div>
 <div class="field"><label>Actividades (una por línea)</label><textarea data-field="items" rows="7">${escapeHtml((p.items||[]).join('\n'))}</textarea></div>
 ${field('Objetivo de kcal (opcional, 0 = sin tope)','max',p.max||0,'number','min="0" max="10000"')}
 <p class="small muted">Los valores de calorías deben ser personalizados; no se recomienda copiar topes antiguos sin revisarlos.</p>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar plan',kind:'primary',onClick:el=>{
  const d=Number(read(el,'day')),items=read(el,'items').split('\n').map(x=>x.trim()).filter(Boolean),max=asNumber(read(el,'max'))||0;
  if(max<0||max>10000)throw Error('Revisá el tope de kcal');S.plan[d]={items,max};persist();render();toast('Plan guardado');
 }}],{onOpen:el=>{el.querySelector('[data-field="day"]').onchange=event=>planEdit(Number(event.target.value))}});
}
function checklistEdit(){
 if(!editing())return;
 showModal('Mis hábitos',`<div class="field"><label>Un hábito por línea</label><textarea data-field="checks" rows="9">${escapeHtml(S.chk.map(x=>x.t).join('\n'))}</textarea></div><p class="small muted">Si cambiás el nombre de un hábito, se crea uno nuevo. Los anteriores no se borran del historial, pero dejarán de aparecer como objetivos activos.</p>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar hábitos',kind:'primary',onClick:el=>{
  const texts=read(el,'checks').split('\n').map(x=>x.trim()).filter(Boolean);
  S.chk=texts.map(t=>S.chk.find(x=>x.t===t)||{id:'c'+(++S.n),t});persist();render();toast('Checklist actualizado');
 }}]);
}
function newStageModal(){
 if(!editing())return;
 showModal('Empezar una nueva etapa',`<div class="muted-box small">Tu etapa actual quedará <strong>archivada</strong>. Se conservan sus registros históricos y también tus ejercicios y rutinas. Podrás verla en Ajustes → Etapas.</div>
 ${field('Nombre de la nueva etapa','name','Mi nueva etapa')}${field('Peso inicial (kg, opcional)','weight','','number','min="20" max="500" step="0.1"')}
 <div class="field"><label>Objetivo o nota personal (opcional)</label><textarea data-field="note" rows="2" placeholder="Mi objetivo de esta etapa..."></textarea></div>
 <label class="checkline"><input type="checkbox" data-field="understood"><span>Entiendo que los registros anteriores quedarán archivados y que los objetivos de kcal se podrán volver a configurar.</span></label>
 <button class="btn full" data-inline="download">⬇ Descargar backup antes de empezar</button>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Archivar e iniciar',kind:'primary',onClick:el=>{
  if(!el.querySelector('[data-field=understood]').checked)throw Error('Confirmá que entendés cómo se archiva el historial');
  const w=asNumber(read(el,'weight'));if(w!==null&&(w<20||w>500))throw Error('Revisá tu peso inicial');
  const name=read(el,'name').trim()||'Nueva etapa',note=read(el,'note').trim();newStage(name,w);
  activeStage().targetNote=note;
  // Drop the inherited fixed daily calorie caps from the old plan, preserve activities.
  Object.keys(S.plan).forEach(d=>{S.plan[d].max=0});persist();render();
 }}],{onOpen:el=>{el.querySelector('[data-inline=download]').onclick=exportJSON}});
}
function chooseStage(id){ui.viewStage=id===S.activeId?null:id;ui.period=30;ui.calendarOffset=0;render();toast(id===S.activeId?'Etapa actual':'Visualizando etapa archivada')}
/* ---------- Exercise session interactions ---------- */
function startSession(id){
 if(!editing())return;
 const r=S.rt.find(x=>x.id==id);if(!r)return toast('Rutina no encontrada');
 if(S.prog&&S.prog.stageId===S.activeId&&S.prog.d===iso()){
  return confirmModal('¿Cambiar rutina?','Hay un entrenamiento en curso. Los ejercicios ya registrados seguirán en el historial, pero la lista pendiente se reemplazará.',()=>{S.prog=null;startSession(id)},'Cambiar rutina');
 }
 const selected=(r.items||[]).filter(it=>!it.opt).map(it=>it.e);
 // Optional exercises are offered separately; do not silently add them.
 S.prog={d:iso(),stageId:S.activeId,r:r.id,sel:selected,done:[],startedAt:Date.now(),elapsedMs:0};
 persist();ui.page='gym';render();window.scrollTo(0,0);
}
function logExercise(id,sets=null){
 if(!editing()||!S.prog||!S.prog.sel.includes(id)||S.prog.done.includes(id))return;
 const e=exercise(id);if(!e)return;
 S.hist.push({d:iso(),stageId:S.activeId,e:e.id,r:S.prog.r,s:(sets||e.s).map(x=>({...x}))});
 S.prog.done.push(id);persist();render();toast('¡Ejercicio anotado!');
}
function editSessionSeries(id){
 const e=exercise(id);if(!e)return;
 const rows=e.s.map(s=>({...s}));
 function draw(el){
  const target=el.querySelector('[data-sets]');
  target.innerHTML=rows.map((x,i)=>`<div class="series-edit"><span class="series-num">${i+1}</span><input data-w="${i}" placeholder="Carga" aria-label="Carga ${i+1}" value="${escapeAttr(x.w)}"><input data-r="${i}" placeholder="Reps" aria-label="Repeticiones ${i+1}" value="${escapeAttr(x.r)}"><button class="btn sm danger" data-remove="${i}">×</button></div>`).join('');
  target.querySelectorAll('[data-w]').forEach(x=>x.oninput=()=>rows[+x.dataset.w].w=x.value);
  target.querySelectorAll('[data-r]').forEach(x=>x.oninput=()=>rows[+x.dataset.r].r=x.value);
  target.querySelectorAll('[data-remove]').forEach(x=>x.onclick=()=>{if(rows.length===1)return;rows.splice(+x.dataset.remove,1);draw(el)});
 }
 showModal('Series · '+e.name,`<p class="small muted">Cambiá las cargas o repeticiones de hoy. Se guardan como referencia para tus próximos entrenamientos.</p><div data-sets class="stack"></div><button class="btn sm" data-add="1">+ Serie</button>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar y marcar hecho',kind:'primary',onClick:el=>{
  if(rows.some(x=>!String(x.w).trim()||!String(x.r).trim()))throw Error('Completá todas las series');
  e.s=rows.map(x=>({...x}));logExercise(id,rows);
 }}],{onOpen:el=>{draw(el);el.querySelector('[data-add]').onclick=()=>{if(rows.length<15){rows.push({...rows.at(-1)});draw(el)}}}});
}
function addSessionExercise(){
 if(!S.prog||!editing())return;
 const options=S.ex.filter(x=>!S.prog.sel.includes(x.id));
 showModal('Agregar ejercicio',`<p class="small muted">Elegí una alternativa o sumá un ejercicio a la sesión de hoy.</p><div class="list-items">${options.map(x=>`<button class="btn full" data-sel="${x.id}">${escapeHtml(x.name)} · <small>${escapeHtml(x.ms.join(', '))}</small></button>`).join('')||'<div class="nothing">Todos tus ejercicios están en la sesión.</div>'}</div><button class="btn sm" data-new="1">+ Crear ejercicio</button>`,[{label:'Cerrar',onClick:()=>{}}],{onOpen:el=>{
  el.querySelector('[data-new]').onclick=()=>editExercise(null,x=>{S.prog.sel.push(x.id);persist();render()});
  el.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{
   const id=Number(b.dataset.sel),e=exercise(id),selected=S.prog.sel.map(exercise).filter(Boolean);
   const atCap=e.ms.some(m=>selected.filter(x=>x.ms.includes(m)).length>=CAP);
   if(atCap)return toast('Máximo '+CAP+' ejercicios del mismo músculo en la sesión');
   S.prog.sel.push(id);persist();closeModal();render();toast('Ejercicio agregado');
  });
 }});
}
function finishSession(){
 if(!S.prog)return;
 const incomplete=S.prog.sel.length-S.prog.done.length;
 const execute=()=>{
  const snapshot=JSON.parse(JSON.stringify(S.prog));
  const gymHabit=S.chk.find(c=>/ir al gym/i.test(c.t))||S.chk.find(c=>/^gym/i.test(c.t));
  if(gymHabit&&snapshot.done.length){const key=S.activeId+'|'+iso();S.chkLog[key]=S.chkLog[key]||{};S.chkLog[key][gymHabit.id]=true}
  const summary=buildSessionSummary(snapshot);
  S.prog=null;persist();render();toast('¡Rutina terminada! 💗');openSessionSummary(summary);
 };
 if(incomplete)return confirmModal('¿Finalizar la sesión?',`Te quedan ${incomplete} ejercicios por marcar. Los que completaste ya están guardados.`,execute,'Finalizar');
 execute();
}
function toggleHabit(id,checked){
 if(!editing())return;
 const k=S.activeId+'|'+iso();S.chkLog[k]=S.chkLog[k]||{};S.chkLog[k][id]=checked;persist();
}
function checkHistory(mode='month',offset=0){
 const end=stageEnd(),t=localDate(end),today=iso();
 let days=[],heading='';
 if(mode==='week'){
  t.setDate(t.getDate()-(t.getDay()+6)%7+offset*7);
  days=Array.from({length:7},(_,i)=>iso(new Date(t.getFullYear(),t.getMonth(),t.getDate()+i,12)));
  heading='Semana del '+days[0].slice(8)+'/'+days[0].slice(5,7);
 }else{
  t.setDate(1);t.setMonth(t.getMonth()+offset);
  const count=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();
  days=Array.from({length:count},(_,i)=>iso(new Date(t.getFullYear(),t.getMonth(),i+1,12)));
  heading=t.toLocaleDateString('es-AR',{month:'long',year:'numeric'});
 }
 const visible=days.filter(d=>d>=stage().start&&d<=end),tracked=visible.filter(d=>Object.prototype.hasOwnProperty.call(S.chkLog,stage().id+'|'+d));
 const head=`<div style="display:grid;grid-template-columns:repeat(${days.length},minmax(0,1fr));gap:3px;margin-top:12px">${days.map((d,i)=>`<span style="font-size:8px;text-align:center;color:var(--muted)">${mode==='week'?'LMXJVSD'[i]:(i===0||(i+1)%5===0?i+1:'')}</span>`).join('')}</div>`;
 const rows=S.chk.map(c=>{
  const checked=visible.filter(d=>S.chkLog[stage().id+'|'+d]?.[c.id]).length;
  const tiles=days.map(d=>{
   const out=d>end||d<stage().start,L=S.chkLog[stage().id+'|'+d],seen=L!==undefined,check=!!L?.[c.id];
   const style=out?'background:var(--surface-2);opacity:.3':check?'background:var(--accent)':seen?'background:var(--surface-3);border:1px solid var(--edge)':'background:transparent;border:1px dashed var(--edge)';
   return `<span title="${d} · ${out?'Fuera de la etapa':check?'Marcado':seen?'No marcado':'Sin registro'}" style="aspect-ratio:1;min-height:8px;border-radius:3px;${style}"></span>`;
  }).join('');
  return `<div style="margin-top:15px"><div class="row between"><strong class="small">${escapeHtml(c.t)}</strong><span class="small muted">${checked} / ${tracked.length} días anotados</span></div><div style="display:grid;grid-template-columns:repeat(${days.length},minmax(0,1fr));gap:3px;margin-top:7px">${tiles}</div></div>`;
 }).join('');
 showModal('Constancia · '+heading,`<div class="row between wrap"><div class="small muted">Días con checklist: <strong>${tracked.length} / ${visible.length}</strong></div><div class="btn-row"><button class="btn sm" data-history-mode="${mode==='week'?'month':'week'}">${mode==='week'?'Ver mes':'Ver semana'}</button><button class="btn sm ghost" data-history-move="prev">‹</button><button class="btn sm ghost" data-history-move="next" ${offset>=0?'disabled':''}>›</button></div></div>
 <p class="small muted">Rosa: hecho · Gris sólido: no marcado · Contorno punteado: no registraste ese día.</p>${head}${rows||'<div class="nothing">No hay hábitos configurados.</div>'}`, [{label:'Cerrar',onClick:()=>{}}],{onOpen:el=>{
  el.querySelector('[data-history-mode]').onclick=()=>checkHistory(mode==='week'?'month':'week',0);
  el.querySelectorAll('[data-history-move]').forEach(b=>b.onclick=()=>checkHistory(mode,offset+(b.dataset.historyMove==='prev'?-1:1)));
 }});
}
function gymProgressChart(){
 const logs=rec('hist'),ids=[...new Set(logs.map(x=>x.e))],pick=ids.includes(ui.exerciseId)?ui.exerciseId:ids[0];
 if(!pick)return '<div class="nothing">Cuando registres ejercicios vas a poder seguir la evolución de cargas aquí.</div>';
 const e=exercise(pick),name=e?.name||'Ejercicio anterior';
 return `<div class="card"><div class="card-title"><div><h2>Evolución de cargas</h2><p class="small muted">Carga máxima anotada · respetando las fechas</p></div></div><div class="field" style="margin-bottom:12px"><label for="select-exercise">Ejercicio</label><select id="select-exercise" data-change="exercise">${ids.map(id=>`<option value="${id}" ${pick==id?'selected':''}>${escapeHtml(exerciseName(id))}</option>`).join('')}</select></div>${svgTimeSeries(logs.filter(x=>x.e==pick).map(x=>({...x,weight:(x.s.map(s=>exerciseWeight(s.w)).filter(Number.isFinite).reduce((m,v)=>Math.max(m,v),-Infinity))})),x=>x.weight,e?.u||'kg')}<p class="no-data-note">Se muestran sólo las sesiones anotadas. Los períodos sin entrenamiento quedan espaciados según el calendario.</p></div>`;
}
// Render the dedicated exercise progression chart instead of treating every workout day as a flat 1-point line.
function pageGym(){
 if(editing()&&S.prog&&S.prog.stageId===S.activeId&&S.prog.d===iso())return session();
 const count=rec('hist').length,trained=new Set(rec('hist').map(x=>x.d)).size;
 return `<div class="content">${sectionTitle('Mis entrenamientos','GYM')}
 <div class="cards-2">${stat('Días entrenados',fmt(trained),'días','En esta etapa')}${stat('Ejercicios anotados',fmt(count),'','Cada ejercicio completado')}</div>
 <div class="card"><div class="card-title"><div><h2>Rutinas</h2><p class="small muted">Elegí la que hagas hoy; podés cambiar el orden.</p></div>${editing()?'<button class="btn sm" data-action="routine-edit">Gestionar</button>':''}</div><div class="list-items">${S.rt.map(routineCard).join('')||'<div class="nothing">Todavía no hay rutinas.</div>'}</div></div>
 <div class="row between wrap"><div><h2>Progreso real</h2><p class="small muted">Cargas y constancia en el tiempo</p></div>${periodButtons()}</div>${gymProgressChart()}
 <div class="card"><div class="card-title"><h2>Días de entrenamiento</h2></div><div class="table-wrap"><table class="table"><thead><tr><th>Fecha</th><th>Ejercicios registrados</th></tr></thead><tbody>${[...new Set(rec('hist').map(x=>x.d))].sort().reverse().slice(0,20).map(d=>`<tr><td>${d}</td><td>${rec('hist').filter(x=>x.d===d).length} <button class="btn sm ghost" data-action="gym-history" data-date="${d}">Ver</button></td></tr>`).join('')||'<tr><td colspan="2">Sin registros todavía.</td></tr>'}</tbody></table></div></div>${calendar()}</div>`;
}

/* ---------- Actions + boot ---------- */
function navigate(page){ui.page=page;ui.calendarOffset=0;render();window.scrollTo({top:0,behavior:'instant'})}
const ACTIONS={
 'nav':b=>navigate(b.dataset.page),
 'view-active':()=>{ui.viewStage=null;render()},
 'theme':b=>{S.theme=b.dataset.theme;persist();render()},
 'theme-cycle':()=>{S.theme=({auto:'dark',dark:'light',light:'auto'})[S.theme||'auto'];persist();render()},
 'period':b=>{ui.period=b.dataset.period==='todo'?'todo':Number(b.dataset.period);render()},
 'month-prev':()=>{ui.calendarOffset--;render()},
 'month-next':()=>{if(ui.calendarOffset<0)ui.calendarOffset++;render()},
 'measure-field':b=>{ui.chartMeasure=b.dataset.field;render()},
 'food-add':()=>openFoodModal(),
 'food-edit':b=>openFoodModal(b.dataset.date),
 'food-paste':openPasteModal,
 'food-delete':b=>confirmModal('Eliminar día de alimentación',`¿Querés borrar el registro del ${b.dataset.date}? Podrás recuperarlo desde una copia de seguridad anterior.`,()=>deleteRecord('food',b.dataset.date),'Eliminar registro',true),
 'profile-edit':openProfileModal,
 'body-add':()=>openBodyModal(),
 'body-edit':b=>openBodyModal(b.dataset.date),
 'body-delete':b=>confirmModal('Eliminar pesaje',`¿Querés borrar el control del ${b.dataset.date}? Si estaba asociado a un umbral, volverá a quedar pendiente.`,()=>deleteRecord('body',b.dataset.date),'Eliminar registro',true),
 'routine-start':b=>startSession(Number(b.dataset.id)),
 'routine-edit':manageRoutineList,
 'session-add':addSessionExercise,
 'session-log':b=>logExercise(Number(b.dataset.id)),
 'session-edit':b=>editSessionSeries(Number(b.dataset.id)),
 'session-skip':b=>{if(!S.prog)return;S.prog.sel=S.prog.sel.filter(id=>id!==Number(b.dataset.id));persist();render()},
 'gym-history':b=>gymHistory(b.dataset.date),
 'session-finish':finishSession,
 'session-cancel':()=>confirmModal('Descartar sesión actual','Se borrará la lista pendiente. Los ejercicios que ya anotaste seguirán en el historial.',()=>{S.prog=null;persist();render()},'Descartar',true),
 'plan-edit':()=>planEdit(),
 'checklist-history':checkHistory,
 'checklist-config':checklistEdit,
 'ex-list':exerciseList,
 'export':exportJSON,
 'import':()=>$('#import-file').click(),
 'stage-new':newStageModal,
 'stage-view':b=>chooseStage(b.dataset.id)
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b||b.disabled)return;
 const action=ACTIONS[b.dataset.action];if(!action)return;
 try{action(b)}catch(err){console.error(err);toast(err.message||'Ocurrió un error')}
});
document.addEventListener('change',e=>{
 if(e.target.matches('[data-checkid]'))toggleHabit(e.target.dataset.checkid,e.target.checked);
 if(e.target.matches('[data-change="exercise"]')){ui.exerciseId=Number(e.target.value);render()}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal-root .modal'))closeModal()});
$('#import-file').addEventListener('change',async e=>{
 const f=e.target.files?.[0];if(!f)return;
 try{
  if(f.size>8*1024*1024)throw Error('El archivo es demasiado grande');
  const candidate=validateLoaded(JSON.parse(await f.text()));
  confirmModal('Importar copia de seguridad','Este archivo reemplazará todos los datos actuales de Mi Gym 2.0 en este dispositivo. Exportá antes un backup si querés conservarlos.',()=>{
   // Validate first, then replace the in-memory state in one step.
   Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,candidate);
   ui.viewStage=null;ui.page='inicio';ui.period=30;ui.calendarOffset=0;ui.exerciseId=null;
   persist();render();toast('Backup importado correctamente');
  },'Importar y reemplazar',true);
 }catch(err){toast(err.message||'Archivo no válido')}
 e.target.value='';
});
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Offline no disponible:',e)));
}
milestones();persist();render();
/* Extra corrections for historical workout data. */
function gymHistory(d){
 const entries=S.hist.map((x,i)=>({...x,idx:i})).filter(x=>x.stageId===stage().id&&x.d===d);
 showModal('Entrenamiento · '+d,`<div class="list-items">${entries.map(x=>{const e=exercise(x.e);return `<div class="list-item"><div class="maintext"><strong>${escapeHtml(exerciseName(x.e))}</strong><div class="exercise-sets">${seriesHTML(x.s,e)}</div></div>${editing()?`<button class="btn sm" data-edit="${x.idx}">✎</button><button class="btn sm danger" data-trash="${x.idx}" aria-label="Eliminar ejercicio registrado">×</button>`:''}</div>`}).join('')||'<div class="nothing">Sin ejercicios registrados</div>'}</div>`,[{label:'Cerrar',onClick:()=>{}}],{onOpen:el=>{
  el.querySelectorAll('[data-trash]').forEach(btn=>btn.onclick=()=>{
   const idx=Number(btn.dataset.trash),item=S.hist[idx];
   if(!item||item.stageId!==S.activeId)return;
   confirmModal('Eliminar ejercicio del historial','Se borrará sólo este registro. El ejercicio y su rutina seguirán disponibles.',()=>{S.hist.splice(idx,1);persist();render();toast('Ejercicio eliminado del historial')},'Eliminar',true);
  });
  el.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>editHistoricExercise(Number(btn.dataset.edit)));
 }});
}
function editHistoricExercise(index){
 const record=S.hist[index];if(!record||!editing()||record.stageId!==S.activeId)return;
 const rows=(record.s||[]).map(x=>({...x}));
 const renderRows=el=>{
  el.querySelector('[data-rows]').innerHTML=rows.map((x,i)=>`<div class="series-edit"><span class="series-num">${i+1}</span><input data-w="${i}" value="${escapeAttr(x.w)}" aria-label="Peso serie ${i+1}"><input data-r="${i}" value="${escapeAttr(x.r)}" aria-label="Reps serie ${i+1}"></div>`).join('');
  el.querySelectorAll('[data-w]').forEach(x=>x.oninput=()=>rows[+x.dataset.w].w=x.value);
  el.querySelectorAll('[data-r]').forEach(x=>x.oninput=()=>rows[+x.dataset.r].r=x.value);
 };
 showModal('Corregir registro · '+exerciseName(record.e),`<p class="small muted">Fecha: ${escapeHtml(record.d)}. Esto modifica sólo la sesión registrada, no la carga habitual del ejercicio.</p><div class="stack" data-rows></div>`,[
 {label:'Cancelar',onClick:()=>{}},{label:'Guardar corrección',kind:'primary',onClick:()=>{
  if(rows.some(x=>!String(x.w).trim()||!String(x.r).trim()))throw Error('Las series no pueden quedar vacías');
  record.s=rows;persist();render();toast('Registro corregido');
 }}],{onOpen:renderRows});
}

function refreshLiveTimer(){const el=document.querySelector('[data-live-timer]');if(!el||!S.prog)return;el.textContent=formatDuration(sessionElapsedMs(S.prog))}
setInterval(refreshLiveTimer,1000);
