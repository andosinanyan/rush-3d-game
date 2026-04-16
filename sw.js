const CACHE_NAME='rush3d-v1';
const ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './Soldier.glb',
  './trees.glb',
  './rocks.glb',
  './bushes.glb',
  './flowers.glb',
  './grass.glb',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp.ok&&e.request.method==='GET'){
      const clone=resp.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));
    }
    return resp;
  })).catch(()=>caches.match('./index.html')));
});
