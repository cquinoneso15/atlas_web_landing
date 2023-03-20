/******************************
 * index.js                   *
 * Script file for index.html *
 * Author: Héctor Ochoa Ortiz *
 * Affil.: TUM SVP            *
 ******************************/


// Create map
const map = L.map('map').setView([48.14, 11.57], 11);

// Add background layer
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
}).addTo(map);

// Add selector and button
const btn = document.querySelector('#btn');
const map_type = document.querySelector('#map_type');
const justice = document.querySelector('#justice');
const v1 = document.querySelector('#v1');
const amenity = document.querySelector('#amenity');
const mot = document.querySelector('#mot');

var polygonLayer;
var poiLayer;
var areaLayer;
var layerControl;
var biv;

const download = document.querySelector('#download');
var legend;
var radar;

// Selector values
var selector_values = {
    "seq_uni": {
        "acc": {
            "v1": [
                "tp",
                "o65",
                "u18",
                "ng"
            ],
            "amenity": [
                "h",
                "e",
                "f",
                "s",
                "cc"
            ],
            "mot": [
                "w_700",
                "b_700",
                "wpt_700"
            ]
        },
        "exp": {
            "v1": [
                "accidents",
                "noise",
                "pollution"
            ]
        },
        "ava": {
            "v1": [
                "acc_pt",
                "cycleway_density",
                "intersection_density"
            ]
        },
        "beh": {
            "v1": [
                "bike_usage",
                "pt_usage",
                "walk_usage",
                "car_sharing_usage"
            ]
        }
    },
    "seq_biv": {
        "acc": {
            "v1": [
                "tp",
                "o65",
                "u18",
                "ng"
            ],
            "amenity": [
                "h",
                "e",
                "f",
                "s",
                "cc"
            ],
            "mot": [
                "w_700",
                "b_700",
                "wpt_700"
            ]
        },
        "exp": {
            "v1": [
                "accidents",
                "noise",
                "pollution"
            ]
        },
        "ava": {
            "v1": [
                "acc_pt",
                "cycleway_density",
                "intersection_density"
            ]
        },
        "beh": {
            "v1": [
                "bike_usage",
                "pt_usage",
                "walk_usage",
                "car_sharing_usage"
            ]
        }
    },
    "div": {
        "ava": {
            "v1": [
                "gender",
                "education",
                "income",
                "age_young",
                "age_old"
            ],
            "mot": [
                "has_driving_license",
                "owns_bike",
                "owns_ebike",
                "owns_car_sharing_membership"
            ]
        },
        "beh": {
            "v1": [
                "gender",
                "education",
                "income",
                "age_young",
                "age_old"
            ],
            "mot": [
                "auto_usage",
                "pt_usage",
                "bicycle_usage",
                "car_sharing_usage",
            ]
        }
    },
    "radar": {
    }
}

var selected_values;

function updateSelector(selector, name, map_type_value, justice_value) {
    selector.options.length = 0;
    selector.disabled = false;
    try {
        let selector_dict = selector_values[map_type_value][justice_value][name];
        if (selector_dict.length == 0) {throw EvalError;}
        var option;
        for (const v of selector_dict) {
            option = new Option();
            option.setAttribute("value", v);
            option.setAttribute("i18n", v);
            selector.add(option);
        }
    } catch (error){
        selector.disabled = true;
    }
    translatePage();
}

map_type.onchange = (e) => {
    updateSelector(v1, "v1", e.target.value, justice.value);
    updateSelector(amenity, "amenity", e.target.value, justice.value);
    updateSelector(mot, "mot", e.target.value, justice.value);
}

justice.onchange = (e) => {
    updateSelector(v1, "v1", map_type.value, e.target.value);
    updateSelector(amenity, "amenity", map_type.value, e.target.value);
    updateSelector(mot, "mot", map_type.value, e.target.value);
};

// When selector value is clicked
btn.onclick = (event) => {
    event.preventDefault();
    selected_values = {
        "map_type": map_type.value,
        "justice": justice.value,
        "v1": v1.value,
        "amenity": amenity.value,
        "mot": mot.value
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
    if (selected_values["map_type"] == "div") {
        callGeoServer(
            "divergent", 
            {"filter1": selected_values["v1"], "filter2": selected_values["mot"]}, 
            handleJsonDiv
        );
    } else if (selected_values["map_type"] == "radar") {
        callGeoServer(
            "all_normalized", 
            {}, 
            handleJsonRadar
        );
    } else {
        switch (selected_values["justice"]) {
            case "acc":
                if (selected_values["map_type"] == "seq_uni") {
                    callGeoServer(
                        "Acc_all", 
                        {"user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"]}, 
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "Acc_hilo", 
                        {"user": selected_values["v1"], "amenity": selected_values["amenity"], "mot": selected_values["mot"]}, 
                        handleJsonBiv
                    );
                }

                callGeoServer(
                    "pois", 
                    {"amenity": selected_values["amenity"]},
                    handleJsonPOIs
                );

                callGeoServer(
                    "service_areas", 
                    {"amenity": selected_values["amenity"], "mot": selected_values["mot"]}, 
                    handleJsonAreas
                );

                break;

            case "exp":
                if (selected_values["map_type"] == "seq_uni") {
                    callGeoServer(
                        "exposure", 
                        {"type": selected_values["v1"]}, 
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "exposure_hilo", 
                        {"type": selected_values["v1"]}, 
                        handleJsonBiv
                    );
                }
                break;
            case "ava":
                if (selected_values["map_type"] == "seq_uni") {
                    callGeoServer(
                        "availability", 
                        {"type": selected_values["v1"]}, 
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "availability_hilo", 
                        {"type": selected_values["v1"]}, 
                        handleJsonBiv
                    );
                }
                break;
            case "beh":
                if (selected_values["map_type"] == "seq_uni") {
                    callGeoServer(
                        "behaviour", 
                        {"type": selected_values["v1"]}, 
                        handleJsonSeq
                    );
                } else {
                    callGeoServer(
                        "behaviour_hilo", 
                        {"type": selected_values["v1"]}, 
                        handleJsonBiv
                    );
                }
                break;
            case "inc":
                if (selected_values["map_type"] == "seq_uni") {
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
            default:
                break;
        }
    }
};

/**************
 * MAP LEGEND *
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
 * END MAP LEGEND *
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
        fillOpacity: 0.9
    });

    layer.bringToFront();
    if (areaLayer) {areaLayer.bringToFront();}
    if (poiLayer) {poiLayer.bringToFront();}
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
    //this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>' + (v1.options[v1.selectedIndex] ? v1.options[v1.selectedIndex].text : '') + (amenity.options[amenity.selectedIndex] ? " / " + amenity.options[amenity.selectedIndex].text : '') + (mot.options[mot.selectedIndex] ? " / " + mot.options[mot.selectedIndex].text : '' ) + '</h4>';
    
    if (biv) {
        switch (selected_values["justice"]) {
            case "acc":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Acc. ' + props.value_acc.toFixed(2) + ' % (' + props.hilo_acc + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            case "exp":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Exp. ' + props.value_exp.toFixed(2) + ' (' + props.hilo_exp + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            case "ava":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Ava. ' + props.value_ava.toFixed(2) + ' (' + props.hilo_ava + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            case "beh":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Beh. ' + props.value_beh.toFixed(2) + ' (' + props.hilo_beh + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            case "inc":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Inc. ' + props.value_inc.toFixed(2) + ' (' + props.hilo_inc + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            default:
                break;
        }
    } else {
        switch (selected_values["justice"]) {
            case "acc":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br />' + props.value.toFixed(2) + ' %'
                    : '<span i18n="hover"></span>');
                break;
            case "exp":
            case "ava":
            case "beh":
            case "inc":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br />' + props.value.toFixed(2)
                    : '<span i18n="hover"></span>');
                break;
            default:
                break;
        }
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

    var hilo_X;
    switch (selected_values["justice"]) {
        case "acc":
            hilo_X = "hilo_acc";
            break;
        case "exp":
            hilo_X = "hilo_exp";
            break;
        case "ava":
            hilo_X = "hilo_ava";
            break;
        case "beh":
            hilo_X = "hilo_beh";
            break;
        case "inc":
            hilo_X = "hilo_inc";
            break;
    }

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
            fillColor: getColorBiv(feature.properties.hilo_pop, feature.properties[hilo_X]),
            weight: 0.5,
            opacity: 1,
            color: 'grey',
            fillOpacity: 0.7
        };
    }

    // Add legend
    generateLegend( '<svg width="100" height="80" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>' +
                    '<g transform="translate(10 30) rotate(-45)">' +
                    '<title>Bivariate legend</title>' +
                    '<rect height="18" width="18" y="2" x="0" stroke="#000" fill="' + getColorBiv("Low", "High") + '"/>' +
                    '<rect height="18" width="18" y="2" x="18" stroke="#000" fill="' + getColorBiv("High", "High") + '"/>' +
                    '<rect height="18" width="18" y="20" x="0" stroke="#000" fill="' + getColorBiv("Low", "Low") + '"/>' +
                    '<rect height="18" width="18" y="20" x="18" stroke="#000" fill="' + getColorBiv("High", "Low") + '"/>' +
                    '<path d="M0,0 v38 h38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none" marker-start="url(#arrow)" marker-end="url(#arrow)"/>' +
                    '<text font-weight="bold" font-size="0.75em" transform="translate(-10, 18) rotate(90)" text-anchor="middle">' + selected_values["justice"] + '</text>' +
                    '<text font-weight="bold" font-size="0.75em" transform="translate(18, 50)" text-anchor="middle">pop</text>' +
                    '</g>' +
                    '</svg>',
                    false);

    // Add layer to map
    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(polygonLayer.getBounds());

    // Add layer control to map
    var layerControlOptions = {};
    if (tiles) {layerControlOptions["Background"] = tiles;}
    if (polygonLayer) {layerControlOptions["Indicator"] = polygonLayer;}
    if (poiLayer) {layerControlOptions["POIs"] = poiLayer;}
    if (areaLayer) {layerControlOptions["Service Areas"] = areaLayer;}
    layerControl = L.control.layers(null, layerControlOptions).addTo(map)

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
    var quants = getQuants(data, "value");
    
    // Generate style from quantiles
    function getColor(d) {
        return  d > quants["Q3"] ? '#d7301f' :
                d > quants["Q2"] ? '#fc8d59' :
                d > quants["Q1"] ? '#fdcc8a' :
                '#fef0d9';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 0.5,
            opacity: 1,
            color: 'grey',
            fillOpacity: 0.7
        };
    }

    // legend
    let grades = [quants["Q0"], quants["Q1"], quants["Q2"], quants["Q3"], quants["Q4"]];
    var legend_text;
    switch (selected_values["justice"]) {
        case "acc":
            legend_text = "<h4>Accessibility [%]</h4>";
            break;
        case "exp":
            legend_text = "<h4>Exposure [" + data.features[0].properties.value_desc + "]</h4>";
            break;
        case "ava":
            legend_text = "<h4>Availability [" + data.features[0].properties.value_desc + "]</h4>";
            break;
        case "beh":
            legend_text = "<h4>Behaviour [" + data.features[0].properties.value_desc + "]</h4>";
            break;
        case "inc":
            legend_text = "<h4>Income [" + data.features[0].properties.value_desc + "]</h4>";
    }

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

function handleJsonDiv(data) {
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
    var quantsPos = getQuants(filterData(data, "value", (x) => x > 0), "value");
    var quantsNeg = getQuants(filterData(data, "value", (x) => x < 0), "value");
    
    // Generate style from quantiles
    function getColor(d) {
        return  d > quantsPos["Q2"]  ? '#a6611a' :
                d > 0                ? '#dfc27d' :
                d == 0               ? '#f5f5f5' :
                d >= quantsNeg["Q2"] ? '#80cdc1' :
                '#018571';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 0.5,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        };
    }

    // legend
    var legend_text;
    switch (selected_values["v1"]) {
        case "gender":
            legend_text = "<h4>% Men - % Woman</h4>";
            break;
        case "education":
            legend_text = "<h4>%High education degree - % Low education degree</h4>";
            break;
        case "income":
            legend_text = "<h4>%High income - % Low income</h4>";
            break;
        case "age_young":
            legend_text = "<h4>%Adults - %Younger adults</h4>";
            break;
        case "age_old":
            legend_text = "<h4>%Adults - %Older adults</h4>";
    }

    
    if (quantsPos["Q0"] != undefined) {
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsPos["Q4"] + quantsPos["Q2"]) / 2.0) + '" ></i> ' +
                (quantsPos["Q4"].toFixed(2)) + ' &ndash; ' + (quantsPos["Q2"].toFixed(2));
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsPos["Q2"] + quantsPos["Q0"]) / 2.0) + '" ></i> ' +
                (quantsPos["Q2"].toFixed(2)) + ' &ndash; ' + (quantsPos["Q0"].toFixed(2));
        legend_text += '<br>';
    }
    legend_text +=
        '<i class="square" style="background:' + getColor(0.0) + '" ></i> 0.00';
    if (quantsNeg["Q0"] != undefined) {
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsNeg["Q4"] + quantsNeg["Q2"]) / 2.0) + '" ></i> ' +
                (quantsNeg["Q4"].toFixed(2)) + ' &ndash; ' + (quantsNeg["Q2"].toFixed(2));
        legend_text += '<br>';
        legend_text +=
            '<i class="square" style="background:' + getColor((quantsNeg["Q2"] + quantsNeg["Q0"]) / 2.0) + '" ></i> ' +
                (quantsNeg["Q2"].toFixed(2)) + ' &ndash; ' + (quantsNeg["Q0"].toFixed(2));
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
        "Indicator": polygonLayer
    }).addTo(map)

    translatePage();
}

function handleJsonRadar(data) {
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

    function style(feature) {
        return {
            fillColor: '#e8ae43',
            weight: 1,
            opacity: 1,
            color: 'grey',
            fillOpacity: 0.5
        };
    }

    var legend_text = '<h4>No neighbourhood selected</h4>';
    generateLegend(legend_text, true);

    function onClick(e) {
        polygonLayer.resetStyle();

        zoomToFeature(e);
        
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.9
        });
        layer.bringToFront();

        generateLegend('<div style="width: 400px;"><canvas id="radar"></canvas></div>', true);
        radar = radarPlot(e);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: onClick
        });
    }

    polygonLayer = L.geoJson(data, {
        attribution: '&copy; <a href="https://www.mos.ed.tum.de/sv/homepage/" i18n="chair"></a>',
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

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