const CountryDetail = ({ country }) => {
    const languages = Object.values(country.languages)
    return <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <p><b>languages</b></p>
        <ul>
            {languages.map(each => <li key={each}>{each}</li>)}
        </ul>
        <img src={country.flags.png} />
    </div>
}

const Weather = ({ country, weather }) => {
    const srcLink = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    return <div>
        <h2>Weather in {country.capital}</h2>
        <p>temperature {Math.round((weather.main.temp)*100)/100} Celcius</p>
        <img src={srcLink}/>
        <p>wind {weather.wind.speed} m/s</p>
    </div>
}

const Country = ({country, weather}) => <div>
    <CountryDetail country={country}/>
    <Weather weather={weather} country={country}/>
</div>


const Display = ({filtered, toShow, handleClick, weather}) => {
    console.log("rendered.")
    if (filtered.length === 0) return <div>no match found</div>

    if (toShow !== null && weather !== null) return <Country country={toShow} weather={weather}/>

    return <div>{filtered.length > 10 ? "Too many matches, specify another filter"
        : filtered.map((each, i) => <div key={i}>{each.name.common} <button onClick={handleClick} type="button" value={each.name.common}>show</button></div>)}</div>
}

export default Display