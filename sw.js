self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('fox-store').then(function(cache) {
            return cache.addAll([
                // App
                '/auxiliar-compras/',
                '/auxiliar-compras/index.html',
                '/auxiliar-compras/list.html',
                '/auxiliar-compras/js/index.js',
                '/auxiliar-compras/css/style.css',
                '/auxiliar-compras/LICENSE',

                // Icons8
                '/auxiliar-compras/icons8/icons8-back-to-36.png',
                '/auxiliar-compras/icons8/icons8-pencil-26.png',
                '/auxiliar-compras/icons8/icons8-trash-26.png',

                // Bootstrap
                '/auxiliar-compras/third-party/bootstrap4/css/bootstrap.min.css',
                '/auxiliar-compras/third-party/bootstrap4/js/bootstrap.min.js',
                '/auxiliar-compras/third-party/bootstrap4/LICENSE',

                // VueJS
                '/auxiliar-compras/third-party/vuejs/LICENSE',
                '/auxiliar-compras/third-party/vuejs/vue.min.js',
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
