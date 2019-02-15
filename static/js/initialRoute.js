// handle tab switching based on geolocation


const brynmawrCenter = [40.028005, -75.314362];

const maxDist = 0.005;

const askForGeolocation = "The Blue Bus website uses your location to determine which bus times to show you based on what school you're currently at.";

function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2);
}

async function initialRoute() {
    var permission = await navigator.permissions.query({ 'name': 'geolocation' });

    if (permission.state === "prompt") {
        alert(askForGeolocation);
    }

    var locationObject = await new Promise(function(fulfill, reject) {
        navigator.geolocation.getCurrentPosition(fulfill, reject);
    });

    var location = [locationObject.coords.latitude, locationObject.coords.longitude];

	window.onfocus = updateView;

    if (distance(location, brynmawrCenter) < maxDist) {
        return "BRYNMAWR";
    }
    else {
        return "HAVERFORD";
    }
}


function updateView() {
    initialRoute().then(function(route) {
        window.MAINVIEW = route;
        window.setView();
    });
}


updateView();
