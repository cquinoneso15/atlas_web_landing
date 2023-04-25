// Check parameters and update
let url = new URL(window.location.href);

setValue("map_type", url.searchParams.get("map_type"));
setValue("justice", url.searchParams.get("justice"));
setValue("v1", url.searchParams.get("v1"));
setValue("amenity", url.searchParams.get("amenity"));
setValue("mot", url.searchParams.get("mot"));

if (url.searchParams.get("map_type") == null || !correctValues()) {
    displayModal(true);
}

// Share function
share_btn.onclick = (event) => {
    let share_url = new URL(window.location.href);
    if (selected_values != undefined) {
        // Add parameters to URL
        for (const key in selected_values) {
            if (selected_values[key] !== undefined && selected_values[key] !== ''){
                share_url.searchParams.set(key, selected_values[key]);
            }
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
