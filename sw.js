// Rede primeiro: sempre pega a versão mais nova quando há internet;
// usa o cache só quando estiver offline.
const CACHE='afina-v5';
const FILES=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'}).then(r=>{
      if(r.ok){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
