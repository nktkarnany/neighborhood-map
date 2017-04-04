var model = {
    currentLocation: {
        lat: 40.74135,
        lng: -73.99802
    },
    places: []
}

var map;
var markers = [];
var infoWindows = [];

// function to initialize the map within the map div
function initMap() {

    // function to check if maps api failed then an alert shows up
    setTimeout(function () {
        if (!window.google || !window.google.maps) {
            alert("Not able to load google maps...Please try again later!!");
        }
    }, 5000);

    // loading the google maps
    map = new google.maps.Map(document.getElementById('map'), {
        center: model.currentLocation,
        zoom: 15
    });

    // function called to get the list of places for the current location
    getCurrentLocation();

}

function getCurrentLocation() {
    // using the maps geo location api to get the current location of the user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        initModel();
    }
}

function showPosition(position) {

    // saving the current location coordinates into model and updating the maps center
    model.currentLocation.lat = position.coords.latitude;
    model.currentLocation.lng = position.coords.longitude;

    map.setCenter(model.currentLocation);

    // Method to get the list of places for the current location
    getPlaces();
}

function getPlaces() {
    var request = {
        location: model.currentLocation,
        radius: '500',
        types: ['restaurant']
    };

    // using the google places library getting the list of nearby restaurants
    var places = new google.maps.places.PlacesService(map);
    places.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        model.places = results;
        initModel(); //called if got list of all the places
    } else {
        alert("Sorry!! No connection. Please try again later");
    }
}

function initModel() {

    // called to generate all the markers before applying the binding
    // of the view model so that all the static model data is in place
    renderAllMarkers();

    var viewModel = {

        toggle: ko.observable(true), // intialising toggle vaiable to display on page load

        toggleMenu: function () {
            this.toggle(!this.toggle()); // on clicking on the toggle menu button animates the side bar menu out of the screen
        },

        showDetail: function (index) { // called for mouse over event on a place in the list view
            markers[index].setAnimation(google.maps.Animation.BOUNCE);
            infoWindows[index].open(map, markers[index]);
        },

        hideDetail: function (index) { // called for mouse out event on a place in the list view
            markers[index].setAnimation(null);
            var infowindow = new google.maps.InfoWindow({
                content: model.places[index].vicinity
            });
            infoWindows[index].close(map, markers[index]);
        },

        query: ko.observable(''),

        places: ko.pureComputed(function () {
            var search = viewModel.query().toLowerCase();
            return ko.utils.arrayFilter(model.places, function (place, index) {
                var match = place.name.toLowerCase().indexOf(search) >= 0;
                if (match) {
                    markers[index].setMap(map);
                    return true;
                } else {
                    markers[index].setMap(null);
                    return false;
                }
            });
        })
    };

    ko.applyBindings(viewModel);
}

function renderAllMarkers() {
    google.maps.InfoWindow.prototype.isOpen = function () {
        var map = this.getMap();
        return (map !== null && typeof map !== "undefined");
    }
    model.places.forEach(function (place) {

        // generating markers for each place in places array model
        var marker = new google.maps.Marker({
            position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            },
            map: map
        });

        // creating and saving info windows into an array
        var infowindow = new google.maps.InfoWindow({
            content: place.vicinity
        });
        infowindow.addListener('closeclick', function () {
            infowindow.close(map, marker);
            marker.setAnimation(null);
        });

        // getting the data for info windows from wikipedia api
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+place.name,
            type: 'get',
            dataType:"jsonp",

            success: function(response){
                var link = response[3][0];

                if(link){
                    infowindow.setContent("<a href='"+ link + "'>" + link + "</a>");
                } else {
                    infowindow.setContent("No Wiki!!");
                }

                infoWindows.push(infowindow);
            },
            error: function() {
                infowindow.setContent("Sorry!! Lost connection");
                infoWindows.push(infowindow);
            }
        });

        // adding a click listener on the marker to display the info window
        marker.addListener('click', function () {
            if (infowindow.isOpen()) {
                infowindow.close(map, marker);
                marker.setAnimation(null);
            } else {
                infowindow.open(map, marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        });
        markers.push(marker);
    });
}
