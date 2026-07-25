import{describe,it,expect,beforeEach}from'vitest';
import{render,screen,fireEvent,within}from'@testing-library/react';
import App from'../src/App';
import{useGarden}from'../src/store';
import{initialState}from'../src/seed';

// 每个用例前重置 store + localStorage,保证独立
beforeEach(()=>{
 localStorage.clear();
 useGarden.setState({...initialState,projects:JSON.parse(JSON.stringify(initialState.projects)),sessions:[]});
});

describe('种子花园 v7 · 二次改造验收',()=>{
 it('1a. 首页目标卡上不再有删除按钮,改为顶部「管理目标」入口',()=>{
  render(<App/>);
  expect(document.querySelectorAll('.plot-del').length).toBe(0);
  expect(screen.getByText('管理目标')).toBeTruthy();
 });

 it('1b. 管理目标面板可新增土地',()=>{
  render(<App/>);
  const before=useGarden.getState().projects.length;
  fireEvent.click(screen.getByText('管理目标'));
  const sheet=document.querySelector('.manage-sheet')!;
  expect(sheet).toBeTruthy();
  fireEvent.change(sheet.querySelector('input')!,{target:{value:'练习吉他'}});
  fireEvent.click(within(sheet as HTMLElement).getByText('创建土地'));
  expect(useGarden.getState().projects.length).toBe(before+1);
  expect(useGarden.getState().projects.some(p=>p.name==='练习吉他')).toBe(true);
 });

 it('1c. 管理目标面板可删除土地,并从花园移除',()=>{
  render(<App/>);
  const before=useGarden.getState().projects.length;
  fireEvent.click(screen.getByText('管理目标'));
  const rows=document.querySelectorAll('.manage-row');
  expect(rows.length).toBeGreaterThan(0);
  fireEvent.click(rows[0].querySelector('.mr-del')!);
  fireEvent.click(screen.getByText('删除'));
  expect(useGarden.getState().projects.length).toBe(before-1);
 });

 it('2. 进入土地后每个子任务都有删除按钮,且删除会移除树',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('AI 学习'));
  const tasksBefore=useGarden.getState().projects.find(p=>p.id==='ai')!.tasks.length;
  expect(document.querySelectorAll('.task-del').length).toBe(tasksBefore);
  fireEvent.click(document.querySelectorAll('.task-del')[0]);
  fireEvent.click(screen.getByText('删除'));
  expect(useGarden.getState().projects.find(p=>p.id==='ai')!.tasks.length).toBe(tasksBefore-1);
 });

 it('3. 数据页展示坚持的力量/树木数/投入时间/种类/时间分析,且日月年可切换',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('数据'));
  // 坚持的力量激励卡保留
  expect(document.querySelector('.power-card.calm')).toBeTruthy();
  // 四张基础指标卡
  expect(document.querySelectorAll('.metrics:not(.honor) .metric').length).toBe(4);
  expect(screen.getByText('树木总数')).toBeTruthy();
  expect(screen.getByText('累计投入')).toBeTruthy();
  // 种类分布 3 行
  expect(document.querySelectorAll('.type-row').length).toBe(3);
  // 时间分析可切换
  expect(document.querySelector('.chart-card')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'月'}));
  expect(document.querySelector('.bucket-switch button.on')!.textContent).toBe('月');
  fireEvent.click(screen.getByRole('button',{name:'年'}));
  expect(document.querySelector('.bucket-switch button.on')!.textContent).toBe('年');
 });

 it('4. 拜访页可点击进入邻居花园详情,看到其生长情况与投入,并可点赞/加好友/留言',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('拜访'));
  expect(document.querySelectorAll('.community article').length).toBeGreaterThanOrEqual(3);
  // 社交动作:点赞/留言/加好友
  expect(document.querySelectorAll('.nb-card .nb-actions .nb-act').length).toBeGreaterThanOrEqual(9);
  fireEvent.click(document.querySelectorAll('.neighbor-scene')[0]);
  const sheet=document.querySelector('.garden-detail')!;
  expect(sheet).toBeTruthy();
  // 详情内有树木场景 + 逐棵树的投入明细
  expect(sheet.querySelectorAll('.detail-scene .art-tree').length).toBeGreaterThan(0);
  expect(sheet.querySelectorAll('.detail-tree').length).toBeGreaterThan(0);
  // 明细里含分钟投入
  expect(within(sheet as HTMLElement).getAllByText(/m$/).length).toBeGreaterThan(0);
  // 详情页留言:输入并提交后出现在留言列表
  const form=sheet.querySelector('.detail-comments .nb-cmt-form')!;
  fireEvent.change(form.querySelector('input')!,{target:{value:'加油呀'}});
  fireEvent.submit(form);
  expect(within(sheet as HTMLElement).getByText('加油呀')).toBeTruthy();
 });

 it('5a. 设置页展示我的荣誉 + 成长足迹三张卡片,不再有天气/土地选择器',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('设置'));
  // 精简:天气/土地外观/实时预览已移除
  expect(document.querySelectorAll('.weather-card').length).toBe(0);
  expect(document.querySelectorAll('.land-card').length).toBe(0);
  expect(document.querySelector('.preview')).toBeNull();
  // 我的荣誉四张 + 成长足迹三张
  expect(document.querySelectorAll('.honor-card').length).toBe(4);
  expect(document.querySelectorAll('.growth-cards .grow-card').length).toBe(3);
  expect(screen.getByText('累计与连续成长')).toBeTruthy();
  expect(screen.getByText('成长历史记录')).toBeTruthy();
  expect(screen.getByText('未来倒计时')).toBeTruthy();
 });

 it('5b. 成长历史记录卡点击打开日历详情页',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('设置'));
  fireEvent.click(screen.getByText('成长历史记录'));
  const cal=document.querySelector('.cal-detail')!;
  expect(cal).toBeTruthy();
  // 含 7 列星期表头与日期网格
  expect(cal.querySelectorAll('.cal-weekdays span').length).toBe(7);
  expect(cal.querySelectorAll('.cal-grid .cal-cell').length).toBeGreaterThan(0);
 });

 it('5c. 未来倒计时可设置并写入 settings.countdown',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('设置'));
  fireEvent.click(screen.getByText('未来倒计时'));
  const sheet=document.querySelector('.cd-sheet')!;
  expect(sheet).toBeTruthy();
  const inputs=sheet.querySelectorAll('input');
  fireEvent.change(inputs[0],{target:{value:'考研倒计时'}});
  fireEvent.change(inputs[1],{target:{value:'2027-01-01'}});
  fireEvent.click(within(sheet as HTMLElement).getByText('保存'));
  expect(useGarden.getState().settings.countdown?.title).toBe('考研倒计时');
  expect(useGarden.getState().settings.countdown?.date).toBe('2027-01-01');
 });

 it('6. 管理面板提供 6 种树木供选择',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('管理目标'));
  const picks=document.querySelectorAll('.tree-pick .tp');
  expect(picks.length).toBe(6);
  ['松树','白杨','果树','樱花','枫树','翠竹'].forEach(n=>{
   expect(within(document.querySelector('.manage-sheet') as HTMLElement).getByText(n)).toBeTruthy();
  });
 });

 it('7. 所有任务(含短时任务)都在土地上呈现为树,不再有花草',()=>{
  render(<App/>);
  fireEvent.click(screen.getByText('AI 学习'));
  const before=document.querySelectorAll('.grove-trees .art-tree').length;
  // 添加一个 5 分钟的短时任务
  const slider=document.querySelector('.duration input') as HTMLInputElement;
  fireEvent.change(slider,{target:{value:'5'}});
  const input=document.querySelector('.new-task input') as HTMLInputElement;
  fireEvent.change(input,{target:{value:'快速记录一句话'}});
  fireEvent.submit(document.querySelector('.new-task')!);
  // 弹出选择树种的窗口,确认后种下
  fireEvent.click(screen.getByText('种下这棵树'));
  // grove 里多出一棵树,且没有任何花草
  expect(document.querySelectorAll('.grove-trees .art-tree').length).toBe(before+1);
  expect(document.querySelectorAll('.grove-trees .art-tree.flower').length).toBe(0);
 });
});
