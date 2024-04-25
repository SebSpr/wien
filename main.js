/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

var themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup(),
  stops: L.featureGroup(),
  zones: L.featureGroup(),
  hotels: L.featureGroup(),
}
// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "ESRI.NatGeoWorldMap": L.tileLayer.provider("Esri.NatGeoWorldMap"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Vienna Sightseeing Haltestellen": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels und Unterkünfte": themaLayer.hotels,

  })
  .addTo(map);


// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

L.control
  .fullscreen()
  .addTo(map);



async function loadSights(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "icons/photo.png",
          iconAnchor: [16,37],
          popupAnchor: [0, -37],

        })
      });
    },
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <img src="${feature.properties.THUMBNAIL}" alt="*">
     <h4><a href="${feature.properties.WEITERE_INF}"
     target="wien">${feature.properties.NAME}</a></h4>
     <adress>${feature.properties.ADRESSE}</adresse>
      `)
    }
  }).addTo(themaLayer.sights);
}

loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")



async function loadLines(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    style: function(feature) {
      var lineName = feature.properties.LINE_NAME;
      var lineColor = "black";
      if  (lineName == "Red Line"){
        lineColor = "#FF4136"
      } else if (lineName == "Yellow Line") {
        lineColor= "#FFDC00";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      }else if (lineName == "Orange Line") {
        lineColor = "#FF851B";
      } else {
        //vielleicht kommen noch andere Linien dazu
      }

      return{
        color: lineColor,
      };
     },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h4><a style="color: black;"><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</a></h4>
      <a style="color: black;"><i class="fa-solid fa-location-crosshairs"></i>${feature.properties.FROM_NAME}</a><br>
      <a style="color: black;"><i class="fa-solid fa-down-long"></i></a><br>
      <a style="color: black;"><i class="fa-solid fa-location-crosshairs"></i>${feature.properties.TO_NAME}</a><br>
      `);
    }
  }).addTo(themaLayer.lines);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")



async function loadStops(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h4><a style="color: black;"><i class="fa-solid fa-bus"></i>${feature.properties.LINE_NAME}</a></h4>
      <a style="color: black;"></i>${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</a>
      `)
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")



async function loadZones(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    style: function(feature) {
      return {
        color: "#F012BE",
        weight: 1, 
        opacity: 0.4,
        fillOpacity: 0.1,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h4><a style="color: black;">Fußgängerzone ${feature.properties.ADRESSE}</a></h4>
      <a style="color: black;"><i class="fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM || "dauerhaft"}</a><br>
      <a style="color: black;"><i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT || "ohne Ausnahmen"}</a>
      `)
    }
  }).addTo(themaLayer.zones);
}

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")






async function loadHotels(url) {
  console.log("Loading", url);
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h3><a style="color: black;">${feature.properties.BETRIEB}</a></h3>
      <h4><a style="color: black;">${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT}</a></h4>
      <hr style="border-top: 1px solid black; margin-bottom: 10px;">
      <adress>Adresse: ${feature.properties.ADRESSE}</adresse><br>
      <a style="color: black;">Tel.: <a href="tel:${feature.properties.KONTAKT_TEL}" target="_blank">${feature.properties.KONTAKT_TEL}</a></a><br>
      <a href="mailto:${feature.properties.KONTAKT_EMAIL}" target="_blank">${feature.properties.KONTAKT_EMAIL}</a><br>
      <a href="${feature.properties.WEBLINK1}" target="_blank">Homepage</a>
    `);
    }
  }).addTo(themaLayer.hotels);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")





/*
Suche Sightseeing
loadLines
Touristische Kraftfahrlinien Liniennetz Vienna Sightseeing Linie Wien 
lines

loadStops
Touristische Kraftfahrlinien Haltestellen Vienna Sightseeing Linie Standorte Wien 
stops

fußgängerzone
loadZones
Fußgängerzonen Wien 
zones

hotels
loadHotels
Hotels und Unterkünfte Standorte Wien
hotels





*/

