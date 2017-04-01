// Create a map variable
var map;
// Function to initialize the map within the map div
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.74135,
            lng: -73.99802
        },
        zoom: 14
    });
    // Create a single latLng literal object.
    var singleLatLng = {
        lat: 40.74135,
        lng: -73.99802
    };
    // TODO: Create a single marker appearing on initialize -
    // Create it with the position of the singleLatLng,
    // on the map, and give it your own title!
    var marker = new google.maps.Marker({
        position: singleLatLng,
        map: map,
        title: "This is a marker!!"
    });
}

var viewModel = function() {
    var self = this;

    self.toggle = ko.observable(true);

    self.toggleMenu = function() {
        self.toggle(!self.toggle());
    };
};

ko.applyBindings(new viewModel());
