// https://developers.google.com/maps/documentation/javascript/examples/place-details

var initLatLng = { lat: 41.6574312, lng: 26.5918566 }; // mevçut lokasyon alınacak
var map;
var marker;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: initLatLng,
    zoom: 8
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

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'circle', 'polygon', 'rectangle'],
    },
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 3,
      clickable: true,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
}

var googleMapKey = "AIzaSyDR9BxloT6YZERaVxmLCL8xgeRAvxdTllk";
function urlCtrl(lat, lng){
  return "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
  + lat + ","+ lng 
  + "&location_type=ROOFTOP&result_type=street_address&key=" 
  + googleMapKey;
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
      yeniUlke('örnek kısa ad', 'uzun Ad');
    }
  };
  xhttp.open("GET", urlCtrl(lat, lng), true);
  xhttp.send();
}

class Ulke{
  constructor(kisaad, uzunad){
    this.kisaad = kisaad;
    this.uzunad = uzunad;
  }
}

function yeniUlke(kad, uad){
  var ulke1= new Ulke(kad, uad);
  console.log(ulke1.kisaad + " -- " + ulke1.uzunad);
}