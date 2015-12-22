// map

var styles = [{'featureType':'landscape','stylers':[{'saturation':-100},{'lightness':65},{'visibility':'on'}]},{'featureType':'poi','stylers':[{'saturation':-100},{'lightness':51},{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'road.arterial','stylers':[{'saturation':-100},{'lightness':30},{'visibility':'on'}]},{'featureType':'road.local','stylers':[{'saturation':-100},{'lightness':40},{'visibility':'on'}]},{'featureType':'transit','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'administrative.province','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':-25},{'saturation':-100}]},{'featureType':'water','elementType':'geometry','stylers':[{'hue':'#ffff00'},{'lightness':-25},{'saturation':-97}]}];


// v3 maps api
function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
          lat: 40.39641294387178,
          lng: -3.7129999999999654
      },
      scrollwheel: false,
      zoom: 3,
      styles: styles
    });

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            function moveToLocation(lat, lng){
                var center = new google.maps.LatLng(lat, lng);
                map.panTo(center);
            }
            moveToLocation( position.coords.latitude, position.coords.longitude );
            map.setZoom(14);
        });
    }

  // Create a marker and set its position.
  var ref = new Firebase('https://wodbase.firebaseio.com/crossfitCenters');
  var infowindow = new google.maps.InfoWindow();

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once('value', function(snapshot) {
    var centros = snapshot.val();

    snapshot.forEach(function(childSnapshot) {
      // key will be 'fred' the first time and 'barney' the second time
      var key = childSnapshot.key();

      // childData will be the actual contents of the child
      var childData = childSnapshot.val();

      var latLng = new google.maps.LatLng(childData.lat, childData.long);
      var marker = new google.maps.Marker({
        map: map,
        position: latLng,
        title: childData.name,
        icon: 'images/map-marker.png'
      });
      marker.setMap(map);
      marker.addListener('click', function() {
          infowindow.setContent('<span>'+ childData.name +'</span>');
          infowindow.open(map, marker);
      });

    });

  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });
}
