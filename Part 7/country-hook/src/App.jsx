import React, { useState, useEffect } from "react";
import { fetchByName } from "./service/country";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  const change = (newCountry) => setCountry(newCountry);

  useEffect(() => {
    fetchByName(name)
      .then((response) => setCountry(response))
      .catch((error) => console.log("error"));
  }, [name]);

  const found = !!country;

  const data = country
    ? {
        name: country.name.common,
        capital: country.capital,
        population: country.population,
        flag: country.flags.png,
      }
    : null;

  return {
    data: data,
    change,
    found,
  };
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flag}
        height="100"
        alt={`flag of ${country.data.name}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
