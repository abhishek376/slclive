    /* http://developer.rideuta.com/ API:
          closest stop : http://api.rideuta.com/SIRITEST/SIRI.svc/CloseStopmonitor?latitude=40.696629000&longitude=-112.044376000&route=&numberToReturn=5&usertoken=UNEUL0I062N
          by vehicle: http://api.rideuta.com/SIRI/SIRI.svc/VehicleMonitor/ByVehicle?vehicle=10054&onwardcalls=true&usertoken=UNEUL0I062N
          by route : http://api.rideuta.com/SIRI/SIRI.svc/VehicleMonitor/ByRoute?route=2&onwardcalls=true&usertoken=UNEUL0I062N
          by stop : http://api.rideuta.com/SIRI/SIRI.svc/StopMonitor?stopid=133054&minutesout=30&onwardcalls=true&filterroute=&usertoken=UNEUL0I062N
    */
    
    var Firebase = require('firebase');
    var xml2js = require('xml2js');
    var rest = require('restler');
    var crc = require('crc');
    var $ = require('jquery');
    //var parser = require('xml2json');

    var routes = {};
    
    var firebusRef = new Firebase('https://slcrider.firebaseio.com');
    
    var lastTime = Date.now() - 3600000;
    var updateInterval = 12000;
    
    var agencyList = [ 'uta' ];
    
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function coerce(n) {
      return isNumber(n) ? Number(n) : n;
    }
    
    function traverseAndCoerce(o) {
      var result = { };
      for(var key in o) {
        result[key] = coerce(o[key]);
      }
      return result;
    }
    
    function vehicleLocation(agency) {
        var prod = "http://api.rideuta.com/SIRI/SIRI.svc/VehicleMonitor/ByRoute?route=72&onwardcalls=true&usertoken=UNEUL0I062N";
      
      var result = prod;
      lastTime = Date.now();
    
      return result;
    }
    
    
    function updateFirebaseWithData() {
      agencyList.forEach(function(agency) {
        rest.get(vehicleLocation(agency)).on('complete', function(data) {
          var parser = new xml2js.Parser()
          
      /*    var v = data['Siri']['VehicleMonitoringDelivery'][0]['VehicleActivity'][0]['MonitoredVehicleJourney'][0]['VehicleLocation'][0];
          var firebaseId = "route72";
          var vehicle = new Object();
          vehicle.lon = parseFloat(v['Longitude'][0]);
          vehicle.lat = parseFloat(v['Latitude'][0]);
          vehicle.routeTag = '72';
          vehicle.dirTag = '72_OB';
          vehicle.predictable = true;
          vehicle.secsSinceReport = 15;
          vehicle.speedKmHr = 38;
          
          console.log(vehicle.dirTag + ":" + vehicle.lat + "/" + vehicle.lon);
        firebusRef.child(agency).child(firebaseId).set(vehicle); */
        });
      });
    }
    
    function getRoutes() {
        $.getJSON('http://localhost:8081/api/routes/utah-transit-authority', function(data){
            data.forEach(function(route){
                routes[route.route_id] = route;
                console.log(route.route_short_name);
            });
        });
    }
    
    setInterval((function() {
            getRoutes();
      updateFirebaseWithData();
            
    }), updateInterval);
