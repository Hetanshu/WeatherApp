require('dotenv').config();
const http=require('http');
const fs=require('fs');
const requests = require("requests");
const url=require('url');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };


const server = http.createServer((req, res) => {
    if (req.url == "/") {
      requests(
        `http://api.openweathermap.org/data/2.5/weather?q=${process.env.CITY}&units=metric&appid=${process.env.APPID}`
      )
        .on("data", (chunk) => {
         console.log(chunk);
          const objdata = JSON.parse(chunk);//Convert Json to obj
          console.log(objdata);
          const arrData = [objdata];// Convert object to array
          //console.log(arrData[0].main.temp); // value of temperature from api json arrData[0].main.temp
          const realTimeData = arrData
            .map((val) => replaceVal(homeFile, val))
            .join("");                               // Join is used to convert array to String'
          res.write(realTimeData);
          console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to errors", err);
            res.end();
          });
      }else if(req.url==""){

      }else {
        res.end("File not found");
      }
  });
  
  server.listen(8000, "127.0.0.1");
