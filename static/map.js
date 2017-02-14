// Create the Google Map…

( function (exports) {

    var map = null;
    var data = null;
    var markers = [];

    function initMap() {
        map = new google.maps.Map(d3.select("#map").node(), {
          zoom: 8,
          center: new google.maps.LatLng(39.7392, -104.9903),
        });

        function updateMarkers() {

            for (i=0; i < markers.length; i++) {
                var marker = markers[i];
                marker.setMap(null);
                marker = null;
            }

            for (i=0; i < data.length; i++) {
                var posLatLng = new google.maps.LatLng(data[i].lat,data[i].lon);
                var pinColor = data[i].color;
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0,0),
                    new google.maps.Point(10, 34));
                var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                    new google.maps.Size(40, 37),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(12, 35));

                var marker = new google.maps.Marker({
                    title: data[i].title,
                    position: posLatLng,
                    icon: pinImage,
                    shadow: pinShadow
                });

                markers.push(marker)

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    var infowindow = new google.maps.InfoWindow({
                        content: "<span>" + data[i].title + "</span>"
                    });
                    console.log('Adding listener')
                    return function() {
                        console.log('Opening infowindow')
                        infowindow.open(map, markers[i]);
                    }
                    })(marker, i));

                marker.setMap(map)


            }

        }

        function updateData(d) {
            console.log(d)
            data = d
        }

        // Load the station data. When the data comes back, create an overlay.
        setInterval( function() {
                d3.json("/api", function(error, data) {
                    if (error) throw error;
                            console.log(data)
                            updateData(data)
                            updateMarkers()

                });
            }, 5000);

        exports.updateData
        exports.updateMarkers

        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        function success(pos) {

            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            map.setZoom(15);
            var GeoMarker = new GeolocationMarker(map);

        }

        function error(err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        };

        navigator.geolocation.getCurrentPosition(success, error, options);


    }


    exports.initMap = initMap


}(window) );

