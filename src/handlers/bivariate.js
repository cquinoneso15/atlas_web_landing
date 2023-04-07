/************************************
 * sequential.js                    *
 * Ajax callback for bivariate data *
 * Author: Héctor Ochoa Ortiz       *
 * Affil.: TUM SVP                  *
 ************************************/

var biv_breakpoint_pop;
var biv_quart_pop;
var biv_breakpoint_X;
var biv_quart_X;

function handleJsonBiv(data) {
    biv = true;

    var X = selected_values["justice"];
    if (X == "income") {X = "inc";}

    biv_breakpoint_pop = data.features[0].properties["pop_breakpoint_value"];
    biv_quart_pop = data.features[0].properties["pop_breakpoint_quart"];
    biv_breakpoint_X = data.features[0].properties[X + "_breakpoint_value"];
    biv_quart_X = data.features[0].properties[X + "_breakpoint_quart"];

    // Add data to download button
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    download.setAttribute("href", dataStr);
    download.setAttribute("download", "data.geojson");

    // If layer is empty, show error message and return
    if (data.features.length == 0) {
        alert('Error while querying, no features found.');
        return;
    }

    function getCritical(variable) {
        return ((variable == 0.75) ? 'High' : 'Low');
    }

    function getNonCritical(variable) {
        return ((getCritical(variable) == 'High') ? 'Low' : 'High');
    }

    function getColorBiv(v1, v2) {
        let v1_critical = getCritical(biv_quart_pop);
        let v2_critical = getCritical(biv_quart_X);
        if (v1 == v1_critical) {
            if (v2 == v2_critical) {
                return '#574249';
            } else {
                return '#c85a5a';
            }
        } else {
            if (v2 == v2_critical) {
                return '#64acbe';
            } else {
                return '#e8e8e8';
            }
        }
    }

    function style(feature) {
        return {
            fillColor: getColorBiv(feature.properties.hilo_pop, feature.properties["hilo_" + X]),
            weight: 0.5,
            opacity: 1,
            color: '#1a1a1a',
            fillOpacity: 0.7
        };
    }

    // Add legend
    generateLegend('<svg width="100" height="80" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>' +
        '<g transform="translate(15 30) rotate(-45)">' +
        '<title>Bivariate legend</title>' +
        '<rect height="18" width="18" y="2" x="0" stroke="#000" fill="' + getColorBiv(getNonCritical(biv_quart_pop), getCritical(biv_quart_X)) + '"/>' +
        '<rect height="18" width="18" y="2" x="18" stroke="#000" fill="' + getColorBiv(getCritical(biv_quart_pop), getCritical(biv_quart_X)) + '"/>' +
        '<rect height="18" width="18" y="20" x="0" stroke="#000" fill="' + getColorBiv(getNonCritical(biv_quart_pop), getNonCritical(biv_quart_X)) + '"/>' +
        '<rect height="18" width="18" y="20" x="18" stroke="#000" fill="' + getColorBiv(getCritical(biv_quart_pop), getNonCritical(biv_quart_X)) + '"/>' +
        '<path d="M0,0 v38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none"' + ((getCritical(biv_quart_X) == 'High') ? ' marker-start="url(#arrow)"' : ' marker-end="url(#arrow)"') + '/>' +
        '<path d="M0,38 h38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none"' + ((getCritical(biv_quart_pop) == 'Low') ? ' marker-start="url(#arrow)"' : ' marker-end="url(#arrow)"') + '/>' +
        '<text font-weight="bold" font-size="0.65em" transform="translate(-14, 18) rotate(90)" text-anchor="middle" i18n="' + selected_values["justice"] + '"></text>' +
        '<text font-weight="bold" font-size="0.65em" transform="translate(18, 50)" text-anchor="middle" i18n="pop"></text>' +
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
    if (tiles) { layerControlOptions["Background"] = tiles; }
    if (polygonLayer) { layerControlOptions["Indicator"] = polygonLayer; }
    if (poiLayer) { layerControlOptions["POIs"] = poiLayer; }
    if (areaLayer) { layerControlOptions["Service Areas"] = areaLayer; }
    layerControl = L.control.layers(null, layerControlOptions).addTo(map)

    if (areaLayer) {
        areaLayer.bringToFront();
        if (poiLayer) {
            poiLayer.bringToFront();
        }
    }

    translatePage();
}