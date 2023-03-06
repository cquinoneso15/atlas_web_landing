/******************************
 * geoserver.js               *
 * AJAX calls to GeoServer    *
 * Author: Héctor Ochoa Ortiz *
 * Affil.: TUM SVP            *
 ******************************/

function formatDictionary(dict) {
    let pairs = [];
    for (let key in dict) {
      pairs.push(`${key}:${dict[key]}`);
    }
    return pairs.join(';');
}


/**
 * Description
 * @param {string} tablename Table name in GeoServer
 * @param {object} params The params in a dictionary format
 * @param {string|function} callback Callback function to be called with the AJAX call data
 * @returns {any} The AJAX call
 */
function callGeoServer(tablename, params, callback){
    var cleanCallback;
    switch(typeof(callback)) {
        case 'string':
            cleanCallback = callback;
            break;
        case 'function':
            cleanCallback = callback.name;
            break;
        default:
            throw new EvalError('Callback should be a string or a function');
    }

    return $.ajax('http://localhost:8080/geoserver/wfs', {
        type: 'GET',
        data: {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typename: 'MGeM:' + tablename,
            srsname: 'EPSG:4326',
            outputFormat: 'text/javascript',
            viewparams: formatDictionary(params)
        },
        dataType: 'jsonp',
        jsonpCallback: 'callback:' + cleanCallback,
        jsonp: 'format_options'
    });
}