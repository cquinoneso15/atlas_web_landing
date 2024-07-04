
let w1 = 1;
let w2 = 1;
let w3 = 1;
let w4 = 1;

let check_income = 1;
let check_tp = 1;
let check_u18 = 1;
let check_o65 = 1;
let check_ng = 1;
let check_sp = 1;
let check_un = 1;


function calculateMinMax(scores) {
    let min = Math.min(...scores);
    let max = Math.max(...scores);
    return { min, max };
}
function normalizeValue(value, scores) {
    const { min, max } = calculateMinMax(scores);
    return (value - min) / (max - min);
}

function handleJsonscoreBiv(data) {
    let rawexposure = data.features.map(feature => feature.properties.value_accidents + feature.properties.value_noise + feature.properties.value_pollution);
    let rawproximty = data.features.map(feature => feature.properties.value_h + feature.properties.value_e + feature.properties.value_f + feature.properties.value_s + feature.properties.value_cc);
    let rawinfra = data.features.map(feature => feature.properties.value_acc_pt + feature.properties.value_cycleway_density + feature.properties.value_intersection_density);
    let rawusage = data.features.map(feature => feature.properties.value_walk_usage + feature.properties.value_car_sharing_usage + feature.properties.value_bike_usage + feature.properties.value_pt_usage);
    let rawsocial = data.features.map(feature => -feature.properties.value_income*check_income + feature.properties.value_tp*check_tp + feature.properties.value_u18*check_u18 + feature.properties.value_o65*check_o65+feature.properties.value_ng*check_ng+feature.properties.value_un*check_un+feature.properties.value_sp*check_sp);
    data.features.forEach((feature, index) => {
        const props = feature.properties;
        props.exposure = normalizeValue(rawexposure[index], rawexposure);
        props.proximity = normalizeValue(rawproximty[index], rawproximty);
        props.infra = normalizeValue(rawinfra[index], rawinfra);
        props.usage = normalizeValue(rawusage[index], rawusage);
        props.socialscore = normalizeValue(rawsocial[index], rawsocial);
    });
    let mobScore = data.features.map(feature => feature.properties.exposure*w1 - feature.properties.proximity*w2 - feature.properties.infra*w3 - feature.properties.usage*w4);
    data.features.forEach((feature, index) => {
        const props = feature.properties;
        props.totalScore = normalizeValue(mobScore[index], mobScore);

    });
    bivscore = true;
       const socialquants = getQuants(data, "socialscore");
    const mobilquants = getQuants(data, "totalScore");


        biv_quart_pop = socialquants["Q3"];
        biv_quart_X = mobilquants["Q3"];

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
            if (v1 >= biv_quart_pop) {
                if (v2 >= biv_quart_X) {
                    return '#574249';
                } else {
                    return '#c85a5a';
                }
            } else {
                if (v2 >= biv_quart_X) {
                    return '#64acbe';
                } else {
                    return '#e8e8e8';
                }
            }
        }
        function style(feature) {
            return {
                fillColor: getColorBiv(feature.properties.socialscore, feature.properties.totalScore),
                weight: 0.5,
                opacity: 1,
                color: '#1a1a1a',
                fillOpacity: 0.7
            };
        }

        // Add legend
        generateLegend('<svg width="220" height="200" viewBox="-13 0 107 100" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>' +
            '<g transform="translate(15 30) rotate(-45)">' +
            '<title>Bivariate legend</title>' +
            '<rect height="18" width="18" y="2" x="0" stroke="#000" fill="' + getColorBiv(biv_quart_pop-1, biv_quart_X) + '"/>' +
            '<rect height="18" width="18" y="2" x="18" stroke="#000" fill="' + getColorBiv(biv_quart_pop, biv_quart_X) + '"/>' +
            '<rect height="18" width="18" y="20" x="0" stroke="#000" fill="' + getColorBiv(biv_quart_pop-1, biv_quart_X-1) + '"/>' +
            '<rect height="18" width="18" y="20" x="18" stroke="#000" fill="' + getColorBiv(biv_quart_pop, biv_quart_X-1) + '"/>' +
            '<path d="M0,0 v38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none"' +  ' marker-start="url(#arrow)"' + '/>' +
            '<path d="M0,38 h38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none"' + ' marker-end="url(#arrow)"' + '/>' +
            '<text font-weight="bold" font-size="0.4em" transform="translate(-10, 18) rotate(90)" text-anchor="middle"  i18n="' + 'mob_leg' + '"></text>' +
            '<text font-weight="bold" font-size="0.4em" transform="translate(18, 48)" text-anchor="middle"  i18n="' + 'social_leg' + '"></text>' +
            '</g>' +
            '<g transform="translate(25 10)">' +
            '<path d="M0,80 h38" opacity="1" stroke-linecap="butt" stroke-linejoin="bevel" stroke="#000" stroke-width="2" fill="none" marker-end="url(#arrow)"/>' +
            '<text font-size="0.4em" transform="translate(-5, 82)" text-anchor="end" i18n="Low"></text>' +
            '<text font-size="0.4em" transform="translate(45, 82)" text-anchor="start" i18n="High"></text>' +
            '</g>' +
            '</svg>'+
            '<div style="width:220px;"><span i18n="desc_biv" style="font-size:smaller;"></span> (<i class="square" style="display:inline-block;float:none;margin:0;background:' + getColorBiv(biv_quart_pop, biv_quart_X) + '" ></i>)</div>',
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
        if (selected_values["justice"] == "acc") {
            if (poiLayer) { layerControlOptions["POIs"] = poiLayer; }
            if (areaLayer) { layerControlOptions["Service Areas"] = areaLayer; }
        }
        layerControl = L.control.layers(null, layerControlOptions).addTo(map)

        translatePage();
}


