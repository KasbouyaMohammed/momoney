// online: always the latest files; offline: the saved copy
const C='momoney-v9',A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.oninstall=e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));
// drop old copies, then reload any open window so it runs the new version
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))
  .then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window'})).then(cs=>cs.forEach(c=>c.navigate(c.url))));
self.onfetch=e=>{
  if(e.request.method!=='GET')return;
  // a page request can't be re-fetched with options, so fetch its URL instead
  const q=e.request.mode==='navigate'?new Request(e.request.url,{cache:'no-cache'}):e.request;
  e.respondWith(fetch(q).then(res=>{
    if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return res;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
};
