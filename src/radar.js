/*******************************
 * radar.js                    *
 * Script file for Radar Plots *
 * Author: Héctor Ochoa Ortiz  *
 * Affil.: TUM SVP             *
 *******************************/


function radarPlot(e) {
  var layer = e.target;
  var properties = layer.feature.properties;

  const config = {
      type: 'radar',
      data: {
          labels: ["Health", "Education", "Food", "Sports", "Community centers"],
          datasets: [{
              label: properties.name,
              data: [properties.value_h, properties.value_e, properties.value_f, properties.value_s, properties.value_cc],
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
          }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    };
  
  return new Chart(document.getElementById('radar'), config);
}