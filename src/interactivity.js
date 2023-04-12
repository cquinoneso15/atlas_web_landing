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
    if (areaLayer) { areaLayer.bringToFront(); }
    if (poiLayer) { poiLayer.bringToFront(); }
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
    this._div.innerHTML = '<h4>' + (v1.options[v1.selectedIndex] ? v1.options[v1.selectedIndex].text : '') + (amenity.options[amenity.selectedIndex] ? " / " + amenity.options[amenity.selectedIndex].text : '') + (mot.options[mot.selectedIndex] ? " / " + mot.options[mot.selectedIndex].text : '') + '</h4>';

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
            case "income":
                this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br /> Inc. ' + props.value_inc.toFixed(2) + ' (' + props.hilo_inc + ') - Pop. ' + props.value_pop.toFixed(2) + ' (' + props.hilo_pop + ')'
                    : '<span i18n="hover"></span>');
                break;
            default:
                break;
        }
    } else {
        this._div.innerHTML += (props
                    ? '<b>' + props.name + '</b><br />' + props.value.toFixed(2) + "&nbsp;" + props.value_desc
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