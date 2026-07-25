import{create}from'zustand';import{persist}from'zustand/middleware';import type{GardenState,Project,Task,TreeType,Settings}from'./types';import{initialState}from'./seed';import{uid}from'./domain';
type Store=GardenState&{toggleTask:(pid:string,tid:string)=>void;addTask:(pid:string,title:string,minutes:number,treeType?:TreeType)=>void;removeTask:(pid:string,tid:string)=>void;setTaskPos:(pid:string,tid:string,pos:{x:number;y:number})=>void;addProject:(name:string,description:string,treeType:TreeType)=>string;updateProject:(id:string,patch:Partial<Project>)=>void;archiveProject:(id:string)=>void;removeProject:(id:string)=>void;updateSettings:(patch:Partial<Settings>)=>void;addSession:(projectId:string,taskId:string,minutes:number)=>void;reset:()=>void};
export const useGarden=create<Store>()(persist((set)=>({...initialState,
 toggleTask:(pid,tid)=>set(s=>({projects:s.projects.map(p=>p.id===pid?{...p,tasks:p.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}:p)})),
 addTask:(pid,title,minutes,treeType)=>set(s=>({projects:s.projects.map(p=>p.id===pid?{...p,tasks:[...p.tasks,{id:uid(),title,minutes,done:false,treeType}]}:p)})),
 removeTask:(pid,tid)=>set(s=>({projects:s.projects.map(p=>p.id===pid?{...p,tasks:p.tasks.filter(t=>t.id!==tid)}:p),sessions:s.sessions.filter(x=>!(x.projectId===pid&&x.taskId===tid))})),
 setTaskPos:(pid,tid,pos)=>set(s=>({projects:s.projects.map(p=>p.id===pid?{...p,tasks:p.tasks.map(t=>t.id===tid?{...t,pos}:t)}:p)})),
 addProject:(name,description,treeType)=>{const id=uid();set(s=>({projects:[...s.projects,{id,name,description,treeType,color:'#789664',tasks:[],createdAt:new Date().toISOString(),archived:false}]}));return id},
 updateProject:(id,patch)=>set(s=>({projects:s.projects.map(p=>p.id===id?{...p,...patch}:p)})),
 archiveProject:id=>set(s=>({projects:s.projects.map(p=>p.id===id?{...p,archived:true}:p)})),
 removeProject:id=>set(s=>({projects:s.projects.filter(p=>p.id!==id),sessions:s.sessions.filter(x=>x.projectId!==id)})),
 updateSettings:patch=>set(s=>({settings:{...s.settings,...patch}})),addSession:(projectId,taskId,minutes)=>set(s=>({sessions:[...s.sessions,{id:uid(),projectId,taskId,minutes,completedAt:new Date().toISOString()}]})),reset:()=>set(initialState)}),{name:'seed-garden-v10'}));
