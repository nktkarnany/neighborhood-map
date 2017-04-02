var model = {
    currentLocation: {
        lat: 40.74135,
        lng: -73.99802
    },
    places: [],
    types: ['restaurant', 'store', 'bank', 'hospital'],
    selectedTypes: ['restaurant']
}

var viewModel = function () {
    var self = this;

    self.toggle = ko.observable(true);

    self.toggleMenu = function () {
        self.toggle(!self.toggle());
    };

    self.types = ko.observableArray(model.types);

    self.selectedTypes = ko.observableArray(model.selectedTypes);
};

ko.applyBindings(new viewModel());

var map;

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
    }
}

function showPosition(position) {
    model.currentLocation.lat = position.coords.latitude;
    model.currentLocation.lng = position.coords.longitude;

    map.setCenter(model.currentLocation);

//    var request = {
//        location: model.currentLocation,
//        radius: '500',
//        types: ['restaurant']
//    };
//
//    var places = new google.maps.places.PlacesService(map);
//    places.nearbySearch(request, callback);
}

//function callback(results, status) {
//    if (status == google.maps.places.PlacesServiceStatus.OK) {
//        console.log(results);
//        //        for (var i = 0; i < results.length; i++) {
//        //            var place = results[i];
//        //        }
//    }
//}
