// https://developers.google.com/maps/documentation/javascript/examples/place-details
// http://bl.ocks.org/knownasilya/89a32e572989f0aff1f8
// http://bl.ocks.org/knownasilya/89a32e572989f0aff1f8 bunu dene

// APP START
function startApp() {
  var initLatLng = { lat: 41.657447, lng: 26.591756 }; // varsayılan lokasyon
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      initLatLng.lat = position.coords.latitude;
      initLatLng.lng = position.coords.longitude;
      initialize(initLatLng.lat, initLatLng.lng);
    }, function () {
      initialize(initLatLng.lat, initLatLng.lng);
    });
  }else{
    initialize(initLatLng.lat, initLatLng.lng);
  }
}

var map = null;

function initialize(lat, lng){
  map = new MapCtrl(lat, lng);
  map.initMap();
  map.mapSetContainerArea("TOP_LEFT", "Harita Seçim OOP Ödev");

  map.addShape();

  //** */
  var paths =[
    { lat: 41.5055879, lng: 27.1496959 },
    { lat: 40.5074612, lng: 27.4766318 },
    { lat: 39.4855018, lng: 26.2730447 },
    { lat: 41.5055879, lng: 27.1496959 },
  ];
  var shape = new Shape("polygon", paths, 'Deneme 4');
  // shape.save(); //new shape
  shape.getAll().then(res=>{
    console.log("liste shape:",res);
  });

  // şekil seçildikten sonra tetiklenecek event
  document.addEventListener("selected-shape", selectShape);
}

function selectShape(){
  console.log('Seçilen Shape Event:', map.selectedShape);
  /**
   * BURDA SEÇİLEN ŞEKİL İÇİN DİĞER İŞLEMLER YAPILACAK
   * -DB KAYIT, TITLE VERME İŞLEMLERİ VS.
   */
}

function deleteShape(){
  map.deleteSelectedShape();
}
