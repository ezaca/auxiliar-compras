// ----------------
// Vue.js Data
// ----------------

var main_user_list = JSON.parse(window.localStorage.getItem('auxcom') || 'null') ||
[{
    title: 'Mercado',
    date: yyyymmdd(new Date()),
    items: [
        { qnt: 1, name: 'Tomate (Kg)', preview: 5, actual: null, check: true },
        { qnt: 1, name: 'Banana (Kg)', preview: 3.99, actual: null, check: false, classes: {} },
        { qnt: 2, name: 'Leite (1L)', preview: 3.99, actual: null, check: false, classes: {} },
        { qnt: 1, name: 'Feijão (Kg)', preview: 8, actual: null, check: false, classes: {} },
    ]
}];

// ----------------
// Vue.js App
// ----------------

var app = new Vue({
    el: '#app',
    data: {
        inputs: {
            lists: {
                add: '',
                adddate: yyyymmdd(new Date()),
            },
        },
        query: {
            list: Number(getItem(/#list=(\d+)/.exec(window.location.hash), 1)),
        },
        lists: main_user_list,
    },
    methods: {
        // Lists
        lists_create(ev){
            ev.preventDefault();
            this.lists.push({
                title: this.inputs.lists.add || 'Lista',
                date: this.inputs.lists.adddate,
                items: [],
            });
            this.inputs.lists.add = '';
            this.inputs.lists.adddate = yyyymmdd(new Date());
            save();
        },

        // Items
        items_create(ev){
            ev.preventDefault();
            this.lists[this.query.list].items.push({ qnt: 1, name: '' });
            save();
        }

        // Execute
        // Report
    }
});

// ----------------
// Utils
// ----------------

var _save_timeout = -1;
var gmt = /(GMT-\d+)/.exec(new Date())[1];

function save(){
    if (_save_timeout !== -1)
        clearTimeout(_save_timeout);

    console.log("Saved");
    window.localStorage.setItem('auxcom', JSON.stringify(main_user_list));
}

function late_save(){
    if (_save_timeout !== -1)
        clearTimeout(_save_timeout);
    _save_timeout = setTimeout(save, 1000);
}

function format_date(date){
    let d = (date instanceof Date) ? date : new Date(date+' '+gmt);
    return d.getDate().toString().padStart(2, '0') + '/' + d.getMonth().toString().padStart(2, '0') + '/' + d.getFullYear();
}

function yyyymmdd(date){
    let d = (date instanceof Date) ? date : new Date(date + ' ' + gmt);
    return  d.getFullYear() + '-' + d.getMonth().toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
}

function navigate(url){
    window.location.href = url;
}

function getItem(array, index){
    return array ? array[index] : undefined;
}

// ----------------
// PWA
// ----------------

if(('serviceWorker' in navigator) && (window.location.origin !== 'file://')) {
    navigator.serviceWorker
    .register('/pwa-examples/a2hs/sw.js')
    .then(function() { console.log('Service worker registered'); });
} else {
    console.log('Service worker could not be registered');
}
