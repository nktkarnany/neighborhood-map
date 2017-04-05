var model = {
    currentLocation: {
        lat: 40.74135,
        lng: -73.99802
    },
    places: []
};

var map;
var infoWindows = [];

// function to initialize the map within the map div
function initMap() {

    // loading the google maps
    map = new google.maps.Map(document.getElementById('map'), {
        center: model.currentLocation,
        zoom: 15
    });

    // function called to get the list of places for the current location
    getCurrentLocation();

}

// error handling for the google maps api
function googleError() {
    alert("Sorry! Not able to load google maps. Please try again later.");
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

        placeClicked: function(place) { // called when place in the list view is clicked
            var marker = place.marker;
            var infowindow = place.infoWindow;
            if (infowindow.isOpen()) {
                infowindow.close(map, marker);
                marker.setAnimation(null);
            } else {
                infowindow.open(map, marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        },

        query: ko.observable(''),

        places: ko.pureComputed(function () {
            var search = viewModel.query().toLowerCase();
            return ko.utils.arrayFilter(model.places, function (place, index) {
                var match = place.name.toLowerCase().indexOf(search) >= 0;
                place.marker.setVisible(match);
                return match;
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
    model.places.forEach(function (place, index) {
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
        model.places[index].marker = marker;
        model.places[index].infoWindow = infowindow;
    });
    updateInfoWindows();
}

var updateInfoWindows = function () {

    model.places.forEach(function (place, index) {

        var infoWindow = model.places[index].infoWindow;

        // getting the data for info windows from wikipedia api
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + place.name,
            type: 'get',
            dataType: "jsonp",

            success: function (response) {
                var link = response[3][0];

                if (link) {
                    infoWindow.setContent("<a href='" + link + "' target=\"blank\">" + link + "</a>");
                } else {
                    infoWindow.setContent("No Wiki!!");
                }

            },
            error: function () {
                infoWindow.setContent("Sorry!! Lost connection");
            }
        });

    });

}
