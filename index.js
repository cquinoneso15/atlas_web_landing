// Create map
const map = L.map('map').setView([48.14, 11.57], 11);

// Add background layer
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);

// Add selector and button
const btn = document.querySelector('#btn');
const user = document.querySelector('#user')
const amenity = document.querySelector('#amenity')
const mot = document.querySelector('#mot')
btn.onclick = (event) => {
    event.preventDefault();
    info.update();

    //Connect to Geoserver WFS
    $.ajax('http://localhost:8080/geoserver/wfs',{
        type: 'GET',
        data: {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typename: 'MGeM:Acc_all',
            srsname: 'EPSG:4326',
            outputFormat: 'text/javascript',
            viewparams: 'user:'.concat(user.value).concat(';amenity:').concat(amenity.value).concat(';mot:').concat(mot.value)
            },
        dataType: 'jsonp',
        jsonpCallback:'callback:handleJson',
        jsonp:'format_options'
    });
};

var polygonLayer;
const download = document.querySelector('#download');
var legend;
// Function called by Ajax
function handleJson(data) {
    // Remove layer if already displayed
    if (polygonLayer) { polygonLayer.remove(); }

    // Add data to download button
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    download.setAttribute("href", dataStr);
    download.setAttribute("download", "data.geojson");

    // If layer is empty, show error message and return
    if (data.features.length == 0) {
        alert('Error while querying, no features found.');
        return;
    }
    
    // Generate quantiles
    var quants = getQuants(data);
    // Generate style from quantiles
    function getColor(d) {
        return  d > quants["Q3"]  ? '#d7301f' :
                d > quants["Q2"]  ? '#fc8d59' :
                d > quants["Q1"]  ? '#fdcc8a' :
                                    '#fef0d9' ;
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 0.5,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6
        };
    }

    // Add legend
    if (legend) { legend.remove(); }
    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [quants["Q0"], quants["Q1"], quants["Q2"], quants["Q3"], quants["Q4"]],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length - 1; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor((grades[i] + grades[i + 1])/2.0) + '"></i> ' +
                (grades[i].toFixed(2)) + '&ndash;' + (grades[i + 1].toFixed(2));
            if (i < grades.length - 2) {div.innerHTML += '<br>';}
        }

        return div;
    };

    legend.addTo(map);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution:'&copy; <a href="https://www.mos.ed.tum.de/en/sv/homepage/">TUM Chair of Urban Structure and Transport Planning</a>',
        style: style,
        onEachFeature: onEachFeature
        }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());
}

// Generate quantiles
function sortedQuants(sortedArray, q){
    var pos = ((sortedArray.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (sortedArray[base+1] !== undefined) ) {
        return sortedArray[base] + rest * (sortedArray[base+1] - sortedArray[base]);
    } else {
        return sortedArray[base];
    }
}

function getQuants(data) {
    var dataArray = [];
    for (let f in data.features) {
        dataArray.push(data.features[f].properties.value);
    }

    var sortedArray=dataArray.sort(function(a, b) {
        return a - b;
    });
    
    return {
        "Q0": sortedArray[0],
        "Q1": sortedQuants(sortedArray, 0.25),
        "Q2": sortedQuants(sortedArray, 0.5),
        "Q3": sortedQuants(sortedArray, 0.75),
        "Q4": sortedArray[sortedArray.length - 1],
    }
}

// Add hovering functionality
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    polygonLayer.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>' + user.options[user.selectedIndex].text + " / " + amenity.options[amenity.selectedIndex].text + " / " + mot.options[mot.selectedIndex].text +'</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.value.toFixed(2) + ' %'
        : 'Hover over a neighborhood');
};

info.addTo(map);