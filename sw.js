self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('fox-store').then(function(cache) {
            return cache.addAll([
                // App
                '/auxiliar-compras/',
                '/auxiliar-compras/index.html',
                '/auxiliar-compras/js/index.js',
                '/auxiliar-compras/css/style.css',
                '/auxiliar-compras/LICENSE',

                // Bootstrap
                '/auxiliar-compras/third-party/bootstrap4/css/bootstrap.min.css',
                '/auxiliar-compras/third-party/bootstrap4/js/bootstrap.min.js',
                '/auxiliar-compras/third-party/bootstrap4/LICENSE',
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
