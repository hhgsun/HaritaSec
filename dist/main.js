// https://developers.google.com/maps/documentation/javascript/examples/place-details
// http://bl.ocks.org/knownasilya/89a32e572989f0aff1f8
// http://bl.ocks.org/knownasilya/89a32e572989f0aff1f8 bunu dene

// APP START
function startApp() {
  var initLatLng = { lat: 41.657447, lng: 26.591756 }; // varsayılan lokasyon
  if (navigator.geolocation) {
    // cihazın konum bilgisini alma
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
  map.initMap(); // harita yükleme
  map.mapSetContainerArea("TOP_LEFT", "Harita Seçim OOP Ödev"); // marita üzerinde alan

  // kayıtlı içerikleri html içine aktarma
  shapes.get().then(res => {
    res.forEach(shape => {
      console.log('shape:',shape.data());
    });
  });

  // şekil seçildikten sonra tetiklenecek event
  document.addEventListener("selected-shape", shapeAddModalOpen);
  document.addEventListener("selected-shape-clear", shapeAddModalClose);
}

var currentShape = null;

function shapeAddModalOpen(){
  currentShape = map.selectedShape;
  document.getElementById('container-shape-modal').style.display = 'block';
}

function shapeAddModalClose(){
  document.getElementById('container-shape-edit-detail').style.display = 'none';
  document.getElementById('container-shape-modal').style.display = 'none';
  clearInputs();
}

function clearInputs(){
  document.getElementById('input-shape-name').value = null;
  document.getElementById('input-shape-desc').value = null;
}

function shapeEditDetailOpen(){
  document.getElementById('container-shape-edit-detail').style.display = 'block';
}

function deleteShape(){
  shapeAddModalClose();
  map.deleteSelectedShape();
}

function saveShapeDB(){
  console.log('current', currentShape);
  var title = document.getElementById('input-shape-name').value;
  var desc = document.getElementById('input-shape-desc').value;
  if(currentShape){
    if(currentShape.type && currentShape.latLngList, title, desc){
      var latlngList = [];
      currentShape.latLngList.forEach(latlng=>{
        latlngList.push({lat: latlng.lat(), lng:latlng.lng()});
      });
      var shape = new Shape(currentShape.type, latlngList, title, desc);
      shape.save().then(function(){
        alert('Kayıt Başarılı');
      }).catch(function(err){
        console.log(err);
        alert('Beklenmedik Hata');
      });
    }else{
      if(!title && !desc){
        alert('Başlık ve Açıklama alanlarını doldurunuz');
        return;
      }
      alert('Eksik bilgi girişi yapılmıştır');
    }
  }
}

function setMapShape(){
  map.setMapShape();
}
