function valueInSelect(select, value) {
    if (value === '' || value === '#') return false;

    // Get the options of the select element
    const options = select.options;

    // Check if the value is among the options
    let isValueInOptions = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            isValueInOptions = true;
            break;
        }
    }

    return isValueInOptions;
}

// Check parameters and update
let url = new URL(window.location.href);
if (valueInSelect(map_type, url.searchParams.get("map_type"))) map_type.value = url.searchParams.get("map_type");
map_type.dispatchEvent(new Event('change'));
if (valueInSelect(justice, url.searchParams.get("justice"))) justice.value = url.searchParams.get("justice");
justice.dispatchEvent(new Event('change'));
if (valueInSelect(v1, url.searchParams.get("v1"))) v1.value = url.searchParams.get("v1");
v1.dispatchEvent(new Event('change'));
if (valueInSelect(amenity, url.searchParams.get("amenity"))) amenity.value = url.searchParams.get("amenity");
amenity.dispatchEvent(new Event('change'));
if (valueInSelect(mot, url.searchParams.get("mot"))) mot.value = url.searchParams.get("mot");
mot.dispatchEvent(new Event('change'));

// Share function
share_btn.onclick = (event) => {
    let share_url = new URL(window.location.href);
    if (selected_values != undefined) {
        for (const key in selected_values) {
            share_url.searchParams.set(key, selected_values[key]);
        }
    }

    navigator.clipboard.writeText(share_url)
    .then(() => {
        alert(`Successfully copied "${share_url}" to the clipboard.`);
    })
    .catch((err) => {
        console.error(`Error copying "${share_url}" to the clipboard: `, err);
    });
}
