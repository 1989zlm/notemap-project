//! farklı dosyalardan gelen veriler
import { setStorage, getStorage, icons, userIcon } from "./helpers.js";


// !html elemanları çağırma
const form = document.querySelector('form');
const input = document.querySelector('form #title');
const cancelBtn = document.querySelector('form #cancel');
const noteList = document.querySelector('ul');
const expandBtn = document.querySelector('#checkbox');
const aside = document.querySelector('.wrapper');


// !global (kodun heryerinden ulaşılabilen)değişkenler
var coords;
var notes = getStorage() || []; // veriler null yerine boş dizi olsun
var markerLayer = null;
var map;


// console.log(notes);

// haritayı ekrana basan fonksiuuyon
function loadMap(coords) {
    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //imleçleri tutacağımız ayrı bir katman oluşturma
    markerLayer = L.layerGroup().addTo(map);

    // kullanıcının konumuna imleç bas
    L.marker(coords, { icon: userIcon }).addTo(map);


    // console.log(markerLayer);
    // lokalden gelen verileri ekrana bas
    renderNoteList(notes);

    // haritadaki tıklanma olaylarını izle
    map.on('click', onMapClick);
}

// iptal butonuna tıklanırsa formu temzile ve kapat
form[3].addEventListener('click', () => {
    // formu temizle
    form.reset();
    //formu kapat
    form.style.display = 'none';
})

// form gönderilirse yeni not oluştur ve storaga kaydet
form.addEventListener('submit', (e) => {
    //1yenilemeyi engelle
    e.preventDefault();

    //2inputlardaki verilerden bir not objesi oluştur
    const newNote = {
        id: new Date().getTime(),
        title: form[0].value,
        date: form[1].value,
        status: form[2].value,
        coords: coords,
    }
    console.log(newNote);

    // 3dizinin başına yeni notu ekle
    notes.unshift(newNote);
    // console.log(notes);
    //4notları listele ekrana bas
    renderNoteList(notes);

    //5 local storage gçncelle
    setStorage(notes);

    //6formu kapat
    form.style.display = 'none';
    form.reset();
});

//not için imleç katmanına yeni bir imleç ekler
function renderMarker(note) {
    //imleç oluştur
    L.marker(note.coords, { icon: icons[note.status] })
        //imleci katmana ekle
        .addTo(markerLayer)
        .bindPopup(note.title)
}

//ekrana notları basar
function renderNoteList(items) {
    // önceden eklenen elemanları temizle
    noteList.innerHTML = '';
    markerLayer.clearLayers();

    //dizideki herbir obje için note kartı bas
    // console.log(items);
    items.forEach((note) => {
        // li elemanı oluuştur
        const listEle = document.createElement('li');

        // data id ekle
        listEle.dataset.id = note.id;

        //içeriği belirle
        listEle.innerHTML = `
        <div class="info">
          <p>${note.title} </p>
           <p>
            <span>Tarih:</span>
            <span>${note.date}</span>
           </p>
           <p>
            <span>Durum:</span>
            <span>${note.status}</span>
           </p>
        </div>
    <div class="icon">
        <i id="fly" class="bi bi-airplane-engines-fill"></i>
        <i id="delete" class="bi bi-trash3-fill"></i>
    </div>
        `;
        //elemanı listeye ekle
        noteList.appendChild(listEle);
        // elemanı haritaya ekle
        renderMarker(note);
    });
};


//(bir fonk.içerisinde başka bir fonksiyonu çağırıyorsak çağrılan bu fonsiyona callback fonsiyon denir)
// navigatorun haritayla(kitiphanesiyle) bi ilgisi yok bu js'in bir özelliğidir
navigator.geolocation.getCurrentPosition(
    // konumu alırsa kullanıcının konumuna göre çalışacak olan fonksiyon
    (e) => {
        loadMap([e.coords.latitude, e.coords.longitude])
    },
    //konumu almazsa varsayılan konuum olarak ankarayı göstrecek olan fonk.
    () => {
        loadMap([39.953925, 32.858552]);
    }
);

// haritadaki tıklanma olaylarında çalışır
function onMapClick(event) {
    // tıklanan yerin konumuna eriş global değişken aktardım
    coords = [event.latlng.lat, event.latlng.lng];

    //formuu göster
    form.style.display = 'flex';

    // haritayı tıklayınca formun ilk inputu tıklanmış gelsin
    form[0].focus();
}

// silme olayları uçui olayları
noteList.addEventListener('click', (e) => {

    //tıklanılan elemanın idisne erişme
    const found_id = e.target.closest('li').dataset.id;

    if (e.target.id === 'delete' && confirm('silmek istiyormusunuz?')) {
        // console.log(e.target);
        //idsini bildiğimiz elemanı diziden çıkart(silinecek olmayan kalcak)
        notes = notes.filter((note) => note.id != found_id);

        //lokali güncelle
        setStorage(notes);

        //ekranı güncelle
        renderNoteList(notes);
    }

    if (e.target.id === 'fly') {
        // console.log(e.target);
        // idisini bildiğimiz elemanı dizindeki haline erişme
        const note = notes.find((note) => note.id == found_id);

        //notun koordinatlarına git
        map.flyTo(note.coords);
    }
})

//! Gizle / Göster
checkbox.addEventListener('input', (e) => {
    const isChecked = e.target.checked;
  
    if (isChecked) {
      aside.classList.remove('hide');
    } else {
      aside.classList.add('hide');
    }
  });
  







//ornek not objesi
// const note ={
//     id:'kjfıwef',
//     title:'jfekl',
//     date:'2024kfj',
//     statur:'park yeri',
//      coords:[123,456],
// }
