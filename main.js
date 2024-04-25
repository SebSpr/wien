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
  sights: L.featureGroup(),
  lines: L.featureGroup(),
  stops: L.featureGroup(),
  zones: L.featureGroup(),
  hotels: L.featureGroup().addTo(map),
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
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "icons/photo.png",
          iconAnchor: [16, 37],
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
    style: function (feature) {
      var lineName = feature.properties.LINE_NAME;
      var lineColor = "black";
      if (lineName == "Red Line") {
        lineColor = "#FF4136"
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B";
      } else {
        //vielleicht kommen noch andere Linien dazu
      }

      return {
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
    pointToLayer: function (feature, latlng) {
      var lineID = feature.properties.LINE_ID
      var busstop;
      if (lineID == 1) {
        busstop = "icons/bus_1.png"
      } else if (lineID == 2) {
        busstop = "icons/bus_2.png"
      } else if (lineID == 3) {
        busstop = "icons/bus_3.png"
      } else if (lineID == 4) {
        busstop = "icons/bus_4.png"
      } else if (lineID == 4) {
        busstop = "icons/bus_4.png"
      } else if (lineID == 5) {
        busstop = "icons/bus_5.png"
      } else if (lineID == 6) {
        busstop = "icons/bus_6.png"
      }

      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: busstop,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h4><a style="color: black;"><i class="fa-solid fa-bus"></i>${feature.properties.LINE_NAME}</a></h4>
      <a style="color: black;"></i>${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</a>
      `)
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

/* correct solution loadStops
 
async function loadStops(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h4><a style="color: black;"><i class="fa-solid fa-bus"></i>${feature.properties.LINE_NAME}</a></h4>
      <a style="color: black;"></i>${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</a>
      `)
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")


*/



async function loadZones(url) {
  console.log("Loading", url)
  var response = await fetch(url);
  var geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
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
    pointToLayer: function (feature, latlng) {
      var hotelKat = feature.properties.KATEGORIE_TXT
      var h_star;
      if (hotelKat == "1*") {
        h_star = "icons/hotel_1star.png"
      } else if (hotelKat == "2*") {
        h_star = "icons/hotel_2stars.png"
      } else if (hotelKat == "3*") {
        h_star = "icons/hotel_3stars.png"
      } else if (hotelKat == "4*") {
        h_star = "icons/hotel_4stars.png"
      } else if (hotelKat == "5*") {
        h_star = "icons/hotel_5stars.png"
      } else {
        h_star = "icons/hotel_0star.png"
      }
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: h_star,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        })
      });
    },
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




