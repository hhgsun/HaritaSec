
class MapCtrl {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 18;

    this.map = null;
    this.mainMarker = null;
    this.drawingManager = null;
    this.selectedShape = null;
  }

  initMap() {
    var self = this;

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: this.zoom,
      disableDefaultUI: true,
    });

    this.mainMarker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });

    var polyOptions = {
      strokeWeight: 0,
      fillOpacity: 0.3,
      editable: true,
      draggable: false
    };

    // şekil çizim aracı
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['circle', 'rectangle', 'polygon'],
      },
      rectangleOptions: polyOptions,
      circleOptions: polyOptions,
      polygonOptions: polyOptions,
      map: this.map,
    });

    // harita üzerine tıklama event
    this.map.addListener('click', function (e) {
      self.openDetailBox(e.latLng.lat(), e.latLng.lng());
      self.mainMarker.setPosition(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
    });

    // yeni şekilden sonra event
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (e) {
      var newShape = e.overlay;
      newShape.type = e.type;
      newShape.setEditable(false);
      self.drawingManager.setDrawingMode(null); // yeni şekil sonrası çizim aracı sıfırlanır

      // oluşan şekile tıklayınca
      google.maps.event.addListener(newShape, 'click', function () {
        self.setSelectShape(newShape, this);
      });
    });

    // şekil modu değişince event
    google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', self.clearSelectShape);
    // haritaya tıklayınca event
    google.maps.event.addListener(this.map, 'click', self.clearSelectShape);
  }

  addShape() {
    var triangleCoords = [
      { lat: 41.5055879, lng: 27.1496959 },
      { lat: 40.5074612, lng: 27.4766318 },
      { lat: 39.4855018, lng: 26.2730447 },
      { lat: 41.5055879, lng: 27.1496959 },
    ];
    var bermudaTriangle = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    bermudaTriangle.setMap(this.map);
  }

  // seçilen şeklin konumlarını ayıklar
  shapeCoordToArray(event) {
    var vertices = event.getPath();
    var latLngList = [];
    for (var i = 0; i < vertices.getLength(); i++) {
      var xy = vertices.getAt(i);
      var latLng = new google.maps.LatLng(xy.lat(), xy.lng());
      latLngList.push(latLng);
    }
    return latLngList;
  }

  setSelectShape(shape, shapeClickEvent = null) {
    if (shape.type !== 'marker') {
      this.clearSelectShape();
      shape.setEditable(true);
      shape.latLngList = this.shapeCoordToArray(shapeClickEvent); // diktörtgen ve yuvarlak seçimlerinde sorun var
    }
    this.selectedShape = shape;
    var event = new CustomEvent('selected-shape');
    document.dispatchEvent(event);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
    }
  }

  clearSelectShape() {
    if (this.selectedShape) {
      if (this.selectedShape.type !== 'marker') {
        this.selectedShape.setEditable(false);
      }
      this.selectedShape = null;
    }
  }

  mapSetContainerArea(position, contentHtml) {
    var div = document.createElement('div');
    div.style.backgroundColor = '#fff';
    div.style.padding = '5px';
    div.style.fontSize = '16px';
    div.append(contentHtml);
    this.map.controls[google.maps.ControlPosition[position]].push(div);
  }

  openDetailBox(lat, lng) {
    this.detailBoxHidden();
    var self = this;
    var address = new CoordAddress(lat, lng);
    address.getCoordAdressData().then(function (res) {
      self.detailBoxShow();
      document.getElementById("container-detail").innerHTML = "<pre style='white-space: pre-wrap;'>" + res + "</pre>";
    });
  };

  detailBoxHidden() {
    document.getElementById("container-detail").classList.add('box-hidden');
    document.getElementById("container-detail").classList.remove('box-show');
  }

  detailBoxShow() {
    document.getElementById("container-detail").classList.remove('box-hidden');
    document.getElementById("container-detail").classList.add('box-show');
  }
}