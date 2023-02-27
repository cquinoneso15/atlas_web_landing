/******************************
 * index.js                   *
 * Script file for index.html *
 * Author: Héctor Ochoa Ortiz *
 * Affil.: TUM SVP            *
 ******************************/



/*********
 * UTILS *
 *********/

// Auxiliary function
function sortedQuants(sortedArray, q) {
    var pos = ((sortedArray.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if ((sortedArray[base + 1] !== undefined)) {
        return sortedArray[base] + rest * (sortedArray[base + 1] - sortedArray[base]);
    } else {
        return sortedArray[base];
    }
}

/**
 * Returns the quantiles of data, value must be stored in properties.value for each feature of data.
 *
 * @param {object} data The data in a dictionary format, fetched from a geoJSON.
 * @return {object} The quantiles in a dictionary, with keys "Q0" to "Q4"
 */
function getQuants(data) {
    var dataArray = [];
    for (let f in data.features) {
        dataArray.push(data.features[f].properties.value);
    }

    var sortedArray = dataArray.sort(function (a, b) {
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

function percToHex(perc) {
    return (Math.round(255 * perc)).toString(16);
}

/*************
 * END UTILS *
 *************/

// Create map
const map = L.map('map').setView([48.14, 11.57], 11);

// Add background layer
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);

// Add selector and button
const btn = document.querySelector('#btn');
const justice = document.querySelector('#justice')
const user = document.querySelector('#user')
const amenity = document.querySelector('#amenity')
const mot = document.querySelector('#mot')
const map_type = document.querySelector('#map_type')

var acc = {
    "user": {
        "tp": "Total population",
	    "o65": "Over 65 y/o",
	    "u18": "Under 18 y/o",
	    "ng": "Non-germans"
    },
    "amenity": {
        "h": "Health",
        "e": "Education",
        "f": "Food",
        "s": "Sports",
        "cc": "Community centers"
    },
    "mot": {
        "w_700": "Walking, 700m",
        "b_700": "Cycling, 10 min",
        "wpt_700": "Walking + Public Transport"
    }
}

function updateSelector(selector, name, justice_value) {
    selector.options.length = 0;
    selector.disabled = false;
    try {
        let selector_dict = window[justice_value][name];
        for (var key in selector_dict) {
            selector.add(new Option(selector_dict[key], key))
        }
    } catch (error){
        selector.disabled = true;
    }
}

justice.onchange = (e) => {
    updateSelector(user, "user", e.target.value);
    updateSelector(amenity, "amenity", e.target.value);
    updateSelector(mot, "mot", e.target.value);
};


btn.onclick = (event) => {
    event.preventDefault();
    info.update();

    // Remove layers if already displayed
    if (polygonLayer) {
        polygonLayer.remove();
        poiLayer.remove();
        areaLayer.remove();
        layerControl.remove();
    }

    generateLegend("", true);

    //Connect to Geoserver WFS
    if (justice.value == "acc") {
        if (map_type.value == "m1") {
            $.ajax('http://localhost:8080/geoserver/wfs', {
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
                jsonpCallback: 'callback:handleJsonSeq',
                jsonp: 'format_options'
            });
        } else {
            $.ajax('http://localhost:8080/geoserver/wfs', {
                type: 'GET',
                data: {
                    service: 'WFS',
                    version: '1.1.0',
                    request: 'GetFeature',
                    typename: 'MGeM:Acc_hilo',
                    srsname: 'EPSG:4326',
                    outputFormat: 'text/javascript',
                    viewparams: 'user:'.concat(user.value).concat(';amenity:').concat(amenity.value).concat(';mot:').concat(mot.value)
                },
                dataType: 'jsonp',
                jsonpCallback: 'callback:handleJsonBiv',
                jsonp: 'format_options'
            });
        }

        $.ajax('http://localhost:8080/geoserver/wfs', {
            type: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typename: 'MGeM:pois',
                srsname: 'EPSG:4326',
                outputFormat: 'text/javascript',
                viewparams: 'amenity:'.concat(amenity.value)
            },
            dataType: 'jsonp',
            jsonpCallback: 'callback:handleJsonPOIs',
            jsonp: 'format_options'
        });

        $.ajax('http://localhost:8080/geoserver/wfs', {
            type: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typename: 'MGeM:service_areas',
                srsname: 'EPSG:4326',
                outputFormat: 'text/javascript',
                viewparams: 'amenity:'.concat(amenity.value).concat(';mot:').concat(mot.value)
            },
            dataType: 'jsonp',
            jsonpCallback: 'callback:handleJsonAreas',
            jsonp: 'format_options'
        });
    }
};

var polygonLayer;
var poiLayer;
var areaLayer;
var layerControl;
var biv;

const download = document.querySelector('#download');
var legend;

/**************
 * MAP DESIGN *
 **************/

var poiCircleStyle = {
    radius: 1.5,
    fillColor: "#5ab4ac",
    color: "#000000",
    weight: 0.25,
    opacity: 0.75,
    fillOpacity: 1
}

function getLegendIFromCircleStyle(style) {
    let size = (style.radius * 2.0) + (style.weight * 2.0);
    return '<i class="circle" style="background: ' + style.fillColor + percToHex(style.fillOpacity) + '; border: ' + style.weight + 'px solid ' + style.color + percToHex(style.opacity) + '; width:' + size + 'px; height:' + size + 'px;" ></i>';
}

/**
 * Adds info to the map legend
 *
 * @param {String} info The info to add
 * @param {boolean} replace True: replace the current legend, False: append to the current legend
 */
function generateLegend(info, replace) {
    if (replace) {
        if (legend) { legend.remove(); }

        legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = info;
            return div;
        };

        legend.addTo(map);
    } else {
        if (legend._container.innerHTML != '') {
            legend._container.innerHTML += '<br>';
        }
        legend._container.innerHTML += info;
    }
}

/******************
 * END MAP DESIGN *
 ******************/

/*********************
 * MAP INTERACTIVITY *
 *********************/

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
    areaLayer.bringToFront();
    poiLayer.bringToFront();
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
    this._div.innerHTML = '<h4>' + (user.options[user.selectedIndex] ? user.options[user.selectedIndex].text : '') + " / " + (amenity.options[amenity.selectedIndex] ? amenity.options[amenity.selectedIndex].text : '') + " / " + (mot.options[mot.selectedIndex] ? mot.options[mot.selectedIndex].text : '' ) + '</h4>';
    if (biv) {
        this._div.innerHTML += (props
            ? '<b>' + props.name + '</b><br /> Acc. ' + props.value_acc.toFixed(2) + ' % (' + props.hilo_acc + ') - Pop. ' + props.value_pop.toFixed(2) + ' % (' + props.hilo_pop + ')'
            : '<span i18n="hover"></span>');
    } else {
        this._div.innerHTML += (props
            ? '<b>' + props.name + '</b><br />' + props.value.toFixed(2) + ' %'
            : '<span i18n="hover"></span>');
    }
    translatePage();
};

info.addTo(map);

// Add scale
var scale = L.control.scale({ metric: true, imperial: false }).addTo(map);

/*************************
 * END MAP INTERACTIVITY *
 *************************/

/******************
 * AJAX CALLBACKS *
 ******************/

function handleJsonBiv(data) {
    biv = true;

    // Add data to download button
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    download.setAttribute("href", dataStr);
    download.setAttribute("download", "data.geojson");

    // If layer is empty, show error message and return
    if (data.features.length == 0) {
        alert('Error while querying, no features found.');
        return;
    }

    function getColorBiv(v1, v2) {
        if (v1 == "High") {
            if (v2 == "High") {
                return '#574249';
            } else {
                return '#c85a5a';
            }
        } else {
            if (v2 == "High") {
                return '#64acbe';
            } else {
                return '#e8e8e8';
            }
        }
    }

    function style(feature) {
        return {
            fillColor: getColorBiv(feature.properties.hilo_pop, feature.properties.hilo_acc),
            weight: 0.5,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6
        };
    }

    // Add legend
    if (legend) { legend.remove(); }
    legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<i style="background:' + getColorBiv("Low", "High") + '"></i>' + '<i style="background:' + getColorBiv("High", "High") + '"></i><br>' + '<i style="background:' + getColorBiv("Low", "Low") + '"></i>' + '<i style="background:' + getColorBiv("High", "Low") + '"></i>'
        return div;
    };

    legend.addTo(map);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());

    // Add layer control to map
    layerControl = L.control.layers(null, {
        "Background": tiles,
        "Indicator": polygonLayer,
        "POIs": poiLayer,
        "Service Areas": areaLayer
    }).addTo(map)

    if (areaLayer) {
        areaLayer.bringToFront();
        if (poiLayer) {
            poiLayer.bringToFront();
        }
    }

    translatePage();
}

function handleJsonSeq(data) {
    biv = false;

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
        return d > quants["Q3"] ? '#d7301f' :
            d > quants["Q2"] ? '#fc8d59' :
                d > quants["Q1"] ? '#fdcc8a' :
                    '#fef0d9';
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

    // legend
    let grades = [quants["Q0"], quants["Q1"], quants["Q2"], quants["Q3"], quants["Q4"]];
    var legend_text = "<h4>Accessibility [%]</h4>";

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length - 1; i++) {
        legend_text +=
            '<i class="square" style="background:' + getColor((grades[i] + grades[i + 1]) / 2.0) + '" ></i> ' +
            (grades[i].toFixed(2)) + '&ndash;' + (grades[i + 1].toFixed(2));
        if (i < grades.length - 2) { legend_text += '<br>'; }
    }

    // add legend to map
    generateLegend(legend_text, false);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());

    // Add layer control to map
    layerControl = L.control.layers(null, {
        "Background": tiles,
        "Indicator": polygonLayer,
        "POIs": poiLayer,
        "Service Areas": areaLayer
    }).addTo(map)

    if (areaLayer) {
        areaLayer.bringToFront();
        if (poiLayer) {
            poiLayer.bringToFront();
        }
    }

    translatePage();
}

function handleJsonPOIs(data) {
    poiLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, poiCircleStyle);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(String(feature.properties.name));
        }
    }).addTo(map);

    var legend_text = '<h4>Points of Interest (POIs)</h4>';
    legend_text += getLegendIFromCircleStyle(poiCircleStyle);
    generateLegend(legend_text, false);

    translatePage();
}

function handleJsonAreas(data) {
    let style = {
        fillColor: '#ffffff',
        weight: 1,
        opacity: 1,
        color: '#483D8B',
        fillOpacity: 0.2
    };
    areaLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        interactive: false,
        style: style
    }).addTo(map);

    var legend_text = '<h4>POI catchment area</h4>';
    legend_text += '<i class="square" style="background:' + style.fillColor + percToHex(style.fillOpacity) + '; border: ' + style.weight + 'px solid ' + style.color + percToHex(style.opacity) + '; width: 16px; height: 16px" ></i> '
    generateLegend(legend_text, false)

    if (poiLayer) {
        poiLayer.bringToFront();
    }

    translatePage();
}

/**********************
 * END AJAX CALLBACKS *
 **********************/