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

    /*
    // SVG size fix
    var svgs = legend._container.getElementsByTagName("svg");
    for (var s of svgs) {
        let bbox = s.getBBox();
        s.setAttribute("width", bbox.width + "px");
        s.setAttribute("height", bbox.height + "px");
        s.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    }
    */
}