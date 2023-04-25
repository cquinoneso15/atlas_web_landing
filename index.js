/******************************
 * index.js                   *
 * Script file for index.html *
 * Author: Héctor Ochoa Ortiz *
 * Affil.: TUM SVP            *
 ******************************/


// Show left bar when in desktop
const mediaQuery = window.matchMedia('(max-width: 1000px)');
document.querySelector('#navbar-left').checked = !mediaQuery.matches;

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

function isDisabled(name) {
    return document.querySelector('#' + name).children.length == 0;
}

function getValue(name) {
    return $('input[name="' + name +'"]:checked').val();
}

function setValue(name, value) {
    if (valueInSelect(name, value)) {
        let input = $('input[name="' + name +'"][value="' + value + '"]')[0];
        input.checked = true;
        input.dispatchEvent(new Event('change'));
    }
}

function valueInSelect(name, value) {
    if (value === '' || value === '#') return false;

    // Check if the value is among the options
    return $('input[name="' + name +'"][value="' + value + '"]').length != 0;
}

// Selector values
var selector_values_after_sp_0 = {
    "sg": {
        "title": "select_sg",
        "values": [
            {
                "value": "tp",
                "desc": "desc"
            },
            {
                "value": "o65",
                "desc": "desc"
            },
            {
                "value": "u18",
                "desc": "desc"
            },
            {
                "value": "ng",
                "desc": "desc"
            },
            {
                "value": "un",
                "desc": "desc"
            },
            {
                "value": "sp",
                "desc": "desc"
            },
            {
                "value": "income",
                "desc": "desc"
            }
        ]
    },
    "ji": {
        "title": "select_justice",
        "values": [
            {
                "value": "ava",
                "desc": "desc"
            },
            {
                "value": "beh",
                "desc": "desc"
            },
            {
                "value": "exp",
                "desc": "desc"
            },
            {
                "value": "acc",
                "desc": "desc"
            }
        ]
    },
    "ji_v_sg": {
        "title": "select_justice",
        "desc": "desc",
        "values": [
            {
                "value": "ava",
                "desc": "desc"
            },
            {
                "value": "beh",
                "desc": "desc"
            },
            {
                "value": "exp",
                "desc": "desc"
            },
            {
                "value": "acc",
                "desc": "desc"
            }
        ]
    },
    "diff_sg": {
        "title": "select_justice",
        "desc": "desc",
        "values": [
            {
                "value": "ava",
                "desc": "desc"
            },
            {
                "value": "beh",
                "desc": "desc"
            }
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
                "values": [
                    {
                        "value": "tp",
                        "desc": "desc"
                    },
                    {
                        "value": "o65",
                        "desc": "desc"
                    },
                    {
                        "value": "u18",
                        "desc": "desc"
                    },
                    {
                        "value": "ng",
                        "desc": "desc"
                    }
                ]
            },
            "amenity": {
                "title": "select_amenity",
                "values": [
                    {
                        "value": "h",
                        "desc": "desc"
                    },
                    {
                        "value": "e",
                        "desc": "desc"
                    },
                    {
                        "value": "f",
                        "desc": "desc"
                    },
                    {
                        "value": "s",
                        "desc": "desc"
                    },
                    {
                        "value": "cc",
                        "desc": "desc"
                    }
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    {
                        "value": "w_700",
                        "desc": "desc"
                    },
                    {
                        "value": "b_700",
                        "desc": "desc"
                    },
                    {
                        "value": "wpt_700",
                        "desc": "desc"
                    }
                ]
            }
        },
        "exp": {
            "v1": {
                "title": "select_exp",
                "desc": "desc",
                "values": [
                    {
                        "value": "accidents",
                        "desc": "desc"
                    },
                    {
                        "value": "noise",
                        "desc": "desc"
                    },
                    {
                        "value": "pollution",
                        "desc": "desc"
                    }
                ]
            }
        },
        "ava": {
            "v1": {
                "title": "select_ava",
                "desc": "desc",
                "values": [
                    {
                        "value": "acc_pt",
                        "desc": "desc"
                    },
                    {
                        "value": "cycleway_density",
                        "desc": "desc"
                    },
                    {
                        "value": "intersection_density",
                        "desc": "desc"
                    }
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_beh",
                "desc": "desc",
                "values": [
                    {
                        "value": "bike_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "pt_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "walk_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "car_sharing_usage",
                        "desc": "desc"
                    }
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
                    {
                        "value": "tp",
                        "desc": "desc"
                    },
                    {
                        "value": "o65",
                        "desc": "desc"
                    },
                    {
                        "value": "u18",
                        "desc": "desc"
                    },
                    {
                        "value": "ng",
                        "desc": "desc"
                    }
                ]
            },
            "amenity": {
                "title": "select_amenity",
                "desc": "desc",
                "values": [
                    {
                        "value": "h",
                        "desc": "desc"
                    },
                    {
                        "value": "e",
                        "desc": "desc"
                    },
                    {
                        "value": "f",
                        "desc": "desc"
                    },
                    {
                        "value": "s",
                        "desc": "desc"
                    },
                    {
                        "value": "cc",
                        "desc": "desc"
                    }
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    {
                        "value": "w_700",
                        "desc": "desc"
                    },
                    {
                        "value": "b_700",
                        "desc": "desc"
                    },
                    {
                        "value": "wpt_700",
                        "desc": "desc"
                    }
                ]
            }
        },
        "exp": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    {
                        "value": "tp",
                        "desc": "desc"
                    },
                    {
                        "value": "o65",
                        "desc": "desc"
                    },
                    {
                        "value": "u18",
                        "desc": "desc"
                    },
                    {
                        "value": "ng",
                        "desc": "desc"
                    },
                    {
                        "value": "un",
                        "desc": "desc"
                    },
                    {
                        "value": "sp",
                        "desc": "desc"
                    }
                ]
            },
            "amenity": {
                "title": "select_exp",
                "desc": "desc",
                "values": [
                    {
                        "value": "accidents",
                        "desc": "desc"
                    },
                    {
                        "value": "noise",
                        "desc": "desc"
                    },
                    {
                        "value": "pollution",
                        "desc": "desc"
                    }
                ]
            }
        },
        "ava": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    {
                        "value": "tp",
                        "desc": "desc"
                    },
                    {
                        "value": "o65",
                        "desc": "desc"
                    },
                    {
                        "value": "u18",
                        "desc": "desc"
                    },
                    {
                        "value": "ng",
                        "desc": "desc"
                    },
                    {
                        "value": "un",
                        "desc": "desc"
                    },
                    {
                        "value": "sp",
                        "desc": "desc"
                    }
                ]
            },
            "amenity": {
                "title": "select_ava",
                "desc": "desc",
                "values": [
                    {
                        "value": "acc_pt",
                        "desc": "desc"
                    },
                    {
                        "value": "cycleway_density",
                        "desc": "desc"
                    },
                    {
                        "value": "intersection_density",
                        "desc": "desc"
                    }
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    {
                        "value": "tp",
                        "desc": "desc"
                    },
                    {
                        "value": "o65",
                        "desc": "desc"
                    },
                    {
                        "value": "u18",
                        "desc": "desc"
                    },
                    {
                        "value": "ng",
                        "desc": "desc"
                    },
                    {
                        "value": "un",
                        "desc": "desc"
                    },
                    {
                        "value": "sp",
                        "desc": "desc"
                    }
                ]
            },
            "amenity": {
                "title": "select_beh",
                "desc": "desc",
                "values": [
                    {
                        "value": "bike_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "pt_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "walk_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "car_sharing_usage",
                        "desc": "desc"
                    }
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
                    {
                        "value": "gender",
                        "desc": "desc"
                    },
                    {
                        "value": "education",
                        "desc": "desc"
                    },
                    {
                        "value": "income",
                        "desc": "desc"
                    },
                    {
                        "value": "age_young",
                        "desc": "desc"
                    },
                    {
                        "value": "age_old",
                        "desc": "desc"
                    }
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    {
                        "value": "has_driving_license",
                        "desc": "desc"
                    },
                    {
                        "value": "owns_bike",
                        "desc": "desc"
                    },
                    {
                        "value": "owns_ebike",
                        "desc": "desc"
                    },
                    {
                        "value": "owns_car_sharing_membership",
                        "desc": "desc"
                    }
                ]
            }
        },
        "beh": {
            "v1": {
                "title": "select_sg",
                "desc": "desc",
                "values": [
                    {
                        "value": "gender",
                        "desc": "desc"
                    },
                    {
                        "value": "education",
                        "desc": "desc"
                    },
                    {
                        "value": "income",
                        "desc": "desc"
                    },
                    {
                        "value": "age_young",
                        "desc": "desc"
                    },
                    {
                        "value": "age_old",
                        "desc": "desc"
                    }
                ]
            },
            "mot": {
                "title": "select_mot",
                "desc": "desc",
                "values": [
                    {
                        "value": "auto_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "pt_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "bicycle_usage",
                        "desc": "desc"
                    },
                    {
                        "value": "car_sharing_usage",
                        "desc": "desc"
                    }
                ]
            }
        }
    },
    "summ": {}
}

var selected_values;

function updateSelectorAfterSP0(name, map_type_value) {
    // Find the .select-main to change
    let curr_sp = document.querySelector('#sp-1');
    curr_sp.style.display = 'block';

    try {
        // Change its title
        let select_title_text = curr_sp.querySelector('.select-title-text');
        select_title_text.setAttribute("i18n", selector_values_after_sp_0[map_type_value]["title"])

        // Fetch possible values
        let selector_dict = selector_values_after_sp_0[map_type_value]["values"];
        if (selector_dict.length == 0) { throw EvalError; }

        // Empty select options
        let select_options = curr_sp.querySelector(".select-options");
        select_options.innerHTML = "";

        // Create the different options
        for (const v of selector_dict) {
            var option = document.createElement("div");
            option.setAttribute("class", "select-option");

            var radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", name);
            radio.setAttribute("id", v["value"]);
            radio.setAttribute("value", v["value"]);
            option.appendChild(radio);

            var label = document.createElement("label");
            label.setAttribute("for", v["value"]);
            label.setAttribute("i18n", v["value"]);
            option.appendChild(label);

            var info = document.createElement("div");
            info.setAttribute("class", "select-title-info");
            info.innerHTML = "&#x1F6C8;";

            var info_tooltip = document.createElement("span");
            info_tooltip.setAttribute("class", "info-tooltip");
            info_tooltip.setAttribute("i18n", v["desc"]);
            info.appendChild(info_tooltip);

            option.appendChild(info);
            select_options.appendChild(option);
        }

        // Unfold in the interface
        curr_sp.querySelector("input[type=checkbox]").checked = true;

        // Add function when checked
        $('input[type=radio][name=' + name + ']').change(function() {
            updateSelectorAfterSP1("v1", this.value);
            updateSelectorAfterSP1("amenity", this.value);
            updateSelectorAfterSP1("mot", this.value);
            
            if (correctValues()) {
                changeMap();
            }
        });
    } catch (error) {
        curr_sp.style.display = 'none';
    }
    translatePage();
}

function updateSelectorAfterSP1(name, justice_value) {
    let map_type_value = getValue("map_type");

    let sp = {
        "v1": "sp-2",
        "amenity": "sp-3",
        "mot": "sp-4"
    }

    // Find the .select-main to change
    let curr_sp = document.querySelector('#' + sp[name]);
    curr_sp.style.display = 'block';

    try {
        // Change its title
        let select_title_text = curr_sp.querySelector('.select-title-text');
        select_title_text.setAttribute("i18n", selector_values_after_sp_1[map_type_value][justice_value][name]["title"])

        // Fetch possible values
        let selector_dict = selector_values_after_sp_1[map_type_value][justice_value][name]["values"];
        if (selector_dict.length == 0) { throw EvalError; }

        // Empty select options
        let select_options = curr_sp.querySelector(".select-options");
        select_options.innerHTML = "";

        // Create the different options
        for (const v of selector_dict) {
            var option = document.createElement("div");
            option.setAttribute("class", "select-option");

            var radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", name);
            radio.setAttribute("id", v["value"]);
            radio.setAttribute("value", v["value"]);
            option.appendChild(radio);

            var label = document.createElement("label");
            label.setAttribute("for", v["value"]);
            label.setAttribute("i18n", v["value"]);
            option.appendChild(label);

            var info = document.createElement("div");
            info.setAttribute("class", "select-title-info");
            info.innerHTML = "&#x1F6C8;";

            var info_tooltip = document.createElement("span");
            info_tooltip.setAttribute("class", "info-tooltip");
            info_tooltip.setAttribute("i18n", v["desc"]);
            info.appendChild(info_tooltip);

            option.appendChild(info);
            select_options.appendChild(option);
        }

        // Unfold in the interface
        curr_sp.querySelector("input[type=checkbox]").checked = true;

        // Add function when checked
        $('input[type=radio][name=' + name + ']').change(function() {
            if (correctValues()) {
                changeMap();
            }
        });
    } catch (error) {
        curr_sp.style.display = 'none';
    }
    translatePage();
}

$('input[type=radio][name=map_type]').change(function() {
    updateSelectorAfterSP0("justice", this.value);
    updateSelectorAfterSP1("v1", "", "");
    updateSelectorAfterSP1("amenity", "", "");
    updateSelectorAfterSP1("mot", "", "");

    if (correctValues()) {
        changeMap();
    }
});

function correctValues() {
    if (getValue("map_type") == "summ") return true;

    if (getValue("justice") == undefined) return false;
    
    return ((!isDisabled("v1") && getValue("v1") != undefined) || isDisabled("v1"))
    && ((!isDisabled("amenity") && getValue("amenity") != undefined) || isDisabled("amenity"))
    && ((!isDisabled("mot") && getValue("mot") != undefined) || isDisabled("mot"))
}

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
    translatePage();
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
