const button = document.getElementById("goBtn");
let inputbox = document.getElementById("textInput");
let controlTable = document.getElementById("controlTable");
let detailTable = document.getElementById("detailTable");
let tableTitleC = document.createElement("tr");
let tableTitleD = document.createElement("tr");

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

let title1D = document.createElement("td");
title1D.appendChild(document.createTextNode("City"));
let title2D = document.createElement("td");
title2D.appendChild(document.createTextNode("Weather"));
let title3D = document.createElement("td");
title3D.appendChild(document.createTextNode("Temputure"));
let title4D = document.createElement("td");
title4D.appendChild(document.createTextNode("Humidity"));

[title1D, title2D, title3D, title4D].forEach(title => {
  tableTitleD.appendChild(title);
});

detailTable.appendChild(tableTitleD);

function getDate(){
    const inp = document.getElementById("textInput");
    let detail = document.querySelectorAll("#detailTable tr.detailData");
    let control = document.querySelectorAll("#controlTable tr.controlData");
  
    for (x of detail) {
      document.querySelector("#detailTable").removeChild(x);
    }
  
    for (x of control) {
      document.querySelector("#controlTable").removeChild(x);
    }
  
    fetch(`https://restcountries.eu/rest/v2/region/${inp.value}`)
      .then(r => r.json())
      .then(d => {
        let out = d.filter(
          it =>
            it.alpha3Code != "HKG" &&
            it.alpha3Code != "MAC" &&
            it.alpha3Code != "TWN"
        );
        out.forEach(it => {
          let row = document.createElement("tr");
          row.classList.add("controlData");
  
          let nation = document.createElement("td");
          let flag = document.createElement("img");
          flag.setAttribute("class", it.capital);
          flag.classList.add(it.alpha2Code);
          flag.setAttribute(
            "src",
            `https://www.countryflags.io/${it.alpha2Code.toLowerCase()}/flat/64.png`
          );
          nation.appendChild(flag);
          nation.setAttribute("class", it.capital + " " + it.alpha2Code);
  
          let name = document.createElement("td");
          name.setAttribute("class", it.capital);
          name.classList.add(it.alpha2Code);
          name.appendChild(document.createTextNode(`${it.name}`));
  
          let captical = document.createElement("td");
          captical.setAttribute("class", it.capital);
          captical.classList.add(it.alpha2Code);
  
          captical.appendChild(document.createTextNode(`${it.capital}`));
  
          [nation, name, captical].forEach(t => row.appendChild(t));
          row.addEventListener("click", event => {
            let detail = document.querySelectorAll("#detailTable tr.detailData");
            for (x of detail) {
              document.querySelector("#detailTable").removeChild(x);
            }
  
            let city = event.target.classList[0];
            let countryCode = event.target.classList[1];
            console.log(city + " " + countryCode);
            event.target.classList.forEach(x => console.log(x));
            console.log(`Country: ${nation}| City: ${city}`);
            fetch(
              `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3f9ebadcda2dc5f688032618d14fc01e`
            )
              .then(r => r.json())
              .then(it => {
                  let row = document.createElement("tr");
                  row.classList.add("detailData");
  
                  let cityName = document.createElement("td");
                  cityName.appendChild(document.createTextNode(`${it.name}`));
                  
                  let weather = document.createElement("td");
                  weather.appendChild(
                    document.createTextNode(`${it.weather[0].main}`)
                  );
  
                  let temputure = document.createElement("td");
                  temputure.appendChild(
                    document.createTextNode(`${it.main.temp}`)
                  );
  
                  let humidity = document.createElement("td");
                  humidity.appendChild(document.createTextNode(`${it.main.humidity}`));
  
                  [cityName, weather, temputure, humidity].forEach(t =>
                    row.appendChild(t)
                  );
                  detailTable.appendChild(row);
              });
          });
  
          controlTable.appendChild(row);
        });
      });
  }

  button.addEventListener("click", e => {getDate();});
  inputbox.addEventListener('keypress', (e) => {
    if (e.code === "Enter") 
        getDate();
        });