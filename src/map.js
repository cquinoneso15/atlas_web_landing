/*************************************************
 * map.js                                        *
 * Script file setting up and displaying the map *
 * Author: Héctor Ochoa Ortiz                    *
 * Affil.: TUM SVP                               *
 * Last update: 2023-05-03                       *
 *************************************************/


// Create map
const map = L.map('map').setView([48.14, 11.57], 11);

// Add background layer
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);
document.querySelectorAll('input[name="map_type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('subitems-container').style.display = 'block';
        document.getElementById('subitems-container').querySelector("input[type=checkbox]").checked = true;
    });
});

// Add selector and button
const map_type = document.querySelector('#map_type');
const justice = document.querySelector('#justice');
const v1 = document.querySelector('#v1');
const amenity = document.querySelector('#amenity');
const mot = document.querySelector('#mot');

// Map layers
var polygonLayer;
var poiLayer;
var areaLayer;
var layerControl;
var biv;
var bivscore

const download = document.querySelector('#download');
var legend;

const weightSliders = document.querySelectorAll('#controls input[type="range"]');
weightSliders.forEach(slider => {
    slider.addEventListener('input', function () {
        document.getElementById(`${slider.id}-value`).innerText = slider.value;
    });
    slider.addEventListener('change', function () {
        changeMap();
    });
});

const weightticker = document.querySelectorAll('#controls input[type="checkbox"]');
weightticker.forEach(slider => {
    slider.addEventListener('input', function () {
        document.getElementById(`${slider.id}-value`).innerText = slider.value;
    });
    slider.addEventListener('change', function () {
        changeMap();
    });
});
// When selector value is clicked
function changeMap() {
    selected_values = {
        "map_type": getValue("map_type"),
        "justice": getValue("justice"),
        "v1": getValue("v1"),
        "amenity": getValue("amenity"),
        "mot": getValue("mot")
    }
    info.update();

    // Remove layers if already displayed
    if (polygonLayer) {
        polygonLayer.remove();
        if (poiLayer) {
            poiLayer.remove();
        }
        if (areaLayer) {
            areaLayer.remove();
        }
        if (layerControl) {
            layerControl.remove();
        }
    }

    generateLegend("", true);

    //Connect to Geoserver WFS
    if (selected_values["map_type"] == "diff_sg") {
        callGeoServer(
            "divergent",
            { "filter1": selected_values["v1"], "filter2": selected_values["mot"] },
            handleJsonDiv
        );
    } else if (selected_values["justice"] == "summ") {
        callGeoServer(
            "all_normalized",
            {},
            handleJsonRadar
        );
    }else if (selected_values["justice"] == "score") {
        w1 = parseFloat(document.getElementById('w1').value);
        w2 = parseFloat(document.getElementById('w2').value);
        w3 = parseFloat(document.getElementById('w3').value);
        w4 = parseFloat(document.getElementById('w4').value);
        check_tp = getCheckboxValue('check_tp');
        check_un = getCheckboxValue('check_un');
        check_o65 = getCheckboxValue('check_o65');
        check_sp = getCheckboxValue('check_sp');
        check_u18 = getCheckboxValue('check_u18');
        check_ng = getCheckboxValue('check_ng');
        check_income = getCheckboxValue('check_income');
        callGeoServer(
            "score_normalized",
            {},
            handleJsonscoreBiv
        );
    }  else {
        switch (selected_values["justice"]) {
            case "acc":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        "acc_all",
                        { "user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "acc_hilo",
                        { "user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                        handleJsonBiv
                    );
                }

                callGeoServer(
                    "pois",
                    { "amenity": selected_values["amenity"] },
                    handleJsonPOIs
                );

                callGeoServer(
                    "service_areas",
                    { "amenity": selected_values["amenity"], "mot": selected_values["mot"] },
                    handleJsonAreas
                );

                break;

            case "exp":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        "exposure",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "exposure_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                }
                break;
            case "ava":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        "availability",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "availability_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                }
                break;
            case "beh":
                if (selected_values["map_type"] == "ji") {
                    callGeoServer(
                        "behaviour",
                        { "type": selected_values["v1"] },
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "behaviour_hilo",
                        { "user": selected_values["v1"], "type": selected_values["amenity"] },
                        handleJsonBiv
                    );
                }
                break;
            case "income":
                if (selected_values["map_type"] == "sg") {
                    callGeoServer(
                        "income",
                        {},
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "income_hilo",
                        {},
                        handleJsonBiv
                    );
                }
                break;
            //case "pop":
            case "tp":
            case "o65":
            case "u18":
            case "ng":
            case "un":
            case "sp":
                if (selected_values["map_type"] == "sg") {
                    callGeoServer(
                        "population",
                        //{ "user": selected_values["v1"] },
                        { "user": selected_values["justice"] },
                        handleJsonSeq
                    );
                }
                break;
            default:
                break;
        }
    }
};

// Update map size after menu transition
document.getElementById('navbar-left').addEventListener('change', function() {
    for (let i=0; i<500; i+=50) // 500 ms = 0.5s = transition time; 50 ms = 0.005s = invalidate size frame
        setTimeout(function(){ map.invalidateSize()}, i);
});

