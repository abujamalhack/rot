'use strict';
/* BLACK MILITARY SYSTEM • V10.0
   Static, non-official UI simulation. Only predefined fictitious records.
   No form submissions, remote APIs, browser storage, tracking or identity checks. */
(() => {
  const $ = (id) => document.getElementById(id);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qualifications = ['تعليم أساسي','ثانوية عامة','دبلوم','بكالوريوس','ماجستير','دكتوراه','أخرى'];
  const levels = ['تجريبي — المستوى الأول','تجريبي — المستوى الثاني','تجريبي — مكتمل'];
  const majors = ['تخصص افتراضي A','تخصص افتراضي B','تخصص افتراضي C'];
  const profiles = Object.freeze([
    Object.freeze({name:'شخص افتراضي — سجل A',mother:'اسم اصطناعي A',id:'DEMO-ID-0001',birth:'1998-06-12',marital:'أعزب — افتراضي',blood:'O+ (مثال)',province:'محافظة افتراضية A',district:'مديرية افتراضية 01',area:'منطقة اختبار A',residence:'عنوان اصطناعي غير حقيقي A',qualification:'بكالوريوس',major:majors[0],level:levels[2],phone:'DEMO-PHONE-01',alternate:'DEMO-ALT-01',email:'demo-a@example.invalid'}),
    Object.freeze({name:'شخص افتراضي — سجل B',mother:'اسم اصطناعي B',id:'DEMO-ID-0002',birth:'2001-03-18',marital:'متزوج — افتراضي',blood:'A+ (مثال)',province:'محافظة افتراضية B',district:'مديرية افتراضية 02',area:'منطقة اختبار B',residence:'عنوان اصطناعي غير حقيقي B',qualification:'ثانوية عامة',major:majors[1],level:levels[0],phone:'DEMO-PHONE-02',alternate:'DEMO-ALT-02',email:'demo-b@example.invalid'}),
    Object.freeze({name:'شخص افتراضي — سجل C',mother:'اسم اصطناعي C',id:'DEMO-ID-0003',birth:'1995-11-27',marital:'غير محدد — افتراضي',blood:'B- (مثال)',province:'محافظة افتراضية C',district:'مديرية افتراضية 03',area:'منطقة اختبار C',residence:'عنوان اصطناعي غير حقيقي C',qualification:'دبلوم',major:majors[2],level:levels[1],phone:'DEMO-PHONE-03',alternate:'DEMO-ALT-03',email:'demo-c@example.invalid'})
  ]);
  // Explicit schema: all values come from predefined synthetic records or allowlisted choices.
  const stages = [
    {title:'البيانات الشخصية',description:'عينة بيانات شخصية اصطناعية للعرض فقط.',fields:[['name','الاسم الرباعي'],['mother','اسم الأم'],['id','رقم البطاقة الشخصية',null,'ltr'],['birth','تاريخ الميلاد',null,'ltr'],['age','العمر المحسوب تلقائيًا'],['marital','الحالة الاجتماعية'],['blood','فصيلة الدم',null,'ltr']]},
    {title:'البيانات الجغرافية',description:'أماكن وهمية؛ لا يتم طلب الموقع الجغرافي.',fields:[['province','المحافظة'],['district','المديرية'],['area','المنطقة'],['residence','مكان السكن']]},
    {title:'البيانات التعليمية',description:'يمكن تعديل الاختيارات التعليمية ضمن قائمة أمثلة محددة.',fields:[['qualification','المؤهل الدراسي',qualifications],['major','التخصص',majors],['level','المستوى التعليمي',levels]]},
    {title:'بيانات التواصل',description:'معرّفات غير حقيقية، وليست أرقامًا قابلة للاتصال.',fields:[['phone','رقم الهاتف',null,'ltr'],['alternate','رقم هاتف بديل',null,'ltr'],['email','البريد الإلكتروني (مثال)',null,'ltr']]},
    {title:'المعاينة والطباعة',description:'راجع الأقسام؛ لا تُرسل المعاينة إلى أي جهة.',fields:[]}
  ];
  let profileIndex=0, step=0, visited=0, current={...profiles[0]}, sound=false, audioContext, toastTimer;
  const now = () => new Date();
  function formatDate(d) { return new Intl.DateTimeFormat('ar',{dateStyle:'full'}).format(d); }
  function ageOf(iso) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const [y,m,d]=iso.split('-').map(Number), dob=new Date(y,m-1,d), today=now();
    if(dob.getFullYear()!==y||dob.getMonth()!==m-1||dob.getDate()!==d||dob>today) return null;
    let age=today.getFullYear()-y;
    if(today.getMonth()<m-1||(today.getMonth()===m-1&&today.getDate()<d)) age--;
    return age;
  }
  function valueOf(key) { return key==='age' ? (ageOf(current.birth)===null?'غير صالح':`${ageOf(current.birth)} سنة`) : current[key]; }
  function el(tag, cls, content) { const node=document.createElement(tag); if(cls) node.className=cls; if(content!==undefined) node.textContent=String(content); return node; }
  function notify(message) { clearTimeout(toastTimer); const box=$('toast'); box.textContent=message; box.hidden=false; toastTimer=setTimeout(()=>{box.hidden=true;},3000); }
  function tone(kind='tap') {
    if(!sound) return;
    try {
      const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
      audioContext ||= new AC(); if(audioContext.state==='suspended') { audioContext.resume().catch(()=>{}); }
      const osc=audioContext.createOscillator(), gain=audioContext.createGain(), t=audioContext.currentTime;
      osc.type='sine'; osc.frequency.setValueAtTime(kind==='success'?660:420,t); osc.frequency.exponentialRampToValueAtTime(kind==='success'?880:310,t+.10);
      gain.gain.setValueAtTime(.0001,t); gain.gain.exponentialRampToValueAtTime(.035,t+.015); gain.gain.exponentialRampToValueAtTime(.0001,t+.14);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(t); osc.stop(t+.15);
    } catch { /* Sound is optional and never blocks the interface. */ }
  }
  function isValidStage(index) {
    return stages[index].fields.every(([key,,options])=>{
      const val=valueOf(key);
      if(typeof val!=='string'||!val.trim()) return false;
      if(key==='birth') return ageOf(val)!==null;
      if(key==='age') return ageOf(current.birth)!==null;
      if(options) return options.includes(val);
      return val===profiles[profileIndex][key];
    });
  }
  function renderFields() {
    const root=$('fields'); root.replaceChildren();
    stages[step].fields.forEach(([key,label,options,direction])=>{
      const field=el('div','field'); const id='field-'+key;
      if(options) {
        const heading=el('label',null,label); heading.htmlFor=id; field.append(heading);
        const select=el('select'); select.id=id;
        options.forEach(option=>{const node=el('option',null,option); node.value=option; select.append(node);});
        select.value=current[key]; select.addEventListener('change',()=>{ if(options.includes(select.value)){current[key]=select.value; $('print-sheet').classList.remove('ready'); $('validation').textContent=''; tone();} else select.value=current[key]; });
        field.append(select,el('small',null,'خيار تجريبي قابل للتعديل'));
      } else {
        const heading=el('span','field-label',label); heading.id=id+'-label';
        const value=el('div','field-value',valueOf(key)); value.id=id; value.setAttribute('aria-labelledby',heading.id); if(direction) value.dir=direction;
        field.append(heading,value,el('small',null,'قيمة اصطناعية ثابتة'));
      }
      root.append(field);
    });
  }
  function buildSummary(target) {
    target.replaceChildren();
    stages.slice(0,4).forEach(stage=>{
      const group=el('section','preview-group'); group.append(el('h4',null,stage.title)); const list=el('dl');
      stage.fields.forEach(([key,label,,dir])=>{const value=el('dd',null,valueOf(key)); if(dir)value.dir=dir; list.append(el('dt',null,label),value);});
      group.append(list); target.append(group);
    });
  }
  function render(focus=false) {
    $('step-label').textContent=`المرحلة ${step+1} من ${stages.length}`; $('percent').textContent=`${(step+1)*20}%`; $('progress').value=(step+1)*20;
    $('stage-number').textContent=String(step+1).padStart(2,'0'); $('stage-title').textContent=stages[step].title; $('stage-description').textContent=stages[step].description; $('validation').textContent='';
    $('steps').querySelectorAll('button').forEach((btn,i)=>{btn.disabled=i>visited; btn.classList.toggle('done',i<step); if(i===step)btn.setAttribute('aria-current','step');else btn.removeAttribute('aria-current');});
    $('back').disabled=step===0; $('next').hidden=step===4; $('print').hidden=step!==4; $('fields').hidden=step===4; $('preview').hidden=step!==4;
    $('print-sheet').classList.remove('ready');
    if(step===4){buildSummary($('preview-content'));buildSummary($('print-content'));$('print-date').textContent='تاريخ المعاينة: '+formatDate(now());$('print-sheet').classList.add('ready');} else renderFields();
    if(!motion.matches){const target=step===4?$('preview'):$('fields');target.classList.remove('reveal');requestAnimationFrame(()=>target.classList.add('reveal'));}
    if(focus)$('stage-title').focus({preventScroll:true});
  }
  function go(index) {
    if(index<0||index>4)return;
    if(index>step && !Array.from({length:index},(_,i)=>i).every(isValidStage)){ $('validation').textContent='تعذر التحقق من السجل الاصطناعي. أعد تعيين النموذج.';return; }
    step=index; visited=Math.max(visited,step); render(true); tone(step===4?'success':'tap');
    if(step===4)notify('تم تجهيز المعاينة التجريبية. لم يتم إرسال أي بيانات.');
  }
  function reset(index=0, showToast=true) {
    profileIndex=index;current={...profiles[index]};step=0;visited=0;$('profile').value=String(index);render(showToast);
    if(showToast){tone();notify('تم إعادة تعيين النموذج التجريبي.');}
  }
  $('profile').addEventListener('change',()=>{const index=Number($('profile').value);if(Number.isInteger(index)&&index>=0&&index<profiles.length)reset(index,false);});
  $('next').addEventListener('click',()=>go(step+1)); $('back').addEventListener('click',()=>go(step-1)); $('reset').addEventListener('click',()=>reset(profileIndex));
  $('steps').addEventListener('click',e=>{const button=e.target.closest('button[data-step]');if(button&&!button.disabled)go(Number(button.dataset.step));});
  $('print').addEventListener('click',()=>{if(step!==4||!stages.slice(0,4).every((_,i)=>isValidStage(i)))return;buildSummary($('print-content'));$('print-sheet').classList.add('ready');tone();window.print();});
  $('theme-btn').addEventListener('click',()=>{const root=document.documentElement;const light=root.dataset.theme!=='light';root.dataset.theme=light?'light':'dark';$('theme-btn').textContent=light?'☾':'☀';tone();});
  $('sound-btn').addEventListener('click',()=>{sound=!sound;$('sound-btn').setAttribute('aria-pressed',String(sound));$('sound-btn').setAttribute('aria-label',sound?'إيقاف الصوت':'تشغيل الصوت');tone('success');notify(sound?'تم تفعيل المؤثرات الصوتية.':'تم إيقاف المؤثرات الصوتية.');});
  function menu(open){$('nav').classList.toggle('open',open);$('menu-btn').setAttribute('aria-expanded',String(open));}
  $('menu-btn').addEventListener('click',()=>menu($('menu-btn').getAttribute('aria-expanded')!=='true'));
  $('nav').addEventListener('click',e=>{if(e.target.closest('a'))menu(false);}); document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false);});
  const tick=()=>{$('clock').textContent=now().toLocaleTimeString('en-GB',{hour12:false});};tick();setInterval(tick,1000);
  function boot(){if(motion.matches)return; const box=$('boot');box.hidden=false;let start;const run=t=>{start??=t;const percent=Math.min(100,Math.round((t-start)/9));$('boot-progress').value=percent;$('boot-status').textContent=percent<45?'LOADING INTERFACE...':percent<85?'CHECKING LOCAL COMPONENTS...':'SYSTEM READY';if(percent<100)requestAnimationFrame(run);else{box.classList.add('out');setTimeout(()=>{box.hidden=true;},350);}};requestAnimationFrame(run);}
  // Decorative canvas, capped resolution, paused when backgrounded or scrolled away.
  const canvas=$('particles'),ctx=canvas.getContext('2d');let w=0,h=0,p=[],raf=0,last=0,visible=true;
  function resize(){if(!ctx)return;const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(w*ratio));canvas.height=Math.max(1,Math.round(h*ratio));ctx.setTransform(ratio,0,0,ratio,0,0);p=Array.from({length:Math.min(55,Math.max(18,Math.round(w/19)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:.6+Math.random()*1.4}));}
  function frame(t){raf=0;if(!ctx||document.hidden||motion.matches||!visible)return;if(t-last>=30){last=t;ctx.clearRect(0,0,w,h);for(const q of p){q.x=(q.x+q.vx+w)%w;q.y=(q.y+q.vy+h)%h;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fillStyle='rgba(214,187,105,.48)';ctx.fill();}for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const a=p[i],b=p[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<85){ctx.strokeStyle=`rgba(129,165,117,${.13*(1-d/85)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}raf=requestAnimationFrame(frame);}
  function sync(){if(raf){cancelAnimationFrame(raf);raf=0;}if(!document.hidden&&visible&&!motion.matches&&ctx){resize();raf=requestAnimationFrame(frame);}}
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe($('home'));}
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(sync,120);},{passive:true});document.addEventListener('visibilitychange',sync);if(motion.addEventListener)motion.addEventListener('change',sync);
  $('app').hidden=false;reset(0,false);sync();boot();
})();
