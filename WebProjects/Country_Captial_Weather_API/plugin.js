const goBotton = document.getElementById("goBtn");
const continentSelector = document.getElementById("continentSelect");
const controlTable = document.getElementById("controlTable");
const detailTable = document.getElementById("detailTable");


// create control table
let tableTitleC = document.createElement("thead");
let title1 = document.createElement("td");
title1.appendChild(document.createTextNode("Flag"));
let title2 = document.createElement("td");
title2.appendChild(document.createTextNode("Country"));
let title3 = document.createElement("td");
title3.appendChild(document.createTextNode("Capital"));

[title1, title2, title3].forEach(title => {
  tableTitleC.appendChild(title);
});
controlTable.appendChild(tableTitleC);


// create captial weather detail table
let tableTitleD = document.createElement("thead");
let title1D = document.createElement("td");
title1D.appendChild(document.createTextNode("City"));
let title2D = document.createElement("td");
title2D.appendChild(document.createTextNode("Weather"));
let title3DA = document.createElement("td");
title3DA.appendChild(document.createTextNode("Temp(High)"));
let title3DB = document.createElement("td");
title3DB.appendChild(document.createTextNode("Temp(Low)"));
let title4D = document.createElement("td");
title4D.appendChild(document.createTextNode("Date"));

[title1D, title2D, title3DA, title3DB, title4D].forEach(title => {
  tableTitleD.appendChild(title);
});
detailTable.appendChild(tableTitleD);


// function get all the captial citys from the target region.
function getRegionCaptials(){
  var controlTable = document.getElementById("controlTable");
  let detail = document.querySelectorAll("#detailTable tr.detailData");
  let control = document.querySelectorAll("#controlTable tr.controlData");

  for (x of detail) {
    document.querySelector("#detailTable").removeChild(x);
  }

  for (x of control) {
    document.querySelector("#controlTable").removeChild(x);
  }
  fetch(`https://restcountries.com/v3.1/region/${continentSelector.value}`)
    .then(r => r.json())
    .then(d => {
      let out = d.filter(
        it =>
          it.cca3 != "HKG" &&
          it.cca3 != "MAC" &&
          it.cca3 != "TWN"
      );
      out.forEach(it => {
        let row = document.createElement("tr");
        row.classList.add("controlData");

        let nation = document.createElement("td");
  
  
        let flag = document.createElement("img");
        flag.setAttribute("class", it.capital);
        flag.classList.add(it["cca2"]);
        flag.setAttribute("src",it.flags["png"]);
        flag.setAttribute('width', "46px");
        flag.setAttribute('height', "30px");
        
        nation.appendChild(flag);
        nation.setAttribute("class", it.capital + " " + it["cca2"]);

        let name = document.createElement("td");
        name.setAttribute("class", it.capital);
        name.classList.add(it["cca2"]);
        name.appendChild(document.createTextNode(`${it.name["common"]}`));

        let captical = document.createElement("td");
        captical.setAttribute("class", it.capital);
        captical.classList.add(it["cca2"]);

        captical.appendChild(document.createTextNode(`${it.capital}`));

        [nation, name, captical].forEach(t => row.appendChild(t));
        row.addEventListener("click", event => {
          let targetRow = event.target.parentNode;
          // let targetRowIndex = targetRow.rowIndex;

          let city = event.target.classList[0].toLowerCase();;
          let countryCode = event.target.classList[1];
          console.log(`Capital City: ${city}, Country Code: ${countryCode}`);
          getWeather(city);

          // highlight the row
          if(row.classList.contains("isSelected") == false)
            targetRow.classList.add('isSelected');
        });
        controlTable.appendChild(row);
      });

      getWeather(out[0].capital);
      controlTable.rows[0].classList.add('isSelected');
    });
}


// function get the forcast weather report for the target city
function getWeather(targetCity){
    // remove all the rows in detail table.
    const detail = document.querySelectorAll("#detailTable tr.detailData");
    for (x of detail) {
      document.querySelector("#detailTable").removeChild(x);
    }

    // clean up row's 'isSelected' class attribute
    var rows = document.getElementById("controlTable").querySelectorAll("tr");
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if(row.classList.contains("isSelected"))
        row.classList.remove("isSelected");
    }

    let city = targetCity;

    fetch(
      `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=f'`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": 'yahoo-weather5.p.rapidapi.com',
          "x-rapidapi-key": '67964410a7mshe898a9edbcf2d68p1415f8jsn8a70b5bda8bf'
        }
      }
    )
      .then(r => r.json())
      .then(d => {
        console.log(d);
        d.forecasts.forEach(it => {
          let row = document.createElement("tr");
          row.classList.add("detailData");

          let cityName = document.createElement("td");
          cityName.appendChild(document.createTextNode(`${d["location"]["city"]}`));
          
            let weather = document.createElement("td");
            weather.appendChild(
              document.createTextNode(`${it.text}`)
            );

            let temputureHigh = document.createElement("td");
            temputureHigh.appendChild(
              document.createTextNode(`${it.high}`)
            );

            let temputureLow = document.createElement("td");
            temputureLow.appendChild(
              document.createTextNode(`${it.low}`)
            );

            let date = document.createElement("td");
            // yahoo weather api use the Unix timestamp, we need to convert it into normal date and time.
            const timestamp = it.date;
            const getDate = new Date(timestamp * 1000);
            // output format: "YYYY-MM-DD HH:MM:SS":
            const dateString = getDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            date.appendChild(document.createTextNode(dateString.substring(0,11)));

            [cityName, weather, temputureHigh, temputureLow, date].forEach(t =>
              row.appendChild(t)
            );
        
        detailTable.appendChild(row);
      });
    });
}


goBotton.addEventListener("click", ev => getRegionCaptials());
getRegionCaptials();