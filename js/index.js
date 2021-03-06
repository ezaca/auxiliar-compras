// ----------------
// Vue.js Data
// ----------------

var list_types = [
    'mercado',
    'mercearia',
    'açougue',
    'padaria',
    'farmácia',
    'loja',
    'lista',
];

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
        recognition: {
            listening: false,
            last: null,
            success: true,
        },
        inputs: {
            lists: {
                add: '',
                adddate: yyyymmdd(new Date()),
            },
        },
        ext: {
            list_types,
            grammars,
        },
        query: {
            list: Number(getItem(/#list=(\d+)/.exec(window.location.hash), 1)),
        },
        lists: main_user_list,
    },
    methods: {
        refreshPage(){
            window.location.reload();
        },

        listenUser(){
            speechRecognition({
                timeout: 0,
                start: () => {
                    this.recognition.listening = true;
                },
                success: result => {
                    let m, r = result.transcript;
                    this.recognition.last = r;
                    this.recognition.listening = false;
                    this.recognition.success = true;
                    if (m = /(?:cri(?:ar?|em?)\s*listas?|criar|listas?)\s*(?:para)?\s*(\S+(?:(?:\s+|-)\S+)*)/.exec(r))
                    {
                        this.inputs.lists.add = ucfirst(m[1]);
                        this.inputs.lists.adddate = yyyymmdd(new Date());
                        this.lists_create();
                    }
                },
                error: error => {
                    this.recognition.listening = false;
                    this.recognition.success = false;
                },
            });
        },

        // Lists
        lists_create(){
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
        },

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

function ucfirst(text){
    return text[0].toUpperCase() + text.substr(1);
}

function navigate(url){
    window.location.href = url;
}

function getItem(array, index){
    return array ? array[index] : undefined;
}

function speechRecognition({timeout, success, error, start, grammar}){
    let timer, handled = false;
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // let speechRecognitionList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();
    // speechRecognitionList.addFromString(grammar, 1);
    // recognition.grammars = speechRecognitionList;
    recognition.lang = "pt-BR";
    recognition.onresult = function(event) {
        handled = true;
        clearTimeout(timer);
        success && success(event.results[0][0]);
    };
    recognition.onerror = function(...args){
        handled = true;
        error && error(...args);
    };
    recognition.onend = () => ! handled && error && error(false);
    if (timeout > 0)
        recognition.onstart = function(){
            start && start();
            timer = setTimeout(()=>recognition.abort(), timeout);
        };
    recognition.start();
    return recognition;
}

var $ = q => document.querySelector(q);
var $$ = q => document.querySelectorAll(q);

var grammars = {
    lists: `
#JSGF V1.0;
grammar auxiliarcompras.lists;
public <comandos> = criar lista [para <tipo>];
<tipo> = ${ list_types.join('|') };
`,
};

// ----------------
// PWA
// ----------------

if(('serviceWorker' in navigator) && (window.location.origin !== 'file://')) {
    navigator.serviceWorker
    .register('/auxiliar-compras/sw.js')
    .then(function() { console.log('Service worker registered'); });
} else {
    console.log('Service worker could not be registered');
}

let deferredPromptPWA;
const installWebAppBtn = $('#installWebApp');
 installWebAppBtn.style.display = 'none';

installWebAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deferredPromptPWA.prompt();
    deferredPromptPWA.userChoice.then((choiceResult) => { deferredPromptPWA = null; });
});

window.addEventListener('beforeinstallprompt', (e) => {
    installWebAppBtn.style.display = '';
    e.preventDefault();
    deferredPromptPWA = e;
    installWebAppBtn.style.display = '';
});