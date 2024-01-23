import { Card, Text, Metric, AreaChart } from "@tremor/react";
import { Country, State, City }  from 'country-state-city';
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import AreaChartCard from "./components/AreaChartCard";
import LineChartCard from "./components/LineChartCard";

function App() {
  const [allCountries,setAllCountries] = useState([]);

  const [selectedCountry,setSelectedCountry] = useState([]);
  const [selectedCity,setSelectedCity] = useState([]);

  const [weatherDetails,setWeatherDetails] = useState([]);


  useEffect(()=>{

    setAllCountries(
      Country.getAllCountries().map((country)=>({
        value:{
          latitute: country.latitude,
          longitude : country.longitude,
          isoCode : country.isoCode

        },
        label : country.name
      })));

  },[])

  const handleSelectedCountry = (option) => {
    setSelectedCountry(option);
    setSelectedCity(null);

  };

  const handleSelectedCity = (option) => {
    setSelectedCity(option);

  };

  const getWeatherDetails = async (e) => {
    e.preventDefault();

    const fetchWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.value.latitude}&longitude=${selectedCity.value.longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,surface_pressure,windspeed_180m,winddirection_180m,temperature_180m,soil_temperature_54cm,soil_moisture_27_81cm,uv_index,uv_index_clear_sky,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=GMT`
    );

    const data = await fetchWeather.json();

    setWeatherDetails(data);
  };

  console.log(weatherDetails);
  
  return (
    <div className="flex max-w-7xl mx-auto space-x-1 p-3">
    {/* Sidebar Div */}
    <div className="flex flex-col space-y-10 bg-blue-950 h-screen w-[25%] p-2">
      <Select options={allCountries} value={selectedCountry} onChange={handleSelectedCountry}/>

      <Select 
      options={City.getCitiesOfCountry(selectedCountry?.value?.isoCode).map((city)=>({
        value:{
          latitude: city.latitude,
          longitude : city.longitude,
        },
        label : city.name
      }))}
      value={selectedCity}
      onChange={handleSelectedCity}
      />

    <button onClick={getWeatherDetails} className="bg-green-400 w-full py-3 text-white  font-bold text-sm hover:scale-105 transition-all duration-150 ease-in-out "> Get Weather </button>

    <div className="flex flex-col space-y-2 text-white font-semibold">
      <p>
      {selectedCountry?.label} {" | "}{selectedCity?.label}
      </p>
      <p>
        Coordinates : {selectedCity?.value?.latitude}{" | "}{selectedCity?.value?.longitude}
      </p>
    </div>
    <div>
      {/*Sunset and Sunrise time*/}

    </div>
  </div>

    {/*Body*/}

    <div className="w-[75%] h-screen ">
      <div className=" flex items-center space-x-2">
      <Card  decoration="top" decorationColor="red" className="text-center bg-gray-100">
        <Text className="!text-gray-600">Temperature</Text>
        <Metric>{weatherDetails?.daily?.temperature_2m_max[0]} &#x2103;</Metric>
      </Card>

      <Card  decoration="top" decorationColor="blue" className="text-center bg-gray-100">
        <Text className="!text-gray-600">Wind Speed </Text>
        <Metric>{weatherDetails?.daily?.windspeed_10m_max[0]} Km/h</Metric>
      </Card>

      <Card  decoration="top" decorationColor="green" className="text-center bg-gray-100">
        <Text className="!text-gray-600">UV Index</Text>
        <Metric>{weatherDetails?.daily?.uv_index_max[0]}</Metric>
      </Card>
      </div>

      <div>
        <AreaChartCard weatherDetails={weatherDetails} />
        <LineChartCard weatherDetails={weatherDetails} />
      </div>

      
    </div>

  </div>
  
  );
}

export default App;
