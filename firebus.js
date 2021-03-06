var buses = { };
var routeMarkers = {};
var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(40.62335, -111.86198),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    var transitLayer = new google.maps.TransitLayer();
	transitLayer.setMap(map);
}
      
var f = new Firebase("https://slcrider.firebaseio.com/uta");

function newBus(bus, firebaseId) {
    var busLatLng = new google.maps.LatLng(bus.lat, bus.lon);
    var directionColor = bus.dirTag && bus.dirTag.indexOf('OB') > -1 ? "7094FF" : "FF6262";
    var marker = new google.maps.Marker({ icon: 'http://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bbT|'+bus.routeTag+'|' + directionColor + '|eee', position: busLatLng, map: map });
    buses[firebaseId] = marker;
    buses[firebaseId].info = bus;
}

f.once("value", function(s) {
  s.forEach(function(b) {
    newBus(b.val(), b.name());
  });
});

f.on("child_changed", function(s) {
  var busMarker = buses[s.name()];
  if(typeof busMarker === 'undefined') {
    newBus(s.val(), s.name());
  }
  else {
    busMarker.animatedMoveTo(s.val().lat, s.val().lon);
  }
});

f.on("child_removed", function(s) {
  var busMarker = buses[s.name()];
  if(typeof busMarker !== 'undefined') {
    busMarker.setMap(null);
    delete buses[s.name()];
    }
});

