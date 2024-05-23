import { useState, useEffect, StrictMode } from "react";
import service from "./service/service";
import Display from "./components/countryList";

const App = () => {

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [toShow, setToShow] = useState(null);
  const [weather, setWeather] = useState(null);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    service
      .getData()
      .then(iniData =>
        setData(iniData))
      .catch(error =>  console.log("Something went wrong."))
  }, [])

  useEffect(() => {
    setFiltered(data.filter(each => each.name.common.toLowerCase().includes(filter.toLowerCase())))
  }, [filter])

  useEffect(() => {
    if (filtered.length === 1) setToShow(filtered[0]);
    else setToShow(null);
  }, [filtered])

  useEffect(() => {
    if (toShow !== null) {
      service
        .getWeather(toShow)
        .then(returned => setWeather(returned))
        .catch(error => console.log("could not get weather"))
    }
  }, [toShow])

  const handleFilter = event => {
    setFilter(event.target.value)
  }

  const handleClick = event => {
    service
      .getWithName(event.target.value)
      .then(returned => {
        setToShow(returned)
      })
      .catch(error => console.log("Something went wrong."))
  }

  return <div>
    <div>find countries <input value={filter} onChange={handleFilter}/>
    </div>
    <Display filtered={filtered}
      weather={weather} toShow={toShow}
      handleClick={handleClick}/>
  </div>
}

export default App;