'use strict';
const books = [
 {id:1,title:'الأصول الثلاثة',author:'الشيخ محمد بن عبد الوهاب',reader:'تسجيل تجريبي',category:'العقيدة',duration:'قريبًا',parts:8,description:'متن مختصر في أصول الدين الثلاثة، يصلح أن يكون مدخلًا لدراسة أصول الاعتقاد.',cover:'cover-1',symbol:'أصول'},
 {id:2,title:'كتاب التوحيد',author:'الشيخ محمد بن عبد الوهاب',reader:'يُحدد لاحقًا',category:'العقيدة',duration:'قريبًا',parts: '—',description:'كتاب في إفراد الله تعالى بالعبادة وبيان مسائل التوحيد.',cover:'cover-2',symbol:'توحيد'},
 {id:3,title:'الأربعون النووية',author:'الإمام النووي',reader:'يُحدد لاحقًا',category:'الحديث',duration:'قريبًا',parts:40,description:'أحاديث جامعة من جوامع كلم النبي ﷺ، معانٍ عظيمة وأصول نافعة.',cover:'cover-3',symbol:'حديث'},
 {id:4,title:'رياض الصالحين',author:'الإمام النووي',reader:'يُحدد لاحقًا',category:'الحديث',duration:'قريبًا',parts:'أبواب متعددة',description:'جمع للأحاديث في الآداب والأخلاق والعبادات والترغيب والترهيب.',cover:'cover-4',symbol:'رياض'},
 {id:5,title:'تفسير جزء عمّ',author:'مجموعة من العلماء',reader:'يُحدد لاحقًا',category:'التفسير',duration:'قريبًا',parts:37,description:'مادة تفسيرية مقترحة للتعلم والتدرج في فهم سور جزء عمّ.',cover:'cover-5',symbol:'تفسير'},
 {id:6,title:'مختصر السيرة النبوية',author:'محمد بن عبد الوهاب',reader:'يُحدد لاحقًا',category:'السيرة',duration:'قريبًا',parts:'فصول',description:'عرض موجز لأحداث السيرة النبوية، من المولد إلى الوفاة.',cover:'cover-6',symbol:'السيرة'},
 {id:7,title:'الأدب المفرد',author:'الإمام البخاري',reader:'يُحدد لاحقًا',category:'الحديث',duration:'قريبًا',parts:'أبواب',description:'كتاب في الآداب والأخلاق وصلة الرحم وحسن المعاملة.',cover:'cover-7',symbol:'أدب'},
 {id:8,title:'عمدة الفقه',author:'ابن قدامة المقدسي',reader:'يُحدد لاحقًا',category:'الفقه',duration:'قريبًا',parts:'أبواب',description:'متن فقهي مختصر مناسب لبداية دراسة الفقه على مذهب الإمام أحمد.',cover:'cover-8',symbol:'فقه'},
 {id:9,title:'القواعد الأربع',author:'الشيخ محمد بن عبد الوهاب',reader:'يُحدد لاحقًا',category:'العقيدة',duration:'قريبًا',parts:4,description:'رسالة موجزة في قواعد تتعلق بتوحيد العبادة.',cover:'cover-9',symbol:'قواعد'},
 {id:10,title:'حلية طالب العلم',author:'الشيخ بكر أبو زيد',reader:'يُحدد لاحقًا',category:'طلب العلم',duration:'قريبًا',parts:'فصول',description:'آداب طالب العلم وما يحتاج إليه في رحلته العلمية.',cover:'cover-10',symbol:'علم'},
 {id:11,title:'مدارج السالكين',author:'ابن قيم الجوزية',reader:'يُحدد لاحقًا',category:'التزكية',duration:'قريبًا',parts:'مجلدات',description:'كتاب في منازل السلوك وتزكية النفس وشرح معاني إياك نعبد وإياك نستعين.',cover:'cover-11',symbol:'مدارج'},
 {id:12,title:'الأربعون في أصول الدين',author:'اختيار للقراءة لاحقًا',reader:'يُحدد لاحقًا',category:'طلب العلم',duration:'قريبًا',parts:'قائمة مقترحة',description:'بطاقة تنظيمية تجريبية قابلة للاستبدال بكتاب موثق بعد اختيار مصدره.',cover:'cover-12',symbol:'معرفة'}
];
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const arabicDigits = n => String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]);
let activeCategory = 'الكل';
let favoritesOnly = false;
let favorites = loadFavorites();
function loadFavorites(){try{return JSON.parse(localStorage.getItem('sawti-favorites')||'[]')}catch{return []}}
function saveFavorites(){try{localStorage.setItem('sawti-favorites',JSON.stringify(favorites))}catch{showToast('تعذر حفظ المفضلة على هذا الجهاز')}}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function visibleBooks(){const term=$('#searchInput').value.trim().toLocaleLowerCase('ar');let list=books.filter(book=>(activeCategory==='الكل'||book.category===activeCategory)&&(!favoritesOnly||favorites.includes(book.id))&&(!term||`${book.title} ${book.author} ${book.reader} ${book.category}`.toLocaleLowerCase('ar').includes(term)));const sort=$('#sortSelect').value;if(sort==='title')list.sort((a,b)=>a.title.localeCompare(b.title,'ar'));if(sort==='author')list.sort((a,b)=>a.author.localeCompare(b.author,'ar'));return list}
function renderBooks(){const list=visibleBooks();$('#bookGrid').innerHTML=list.map(book=>`<article class="book-card" tabindex="0" role="button" aria-label="تفاصيل كتاب ${escapeHTML(book.title)}" data-open-book="${book.id}"><div class="cover-wrap"><div class="cover ${book.cover}"><span class="cover-pattern" aria-hidden="true">۞</span><span class="cover-category">${escapeHTML(book.category)}</span><span class="cover-title">${escapeHTML(book.title)}</span><span class="cover-author">${escapeHTML(book.author)}</span></div><button class="favorite-button ${favorites.includes(book.id)?'is-favorite':''}" data-favorite="${book.id}" aria-label="${favorites.includes(book.id)?'إزالة من':'إضافة إلى'} المفضلة" aria-pressed="${favorites.includes(book.id)}">${favorites.includes(book.id)?'♥':'♡'}</button></div><div class="card-info"><span class="card-category">${escapeHTML(book.category)}</span><h3>${escapeHTML(book.title)}</h3><p class="card-author">${escapeHTML(book.author)}</p><div class="card-meta"><span class="meta-kind"><span>♫</span> صوتي</span><span>${escapeHTML(String(book.parts))==='—'?'تفاصيل قريبًا':escapeHTML(String(book.parts))+' '+(typeof book.parts==='number'?'مقطعًا':'')}</span></div><button class="detail-button" data-open-book="${book.id}">عرض التفاصيل <span aria-hidden="true">←</span></button></div></article>`).join('');$('#bookGrid').classList.toggle('hidden',list.length===0);$('#emptyState').classList.toggle('hidden',list.length!==0);$('#resultsLabel').innerHTML=`${favoritesOnly?'كتبك المفضلة':activeCategory==='الكل'?'كل الكتب':escapeHTML(activeCategory)} <span>${arabicDigits(list.length)} ${list.length===1?'نتيجة':'نتائج'}</span>`;$('#bookCount').textContent=arabicDigits(books.length);$('#favoriteCount').textContent=arabicDigits(favorites.length);$$('.category-chip').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===activeCategory));$('#favoritesNav').classList.toggle('active',favoritesOnly)}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2400)}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];saveFavorites();renderBooks();showToast(favorites.includes(id)?'أُضيف الكتاب إلى المفضلة':'أُزيل الكتاب من المفضلة')}
function openBook(id){const book=books.find(item=>item.id===Number(id));if(!book)return;$('#dialogContent').innerHTML=`<div class="dialog-layout"><div class="dialog-cover ${book.cover}">${escapeHTML(book.symbol)}</div><div class="dialog-content"><span class="detail-label">${escapeHTML(book.category)}</span><h2 id="dialogTitle">${escapeHTML(book.title)}</h2><p>${escapeHTML(book.author)}</p><p>القارئ: ${escapeHTML(book.reader)}</p><p>الفصول أو المقاطع: ${escapeHTML(String(book.parts))}</p></div></div><p>${escapeHTML(book.description)}</p><div class="dialog-note">هذه بطاقة تجريبية ضمن المرحلة الأولى. لم تُربط بهذا الكتاب ملفات صوتية حقيقية بعد؛ سنضيف المصادر والمشغل في المرحلة التالية بعد التحقق من الروابط وحقوق الاستخدام.</div><div class="dialog-actions"><button class="primary" id="dialogListen">♫ الاستماع — قريبًا</button><button id="dialogFavorite">${favorites.includes(book.id)?'♥ في المفضلة':'♡ أضف إلى المفضلة'}</button></div>`;$('#bookDialog').showModal();$('#dialogListen').addEventListener('click',()=>showToast('المشغل الصوتي ضمن المرحلة الثانية'));$('#dialogFavorite').addEventListener('click',()=>{toggleFavorite(book.id);$('#dialogFavorite').textContent=favorites.includes(book.id)?'♥ في المفضلة':'♡ أضف إلى المفضلة'})}
$('#searchInput').addEventListener('input',()=>{favoritesOnly=false;renderBooks()});$('#sortSelect').addEventListener('change',renderBooks);$('#categoryList').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;favoritesOnly=false;renderBooks()});$('#bookGrid').addEventListener('click',event=>{const fav=event.target.closest('[data-favorite]');if(fav){event.stopPropagation();toggleFavorite(Number(fav.dataset.favorite));return}const open=event.target.closest('[data-open-book]');if(open)openBook(open.dataset.openBook)});$('#bookGrid').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('.book-card')){event.preventDefault();openBook(event.target.dataset.openBook)}});$('#dialogClose').addEventListener('click',()=>$('#bookDialog').close());$('#bookDialog').addEventListener('click',event=>{if(event.target===$('#bookDialog'))$('#bookDialog').close()});$('#resetFilters').addEventListener('click',()=>{$('#searchInput').value='';activeCategory='الكل';favoritesOnly=false;renderBooks()});$('#favoritesNav').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;activeCategory='الكل';$('#searchInput').value='';renderBooks();$('#library').scrollIntoView({behavior:'smooth'})});$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');const dark=document.body.classList.contains('dark');try{localStorage.setItem('sawti-theme',dark?'dark':'light')}catch{}$('#themeToggle').textContent=dark?'☾':'☼';$('#themeToggle').setAttribute('aria-label',dark?'تفعيل المظهر الفاتح':'تفعيل المظهر الداكن')});try{if(localStorage.getItem('sawti-theme')==='dark'){document.body.classList.add('dark');$('#themeToggle').textContent='☾'}}catch{}
if('serviceWorker' in navigator && location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Service worker registration failed:',error)))}
renderBooks();


/* المرحلة الثانية: مكتبة محلية، مشغل، تقدّم ومواضع مرجعية */
(() => {
  const DB_NAME = 'sawti-local-library';
  const DB_VERSION = 1;
  const AUDIO_EXT = /\.(mp3|m4a|m4b|aac|ogg|opus|wav|flac|wma|webm)$/i;
  const local$ = (selector, root=document) => root.querySelector(selector);
  let dbPromise;
  let currentTrack = null;
  let currentObjectUrl = null;
  let savePositionTimer = null;
  const audio = local$('#audioPlayer');
  const toArabic = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
  const fmtTime = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '٠:٠٠';
    const s = Math.floor(seconds), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), r=s%60;
    return toArabic(h ? `${h}:${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}` : `${m}:${String(r).padStart(2,'0')}`);
  };
  function openDB(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)){reject(new Error('المتصفح لا يدعم التخزين المحلي المطلوب.'));return;}
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks',{keyPath:'id'});
        if(!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs',{keyPath:'id'});
        if(!db.objectStoreNames.contains('bookmarks')) db.createObjectStore('bookmarks',{keyPath:'id'});
      };
      request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error||new Error('تعذر فتح المكتبة المحلية.'));
    });
    return dbPromise;
  }
  async function store(name, mode, action){
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(name,mode), st=tx.objectStore(name); let req;
      try{req=action(st)}catch(e){reject(e);return;}
      if(req){req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);}
      else {tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);}
    });
  }
  const allTracks=()=>store('tracks','readonly',st=>st.getAll());
  const getTrack=id=>store('tracks','readonly',st=>st.get(id));
  const putTrack=track=>store('tracks','readwrite',st=>st.put(track));
  async function deleteTrack(id){const marks=(await allBookmarks()).filter(x=>x.trackId===id);await store('tracks','readwrite',st=>st.delete(id));await store('blobs','readwrite',st=>st.delete(id));for(const mark of marks)await deleteBookmark(mark.id);}
  const getBlob=id=>store('blobs','readonly',st=>st.get(id));
  const putBlob=record=>store('blobs','readwrite',st=>st.put(record));
  const allBookmarks=()=>store('bookmarks','readonly',st=>st.getAll());
  const putBookmark=item=>store('bookmarks','readwrite',st=>st.put(item));
  const deleteBookmark=id=>store('bookmarks','readwrite',st=>st.delete(id));
  function makeId(){return (crypto.randomUUID ? crypto.randomUUID() : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`)}
  function safeName(s){return String(s||'ملف صوتي').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function status(message){local$('#localStatus').textContent=message;}
  function pct(track){return track.duration>0 ? Math.min(100,Math.round((track.position||0)/track.duration*100)) : 0;}
  function totalProgress(tracks){
    const known=tracks.filter(t=>t.duration>0);
    if(!known.length) return 0;
    const duration=known.reduce((s,t)=>s+t.duration,0);
    return duration ? Math.round(known.reduce((s,t)=>s+Math.min(t.position||0,t.duration),0)/duration*100) : 0;
  }
  async function renderLocalLibrary(){
    let tracks; try{tracks=(await allTracks()).sort((a,b)=>a.name.localeCompare(b.name,'ar'));}
    catch(e){status(e.message||'تعذر قراءة المكتبة المحلية.');return;}
    const groups=new Map();
    tracks.forEach(t=>{const key=t.collection||'ملفات غير مصنفة';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);});
    const sum=local$('#librarySummary');
    sum.innerHTML=tracks.length?`<div><strong>${toArabic(tracks.length)}</strong><span>ملف صوتي</span></div><div><strong>${toArabic(totalProgress(tracks))}٪</strong><span>تقدّم المكتبة</span></div><div><strong>${toArabic(tracks.filter(t=>t.duration>0 && (t.position||0)>=t.duration-2).length)}</strong><span>ملفات مكتملة</span></div>`:'';
    local$('#localEmpty').classList.toggle('hidden',tracks.length>0);
    local$('#localGroups').innerHTML=[...groups.entries()].map(([name,list])=>{
      const progress=totalProgress(list), done=list.filter(t=>t.duration>0&&(t.position||0)>=t.duration-2).length;
      return `<section class="audio-group"><div class="group-heading"><div><h3>${safeName(name)}</h3><p>${toArabic(list.length)} ملف · ${toArabic(done)} مكتمل</p></div><strong>${toArabic(progress)}٪</strong></div><progress max="100" value="${progress}" aria-label="تقدّم ${safeName(name)}"></progress><div class="track-list">${list.map(t=>`<article class="track-row"><button class="track-play" data-play-track="${t.id}" aria-label="تشغيل ${safeName(t.name)}">▶</button><div class="track-main"><strong>${safeName(t.name)}</strong><div class="track-mini-progress"><progress max="100" value="${pct(t)}"></progress><small>${t.duration?`${toArabic(pct(t))}٪ · ${fmtTime(t.position||0)} / ${fmtTime(t.duration)}`:'لم يُشغّل بعد'}</small></div></div><button class="track-more" data-track-bookmark="${t.id}" title="إدارة العلامات">علامات</button><button class="track-remove" data-remove-track="${t.id}" aria-label="حذف ${safeName(t.name)} من المكتبة">×</button></article>`).join('')}</div></section>`;
    }).join('');
  }
  async function chooseDirectory(){
    if(!window.isSecureContext){status('يلزم فتح التطبيق عبر HTTPS لمنح إذن الوصول إلى المجلد.');return;}
    if(typeof window.showDirectoryPicker!=='function'){
      status('هذا المتصفح لا يوفّر اختيار المجلد مباشرة. استخدم «استيراد ملفات»؛ ستُحفظ نسخ محلية داخل التطبيق.');
      local$('#audioFilesInput').click(); return;
    }
    try{
      const dir=await window.showDirectoryPicker({mode:'read'});
      const collection=dir.name||'مجلد صوتي';
      status('جارٍ فحص المجلد وحفظ مراجع الملفات محليًا…');
      let count=0;
      async function walk(handle, prefix=''){
        for await(const entry of handle.values()){
          if(entry.kind==='directory'){await walk(entry,prefix+entry.name+'/');continue;}
          if(entry.kind==='file'&&AUDIO_EXT.test(entry.name)){
            const relative=prefix+entry.name;
            const old=(await allTracks()).find(t=>t.source==='handle'&&t.collection===collection&&t.relativePath===relative);
            if(old){old.handle=entry;old.lastSeen=Date.now();await putTrack(old);}
            else await putTrack({id:makeId(),name:entry.name,collection,relativePath:relative,source:'handle',handle:entry,duration:0,position:0,addedAt:Date.now(),completed:false});
            count++;
          }
        }
      }
      await walk(dir);
      if(!count) status('لم أعثر على ملفات صوتية مدعومة داخل المجلد المختار.');
      else status(`تمت إضافة ${toArabic(count)} ملفًا من «${collection}». لم تُرفع الملفات إلى الإنترنت.`);
      await renderLocalLibrary();
    }catch(e){if(e.name==='AbortError')return;console.error(e);status('تعذر الوصول إلى المجلد. تحقق من الإذن، أو استخدم استيراد الملفات.');}
  }
  async function importFiles(files){
    if(!files||!files.length)return;
    const collection=prompt('اكتب اسم الكتاب أو المجموعة التي تضم هذه الملفات:', 'كتاب صوتي جديد');
    if(collection===null)return;
    const label=collection.trim()||'كتاب صوتي جديد';
    status('جارٍ حفظ الملفات في مساحة التطبيق المحلية…');
    let done=0;
    try{
      if(navigator.storage&&navigator.storage.estimate){const est=await navigator.storage.estimate();const size=[...files].reduce((s,f)=>s+f.size,0);if(est.quota&&est.usage+size>est.quota*.95){status('قد لا تتسع مساحة المتصفح لهذه الملفات. جرّب اختيار عدد أقل من الملفات.');return;}}
      for(const file of files){
        if(!file.type.startsWith('audio/')&&!AUDIO_EXT.test(file.name))continue;
        const id=makeId();
        await putTrack({id,name:file.name,collection:label,relativePath:file.name,source:'blob',size:file.size,type:file.type||'audio/mpeg',duration:0,position:0,addedAt:Date.now(),completed:false});
        await putBlob({id,blob:file}); done++;
      }
      status(`تم حفظ ${toArabic(done)} ملفًا محليًا في مجموعة «${label}». لم تُرفع الملفات إلى الإنترنت.`);
      await renderLocalLibrary();
    }catch(e){console.error(e);status('تعذر حفظ بعض الملفات. قد تكون مساحة المتصفح غير كافية؛ احذف ملفات غير لازمة أو استخدم إذن المجلد إن كان مدعومًا.');await renderLocalLibrary();}
  }
  async function resolveAudioFile(track){
    if(track.source==='blob') {const rec=await getBlob(track.id);if(!rec||!rec.blob)throw new Error('لم نعثر على النسخة المحلية من الملف.');return rec.blob;}
    if(!track.handle)throw new Error('انتهى مرجع الملف. اختر المجلد مرة أخرى.');
    let permission=await track.handle.queryPermission({mode:'read'});
    if(permission!=='granted')permission=await track.handle.requestPermission({mode:'read'});
    if(permission!=='granted')throw new Error('لم يُمنح إذن قراءة الملف.');
    return await track.handle.getFile();
  }
  async function playTrack(id){
    try{
      const track=await getTrack(id);if(!track)return;
      const file=await resolveAudioFile(track);
      if(currentObjectUrl)URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl=URL.createObjectURL(file);currentTrack=track;
      audio.src=currentObjectUrl; audio.load();
      local$('#playerTitle').textContent=track.name;
      local$('#playerSubtitle').textContent=`${track.collection||'ملفات غير مصنفة'} · ${track.source==='blob'?'نسخة محلية محفوظة':'قراءة من مجلد بإذن المتصفح'}`;
      local$('#playerDialog').showModal();
      local$('#bookmarkList').innerHTML='';
      audio.addEventListener('loadedmetadata',async function onMeta(){audio.removeEventListener('loadedmetadata',onMeta);if(Number.isFinite(audio.duration)){currentTrack.duration=audio.duration;await putTrack(currentTrack);updatePlayerProgress();await renderLocalLibrary();}if(currentTrack.position>0){audio.currentTime=Math.min(currentTrack.position,Math.max(0,audio.duration-1));updatePlayerProgress();}audio.play().catch(()=>{});renderBookmarks();},{once:false});
      renderBookmarks();
    }catch(e){console.error(e);status(e.message||'تعذر تشغيل الملف.');showToast(e.message||'تعذر تشغيل الملف');}
  }
  function updatePlayerProgress(){
    if(!currentTrack)return;
    const duration=Number.isFinite(audio.duration)?audio.duration:(currentTrack.duration||0), pos=audio.currentTime||0;
    const percent=duration?Math.min(100,Math.round(pos/duration*100)):0;
    local$('#fileProgressBar').value=percent;local$('#fileProgressText').textContent=`${toArabic(percent)}٪`;
    local$('#currentTimeText').textContent=fmtTime(pos);local$('#durationText').textContent=fmtTime(duration);
  }
  async function savePosition(){
    if(!currentTrack||!Number.isFinite(audio.currentTime))return;
    currentTrack.position=audio.currentTime;currentTrack.duration=Number.isFinite(audio.duration)?audio.duration:currentTrack.duration;
    currentTrack.completed=currentTrack.duration>0&&currentTrack.position>=currentTrack.duration-2;
    try{await putTrack(currentTrack);await renderLocalLibrary();}catch(e){console.warn('تعذر حفظ موضع التشغيل',e);}
  }
  async function renderBookmarks(){
    if(!currentTrack)return;
    const list=(await allBookmarks()).filter(b=>b.trackId===currentTrack.id).sort((a,b)=>a.time-b.time);
    local$('#bookmarkList').innerHTML=list.length?list.map(b=>`<div class="bookmark-item"><button data-jump-bookmark="${b.id}" class="bookmark-jump"><strong>${safeName(b.name)}</strong><small>${fmtTime(b.time)}${b.note?` · ${safeName(b.note)}`:''}</small></button><button data-delete-bookmark="${b.id}" class="bookmark-delete" aria-label="حذف العلامة">×</button></div>`).join(''):'<p class="bookmark-empty">لا توجد علامات بعد. أضف علامة للعودة إلى موضع مهم.</p>';
  }
  async function addBookmark(){
    if(!currentTrack)return;
    const name=prompt('اسم العلامة المرجعية:',`موضع ${fmtTime(audio.currentTime)}`);if(name===null)return;
    const note=prompt('ملاحظة اختيارية لهذه العلامة (اتركها فارغة إن شئت):','');if(note===null)return;
    await putBookmark({id:makeId(),trackId:currentTrack.id,name:name.trim()||`موضع ${fmtTime(audio.currentTime)}`,note:note.trim(),time:audio.currentTime,createdAt:Date.now()});
    await renderBookmarks();showToast('تم حفظ العلامة المرجعية محليًا');
  }
  local$('#chooseFolderBtn').addEventListener('click',chooseDirectory);
  local$('#importFilesBtn').addEventListener('click',()=>local$('#audioFilesInput').click());
  local$('#audioFilesInput').addEventListener('change',async e=>{await importFiles(e.target.files);e.target.value='';});
  local$('#localGroups').addEventListener('click',async e=>{
    const play=e.target.closest('[data-play-track]');if(play){await playTrack(play.dataset.playTrack);return;}
    const marks=e.target.closest('[data-track-bookmark]');if(marks){await playTrack(marks.dataset.trackBookmark);return;}
    const remove=e.target.closest('[data-remove-track]');if(remove&&confirm('هل تريد إزالة هذا الملف ومواضعه المرجعية من مكتبة التطبيق؟')){await deleteTrack(remove.dataset.removeTrack);await renderLocalLibrary();status('تمت إزالة الملف من فهرس المكتبة المحلية.');}
  });
  local$('#audioPlayer').addEventListener('timeupdate',()=>{updatePlayerProgress();if(!savePositionTimer){savePositionTimer=setTimeout(async()=>{savePositionTimer=null;await savePosition();},4000);}});
  local$('#audioPlayer').addEventListener('pause',savePosition);
  local$('#audioPlayer').addEventListener('ended',async()=>{await savePosition();showToast('اكتمل هذا الملف الصوتي');});
  local$('#audioPlayer').addEventListener('loadedmetadata',updatePlayerProgress);
  local$('#bookmarkAddBtn').addEventListener('click',addBookmark);
  local$('#resumeStartBtn').addEventListener('click',()=>{if(currentTrack)audio.currentTime=Math.min(currentTrack.position||0,audio.duration||0);audio.play().catch(()=>{});});
  local$('#bookmarkList').addEventListener('click',async e=>{
    const jump=e.target.closest('[data-jump-bookmark]');if(jump){const b=(await allBookmarks()).find(x=>x.id===jump.dataset.jumpBookmark);if(b){audio.currentTime=b.time;audio.play().catch(()=>{});}return;}
    const del=e.target.closest('[data-delete-bookmark]');if(del){await deleteBookmark(del.dataset.deleteBookmark);await renderBookmarks();showToast('حُذفت العلامة المرجعية');}
  });
  local$('#playerClose').addEventListener('click',async()=>{await savePosition();local$('#playerDialog').close();audio.pause();});
  local$('#playerDialog').addEventListener('close',()=>{audio.pause();});
  local$('#exportBackupBtn').addEventListener('click',async()=>{
    try{
      const tracks=(await allTracks()).map(t=>({id:t.id,name:t.name,collection:t.collection,relativePath:t.relativePath,source:t.source,size:t.size||null,type:t.type||null,duration:t.duration||0,position:t.position||0,completed:!!t.completed,addedAt:t.addedAt}));
      const bookmarks=await allBookmarks();
      const payload={app:'sawti-islamic-library',backupVersion:1,createdAt:new Date().toISOString(),notice:'هذه النسخة الاحتياطية تشمل بيانات التقدّم والعلامات فقط، ولا تشمل الملفات الصوتية أو أذونات المجلد.',tracks,bookmarks};
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sawti-local-backup.json';a.click();URL.revokeObjectURL(url);showToast('تم تجهيز نسخة احتياطية للبيانات');
    }catch(e){showToast('تعذر تصدير النسخة الاحتياطية');}
  });
  local$('#clearLocalBtn').addEventListener('click',async()=>{
    if(!confirm('سيُحذف فهرس المكتبة والملفات المستوردة والعلامات من هذا المتصفح. لا يمكن التراجع عن ذلك. هل تريد المتابعة؟'))return;
    try{for(const name of ['tracks','blobs','bookmarks'])await store(name,'readwrite',st=>st.clear());if(currentObjectUrl)URL.revokeObjectURL(currentObjectUrl);currentTrack=null;audio.pause();audio.removeAttribute('src');await renderLocalLibrary();status('تم مسح بيانات المكتبة المحلية.');}catch(e){status('تعذر مسح البيانات المحلية.');}
  });
  (async()=>{try{await renderLocalLibrary();if(!window.isSecureContext)status('تنبيه: بعض إمكانات إذن المجلد تحتاج إلى HTTPS. ارفع التطبيق على GitHub Pages لاختبارها.');}catch(e){status(e.message||'تعذر تهيئة المكتبة المحلية.');}})();
})();
