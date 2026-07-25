import type{GardenState}from'./types';
export const initialState:GardenState={projects:[
{id:'ai',name:'AI 学习',description:'搭建自己的 AI 知识体系',color:'#789664',treeType:'pine',createdAt:'2026-07-01',archived:false,tasks:[{id:'a1',title:'阅读一篇行业资讯',minutes:15,done:true},{id:'a2',title:'完成 30 分钟课程',minutes:30,done:false},{id:'a3',title:'整理一张知识卡片',minutes:15,done:false}]},
{id:'run',name:'晨跑计划',description:'用 30 次晨跑找回身体节奏',color:'#c47d55',treeType:'poplar',createdAt:'2026-07-05',archived:false,tasks:[{id:'r1',title:'完成 3 公里轻松跑',minutes:30,done:false},{id:'r2',title:'跑后拉伸',minutes:10,done:false},{id:'r3',title:'记录身体感受',minutes:5,done:false}]},
{id:'read',name:'年度阅读',description:'今年认真读完 24 本书',color:'#7e8aa6',treeType:'fruit',createdAt:'2026-06-18',archived:false,tasks:[{id:'b1',title:'阅读 20 页',minutes:25,done:true},{id:'b2',title:'摘录一个好句子',minutes:5,done:true},{id:'b3',title:'写下 100 字感想',minutes:10,done:false}]}],
// —— 展示用专注记录:成材阈值 10~30 小时(默认 20 小时);每条记录都是正常时长(几十~200多分钟),
// 让树木分布在不同生长阶段。今日(07-25)记录合计 = 60+45 = 105 分钟 ——
sessions:[
{id:'s1',projectId:'ai',taskId:'a1',minutes:215,completedAt:'2026-07-24T20:30:00'},
{id:'s2',projectId:'ai',taskId:'a2',minutes:95,completedAt:'2026-07-22T19:15:00'},
{id:'s3',projectId:'ai',taskId:'a3',minutes:60,completedAt:'2026-07-25T08:40:00'},
{id:'s4',projectId:'run',taskId:'r1',minutes:240,completedAt:'2026-07-23T07:10:00'},
{id:'s5',projectId:'run',taskId:'r2',minutes:130,completedAt:'2026-07-21T07:20:00'},
{id:'s6',projectId:'run',taskId:'r3',minutes:45,completedAt:'2026-07-25T07:30:00'},
{id:'s7',projectId:'read',taskId:'b1',minutes:260,completedAt:'2026-07-20T22:00:00'},
{id:'s8',projectId:'read',taskId:'b2',minutes:110,completedAt:'2026-07-24T21:40:00'},
{id:'s9',projectId:'read',taskId:'b3',minutes:50,completedAt:'2026-07-23T21:50:00'}],
settings:{weather:'sunny',terrain:'meadow'}};
