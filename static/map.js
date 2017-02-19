// Create the Google Map…

( function (exports) {

    var map = null;
    var bounds;
    var overlay;
    var data = [];
    var markers = [];
    var ANIMATION = 0;

    function initMap() {
            map = new google.maps.Map(d3.select("#map").node(), {
              zoom: 8,
              center: new google.maps.LatLng(39.7392, -104.9903),
            });
            bounds   = new google.maps.LatLngBounds();
            overlay  = new google.maps.OverlayView();
            overlay.onAdd = function() {
              layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "stations");
            }

        updateOverlay()

        }

        function updateData(d) {
            sourcedata = d
        }

        function updateOverlay() {

        overlay.draw = function() {
          var projection = this.getProjection(), padding = 10;
          var selection = layer.selectAll("svg").data(d3.entries(data));
          selection.exit().remove()

          var marker = selection
                            .each(transform)
                            .enter().append("svg:svg")
                            .each(transform)
                            .attr("class", "marker");

          // Add a circle.
          marker.append("svg:circle")
                            .attr("r", 7)
                            .attr("cx", padding)
                            .attr("cy", padding)
                            .style('fill', function(d) {return d.value.color; })
                            .on("click",expandNode);

          // Add a label.
          marker.append("svg:text")
                            .attr("x", 0)
                            .attr("y", 25)
                            .attr("dy", ".31em")
                            .attr("class","marker_text")
                            .text(function(d) {return d.value.title; });

          function transform(d) {
            d = new google.maps.LatLng(d.value.lat, d.value.lon);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this).transition().duration(ANIMATION).style("left", (d.x - padding) + "px").style("top", (d.y - padding) + "px");
          }
          // provides node animation for mouseover
          function expandNode() {
              if ( d3.select(this).attr('r') >= 9 ) {
                    d3.select(this).transition()
                            .duration(100)
                            .attr("r", 7)
              }
              else {
                    d3.select(this).transition()
                            .duration(100)
                            .attr("r", 9)
              }
          };


          // provides node animation for mouseout
          function contractNode(){
            d3.select(this).transition()
                            .duration(100)
                            .attr("r",4.5)
          };
        };

        overlay.setMap(map);
      }

        // Load the station data. When the data comes back, create an overlay.
        setInterval( function() {
                d3.json("/api", function(error, d) {
                    if (error) throw error;
                            console.log(d);
                            data = d
                            ANIMATION = 100
                            overlay.draw()
                            ANIMATION = 0
                });
            }, 1000);

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

    exports.initMap = initMap

}(window) );

