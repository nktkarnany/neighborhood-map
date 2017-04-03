var model = {
    currentPlace: "Chelsea, New York",
    currentLocation: {
        lat: 40.74135,
        lng: -73.99802
    },
    places: []
}

var map;
var markers = [];

// Function to initialize the map within the map div
function initMap() {

    setTimeout(function () {
        if (!window.google || !window.google.maps) {
            alert("Not able to load google maps...Please try again later!!");
        }
    }, 5000);

    map = new google.maps.Map(document.getElementById('map'), {
        center: model.currentLocation,
        zoom: 14
    });

    getCurrentLocation();

    //    // Create a single latLng literal object.
    //    var singleLatLng = {
    //        lat: model.currentLocation.lat,
    //        lng: model.currentLocation.lng
    //    };
    //    // TODO: Create a single marker appearing on initialize -
    //    // Create it with the position of the singleLatLng,
    //    // on the map, and give it your own title!
    //    var marker = new google.maps.Marker({
    //        position: singleLatLng,
    //        map: map,
    //        title: "This is a marker!!"
    //    });

}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        initModel();
    }
}

function showPosition(position) {
    model.currentLocation.lat = position.coords.latitude;
    model.currentLocation.lng = position.coords.longitude;

    map.setCenter(model.currentLocation);

    getPlaces();
}

function getPlaces() {
    var request = {
        location: model.currentLocation,
        radius: '500',
        types: ['restaurant']
    };

    var places = new google.maps.places.PlacesService(map);
    places.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        model.places = results;
        initModel();
    }
}

function initModel() {

    model.places.forEach(function (place) {
        markers.push(new google.maps.Marker({
            position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            },
            map: map
        }));
    });

    var viewModel = {

        toggle: ko.observable(true),

        toggleMenu: function () {
            this.toggle(!this.toggle());
        },

        showDetail: function (index) {
            //        console.log(index);
        },

        hideDetail: function (index) {
            //        console.log(index);
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
