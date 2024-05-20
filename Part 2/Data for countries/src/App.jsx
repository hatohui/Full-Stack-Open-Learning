import { useState, useEffect, StrictMode } from "react";
import service from "./service/service";
import Display from "./components/countryList";

const App = () => {

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [toShow, setToShow] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    service
      .getData()
      .then(iniData =>
        setData(iniData))
      .catch(error =>  console.log("Something went wrong."))
  }, [])

  const handleFilter = event => {
    setFilter(event.target.value)
    setToShow(null)
  }

  const handleClick = event => {
    service
      .getWithName(event.target.value)
      .then(returned => {
        setToShow(returned)
        handleWeather(returned)
      })
      .catch(error => console.log("Something went wrong."))
  }

  const handleWeather = object => {
    service.getWeather(object)
      .then(returned => setWeather(returned))
      .catch(error => console.log("could not get Weather"))
  }

  return <div>
    <div>find countries <input value={filter} onChange={handleFilter}/>
    </div>
    <Display countries={data} filter={filter} 
      weather={weather} toShow={toShow} 
      handleClick={handleClick} handleWeather={handleWeather}/>
  </div>
}

export default App;