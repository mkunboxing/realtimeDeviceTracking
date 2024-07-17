const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
    }, (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 0
    }
);
}

const map = L.map("map").setView([0, 0], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'mukul'
}).addTo(map);

const markers = {};

socket.on("newLocation", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("userdisconnect", (id) => {
    map.removeLayer(markers[id]);
    delete markers[id];
})