
class Shape {
  constructor(type = null, paths = null, title = null, desc = null, zoom = 18) {
    this.type = type;
    this.paths = paths;
    this.title = title;
    this.desc = desc;
    this.zoom = zoom;
  }

  async save() {
    return await shapesList.add({
      type: this.type,
      paths: this.paths,
      title: this.title,
      desc: this.desc,
      zoom: this.zoom
    });
  }
}


class CoordAddress {
  constructor(latitude, longitude) {
    this.coordMapKey = 'AIzaSyDR9BxloT6YZERaVxmLCL8xgeRAvxdTllk'; //AIzaSyAh-3vnlSoEldRmuZ2Ed7tLIP5Xu7Rmjis <haritasec-key -dene
    this.latitude = latitude;
    this.longitude = longitude;
  }

  getCoordUrlFormat() {
    return this.latitude + ',' + this.longitude;
  }

  getCoordAddressUrl() { // kordinat verileri için gerekli api adresi
    return "https://maps.googleapis.com/maps/api/geocode/json?latlng="
      + this.getCoordUrlFormat()
      + "&location_type=ROOFTOP&result_type=street_address"
      + "&key=" + this.coordMapKey;
  }

  async getCoordAdressData() {
    let response = await fetch(this.getCoordAddressUrl());
    return response.text(); //.json()
  }

}