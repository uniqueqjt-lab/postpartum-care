const CACHE='postpartum-care-v1.7';
const ASSETS=[
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/d0.html",
  "/d1.html",
  "/d2.html",
  "/d3.html",
  "/d4-5.html",
  "/d6-7.html",
  "/d8-10.html",
  "/d11-14.html",
  "/week3.html",
  "/week4.html",
  "/week5-6.html",
  "/week7-8.html",
  "/week9-12.html",
  "/topic-lochia.html",
  "/topic-perineum.html",
  "/topic-cesarean.html",
  "/topic-pelvic-floor.html",
  "/topic-bowel.html",
  "/topic-core.html",
  "/topic-exercise.html",
  "/topic-sex.html",
  "/topic-breast.html",
  "/topic-sleep-mood.html",
  "/topic-diet.html",
  "/myths.html"
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached=>{
      const network=fetch(event.request).then(resp=>{
        if(resp && resp.status===200){
          const clone=resp.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,clone));
        }
        return resp;
      }).catch(()=>cached);
      return cached || network;
    })
  );
});