import pine_seed from'./assets/pine_seed.png';
import pine_sprout from'./assets/pine_sprout.png';
import pine_sapling from'./assets/pine_sapling.png';
import pine_young from'./assets/pine_young.png';
import pine_mature from'./assets/pine_mature.png';
import poplar_seed from'./assets/poplar_seed.png';
import poplar_sprout from'./assets/poplar_sprout.png';
import poplar_sapling from'./assets/poplar_sapling.png';
import poplar_young from'./assets/poplar_young.png';
import poplar_mature from'./assets/poplar_mature.png';
import fruit_seed from'./assets/fruit_seed.png';
import fruit_sprout from'./assets/fruit_sprout.png';
import fruit_sapling from'./assets/fruit_sapling.png';
import fruit_young from'./assets/fruit_young.png';
import fruit_mature from'./assets/fruit_mature.png';
import sakura_seed from'./assets/sakura_seed.png';
import sakura_sprout from'./assets/sakura_sprout.png';
import sakura_sapling from'./assets/sakura_sapling.png';
import sakura_young from'./assets/sakura_young.png';
import sakura_mature from'./assets/sakura_mature.png';
import maple_seed from'./assets/maple_seed.png';
import maple_sprout from'./assets/maple_sprout.png';
import maple_sapling from'./assets/maple_sapling.png';
import maple_young from'./assets/maple_young.png';
import maple_mature from'./assets/maple_mature.png';
import bamboo_seed from'./assets/bamboo_seed.png';
import bamboo_sprout from'./assets/bamboo_sprout.png';
import bamboo_sapling from'./assets/bamboo_sapling.png';
import bamboo_young from'./assets/bamboo_young.png';
import bamboo_mature from'./assets/bamboo_mature.png';
import pine_kernel from'./assets/pine_kernel.png';
import poplar_kernel from'./assets/poplar_kernel.png';
import fruit_kernel from'./assets/fruit_kernel.png';
import sakura_kernel from'./assets/sakura_kernel.png';
import maple_kernel from'./assets/maple_kernel.png';
import bamboo_kernel from'./assets/bamboo_kernel.png';
import islandArt from'./assets/island.png';
import islandForest from'./assets/island_forest.png';
import islandAutumn from'./assets/island_autumn.png';
const terrainArt:Record<'meadow'|'forest'|'autumn',string>={meadow:islandArt,forest:islandForest,autumn:islandAutumn};
const WEATHERS=[
 ['sunny','暖阳','午后洒下的金色阳光'],
 ['rain','细雨','安静的沙沙雨声'],
 ['sunset','晚霞','橙紫交织的黄昏']]as const;
const LANDS=[
 ['meadow','春日草坡','嫩绿与暖土'],
 ['forest','苔藓森林','深绿与雾气'],
 ['autumn','秋日山谷','金黄与赭石']]as const;
import{useEffect,useMemo,useRef,useState}from'react';
import type{FormEvent}from'react';
import{ArrowLeft,BarChart3,Check,ChevronRight,Home,Pause,Play,Plus,RotateCcw,Settings as Cog,Settings2,TimerReset,TreePine,Users,CloudRain,Sun,Palette,Trash2,X,Sprout,Clock,Heart,Star,Flame,ThumbsUp,MessageCircle,UserPlus,Move}from'lucide-react';
import{useGarden}from'./store';
import{treeNames,treeScale,treeStage,stageLabel,seriesByBucket,gardenStars,streaks,wateringCount,maturedTrees,projectProgress,encourage,growthDays,calendarByDay,monthGrid,daysUntil,DEFAULT_MATURE_MINUTES,MIN_MATURE_MINUTES,MAX_MATURE_MINUTES,clampMature,stageThresholds}from'./domain';
import type{Bucket,GrowthStage}from'./domain';
import type{Project,Task,TreeType,FocusSession,Terrain,Weather}from'./types';

type Page='home'|'stats'|'visit'|'settings';
type Clock={projectId:string;taskId:string;mode:'up'|'down';target:number;baseElapsed:number;startedAt:number|null}|null;

const treeArt:Record<TreeType,Record<GrowthStage,string>>={
 pine:{seed:pine_kernel,sprout:pine_seed,sapling:pine_sprout,sturdy:pine_sapling,lush:pine_young,mature:pine_mature},
 poplar:{seed:poplar_kernel,sprout:poplar_seed,sapling:poplar_sprout,sturdy:poplar_sapling,lush:poplar_young,mature:poplar_mature},
 fruit:{seed:fruit_kernel,sprout:fruit_seed,sapling:fruit_sprout,sturdy:fruit_sapling,lush:fruit_young,mature:fruit_mature},
 sakura:{seed:sakura_kernel,sprout:sakura_seed,sapling:sakura_sprout,sturdy:sakura_sapling,lush:sakura_young,mature:sakura_mature},
 maple:{seed:maple_kernel,sprout:maple_seed,sapling:maple_sprout,sturdy:maple_sapling,lush:maple_young,mature:maple_mature},
 bamboo:{seed:bamboo_kernel,sprout:bamboo_seed,sapling:bamboo_sprout,sturdy:bamboo_sapling,lush:bamboo_young,mature:bamboo_mature}
};
const fmt=(s:number)=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const humanTime=(m:number)=>m>=60?`${Math.floor(m/60)} 小时 ${m%60?`${m%60} 分`:''}`.trim():`${m} 分钟`;

/* —— 花园星光徽章:自绘四芒星 + 小伴星,金→黛绿柔和渐变,与森林调更文艺 —— */
function StarBadge({id='sg'}:{id?:string}){
 return <svg className="star-svg" viewBox="0 0 24 24" aria-hidden="true">
  <defs>
   <linearGradient id={`starSpark-${id}`} x1="3" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
    <stop offset="0" stopColor="#f2d489"/><stop offset=".5" stopColor="#c9a95c"/><stop offset="1" stopColor="#7ba883"/>
   </linearGradient>
  </defs>
  <path d="M13.3 3.1c.16 0 .3.11.35.27l1.06 3.55c.28.93 1 1.65 1.93 1.93l3.55 1.06c.16.05.27.19.27.35s-.11.3-.27.35l-3.55 1.06c-.93.28-1.65 1-1.93 1.93l-1.06 3.55a.37.37 0 01-.7 0l-1.06-3.55a2.66 2.66 0 00-1.93-1.93L6.41 10.66a.37.37 0 010-.7l3.55-1.06c.93-.28 1.65-1 1.93-1.93l1.06-3.55a.37.37 0 01.35-.32z" fill={`url(#starSpark-${id})`}/>
  <path d="M6 14.6c.08 0 .15.06.18.14l.42 1.34c.13.42.46.75.88.88l1.34.42a.19.19 0 010 .36l-1.34.42c-.42.13-.75.46-.88.88l-.42 1.34a.19.19 0 01-.36 0l-.42-1.34a1.24 1.24 0 00-.88-.88l-1.34-.42a.19.19 0 010-.36l1.34-.42c.42-.13.75-.46.88-.88l.42-1.34c.03-.08.1-.14.18-.14z" fill={`url(#starSpark-${id})`} opacity=".72"/>
 </svg>;
}

/* —— 成长足迹三枚精致线性图标 —— */
function IcoGrowth(){
 return <svg className="grow-line" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <path d="M14 24V12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  <path d="M14 15.5c-.4-3-2.6-5-5.4-5.4C8.1 13 10.3 15.1 14 15.5z" fill="currentColor" opacity=".9"/>
  <path d="M14 13c.3-3.3 2.6-5.6 5.6-6-.4 3.4-2.5 5.7-5.6 6z" fill="currentColor"/>
  <path d="M21.3 5.2l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" fill="currentColor" opacity=".75"/>
  <path d="M6.5 24h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
 </svg>;
}
function IcoCalendar(){
 return <svg className="grow-line" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <rect x="4.5" y="6.5" width="19" height="17" rx="3.2" stroke="currentColor" strokeWidth="1.7"/>
  <path d="M4.5 11.2h19" stroke="currentColor" strokeWidth="1.7"/>
  <path d="M9.5 4.5v4M18.5 4.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  <circle cx="10" cy="15.5" r="1.3" fill="currentColor"/>
  <circle cx="14" cy="15.5" r="1.3" fill="currentColor"/>
  <circle cx="18" cy="15.5" r="1.3" fill="currentColor" opacity=".55"/>
  <circle cx="10" cy="19.5" r="1.3" fill="currentColor" opacity=".55"/>
  <circle cx="14" cy="19.5" r="1.3" fill="currentColor" opacity=".55"/>
 </svg>;
}
function IcoHourglass(){
 return <svg className="grow-line" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <path d="M8 4.5h12M8 23.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  <path d="M9 4.5c0 4.5 2 6.4 5 9.5 3-3.1 5-5 5-9.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  <path d="M9 23.5c0-4.5 2-6.4 5-9.5 3 3.1 5 5 5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  <path d="M11.4 20.5c.7-1.8 1.6-2.9 2.6-4 1 1.1 1.9 2.2 2.6 4z" fill="currentColor" opacity=".85"/>
 </svg>;
}

function Tree({type,minutes,done,style,draggable,dragging,onPointerDown,mature}:{type:TreeType;minutes:number;done:boolean;style?:React.CSSProperties;draggable?:boolean;dragging?:boolean;onPointerDown?:(e:React.PointerEvent)=>void;mature?:number}){
 const setMature=useGarden(s=>s.settings.matureMinutes)??DEFAULT_MATURE_MINUTES;
 const M=mature??setMature;
 const st=treeStage(minutes,M);
 return <div className={`focus-tree art-tree ${type} stage-${st} ${done?'complete':''} ${draggable?'draggable':''} ${dragging?'dragging':''}`} style={{'--scale':treeScale(minutes,M),...style}as React.CSSProperties} onPointerDown={onPointerDown}>
  <img src={treeArt[type][st]} alt="" draggable={false}/>
  <span>{minutes}m</span>
 </div>
}

/* —— 首页 —— */
function HomePage({open,manage}:{open:(id:string)=>void;manage:()=>void}){
 const allProjects=useGarden(s=>s.projects);
 const projects=allProjects.filter(p=>!p.archived);
 const sessions=useGarden(s=>s.sessions);
 const settings=useGarden(s=>s.settings);
 const minutesOf=(pid:string,tid:string)=>sessions.filter(x=>x.projectId===pid&&x.taskId===tid).reduce((n,x)=>n+x.minutes,0);
 const stars=gardenStars(allProjects,sessions,minutesOf);
 const todayKey=(()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})();
 const todayMinutes=sessions.filter(x=>x.completedAt.slice(0,10)===todayKey).reduce((n,x)=>n+x.minutes,0);
 return <main className={`home-page theme-${settings.weather} land-${settings.terrain}`}>
  <div className="weather-fx"/>
  <div className="scene-title"><b>木漏れ日の庭</b><span>风经过树梢，今天也适合种下一点时间。</span></div>
  <header className="brand"><div><small>MORI · FOCUS GARDEN</small><h1>把时间，种成森林。</h1></div><div className="star-pill" title="花园星光：你的总成就分——完成事项、长成大树与连续陪伴累积而来"><StarBadge id="home"/>{stars}</div></header>
  <section className="today"><span>今日投入</span><strong>{todayMinutes}</strong><em>分钟</em><p>每项子任务是一棵树，投入越久，树长得越高。</p></section>
  <div className="title-row"><h2>目标土地</h2><button className="manage-btn" onClick={manage}><Settings2/>管理目标</button></div>
  <section className="plots">
   {projects.map((p,i)=>{
    const ps=sessions.filter(x=>x.projectId===p.id);
    const prog=projectProgress(p,minutesOf,settings.matureMinutes??DEFAULT_MATURE_MINUTES);
    return <div className={`project poster-${i%3}`} key={p.id}>
     <button className="project-open" onClick={()=>open(p.id)}>
      <div className="project-copy"><small>{String(i+1).padStart(2,'0')} / {treeNames[p.treeType]}林</small><h3>{p.name}</h3><p>{p.description}</p></div>
      <div className="mini-grove">{p.tasks.slice(0,5).map(t=><Tree key={t.id} type={p.treeType} done={t.done} minutes={ps.filter(x=>x.taskId===t.id).reduce((n,x)=>n+x.minutes,0)}/>)}</div>
      <div className="plot-foot"><div className="plot-meta"><span>{p.tasks.length} 棵树 · {ps.reduce((n,x)=>n+x.minutes,0)} 分钟</span><small className="plot-prog-txt">成林 {prog}%</small></div><div className="plot-prog"><i style={{width:`${prog}%`}}/></div></div>
      <ChevronRight/>
     </button>
    </div>
   })}
   {projects.length===0&&<div className="empty-hint">还没有目标土地，点右上角<b>「管理目标」</b>开垦第一块吧。</div>}
  </section>
 </main>
}

/* —— 管理目标:新增 + 删除都在这里 —— */
function Manage({close}:{close:()=>void}){
 const allProjects=useGarden(s=>s.projects);
 const projects=allProjects.filter(p=>!p.archived);
 const settings=useGarden(s=>s.settings);
 const add=useGarden(s=>s.addProject);
 const removeProject=useGarden(s=>s.removeProject);
 const updateProject=useGarden(s=>s.updateProject);
 const[name,setName]=useState('');
 const[tree,setTree]=useState<TreeType>('pine');
 const[confirm,setConfirm]=useState<Project|null>(null);
 const submit=(e:FormEvent)=>{e.preventDefault();if(name.trim()){add(name.trim(),'把每一次专注，积累成看得见的生长。',tree);setName('')}};
 return <div className="modal sheet" onClick={close}>
  <div className="manage-sheet" onClick={e=>e.stopPropagation()}>
   <button className="sheet-close" onClick={close}><X/></button>
   <small>MANAGE LAND</small>
   <h2>管理目标土地</h2>
   <p className="manage-lead">在这里开垦新的土地、为每块土地挑选专属的地貌与天气，或移除不再需要的花园。</p>

   <div className="manage-add">
    <h3>开垦新土地</h3>
    <form onSubmit={submit}>
     <input value={name} onChange={e=>setName(e.target.value)} placeholder="目标名称，例如：练习吉他"/>
     <div className="tree-pick">{(['pine','poplar','fruit','sakura','maple','bamboo']as TreeType[]).map(x=><button type="button" key={x} className={`tp ${x} ${tree===x?'on':''}`} onClick={()=>setTree(x)}><i/><b>{treeNames[x]}</b></button>)}</div>
     <button className="submit" disabled={!name.trim()}><Plus/>创建土地</button>
    </form>
   </div>

   <div className="manage-list">
    <h3>已有土地 <em>{projects.length}</em></h3>
    {projects.map(p=>{
     const terrain:Terrain=p.terrain??settings.terrain;
     const weather:Weather=p.weather??settings.weather;
     return <div className="manage-row" key={p.id}>
      <div className="mr-top">
       <span className={`type-dot ${p.treeType}`}/>
       <div className="mr-info"><b>{p.name}</b><em>{treeNames[p.treeType]}林 · {p.tasks.length} 棵树</em></div>
       <button className="mr-del" title="删除" onClick={()=>setConfirm(p)}><Trash2/></button>
      </div>
      <div className="mr-scene">
       <div className="sp-group"><span className="sp-label">土地</span><div className="sp-row">{LANDS.map(([lid,label])=>{const on=terrain===lid;return <button type="button" key={lid} className={`sp-chip lc-${lid} ${on?'on':''}`} onClick={()=>updateProject(p.id,{terrain:lid})}>{label}</button>})}</div></div>
       <div className="sp-group"><span className="sp-label">天气</span><div className="sp-row">{WEATHERS.map(([wid,label])=>{const on=weather===wid;return <button type="button" key={wid} className={`sp-chip wc-${wid} ${on?'on':''}`} onClick={()=>updateProject(p.id,{weather:wid})}>{label}</button>})}</div></div>
      </div>
     </div>;
    })}
    {projects.length===0&&<div className="mr-empty">还没有土地，先在上面开垦一块吧。</div>}
   </div>

   {confirm&&<div className="modal" onClick={()=>setConfirm(null)}>
    <div className="confirm" onClick={e=>e.stopPropagation()}>
     <h2>删除「{confirm.name}」?</h2>
     <p>这块土地、它的 {confirm.tasks.length} 棵树和全部专注记录都会被移除，且无法恢复。</p>
     <div className="confirm-btns"><button className="ghost" onClick={()=>setConfirm(null)}>再想想</button><button className="danger" onClick={()=>{removeProject(confirm.id);setConfirm(null)}}>删除</button></div>
    </div>
   </div>}
  </div>
 </div>
}

/* —— 可拖拽的树林场景 —— */
function defaultPos(i:number,n:number){
 // 沿中央下部的“四菱形”区域均匀铺开,避开左侧河道
 const cols=Math.min(n,4);
 const col=i%cols, row=Math.floor(i/cols);
 const x=cols===1?50:34+col*(40/(cols-1));
 const y=70-row*13;
 return{x,y:Math.max(40,y)};
}
function Grove({pid,tasks,terrainUrl,minutesOf,defaultTree}:{pid:string;tasks:Task[];terrainUrl:string;minutesOf:(t:Task)=>number;defaultTree:TreeType}){
 const setTaskPos=useGarden(s=>s.setTaskPos);
 const areaRef=useRef<HTMLDivElement>(null);
 const[drag,setDrag]=useState<{id:string;x:number;y:number}|null>(null);
 const[active,setActive]=useState<string|null>(null);
 const dragRef=useRef<{id:string;x:number;y:number}|null>(null);
 const startDrag=(e:React.PointerEvent,t:Task,fx:number,fy:number)=>{
  e.preventDefault();e.stopPropagation();
  setActive(t.id);
  const area=areaRef.current;if(!area)return;
  const move=(ev:PointerEvent)=>{
   const r=area.getBoundingClientRect();
   let x=(ev.clientX-r.left)/r.width*100;
   let y=(ev.clientY-r.top)/r.height*100;
   x=Math.max(8,Math.min(92,x));y=Math.max(30,Math.min(90,y));
   dragRef.current={id:t.id,x,y};setDrag({id:t.id,x,y});
  };
  const up=()=>{
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);
   const d=dragRef.current;if(d)setTaskPos(pid,d.id,{x:d.x,y:d.y});
   dragRef.current=null;setDrag(null);setActive(null);
  };
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
  dragRef.current={id:t.id,x:fx,y:fy};setDrag({id:t.id,x:fx,y:fy});
 };
 return <section className="grove">
  <div className="grove-island" style={{backgroundImage:`url(${terrainUrl})`}}/>
  <div className="weather-fx"/>
  <div className="grove-trees free" ref={areaRef}>
   {tasks.map((t,i)=>{
    const base=t.pos??defaultPos(i,tasks.length);
    const live=drag&&drag.id===t.id?drag:base;
    return <div className={`tree-slot ${drag?.id===t.id?'dragging':''}`} key={t.id}
     style={{left:`${live.x}%`,top:`${live.y}%`}}
     onPointerDown={e=>startDrag(e,t,base.x,base.y)}>
     {active===t.id&&<span className="tree-hint"><Move/>拖动可移动树的位置</span>}
     <Tree type={t.treeType||defaultTree} done={t.done} minutes={minutesOf(t)} draggable dragging={drag?.id===t.id}/>
    </div>;
   })}
   {tasks.length===0&&<span className="grove-empty">在下面添加第一项子任务,土地上会长出一棵树。</span>}
  </div>
 </section>;
}

/* —— 目标土地详情 —— */
function ProjectPage({id,back}:{id:string;back:()=>void}){
 const settings=useGarden(s=>s.settings);
 const p=useGarden(s=>s.projects.find(x=>x.id===id));
 const sessions=useGarden(s=>s.sessions);
 const addTask=useGarden(s=>s.addTask);
 const toggle=useGarden(s=>s.toggleTask);
 const removeTask=useGarden(s=>s.removeTask);
 const addSession=useGarden(s=>s.addSession);
 const[clock,setClock]=useState<Clock>(()=>{try{const raw=JSON.parse(localStorage.getItem('mori-active-clock')||'null');if(!raw)return null;
  // 兼容旧版(基于秒数心跳)数据 → 迁移为基于时间戳
  if('seconds'in raw){const base=raw.mode==='down'?(raw.target-raw.seconds):raw.seconds;return{projectId:raw.projectId,taskId:raw.taskId,mode:raw.mode,target:raw.target,baseElapsed:Math.max(0,base),startedAt:raw.running?Date.now():null}}
  return raw}catch{return null}});
 const[now,setNow]=useState(()=>Date.now());
 const[taskName,setTaskName]=useState('');
 const[duration,setDuration]=useState(25);
 const[taskTree,setTaskTree]=useState<TreeType|undefined>(undefined);
 const[pickName,setPickName]=useState<string|null>(null);
 const[delTask,setDelTask]=useState<Task|null>(null);
 useEffect(()=>{if(clock)localStorage.setItem('mori-active-clock',JSON.stringify(clock));else localStorage.removeItem('mori-active-clock')},[clock]);
 // 基于时间戳:运行时每秒刷新 now 用于显示;真实用时由 (now - startedAt) 计算,锁屏/切后台/离开页面回来都能补上真实流逝的时间
 useEffect(()=>{if(!clock?.startedAt)return;setNow(Date.now());const x=setInterval(()=>setNow(Date.now()),1000);const onVis=()=>{if(document.visibilityState==='visible')setNow(Date.now())};document.addEventListener('visibilitychange',onVis);return()=>{clearInterval(x);document.removeEventListener('visibilitychange',onVis)}},[clock?.startedAt]);
 // 倒计时到点:自动记账并停止
 useEffect(()=>{if(!clock||clock.mode!=='down'||!clock.startedAt)return;const elapsed=clock.baseElapsed+(now-clock.startedAt)/1000;if(elapsed>=clock.target){addSession(clock.projectId,clock.taskId,Math.max(1,Math.round(clock.target/60)));setClock(null)}},[now,clock,addSession]);
 if(!p)return null;
 const terrain:Terrain=p.terrain??settings.terrain;
 const weather:Weather=p.weather??settings.weather;
 const taskMinutes=(t:Task)=>sessions.filter(x=>x.projectId===id&&x.taskId===t.id).reduce((n,x)=>n+x.minutes,0);
 const start=(t:Task,mode:'up'|'down')=>setClock({projectId:id,taskId:t.id,mode,target:duration*60,baseElapsed:0,startedAt:Date.now()});
 // 已流逝真实秒数(基于时间戳)
 const elapsedOf=(c:NonNullable<Clock>)=>c.baseElapsed+(c.startedAt?(now-c.startedAt)/1000:0);
 const running=!!clock?.startedAt;
 const toggleRun=()=>setClock(c=>{if(!c)return c;return c.startedAt?{...c,baseElapsed:elapsedOf(c),startedAt:null}:{...c,startedAt:Date.now()}});
 const stop=()=>{if(!clock)return;const e=elapsedOf(clock);const spent=clock.mode==='up'?e:Math.min(e,clock.target);if(spent>=1)addSession(id,clock.taskId,Math.max(1,Math.round(spent/60)));setClock(null)};
 return <main className={`project-page theme-${weather} land-${terrain}`}>
  <div className="focus-sky"><span>专注森林</span><b>让这一小时，安静地生长</b></div>
  <button className="back" onClick={back}><ArrowLeft/></button>
  <section className="project-head"><small>{treeNames[p.treeType]}林 · {p.tasks.length} 棵树</small><h1>{p.name}</h1><p>{p.description}</p></section>
  <Grove pid={id} tasks={p.tasks} terrainUrl={terrainArt[terrain]} minutesOf={taskMinutes} defaultTree={p.treeType}/>
  <div className="task-title"><h2>子任务</h2><span>每项任务对应一棵树</span></div>
  <section className="task-list">
   {p.tasks.map(t=>{
    const active=clock?.taskId===t.id;
    const m=taskMinutes(t);
    return <article className={active?'active':''} key={t.id}>
     <button className="check" onClick={()=>toggle(id,t.id)}>{t.done&&<Check/>}</button>
     <div className="task-info"><b>{t.title}</b><span>{treeNames[t.treeType||p.treeType]} · 累计专注 {m} 分钟 · {stageLabel(m,settings.matureMinutes??DEFAULT_MATURE_MINUTES)} · {t.done?'已完成':'进行中'}</span></div>
     {active?<div className="clock"><strong>{fmt(Math.max(0,Math.round(clock!.mode==='up'?elapsedOf(clock!):clock!.target-elapsedOf(clock!))))}</strong><button onClick={toggleRun}>{running?<Pause/>:<Play/>}</button><button onClick={stop}><RotateCcw/></button></div>
      :<div className="start"><button onClick={()=>start(t,'up')}>正计时</button><button onClick={()=>start(t,'down')}>倒计时</button></div>}
     <button className="task-del" title="删除子任务" onClick={()=>setDelTask(t)}><Trash2/></button>
    </article>
   })}
  </section>
  <div className="duration"><TimerReset/><span>倒计时</span><input type="range" min="5" max="240" step="5" value={duration} onChange={e=>setDuration(+e.target.value)}/><b>{duration} 分钟</b></div>
  <form className="new-task" onSubmit={(e:FormEvent)=>{e.preventDefault();if(taskName.trim()){setPickName(taskName.trim());setTaskTree(p.treeType)}}}>
   <input value={taskName} onChange={e=>setTaskName(e.target.value)} placeholder="添加子任务，例如：课程学习"/><button><Plus/></button>
  </form>
  {pickName!==null&&<div className="modal" onClick={()=>setPickName(null)}>
   <div className="confirm tree-modal" onClick={e=>e.stopPropagation()}>
    <small>NEW TREE</small>
    <h2>为「{pickName}」选一棵树</h2>
    <p>这项子任务会在土地上长成你选择的树种。</p>
    <div className="task-tree-pick"><div className="ttp-row">{(['pine','poplar','fruit','sakura','maple','bamboo']as TreeType[]).map(x=>{const on=(taskTree??p.treeType)===x;return <button type="button" key={x} className={`ttp ${x} ${on?'on':''}`} onClick={()=>setTaskTree(x)} title={treeNames[x]}><i/><b>{treeNames[x]}</b></button>})}</div></div>
    <div className="confirm-btns"><button className="ghost" onClick={()=>setPickName(null)}>取消</button><button className="danger" onClick={()=>{addTask(id,pickName,duration,taskTree??p.treeType);setTaskName('');setTaskTree(undefined);setPickName(null)}}>种下这棵树</button></div>
   </div>
  </div>}
  {delTask&&<div className="modal" onClick={()=>setDelTask(null)}>
   <div className="confirm" onClick={e=>e.stopPropagation()}>
    <h2>删除子任务?</h2>
    <p>「{delTask.title}」这棵树和它的专注记录会被移除。</p>
    <div className="confirm-btns"><button className="ghost" onClick={()=>setDelTask(null)}>取消</button><button className="danger" onClick={()=>{removeTask(id,delTask.id);setDelTask(null)}}>删除</button></div>
   </div>
  </div>}
 </main>
}

/* —— 数据统计 —— */
function StatCard({icon:Icon,value,label,sub}:{icon:any;value:React.ReactNode;label:string;sub?:string}){
 return <div className="metric"><div className="metric-ico"><Icon/></div><div className="metric-body"><strong>{value}</strong><span>{label}</span>{sub&&<em>{sub}</em>}</div></div>
}
function Bars({data}:{data:{label:string;minutes:number}[]}){
 const max=Math.max(1,...data.map(d=>d.minutes));
 const view=data.slice(-12);
 if(view.length===0)return <div className="bars-empty">还没有专注记录，先去种一棵树吧。</div>;
 return <div className="bars">{view.map(d=><div className="bar-col" key={d.label}><div className="bar-track"><div className="bar-fill" style={{height:`${Math.round(d.minutes/max*100)}%`}}><i>{d.minutes}</i></div></div><small>{d.label}</small></div>)}</div>
}
function Stats(){
 const allProjects=useGarden(s=>s.projects);
 const projects=useMemo(()=>allProjects.filter(p=>!p.archived),[allProjects]);
 const sessions=useGarden(s=>s.sessions);
 const matureMin=useGarden(s=>s.settings.matureMinutes)??DEFAULT_MATURE_MINUTES;
 const[bucket,setBucket]=useState<Bucket>('day');
 const totalMin=sessions.reduce((n,x)=>n+x.minutes,0);
 const allTasks=projects.flatMap(p=>p.tasks.map(t=>({p,t})));
 const treeMinutes=(pid:string,tid:string)=>sessions.filter(x=>x.projectId===pid&&x.taskId===tid).reduce((n,x)=>n+x.minutes,0);
 const typeCount=useMemo(()=>{const m:Record<TreeType,number>={pine:0,poplar:0,fruit:0,sakura:0,maple:0,bamboo:0};projects.forEach(p=>p.tasks.forEach(()=>m[p.treeType]++));return m},[projects]);
 const stageCount=useMemo(()=>{const m:Record<string,number>={seed:0,sprout:0,sapling:0,sturdy:0,lush:0,mature:0};allTasks.forEach(({p,t})=>{m[treeStage(treeMinutes(p.id,t.id),matureMin)]++});return m},[projects,sessions,matureMin]);
 const series=useMemo(()=>seriesByBucket(sessions,bucket),[sessions,bucket]);
 const treeTotal=allTasks.length;
 const projMinutes=(p:Project)=>sessions.filter(x=>x.projectId===p.id).reduce((n,x)=>n+x.minutes,0);
 const {current:curStreak,longest:longStreak}=streaks(sessions);
 const water=wateringCount(allProjects);
 return <main className="plain stats-page">
  <small>FOCUS ARCHIVE</small><h1>数据统计</h1>
  <p className="lead">你的森林正在慢慢成形，这里记录它的每一次生长。</p>

  <section className="metrics">
   <StatCard icon={Clock} value={Math.floor(totalMin/60)} label="累计投入" sub={humanTime(totalMin)}/>
   <StatCard icon={TreePine} value={treeTotal} label="树木总数" sub="棵成长中的树"/>
   <StatCard icon={Sprout} value={stageCount.mature} label="成材大树" sub={`${stageCount.lush} 棵繁茂中`}/>
   <StatCard icon={Flame} value={curStreak} label="当前连签" sub={`最长 ${longStreak} 天`}/>
  </section>

  <h2 className="sec-title">树木种类分布</h2>
  <div className="type-dist">
   {(['pine','poplar','fruit','sakura','maple','bamboo']as TreeType[]).filter(t=>typeCount[t]>0).map(t=>{const c=typeCount[t];const pct=treeTotal?Math.round(c/treeTotal*100):0;return <div className="type-row" key={t}><span className={`type-dot ${t}`}/><b>{treeNames[t]}</b><div className="type-bar"><i style={{width:`${pct}%`}}/></div><em>{c} 棵</em></div>})}
   {treeTotal===0&&<div className="bars-empty">还没有树木。</div>}
  </div>

  <div className="sec-head"><h2 className="sec-title">投入时间分析</h2>
   <div className="bucket-switch">{([['day','日'],['month','月'],['year','年']]as[Bucket,string][]).map(([k,l])=><button key={k} className={bucket===k?'on':''} onClick={()=>setBucket(k)}>{l}</button>)}</div>
  </div>
  <div className="chart-card"><Bars data={series}/></div>

  <section className="power-card calm">
   <span className="power-emoji">🌱</span>
   <div className="power-body">
    <p>{encourage(water)}</p>
   </div>
  </section>

  <h2 className="sec-title">各土地投入</h2>
  {projects.map(p=>{const pct=projectProgress(p,treeMinutes,matureMin);return <div className="stat" key={p.id}><Tree type={p.treeType} done minutes={projMinutes(p)}/><div className="stat-info"><b>{p.name}</b><span>{p.tasks.length} 棵 {treeNames[p.treeType]} · {p.tasks.filter(t=>t.done).length} 棵已完成</span><div className="stat-prog"><i style={{width:`${pct}%`}}/></div></div><strong>{projMinutes(p)}<em>min</em></strong></div>})}
  {projects.length===0&&<div className="bars-empty">还没有土地。</div>}
 </main>
}

/* —— 拜访花园 —— */
type Neighbor={id:string;name:string;goal:string;terrain:'meadow'|'forest'|'autumn';avatar:string;comments:{who:string;text:string}[];trees:{type:TreeType;title:string;minutes:number}[]};
const neighbors:Neighbor[]=[
 {id:'yuzu',name:'柚子的画室',goal:'学会画画',terrain:'autumn',avatar:'🎨',comments:[{who:'渡边',text:'画风好治愈～'},{who:'林深',text:'这色感绝了'}],trees:[
  {type:'maple',title:'每日速写 30 分钟',minutes:460},
  {type:'fruit',title:'临摹大师作品',minutes:180},
  {type:'sakura',title:'色彩理论学习',minutes:120},
  {type:'poplar',title:'整理灵感画册',minutes:75},
  {type:'poplar',title:'随手涂鸦 10 分钟',minutes:40}]},
 {id:'shan',name:'山眠书屋',goal:'一年读完 50 本书',terrain:'forest',avatar:'📚',comments:[{who:'阿元',text:'这阅读量太强了'},{who:'柚子',text:'求书单！'}],trees:[
  {type:'pine',title:'睡前阅读 40 页',minutes:1280},
  {type:'bamboo',title:'写读书笔记',minutes:520},
  {type:'fruit',title:'精读经典',minutes:340},
  {type:'sakura',title:'摘抄金句',minutes:150},
  {type:'poplar',title:'月度书单复盘',minutes:90}]},
 {id:'chao',name:'潮汐健身房',goal:'坚持晨间训练',terrain:'meadow',avatar:'💪',comments:[{who:'林深',text:'马拉松也能行吧！'},{who:'阿元',text:'羡慕这自律🔥'}],trees:[
  {type:'poplar',title:'晨跑 5 公里',minutes:610},
  {type:'bamboo',title:'力量训练',minutes:430},
  {type:'maple',title:'拉伸恢复',minutes:120},
  {type:'fruit',title:'晨起冥想 5 分钟',minutes:35}]},
];
function Visit(){
 const[liked,setLiked]=useState<{id:string;time:number}[]>([]);
 const[friendState,setFriendState]=useState<Record<string,'pending'|'friend'>>({});
 const[comments,setComments]=useState<Record<string,{who:string;text:string;time:number}[]>>({});
 const[draft,setDraft]=useState<Record<string,string>>({});
 const[view,setView]=useState<Neighbor|null>(null);
 const[tab,setTab]=useState<'plaza'|'me'>('plaza');
 const[toast,setToast]=useState('');
 const nbOf=(id:string)=>neighbors.find(n=>n.id===id)!;
 const flash=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2200)};
 const fmtTime=(t:number)=>{const d=Math.floor((Date.now()-t)/1000);if(d<60)return'刚刚';if(d<3600)return`${Math.floor(d/60)} 分钟前`;if(d<86400)return`${Math.floor(d/3600)} 小时前`;const dt=new Date(t);return`${dt.getMonth()+1}月${dt.getDate()}日 ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`};
 const isLiked=(id:string)=>liked.some(l=>l.id===id);
 const toggleLike=(id:string)=>setLiked(v=>v.some(l=>l.id===id)?v.filter(l=>l.id!==id):[...v,{id,time:Date.now()}]);
 // 加好友 = 发送申请,需对方同意:先进入"申请中",片刻后对方接受
 const requestFriend=(id:string)=>{
  const st=friendState[id];
  if(st==='friend'){setFriendState(s=>{const n={...s};delete n[id];return n});flash(`已和「${nbOf(id).name}」解除好友`);return}
  if(st==='pending'){setFriendState(s=>{const n={...s};delete n[id];return n});flash('已撤回好友申请');return}
  setFriendState(s=>({...s,[id]:'pending'}));flash(`已向「${nbOf(id).name}」发送好友申请,等待对方同意…`);
  setTimeout(()=>{setFriendState(s=>s[id]==='pending'?{...s,[id]:'friend'}:s);flash(`「${nbOf(id).name}」通过了你的好友申请 🎉`)},1800);
 };
 const removeFriend=(id:string)=>setFriendState(s=>{const n={...s};delete n[id];return n});
 const friendLabel=(id:string)=>friendState[id]==='friend'?'已是好友':friendState[id]==='pending'?'申请中…':'加好友';
 const postComment=(id:string)=>{const t=(draft[id]||'').trim();if(!t)return;setComments(c=>({...c,[id]:[...(c[id]||[]),{who:'我',text:t,time:Date.now()}]}));setDraft(d=>({...d,[id]:''}))};
 const removeMyComment=(id:string,idx:number)=>setComments(c=>({...c,[id]:(c[id]||[]).filter((_,i)=>i!==idx)}));
 const allComments=(g:Neighbor)=>[...g.comments,...(comments[g.id]||[])];
 const likeCount=(g:Neighbor)=>(isLiked(g.id)?1:0)+ (g.id.charCodeAt(0)%9)+3;
 const myFriends=Object.keys(friendState).filter(id=>friendState[id]==='friend');
 const myPending=Object.keys(friendState).filter(id=>friendState[id]==='pending');
 const myComments=Object.entries(comments).flatMap(([id,list])=>list.map((c,i)=>({id,i,text:c.text,time:c.time})));
 return <main className="plain community">
  <small>GARDEN COMMUNITY</small><h1>拜访花园</h1>
  <p>看看别人的花园,点赞、留言、交朋友。</p>
  <div className="visit-tabs">
   <button className={tab==='plaza'?'on':''} onClick={()=>setTab('plaza')}>花园广场</button>
   <button className={tab==='me'?'on':''} onClick={()=>setTab('me')}>我的（好友 {myFriends.length}）</button>
  </div>
  {tab==='plaza'&&neighbors.map(g=>{
   const total=g.trees.reduce((n,t)=>n+t.minutes,0);
   const bloom=Math.min(100,Math.round(total/22));
   return <article className="nb-card" key={g.id}>
    <div className="nb-head"><span className="nb-avatar">{g.avatar}</span><div><b>{g.name}</b><em className="nb-bloom">🌸 郁郁葱葱度 {bloom}%</em></div>{friendState[g.id]==='friend'&&<span className="nb-friend-tag">好友</span>}</div>
    <button className={`neighbor-scene land-${g.terrain}`} onClick={()=>setView(g)}>
     <div className="nb-island" style={{backgroundImage:`url(${terrainArt[g.terrain]})`}}/>
     <div className="nb-trees">{g.trees.slice(0,4).map((t,j)=><Tree key={j} type={t.type} minutes={t.minutes} done/>)}</div>
     <span className="nb-treecount">🌳 {g.trees.length} 棵大树</span>
    </button>
    <div className="nb-actions">
     <button className={`nb-act ${isLiked(g.id)?'on':''}`} onClick={()=>toggleLike(g.id)}><ThumbsUp/>点赞 {likeCount(g)}</button>
     <button className="nb-act primary" onClick={()=>setView(g)}><MessageCircle/>留言 {allComments(g).length}</button>
     <button className={`nb-act warm ${friendState[g.id]==='friend'?'on':''} ${friendState[g.id]==='pending'?'pending':''}`} onClick={()=>requestFriend(g.id)}><UserPlus/>{friendLabel(g.id)}</button>
    </div>
    <div className="nb-comments">
     {allComments(g).slice(-3).map((c,j)=><div className="nb-cmt" key={j}><b>{c.who}：</b>{c.text}</div>)}
     <form className="nb-cmt-form" onSubmit={(e:FormEvent)=>{e.preventDefault();postComment(g.id)}}>
      <input value={draft[g.id]||''} onChange={e=>setDraft(d=>({...d,[g.id]:e.target.value}))} placeholder="说点什么…"/>
      <button type="submit"><Plus/></button>
     </form>
    </div>
   </article>
  })}
  {tab==='me'&&<div className="my-social">
   <section className="ms-block">
    <h2 className="sec-title">好友申请中 {myPending.length>0&&<em>{myPending.length}</em>}</h2>
    {myPending.length===0&&<div className="ms-empty">没有正在等待对方同意的申请。</div>}
    {myPending.map(id=>{const g=nbOf(id);return <div className="ms-row" key={id}><span className="nb-avatar sm">{g.avatar}</span><div className="ms-info"><b>{g.name}</b><em>等待对方同意…</em></div><button className="ms-btn ghost" onClick={()=>requestFriend(id)}>撤回</button></div>})}
   </section>
   <section className="ms-block">
    <h2 className="sec-title">我的好友 {myFriends.length>0&&<em>{myFriends.length}</em>}</h2>
    {myFriends.length===0&&<div className="ms-empty">还没有好友。去花园广场加好友,对方同意后会出现在这里。</div>}
    {myFriends.map(id=>{const g=nbOf(id);return <div className="ms-row" key={id}><span className="nb-avatar sm">{g.avatar}</span><div className="ms-info" onClick={()=>{setView(g);setTab('plaza')}}><b>{g.name}</b><em>{g.goal}</em></div><button className="ms-btn danger" onClick={()=>removeFriend(id)}>删除</button></div>})}
   </section>
   <section className="ms-block">
    <h2 className="sec-title">我的点赞 {liked.length>0&&<em>{liked.length}</em>}</h2>
    {liked.length===0&&<div className="ms-empty">还没有点赞任何花园。</div>}
    {liked.map(l=>{const g=nbOf(l.id);return <div className="ms-row" key={l.id}><span className="nb-avatar sm">{g.avatar}</span><div className="ms-info"><b>{g.name}</b><em>你点了赞 👍 · <time>{fmtTime(l.time)}</time></em></div><button className="ms-btn ghost" onClick={()=>toggleLike(l.id)}>取消</button></div>})}
   </section>
   <section className="ms-block">
    <h2 className="sec-title">我的留言 {myComments.length>0&&<em>{myComments.length}</em>}</h2>
    {myComments.length===0&&<div className="ms-empty">还没有发表留言。</div>}
    {myComments.map(c=>{const g=nbOf(c.id);return <div className="ms-row" key={c.id+c.i}><span className="nb-avatar sm">{g.avatar}</span><div className="ms-info"><b>{g.name}</b><em>「{c.text}」 · <time>{fmtTime(c.time)}</time></em></div><button className="ms-btn ghost" onClick={()=>removeMyComment(c.id,c.i)}>撤回</button></div>})}
   </section>
  </div>}
  {view&&<div className="modal center" onClick={()=>setView(null)}>
   <div className={`garden-detail land-${view.terrain}`} onClick={e=>e.stopPropagation()}>
    <button className="sheet-close" onClick={()=>setView(null)}><X/></button>
    <small>NEIGHBOR GARDEN</small>
    <h2>{view.name}</h2>
    <p>{view.goal}</p>
    <div className="detail-scene"><div className="nb-island" style={{backgroundImage:`url(${terrainArt[view.terrain]})`}}/><div className="nb-trees">{view.trees.map((t,j)=><Tree key={j} type={t.type} minutes={t.minutes} done mature={DEFAULT_MATURE_MINUTES}/>)}</div></div>
    <div className="detail-metrics">
     <div><strong>{view.trees.length}</strong><span>棵树</span></div>
     <div><strong>{view.trees.reduce((n,t)=>n+t.minutes,0).toLocaleString()}</strong><span>分钟投入</span></div>
     <div><strong>{view.trees.filter(t=>treeStage(t.minutes)==='mature').length}</strong><span>成材</span></div>
    </div>
    <div className="detail-list">
     {view.trees.map((t,j)=><div className="detail-tree" key={j}><span className={`type-dot ${t.type}`}/><div><b>{t.title}</b><em>{treeNames[t.type]} · {stageLabel(t.minutes)}</em></div><strong>{t.minutes}m</strong></div>)}
    </div>
    <div className="detail-actions">
     <button className={`nb-act ${isLiked(view.id)?'on':''}`} onClick={()=>toggleLike(view.id)}><ThumbsUp/>{isLiked(view.id)?'已点赞':'点赞'}</button>
     <button className={`nb-act warm ${friendState[view.id]==='friend'?'on':''} ${friendState[view.id]==='pending'?'pending':''}`} onClick={()=>requestFriend(view.id)}><UserPlus/>{friendLabel(view.id)}</button>
    </div>
    <div className="detail-comments">
     <h3>留言 {allComments(view).length}</h3>
     {allComments(view).map((c,j)=><div className="nb-cmt" key={j}><b>{c.who}：</b>{c.text}{'time'in c&&(c as {time?:number}).time?<time className="cmt-time">{fmtTime((c as {time:number}).time)}</time>:null}</div>)}
     <form className="nb-cmt-form" onSubmit={(e:FormEvent)=>{e.preventDefault();postComment(view.id)}}>
      <input value={draft[view.id]||''} onChange={e=>setDraft(d=>({...d,[view.id]:e.target.value}))} placeholder="给这片花园留言…"/>
      <button type="submit"><Plus/></button>
     </form>
    </div>
   </div>
  </div>}
  {toast&&<div className="visit-toast">{toast}</div>}
 </main>
}

/* —— 设置 · 花园偏好 —— */
function Settings(){
 const s=useGarden(x=>x.settings);
 const u=useGarden(x=>x.updateSettings);
 const allProjects=useGarden(x=>x.projects);
 const sessions=useGarden(x=>x.sessions);
 const minutesOf=(pid:string,tid:string)=>sessions.filter(x=>x.projectId===pid&&x.taskId===tid).reduce((n,x)=>n+x.minutes,0);
 const stars=gardenStars(allProjects,sessions,minutesOf);
 const {longest}=streaks(sessions);
 const matured=maturedTrees(allProjects,minutesOf,s.matureMinutes??DEFAULT_MATURE_MINUTES);
 const water=wateringCount(allProjects);
 const {total:growTotal,current:growCurrent}=growthDays(sessions);
 const calMap=calendarByDay(sessions);
 const now=new Date();
 const[calOpen,setCalOpen]=useState(false);
 const[calY,setCalY]=useState(now.getFullYear());
 const[calM,setCalM]=useState(now.getMonth());
 const[cdOpen,setCdOpen]=useState(false);
 const matureMin=clampMature(s.matureMinutes??DEFAULT_MATURE_MINUTES);
 const th=stageThresholds(matureMin);
 const hrs=(m:number)=>m%60===0?`${m/60} 小时`:`${(m/60).toFixed(1)} 小时`;
 const cd=s.countdown??null;
 const cdDays=cd?daysUntil(cd.date):null;
 const[cdTitle,setCdTitle]=useState(cd?.title??'');
 const[cdDate,setCdDate]=useState(cd?.date??'');
 const grid=monthGrid(calY,calM);
 const monthMinutes=grid.reduce((n,c)=>n+(c.date?(calMap.get(c.date)??0):0),0);
 const shiftMonth=(delta:number)=>{let m=calM+delta,y=calY;if(m<0){m=11;y--}if(m>11){m=0;y++}setCalM(m);setCalY(y)};
 const saveCd=(e:FormEvent)=>{e.preventDefault();if(cdTitle.trim()&&cdDate){u({countdown:{title:cdTitle.trim(),date:cdDate}});setCdOpen(false)}};
 const clearCd=()=>{u({countdown:null});setCdTitle('');setCdDate('');setCdOpen(false)};
 return <main className="plain preferences">
  <small>GARDEN PREFERENCE</small><h1>花园偏好</h1>
  <p>这里汇总你的成长荣誉与里程碑。默认的天气与土地可在首页每块目标土地的详情页里单独设置。</p>

  <h2>我的荣誉</h2>
  <p className="honor-lead">星光是你在花园里的总成就分：每完成一件事 +10，每长成一棵大树 +50，再加上连续陪伴的加成。</p>
  <div className="honor-grid">
   <div className="honor-card"><span className="honor-ico honor-ico-star"><StarBadge id="set"/></span><strong>{stars}</strong><em>花园星光</em></div>
   <div className="honor-card"><span className="honor-ico"><Flame/></span><strong>{longest}</strong><em>最长连签·天</em></div>
   <div className="honor-card"><span className="honor-ico">🌳</span><strong>{matured}</strong><em>成材大树</em></div>
   <div className="honor-card"><span className="honor-ico"><Check/></span><strong>{water}</strong><em>已完成事项</em></div>
  </div>

  <h2>成长足迹</h2>
  <div className="growth-cards">
   <div className="grow-card grow-streak">
    <span className="grow-ico"><IcoGrowth/></span>
    <div className="grow-body">
     <b>累计与连续成长</b>
     <div className="grow-nums">
      <div><strong>{growTotal}</strong><em>共成长·天</em></div>
      <div><strong>{growCurrent}</strong><em>连续成长·天</em></div>
     </div>
    </div>
   </div>

   <button className="grow-card grow-cal" onClick={()=>setCalOpen(true)}>
    <span className="grow-ico"><IcoCalendar/></span>
    <div className="grow-body">
     <b>成长历史记录</b>
     <span className="grow-sub">已记录 {growTotal} 个成长日 · 点击查看日历</span>
    </div>
    <ChevronRight/>
   </button>

   {cd?
    <button className="grow-card grow-cd active" onClick={()=>setCdOpen(true)}>
     <span className="grow-ico"><IcoHourglass/></span>
     <div className="grow-body">
      <b>{cd.title}</b>
      <span className="grow-sub">{cd.date}</span>
     </div>
     <div className="cd-badge"><strong>{cdDays!}</strong><em>{cdDays!>=0?'天后':'天前'}</em></div>
    </button>
    :
    <button className="grow-card grow-cd" onClick={()=>setCdOpen(true)}>
     <span className="grow-ico"><IcoHourglass/></span>
     <div className="grow-body">
      <b>未来倒计时</b>
      <span className="grow-sub">点击设置一个值得期待的日子</span>
     </div>
     <Plus/>
    </button>}
  </div>

  <h2>成长节奏</h2>
  <div className="pace-card">
   <div className="pace-head">
    <div className="pace-title"><span className="grow-ico"><TreePine/></span><div><b>成材所需专注</b><span className="grow-sub">拖动调整一棵树长成「成材」需要的累计专注时长</span></div></div>
    <div className="pace-badge"><strong>{(matureMin/60).toFixed(matureMin%60===0?0:1)}</strong><em>小时</em></div>
   </div>
   <input className="pace-slider" type="range" min={MIN_MATURE_MINUTES} max={MAX_MATURE_MINUTES} step={60} value={matureMin} onChange={e=>u({matureMinutes:clampMature(+e.target.value)})}/>
   <div className="pace-scale"><span>{MIN_MATURE_MINUTES/60}h</span><span>{MAX_MATURE_MINUTES/60}h</span></div>
   <div className="pace-stages">
    {th.map(g=><div className="pace-stage" key={g.key}><b>{g.label}</b><em>{g.min===0?'0':g.min<60?`${g.min}分`:hrs(g.min)}</em></div>)}
   </div>
   <p className="pace-note">成材至少需 {MIN_MATURE_MINUTES/60} 小时,最多 {MAX_MATURE_MINUTES/60} 小时;其余阶段按比例自动换算。调整后所有树会按新节奏重新判定。</p>
  </div>

  {calOpen&&<div className="modal center" onClick={()=>setCalOpen(false)}>
   <div className="cal-detail" onClick={e=>e.stopPropagation()}>
    <button className="sheet-close" onClick={()=>setCalOpen(false)}><X/></button>
    <small>GROWTH CALENDAR</small>
    <div className="cal-head">
     <button className="cal-nav" onClick={()=>shiftMonth(-1)}><ArrowLeft/></button>
     <h2>{calY} 年 {calM+1} 月</h2>
     <button className="cal-nav" onClick={()=>shiftMonth(1)}><ChevronRight/></button>
    </div>
    <p className="cal-sum">本月投入 {monthMinutes} 分钟</p>
    <div className="cal-weekdays">{['日','一','二','三','四','五','六'].map(w=><span key={w}>{w}</span>)}</div>
    <div className="cal-grid">
     {grid.map((c,i)=>{
      if(!c.date)return <span className="cal-cell empty" key={i}/>;
      const m=calMap.get(c.date)??0;
      const lvl=m===0?0:m<30?1:m<90?2:m<180?3:4;
      const isToday=c.date===`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      return <span className={`cal-cell lvl-${lvl} ${isToday?'today':''}`} key={i} title={m>0?`${m} 分钟`:'未成长'}><i>{c.day}</i>{m>0&&<b/>}</span>;
     })}
    </div>
    <div className="cal-legend">
     <span className="cal-legend-title">每日专注时长</span>
     <div className="cal-legend-scale">
      <span>少</span>
      {[0,1,2,3,4].map(l=><i key={l} className={`lg lvl-${l}`}/>)}
      <span>多</span>
     </div>
     <span className="cal-legend-note">无 · &lt;30 · 30–90 · 90–180 · ≥180 分钟</span>
    </div>
   </div>
  </div>}

  {cdOpen&&<div className="modal sheet" onClick={()=>setCdOpen(false)}>
   <div className="cd-sheet" onClick={e=>e.stopPropagation()}>
    <button className="sheet-close" onClick={()=>setCdOpen(false)}><X/></button>
    <small>COUNTDOWN</small>
    <h2>未来倒计时</h2>
    <p className="cd-lead">设定一个值得期待的日子,它会显示在花园偏好页,提醒你时间正在生长。</p>
    <form className="cd-form" onSubmit={saveCd}>
     <label>纪念日名称<input value={cdTitle} onChange={e=>setCdTitle(e.target.value)} placeholder="例如:考研倒计时 / 生日"/></label>
     <label>目标日期<input type="date" value={cdDate} onChange={e=>setCdDate(e.target.value)}/></label>
     <div className="cd-btns">
      {cd&&<button type="button" className="ghost" onClick={clearCd}>清除</button>}
      <button type="submit" className="submit" disabled={!cdTitle.trim()||!cdDate}>保存</button>
     </div>
    </form>
   </div>
  </div>}
 </main>
}

/* —— 应用根 —— */
export default function App(){
 const[page,setPage]=useState<Page>('home');
 const[project,setProject]=useState<string|null>(null);
 const[manage,setManage]=useState(false);
 if(project)return <div className="app"><ProjectPage id={project} back={()=>setProject(null)}/></div>;
 return <div className="app">
  {page==='home'?<HomePage open={setProject} manage={()=>setManage(true)}/>:page==='stats'?<Stats/>:page==='visit'?<Visit/>:<Settings/>}
  <nav>{[['home',Home,'花园'],['stats',BarChart3,'数据'],['visit',Users,'拜访'],['settings',Cog,'设置']].map(([x,I,l]:any)=><button key={x} className={page===x?'on':''} onClick={()=>setPage(x)}><I/><span>{l}</span></button>)}</nav>
  {manage&&<Manage close={()=>setManage(false)}/>}
 </div>
}
