self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('fox-store').then(function(cache) {
     return cache.addAll([
       '/auxiliar-compras/',
       '/auxiliar-compras/index.html',
       '/auxiliar-compras/index.js',
       '/auxiliar-compras/style.css',
       '/auxiliar-compras/images/fox1.jpg',
       '/auxiliar-compras/images/fox2.jpg',
       '/auxiliar-compras/images/fox3.jpg',
       '/auxiliar-compras/images/fox4.jpg'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
