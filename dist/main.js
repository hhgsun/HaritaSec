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
  } else {
    initialize(initLatLng.lat, initLatLng.lng);
  }
}

var map = null;

function initialize(lat, lng) {
  map = new MapCtrl(lat, lng);
  map.initMap(); // harita yükleme
  map.mapSetContainerArea("TOP_LEFT", "Harita Seçim OOP Ödev"); // marita üzerinde alan

  // şekil seçildikten sonra tetiklenecek event
  document.addEventListener("selected-shape", shapeAddModalOpen);
  document.addEventListener("selected-shape-clear", shapeAddModalClose);
  loadShapeList();
}

function loadShapeList() {
  // sıfırlama
  document.getElementById('container-shape-list').innerHTML = '';
  // kayıtlı içerikleri html içine aktarma
  shapesList.get().then(res => {
    if (res.size) {
      res.forEach(shape => {
        var li = document.createElement('li');
        li.id = shape.id;
        li.setAttribute('class', 'container-shape-list-item');
        li.setAttribute('onclick', 'loadGetShapeData(this)');
        li.append(shape.data().title);
        document.getElementById('container-shape-list').append(li);
      });
    } else {
      document.getElementById('container-shape-list').append('Kayıt Bulunmamaktadır')
    }
  });
}

function loadGetShapeData(itemObj) {
  console.log('ggg', itemObj.id);
  if(itemObj.id){
    shapesList.doc(itemObj.id).get().then(function(res){
      if(res.exists){
        setMapShape(res.data().paths, res.data().zoom);
      }else{
        alert('Veri Kaydı Eksik');
      }
    });
  }
}


var currentShape = null;

function shapeAddModalOpen() {
  currentShape = map.selectedShape;
  document.getElementById('container-shape-modal').style.display = 'block';
}

function shapeAddModalClose() {
  document.getElementById('container-shape-edit-detail').style.display = 'none';
  document.getElementById('container-shape-modal').style.display = 'none';
  clearInputs();
}

function clearInputs() {
  document.getElementById('input-shape-name').value = null;
  document.getElementById('input-shape-desc').value = null;
}

function shapeEditDetailOpen() {
  document.getElementById('container-shape-edit-detail').style.display = 'block';
}

function deleteShape() {
  shapeAddModalClose();
  map.deleteSelectedShape();
}

function saveShapeDB() {
  var title = document.getElementById('input-shape-name').value;
  var desc = document.getElementById('input-shape-desc').value;
  if (currentShape) {
    if (currentShape.type && currentShape.latLngList, title, desc) {
      var paths = [];
      currentShape.latLngList.forEach(latlng => {
        paths.push({ lat: latlng.lat(), lng: latlng.lng() });
      });
      var shape = new Shape(currentShape.type, paths, title, desc, this.map.map.getZoom());
      shape.save().then(function () {
        shapeAddModalClose();
        loadShapeList();
        alert('Kayıt Başarılı');
      }).catch(function (err) {
        console.log(err);
        alert('Beklenmedik Hata');
      });
    } else {
      if (!title && !desc) {
        alert('Başlık ve Açıklama alanlarını doldurunuz');
        return;
      }
      alert('Eksik bilgi girişi yapılmıştır');
    }
  }
}

function setMapShape(_paths, _zoomLevel) {
  map.setMapZoom(_zoomLevel);
  map.setMapShape(_paths);
  map.setMapCenter(_paths[0]);
}
