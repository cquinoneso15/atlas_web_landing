/*******************************
 * radar.js                    *
 * Script file for Radar Plots *
 * Author: Héctor Ochoa Ortiz  *
 * Affil.: TUM SVP             *
 *******************************/

var currentLayer;

let labels = [
  "value_h",
  "value_e",
  "value_f",
  "value_s",
  "value_cc",
  "value_acc_pt",
  "value_cycleway_density",
  "value_intersection_density",
  "value_walk_usage",
  "value_car_sharing_usage",
  "value_bike_usage",
  "value_pt_usage",
  "value_accidents",
  "value_noise",
  "value_pollution",
  "value_income",
  "value_tp",
  "value_u18",
  "value_o65",
  "value_ng"
]

function hideByLabel(plot, label) {
  var datasets = plot.data.datasets;
  var properties = currentLayer.feature.properties;

  // Remove label item from labels
  plot.data.labels = plot.data.labels.filter(item => item !== label);

  for (var i = 0; i < datasets.length; i++) {
    var data = datasets[i].data;
    data = plot.data.labels.map(key => varDict[key]).map(x => properties[x]);
  }
  
  plot.update();
}


function radarPlot(e) {
  currentLayer = e.target;
  var properties = currentLayer.feature.properties;

  const config = {
      type: 'radar',
      data: {
          labels: labels.map(x => translateString(x.split("value_")[1])),
          datasets: [
            {
              label: properties.name,
              data: labels.map(x => properties[x]),
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            },
            {
              label: "Average of Munich",
              data: labels.map(x => 0.5), //TODO Fix
              fill: true,
              backgroundColor: 'rgba(150, 150, 150, 0.2)',
              borderColor: 'rgb(150, 150, 150)',
              pointBackgroundColor: 'rgb(150, 150, 150)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(150, 150, 150)'
            }
          ]
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