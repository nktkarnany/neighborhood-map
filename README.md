## Neighborhood Map Nanodegree Project

To get started, check out the repository and inspect the code.

### Getting started

#### Steps to run this application

1. To Run the application locally open _index.html_ in your browser.

#### Steps to build this application

1. First clone or download this repository into your local machine.
2. This website uses gulp task runner to minify css, js and also watches any changes in these files.
3. You must have got a _package.json_ file with the source code.
4. Run `npm install` in cmd to download and install node modules.
5. Run `gulp`
6. You can start making changes in the css and js files of your src folder.
7. Gulp watches any changes in the js and css files and runs respective tasks.

#### Javascript (index.js)

1. A model is created with all the default lat lng for map init.
2. initMap() - to intialise the google maps which is called when google maps api gets loaded.
3. getCurrentLocation() - called after maps initialization to get users current location.
4. getPlaces() - called to get list of places for current location from google places api.
5. initModel() - called at the end after the model is ready and the data is ready to be plugged with the view.

#### Html, css

1. Bootstrap framework is used to leverage flex box for rendering responsive UI.
