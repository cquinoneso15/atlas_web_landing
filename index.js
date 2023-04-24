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
//const update_btn = document.querySelector('#btn');
const map_type = document.querySelector('#map_type');
const justice = document.querySelector('#justice');
const v1 = document.querySelector('#v1');
const amenity = document.querySelector('#amenity');
const mot = document.querySelector('#mot');

const share_btn = document.querySelector('#share');
const about_us_btn = document.querySelector('#about_us');
var span = document.getElementsByClassName("close")[0];
var modal_about = document.getElementById("modal-about");


// Map layers
var polygonLayer;
var poiLayer;
var areaLayer;
var layerControl;
var biv;

const download = document.querySelector('#download');
var legend;
var radar;

// Selector values
var selector_values_after_sp_0 = {
    "sg": {
        "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng",
                    "un",
                    "sp",
                    "income"
                ]
    },
    "ji": {
        "title": "select_justice",
        "desc": "desc",
        "values": [
            "ava",
            "beh",
            "exp",
            "acc"
        ]
    },
    "ji_v_sg": {
        "title": "select_justice",
        "desc": "desc",
        "values": [
            "ava",
            "beh",
            "exp",
            "acc"
        ]
    },
    "diff_sg": {
        "title": "select_justice",
        "desc": "desc",
        "values": [
            "ava",
            "beh"
        ]
    },
    "summ": {}
}
var selector_values_after_sp_1 = {
    "sg": {},
    "ji": {
        "acc": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng"
                ]
            },
            "amenity": {
                "title": "select_amenity",
                "desc": "desc",
                "values": [
                    "h",
                    "e",
                    "f",
                    "s",
                    "cc"
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    "w_700",
                    "b_700",
                    "wpt_700"
                ]
            }
        },
        "exp": {
            "v1": {
                "title": "select_exp",
                "desc": "desc",
                "values": [
                    "accidents",
                    "noise",
                    "pollution"
                ]
            }
        },
        "ava": {
            "v1": {
                "title": "select_ava",
                "desc": "desc",
                "values": [
                    "acc_pt",
                    "cycleway_density",
                    "intersection_density"
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_beh",
                "desc": "desc",
                "values": [
                    "bike_usage",
                    "pt_usage",
                    "walk_usage",
                    "car_sharing_usage"
                ]
            }
        }
    },
    "ji_v_sg": {
        "acc": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng"
                ]
            },
            "amenity": {
                "title": "select_amenity",
                "desc": "desc",
                "values": [
                    "h",
                    "e",
                    "f",
                    "s",
                    "cc"
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    "w_700",
                    "b_700",
                    "wpt_700"
                ]
            }
        },
        "exp": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng",
                    "un",
                    "sp"
                ]
            },
            "amenity": {
                "title": "select_exp",
                "desc": "desc",
                "values": [
                    "accidents",
                    "noise",
                    "pollution"
                ]
            }
        },
        "ava": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng",
                    "un",
                    "sp"
                ]
            },
            "amenity": {
                "title": "select_ava",
                "desc": "desc",
                "values": [
                    "acc_pt",
                    "cycleway_density",
                    "intersection_density"
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "tp",
                    "o65",
                    "u18",
                    "ng",
                    "un",
                    "sp"
                ]
            },
            "amenity": {
                "title": "select_beh",
                "desc": "desc",
                "values": [
                    "bike_usage",
                    "pt_usage",
                    "walk_usage",
                    "car_sharing_usage"
                ]
            }
        }
    },
    "diff_sg": {
        "ava": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "gender",
                    "education",
                    "income",
                    "age_young",
                    "age_old"
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    "has_driving_license",
                    "owns_bike",
                    "owns_ebike",
                    "owns_car_sharing_membership"
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    "gender",
                    "education",
                    "income",
                    "age_young",
                    "age_old"
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    "auto_usage",
                    "pt_usage",
                    "bicycle_usage",
                    "car_sharing_usage",
                ]
            }
        }
    },
    "summ": {}
}

var selected_values;

function updateSelectorAfterSP0(selector, name, map_type_value) {
    let curr_sp = document.querySelector('#sp-1');

    selector.options.length = 0;
    selector.disabled = false;
    curr_sp.style.display = 'block';
    try {
        let select_title = curr_sp.querySelector('.select-title');
        let select_title_text = select_title.querySelector('.select-title-text');
        select_title_text.setAttribute("i18n", selector_values_after_sp_0[map_type_value]["title"])
        let select_title_info_tooltip = select_title.querySelector('.select-title-info').querySelector('.info-tooltip');
        select_title_info_tooltip.setAttribute("desc", selector_values_after_sp_1[map_type_value]["desc"]);
        let selector_dict = selector_values_after_sp_0[map_type_value]["values"];
        if (selector_dict.length == 0) { throw EvalError; }
        var option;
        option = new Option();
        option.setAttribute("value", "select");
        option.setAttribute("i18n", "select");
        selector.add(option);
        for (const v of selector_dict) {
            option = new Option();
            option.setAttribute("value", v);
            option.setAttribute("i18n", v);
            selector.add(option);
        }
    } catch (error) {
        selector.disabled = true;
        curr_sp.style.display = 'none';
    }
    translatePage();
}

function updateSelectorAfterSP1(selector, name, map_type_value, justice_value) {
    let sp = {
        "map_type": "sp-0",
        "justice": "sp-1",
        "v1": "sp-2",
        "amenity": "sp-3",
        "mot": "sp-4"
    }

    let curr_sp = document.querySelector('#' + sp[name]);

    selector.options.length = 0;
    selector.disabled = false;
    curr_sp.style.display = 'block';
    try {
        let select_title = curr_sp.querySelector('.select-title');
        let select_title_text = select_title.querySelector('.select-title-text');
        select_title_text.setAttribute("i18n", selector_values_after_sp_1[map_type_value][justice_value][name]["title"]);
        let select_title_info_tooltip = select_title.querySelector('.select-title-info').querySelector('.info-tooltip');
        select_title_info_tooltip.setAttribute("i18n", selector_values_after_sp_1[map_type_value][justice_value][name]["desc"]);
        let selector_dict = selector_values_after_sp_1[map_type_value][justice_value][name]["values"];
        if (selector_dict.length == 0) { throw EvalError; }
        var option;
        option = new Option();
        option.setAttribute("value", "select");
        option.setAttribute("i18n", "select");
        selector.add(option);
        for (const v of selector_dict) {
            option = new Option();
            option.setAttribute("value", v);
            option.setAttribute("i18n", v);
            selector.add(option);
        }
    } catch (error) {
        selector.disabled = true;
        curr_sp.style.display = 'none';
    }
    translatePage();
}

map_type.onchange = (e) => {
    e.preventDefault()
    updateSelectorAfterSP0(justice, "justice", e.target.value);
    updateSelectorAfterSP1(v1, "v1", "", "");
    updateSelectorAfterSP1(amenity, "amenity", "", "");
    updateSelectorAfterSP1(mot, "mot", "", "");

    if (correctValues()) {
        changeMap();
    }
}

justice.onchange = (e) => {
    e.preventDefault()
    updateSelectorAfterSP1(v1, "v1", map_type.value, e.target.value);
    updateSelectorAfterSP1(amenity, "amenity", map_type.value, e.target.value);
    updateSelectorAfterSP1(mot, "mot", map_type.value, e.target.value);
    
    if (correctValues()) {
        changeMap();
    }
};

v1.onchange = (e) => {
    e.preventDefault()
    if (correctValues()) {
        changeMap();
    }
}

amenity.onchange = (e) => {
    e.preventDefault()
    if (correctValues()) {
        changeMap();
    }
}

mot.onchange = (e) => {
    e.preventDefault()
    if (correctValues()) {
        changeMap();
    }
}

function correctValues() {
    if (map_type.value == "radar") return true;

    if (justice.value == "select") return false;
    
    return ((!v1.disabled && v1.value != "select") || v1.disabled)
    && ((!amenity.disabled && amenity.value != "select") || amenity.disabled)
    && ((!mot.disabled && mot.value != "select") || mot.disabled)
}

// When selector value is clicked
function changeMap() {
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
    if (selected_values["map_type"] == "diff_sg") {
        callGeoServer(
            "divergent",
            { "filter1": selected_values["v1"], "filter2": selected_values["mot"] },
            handleJsonDiv
        );
    } else if (selected_values["map_type"] == "summ") {
        callGeoServer(
            "all_normalized",
            {},
            handleJsonRadar
        );
    } else {
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

// Parameter true if welcome modal, false if about us modal
function displayModal(welcomeOrAboutUs) {
    var content = modal_about.querySelector('.modal-content').querySelector('.modal-text');
    if (welcomeOrAboutUs) {
        content.innerHTML = '<h2 i18n="welcome"></h2><p i18n="project_description"></p><p i18n="tool_tutorial"></p>'
    } else {
        content.innerHTML = '<p i18n="about_us_text"></p><p i18n="data_source"></p><img src="https://www.mos.ed.tum.de/fileadmin/_processed_/9/8/csm_Header_MCube_57378eef86.jpg" alt="MCube">'
    }
    modal_about.style.display = "block";
}

about_us_btn.onclick = (event) => {
    displayModal(false);
}

span.onclick = function() {
    modal_about.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal_about) {
        modal_about.style.display = "none";
    }
}
