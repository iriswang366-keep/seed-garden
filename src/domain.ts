import type{Project,TreeType,FocusSession}from'./types';
export const treeNames:Record<TreeType,string>={pine:'松树',poplar:'白杨',fruit:'果树',sakura:'樱花',maple:'枫树',bamboo:'翠竹'};

// —— 花草已移除：所有任务都长成树 ——
export const FLOWER_MAX=15;
export const isFlowerTask=(_targetMinutes:number)=>false;
export const uid=()=>crypto.randomUUID?.()??`${Date.now()}-${Math.random()}`;
export const progress=(p:Project)=>p.tasks.length?Math.round(p.tasks.filter(t=>t.done).length/p.tasks.length*100):0;
export const stage=(p:Project)=>{const n=p.tasks.filter(t=>t.done).length;return n===0?'seed':n<3?'sprout':n<6?'sapling':'mature'};
export const totalMinutes=(p:Project)=>p.tasks.filter(t=>t.done).reduce((n,t)=>n+t.minutes,0);
export const focusMinutes=(mode:'up'|'down',seconds:number,target:number)=>Math.max(1,Math.round((mode==='up'?seconds:target-seconds)/60));

// —— 生长阶段:按累计专注分钟数把单棵树分成 6 个成长阶段 ——
export type GrowthStage='seed'|'sprout'|'sapling'|'sturdy'|'lush'|'mature';
// 成材阈值可由用户自定义,但限制在区间内:最低 10 小时,最高 30 小时,默认 20 小时
export const DEFAULT_MATURE_MINUTES=1200;
export const MIN_MATURE_MINUTES=600;   // 10h 下限:成材至少要投入 10 小时
export const MAX_MATURE_MINUTES=1800;  // 30h 上限
export const clampMature=(m:number)=>Math.min(MAX_MATURE_MINUTES,Math.max(MIN_MATURE_MINUTES,Math.round(m)));
// 各阶段占「成材阈值」的比例;嫩芽为固定 1 分钟下限(任何专注都立刻发芽)
const STAGE_DEF:{key:GrowthStage;label:string;ratio:number}[]=[
 {key:'seed',label:'种子',ratio:0},
 {key:'sprout',label:'嫩芽',ratio:0.03},
 {key:'sapling',label:'幼苗',ratio:0.10},
 {key:'sturdy',label:'茁壮',ratio:0.30},
 {key:'lush',label:'繁茂',ratio:0.60},
 {key:'mature',label:'成材',ratio:1},
];
// 每个阶段固定缩放:同一阶段的所有树大小一致(不再按分钟连续缩放)
export const STAGE_SCALE:Record<GrowthStage,number>={seed:0.42,sprout:0.55,sapling:0.7,sturdy:0.86,lush:1.02,mature:1.16};
// 根据成材阈值派生 6 个阶段的分钟门槛
export const stageThresholds=(mature:number=DEFAULT_MATURE_MINUTES):{key:GrowthStage;label:string;min:number}[]=>
 STAGE_DEF.map(g=>({key:g.key,label:g.label,min:Math.round(g.ratio*mature)}));
// 兼容旧调用:导出默认阈值下的阶段表
export const growthStages=stageThresholds(DEFAULT_MATURE_MINUTES);
export const treeStage=(minutes:number,mature:number=DEFAULT_MATURE_MINUTES):GrowthStage=>{let s:GrowthStage='seed';for(const g of stageThresholds(mature)){if(minutes>=g.min)s=g.key}return s};
export const stageLabel=(minutes:number,mature:number=DEFAULT_MATURE_MINUTES)=>STAGE_DEF.find(g=>g.key===treeStage(minutes,mature))!.label;
export const treeScale=(minutes:number,mature:number=DEFAULT_MATURE_MINUTES)=>STAGE_SCALE[treeStage(minutes,mature)];

// —— 日期分桶统计 ——
export type Bucket='day'|'month'|'year';
export const bucketKey=(iso:string,b:Bucket)=>{const d=new Date(iso);const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return b==='day'?`${y}-${m}-${day}`:b==='month'?`${y}-${m}`:`${y}`};
export const bucketLabel=(key:string,b:Bucket)=>{const p=key.split('-');return b==='day'?`${+p[1]}/${+p[2]}`:b==='month'?`${p[0]}年${+p[1]}月`:`${p[0]}年`};
export type SeriesPoint={key:string;label:string;minutes:number};
export const seriesByBucket=(sessions:FocusSession[],b:Bucket):SeriesPoint[]=>{
 const map=new Map<string,number>();
 for(const s of sessions){const k=bucketKey(s.completedAt,b);map.set(k,(map.get(k)??0)+s.minutes)}
 return[...map.entries()].sort((a,z)=>a[0]<z[0]?-1:1).map(([key,minutes])=>({key,label:bucketLabel(key,b),minutes}))
};

// —— 花园星光 / 连续打卡 / 激励(v14 移植自"心愿花园"原型) ——
// 完成一条子任务 = 一次"浇灌"
export const wateringCount=(projects:Project[])=>projects.reduce((n,p)=>n+p.tasks.filter(t=>t.done).length,0);
// 一棵树长成大树:该子任务已完成且累计专注达到 mature 阈值(1800 分钟);无专注记录时,只要 done 也算一棵成树的浇灌成果里程碑
export const maturedTrees=(projects:Project[],minutesOf:(pid:string,tid:string)=>number,mature:number=DEFAULT_MATURE_MINUTES)=>
 projects.reduce((n,p)=>n+p.tasks.filter(t=>t.done&&treeStage(minutesOf(p.id,t.id),mature)==='mature').length,0);
// 连续打卡:按 session.completedAt 的自然日,求当前连签与历史最长连签
export const streaks=(sessions:FocusSession[]):{current:number;longest:number}=>{
 const days=[...new Set(sessions.map(s=>bucketKey(s.completedAt,'day')))].sort();
 if(days.length===0)return{current:0,longest:0};
 const toNum=(k:string)=>{const[y,m,d]=k.split('-').map(Number);return Date.UTC(y,m-1,d)/86400000};
 let longest=1,run=1;
 for(let i=1;i<days.length;i++){run=toNum(days[i])-toNum(days[i-1])===1?run+1:1;longest=Math.max(longest,run)}
 // 当前连签:从最后一天往回连续
 let current=1;for(let i=days.length-1;i>0;i--){if(toNum(days[i])-toNum(days[i-1])===1)current++;else break}
 return{current,longest};
};
// 花园星光:浇灌×10 + 成树×50 + 最长连签加成 S×(S+1)
export const gardenStars=(projects:Project[],sessions:FocusSession[],minutesOf:(pid:string,tid:string)=>number)=>{
 const water=wateringCount(projects);
 const trees=maturedTrees(projects,minutesOf);
 const {longest}=streaks(sessions);
 return water*10+trees*50+longest*(longest+1);
};

// —— 成长天数:共成长天数(有专注记录的自然日总数)与当前连续成长天数 ——
export const growthDays=(sessions:FocusSession[]):{total:number;current:number}=>{
 const days=[...new Set(sessions.map(s=>bucketKey(s.completedAt,'day')))];
 const {current}=streaks(sessions);
 return{total:days.length,current};
};

// —— 成长日历:统计每一自然日的专注分钟,用于日历热力小卡 ——
export type CalendarDay={date:string;minutes:number};
export const calendarByDay=(sessions:FocusSession[]):Map<string,number>=>{
 const map=new Map<string,number>();
 for(const s of sessions){const k=bucketKey(s.completedAt,'day');map.set(k,(map.get(k)??0)+s.minutes)}
 return map;
};
// 生成某年某月的完整日历网格(前后补空位,固定 6 行 42 格,保证不同月份高度一致)
export const monthGrid=(year:number,month0:number)=>{
 const first=new Date(year,month0,1);
 const startPad=first.getDay(); // 0=周日
 const daysInMonth=new Date(year,month0+1,0).getDate();
 const cells:{date:string|null;day:number|null}[]=[];
 for(let i=0;i<startPad;i++)cells.push({date:null,day:null});
 for(let d=1;d<=daysInMonth;d++){
  const key=`${year}-${String(month0+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  cells.push({date:key,day:d});
 }
 while(cells.length<42)cells.push({date:null,day:null}); // 补满 6 行
 return cells;
};

// —— 未来倒计时:距目标日期还剩多少天(向上取整,今天=0) ——
export const daysUntil=(dateISO:string):number=>{
 const target=new Date(dateISO+'T00:00:00');
 const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 return Math.ceil((target.getTime()-today.getTime())/86400000);
};
// 单个目标的成林进度:已成材树木数 ÷ 目标内全部树木数(每棵树按累计专注分钟判定是否成材)
export const projectProgress=(p:Project,minutesOf:(pid:string,tid:string)=>number,mature:number=DEFAULT_MATURE_MINUTES)=>p.tasks.length?Math.round(p.tasks.filter(t=>treeStage(minutesOf(p.id,t.id),mature)==='mature').length/p.tasks.length*100):0;
// 激励文案:随累计浇灌次数升级
export const encourage=(water:number)=>{
 if(water===0)return'种下第一颗种子吧——每完成一件小事,就是给未来浇一次水。';
 if(water<10)return`你已经把目标拆成了 ${water} 个可执行的小步骤并逐一完成。每一次打卡都在给某棵树浇水——宏大的目标,就是这样一天天长成一片森林的。`;
 if(water<30)return`已经浇灌 ${water} 次了。坚持正在显出形状——你的花园开始有了郁郁葱葱的样子。`;
 if(water<100)return`${water} 次浇灌积累下来,你已经是一位有耐心的园丁。慢即是快,森林正在成形。`;
 return`${water} 次浇灌!这片森林已经枝繁叶茂,你的自律本身就是最好的风景。`;
};
