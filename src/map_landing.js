var map = L.map('mapid').setView([40, 20], 3);

$.getJSON("src/countries.geo.json", function(geoJsonData) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.geoJSON(geoJsonData, {
            style: function(feature) {
                // Check the country name and apply different styles
                if (feature.properties.name === "Tunisia" || feature.properties.name === "Germany") {
                    return {
                        fillColor: "#072140", // Different color for Tunisia and Germany
                        weight: 2,
                        opacity: 0.5,
                        color: '#ABB5BE', // Border color
                        fillOpacity: 0.7
                    };
                } else {
                    return {
                        fillColor: "#DDE2E6",
                        weight: 2,
                        opacity: 0.5,
                        color: '#ABB5BE', // Border color
                        fillOpacity: 0.5
                    };
                }
            },
            // Conditional click events
            onEachFeature: function(feature, layer) {
                    layer.on('click', function() {
                        displayCountryData(feature.properties.name);
                            var textBox = document.querySelector('.text-box-dynamic'); // Get the text box element
                            if (textBox.style.display === 'none') {
                                textBox.style.display = 'block'; // Show the text box
                            }
                        });

            }
        }).addTo(map);
    });

function displayCountryData(countryName) {
    var content = {
        "Germany":
            "<h3 style='font-size: 30px;text-decoration: underline'>Munich</h3>" +
            "<a i18n=\"landing_further\"></a>"+
        " <ol>" +
            "            <li> <h i18n=\"landing_Munich_report\"></h> <a href=\"https://syncandshare.lrz.de/getlink/fi7q2ukHDC8aV4LTwfBYeq/Mobility%20Injustice%20Atlas_Munich_TUM.pdf\" style=\"font-weight: bold; text-decoration: none;\" i18n=\"Click\"></a></li>\n" +
            "            <li> <h i18n=\"landing_Munich_linkedin\"></h> <a href=\"https://www.linkedin.com/posts/m-cube-munich-cluster-for-the-future-of-mobility-in-metropolitan-regions_mcube-mcube-innovationsempfehlung-volume-activity-7166422313654075392-EhFj?utm_source=share&utm_medium=member_desktop\" style=\"font-weight: bold; text-decoration: none;\" i18n=\"Click\"></a>  </li>\n" +
            "            <li> <h i18n=\"landing_github\"></h> <a href=\"https://github.com/Robot8A/atlas_web\" style=\"font-weight: bold; text-decoration: none;\" i18n=\"Click\"></a></li>\n" +
            "        </ol>"
            ,

        "Tunisia": "<h3 style='font-size: 30px;text-decoration: underline'>Tunis</h3>" +
             "<a i18n=\"landing_further\"></a>"+
        " <ol>" +
            "            <li> <strong i18n=\"landing_github\"></strong> <a href=\"https://github.com/CyrkaFRDE/Altas_MJ_TN\" style=\"font-weight: bold; text-decoration: none;\" i18n=\"Click\"></a></li>\n" +
            "        </ol>"

    };
    var container = document.getElementById('dynamicContentContainer');
    container.innerHTML = content[countryName] || "<h3 i18n=\"landing_no_data\"></h3><p i18n=\"landing_no_data_desc\"></p>";
    container.style.marginTop = "20px";
    container.style.padding = "10px";
    if(content[countryName]){displayCountrySource(countryName);
    }
    else{document.getElementById('dynamicSource').innerHTML = "";
        document.getElementById('Source').innerHTML = ""}

    translatePage()
}
function displayCountrySource(countryName) {

    var Source_container = document.getElementById('Source');
    document.getElementById('Source')
    Source_container.innerHTML = "<h3 i18n=\"Source\" style=\"font-size: 25px\"></h3>"
    fetch('src/Source.json')
        .then(response => response.json())
        .then(data => generateTable(data, countryName))
        .catch(error => console.error('Error loading the JSON data:', error));
    function generateTable(data, country) {
        var tableData = data[country];
        if (!tableData) {
            console.error('No data found for:', country);
            return;
        }
        var mobilityRowCount = tableData.filter(item => item.category === "ji").reduce((acc, item) => acc + item.type_of_data.length, 0);
        var table = '<table>';
        table += '<colgroup>';
        table += '<col>';
        table += '<col>';
        table += '<col>';
        table += '<col>';
        table += '<col>';
        table += '</colgroup>';
        table += '<tr><th colspan="2" i18n="Variables"></th><th i18n="type_data"></th><th i18n="DESCRIPTION"></th><th i18n="data_Source"></th></tr>';
        let isFirstMobility = true;
        tableData.forEach(function(variable) {
            variable.type_of_data.forEach(function(item, index) {
                table += '<tr>';
                // Check if the current variable is the first in the Mobility category
                if (variable.category === "ji" && isFirstMobility) {
                    table += `<td rowspan="${mobilityRowCount}" i18n="ji"></td>`;
                    isFirstMobility = false;
                }
                if (!variable.category && index === 0) {
                    table += `<td colspan="2" i18n="${variable.variable}">${variable.variable.replace(/_/g, ' ')}</td>`;
                } else if (index === 0) { // First type of data for this variable
                    table += `<td rowspan="${variable.type_of_data.length}" i18n="${variable.variable}">${variable.variable.replace(/_/g, ' ')}</td>`;
                }
                table += `<td i18n=${item.name}></td>`;
                table += `<td i18n=${item.desc}></td>`;
                table += `<td><a href="${item.url}">${item.source}</a></td>`;
                table += '</tr>';
            });
        });
        table += '</table>';
        document.getElementById('dynamicSource').innerHTML = table;
        translatePage()
    }
}