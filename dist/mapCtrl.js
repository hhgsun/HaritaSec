// https://developers.google.com/maps/documentation/javascript/examples/place-details
var coordMapKey = "AIzaSyDR9BxloT6YZERaVxmLCL8xgeRAvxdTllk"; //AIzaSyAh-3vnlSoEldRmuZ2Ed7tLIP5Xu7Rmjis <haritasec-key -dene

var initLatLng = { lat: 41.6574312, lng: 26.5918566 }; // mevçut lokasyon alınacak
var map;
var marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: initLatLng,
    zoom: 8,
    disableDefaultUI: true,
    
  });
  marker = new google.maps.Marker({
    position: initLatLng,
    map: map,
    animation: google.maps.Animation.DROP,
    title: 'Tıkla',
    draggable: true,
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  });

  map.addListener('click', function (e) {
    getCoordAddress(e.latLng.lat(), e.latLng.lng());
    marker.setPosition(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()));
  });

  // http://bl.ocks.org/knownasilya/89a32e572989f0aff1f8 bunu dene
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'circle', 'polygon', 'rectangle'],
    },
    markerOptions: {
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    },
    polylineOptions: {
      editable: true,
      draggable: true
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 3,
      clickable: true,
      editable: true,
      draggable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
  
  map.addListener(drawingManager, 'insert_at', function(event) {
    console.log(event);
    if (event.type == 'circle') {
      var radius = event.overlay.getRadius();
    }
  });

  leftTopArea();
}


function getCoordAddress(lat, lng){
  document.getElementById("container-detail").classList.add('box-hidden');
  document.getElementById("container-detail").classList.remove('box-show');

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("container-detail").classList.remove('box-hidden');
      document.getElementById("container-detail").classList.add('box-show');
      document.getElementById("container-detail").innerHTML = "<pre style='white-space: pre-wrap;'>" + this.responseText + "</pre>";
      console.log(JSON.parse(this.response));
    }
  };
  xhttp.open("GET", getCoordAddressUrl(lat, lng), true);
  xhttp.send();
};

function getCoordAddressUrl(lat, lng){
  return "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
  + lat + ","+ lng 
  + "&location_type=ROOFTOP&result_type=street_address&key=" 
  + coordMapKey;
}

function leftTopArea(){
  var div1 = document.createElement('div');
  div1.style.backgroundColor = '#fff';
  div1.style.padding = '5px';
  div1.style.fontSize = '16px';
  div1.append("Harita Seçim OOP Ödev");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(div1);
}