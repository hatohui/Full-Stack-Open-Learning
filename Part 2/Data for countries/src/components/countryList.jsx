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

const Weather = ({ country }) => {
    return <div>
        <h2>Weather in {country.capital}</h2>
        <p>temperature </p>
    </div>
}

const Country = ({country}) => <div>
    <CountryDetail country={country}/>
    <Weather country={country}/>
</div>


const Display = ({countries, filter, toShow, handleClick, weather, handleWeather}) => {
    console.log(weather)
    if (toShow !== null) return <Country country={toShow} />

    const countriesCopy = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

    if (countriesCopy.length === 0) return <div>No match found</div>

    if (countriesCopy.length === 1) {
        console.log("exist")
        handleWeather(countriesCopy[0])
        return <Country country={countriesCopy[0]} />
    }

    return <div>{countriesCopy.length > 10 ? "Too many matches, specify another filter"
        : countriesCopy.map((each, i) => <div key={i}>{each.name.common} <button onClick={handleClick} type="button" value={each.name.common}>show</button></div>)}</div>
}

export default Display