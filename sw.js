var C='ad-v20',FC='ad-fonts',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=C&&x!=FC}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
if(u.hostname=='fonts.googleapis.com'||u.hostname=='fonts.gstatic.com'){e.respondWith(caches.open(FC).then(function(c){return c.match(r).then(function(m){var f=fetch(r).then(function(res){try{c.put(r,res.clone())}catch(x){}return res}).catch(function(){return m});return m||f})}));return}
if(u.origin!==location.origin||u.search.indexOf('_=')>-1)return;
var key=r.mode=='navigate'?'index.html':r;
e.respondWith(caches.open(C).then(function(c){return c.match(key).then(function(m){var f=fetch(r,{cache:'no-store'}).then(function(res){if(res&&res.ok)c.put(key,res.clone());return res}).catch(function(){return m});return m||f})}))});
