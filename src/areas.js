/*****************************************
 * areas.js                              *
 * Ajax callback for area isochrone data *
 * Author: Héctor Ochoa Ortiz            *
 * Affil.: TUM SVP                       *
 *****************************************/

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