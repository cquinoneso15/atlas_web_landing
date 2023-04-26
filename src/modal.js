const about_us_btn = document.querySelector('#about_us');
var span = document.getElementsByClassName("close")[0];
var modal_about = document.getElementById("modal-about");

var temporaryValues = {};

function createCatSelection (name) {
    var content = modal_about.querySelector('.modal-content').querySelector('.modal-text');
    if (correctValues(temporaryValues)) {
        selected_values = temporaryValues;
        window.location.href = createShareURL();
    } else {
        let cat_selection = content.querySelector('.cat-selection');
        cat_selection.innerHTML = "";
        var values_dict;
        switch (name) {
            case "map_type":
                values_dict = selector_values_before_sp_0;
                break;
            case "justice":
                values_dict = selector_values_after_sp_0[temporaryValues["map_type"]]["values"];
                break;
            default:
                values_dict = selector_values_after_sp_1[temporaryValues["map_type"]][temporaryValues["justice"]][name]["values"];
                break;
        }

        for (let v of values_dict) {
            let option = document.createElement("button");
            option.setAttribute("class", "cat-selection-option");
            option.setAttribute("value", v["value"]);

            let option_text = document.createElement("div");
            option_text.setAttribute("class", "cat-selection-option-text");
            option_text.setAttribute("i18n", v["value"]);
            option.appendChild(option_text);

            let option_desc = document.createElement("div");
            option_desc.setAttribute("class", "cat-selection-option-desc");
            option_desc.setAttribute("i18n", v["desc"]);
            option.appendChild(option_desc);

            option.onclick = function() {
                temporaryValues[name] = this.value;

                var next;
                switch(name) {
                    case "map_type":
                        next = "justice";
                        break;
                    case "justice":
                        next = "amenity";
                        break;
                    case "amenity":
                        next = "mot";
                        break;
                    case "mot":
                        next = "v1";
                        break;
                }

                createCatSelection(next);
            }
            cat_selection.appendChild(option);
        }

        let cat_title = content.querySelector('.cat-title');
        cat_title.setAttribute("i18n", "select_" + name);
        translatePage();
    }
}

// Parameter true if welcome modal, false if about us modal
function displayModal(welcomeOrAboutUs) {
    var content = modal_about.querySelector('.modal-content').querySelector('.modal-text');
    if (welcomeOrAboutUs) {
        // Welcome
        content.innerHTML = '<h2 i18n="welcome"></h2><p i18n="project_description"></p><p i18n="tool_tutorial"></p>';
        
        // Cat selection
        content.innerHTML += '<div class="cats"><div class="cat-selection"></div><div class="line-wrapper"><hr class="line"><div class="cat-title"></div></div></div>';
        createCatSelection("map_type");
    } else {
        // About
        content.innerHTML = '<p i18n="about_us_text"></p><p i18n="data_source"></p><img src="https://www.mos.ed.tum.de/fileadmin/_processed_/9/8/csm_Header_MCube_57378eef86.jpg" alt="MCube">'
        translatePage();
    }
    modal_about.style.display = "block";
}

// When About button is clicked, show About modal
about_us_btn.onclick = (event) => {
    displayModal(false);
}

// When X button is clicked, close the modal
span.onclick = function() {
    modal_about.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal_about) {
        modal_about.style.display = "none";
    }
}
