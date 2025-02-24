"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("body");

export default function Home() {
  const [cityInput, setCityInput] = useState<string>(""); 
  const [city, setCity] = useState<string | null>(null);  
  const { data, loading, error } = useFetchData(city);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cityData, setCityData] = useState<typeof data[]>([]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setCity(cityInput);
  };
  
  useEffect(() => {
    if (error) {
      setIsModalOpen(true);
    } else if (data) {
      setCityData((prevList) => [...prevList, data]); //Mantiene lo previo y añade data
    }
  }, [data, error]); // Funciona cuando data o error cambian de valor

  const removeCard = (index: number) => {
    setCityData((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex justify-center w-full min-w-[500px] h-full min-h-screen p-16">
        <div className="flex flex-col w-full">
          <form onSubmit={handleSubmit} className="pb-10">
            <input
              type="text"
              placeholder="City"
              value={cityInput}
              name="city"
              className="border p-2 rounded w-full bg-slate-50"
              onChange={(e) => setCityInput(e.target.value)}
            />
          </form>

          {loading && <p>Loading...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityData.map((city, index) => (
              <WeatherCard key={index} city={city} index={index} removeCard={removeCard} />
            ))}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Invalid search"
            className="bg-white p-6 rounded shadow-lg mx-auto max-w-sm"
            overlayClassName="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center"
          >
            <h2 className="text-lg font-bold">City does not exist</h2>
            <p>Please enter a valid city name.</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-5 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </Modal>
        </div>
      </div>
    </>
  );
}

function WeatherCard({ city, index, removeCard }: { city: any; index: number; removeCard: (index: number) => void }) {
  // Extract values
  const { text: condition, icon } = city.current.condition;
  const isDay = city.current.is_day === 1;
  const temperature = city.current.temp_c;
  const humidity = city.current.humidity;
  const windSpeed = city.current.wind_kph;
  const rainProbability = city.current.precip_mm;

  // Determine background style
  const getBackgroundStyle = () => {
    if (["Clear", "Sunny", "Partly cloudy"].includes(condition)) {
      return isDay ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-blue-800 to-blue-900";
    }
    if (["Cloudy", "Overcast", "Mist", "Fog"].includes(condition)) {
      return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
    if (["Light rain", "Drizzle", "Moderate rain", "Heavy rain", "Torrential rain", "Thunderstorms"].includes(condition)) {
      return "bg-gradient-to-r from-gray-700 to-gray-900";
    }
    return "bg-gradient-to-r from-green-300 to-green-400";
  };

  return (
    <div className={`relative p-5 border rounded-lg shadow-md text-white ${getBackgroundStyle()}`}>
      <button
        className="absolute top-4 right-4 w-8 h-8 opacity-100 hover:text-red-500 text-white text-xl flex items-center justify-center rounded-full"
        onClick={() => removeCard(index)}
      >
        ✖
      </button>

      <h2 className="text-2xl font-semibold text-center">
        {city.location.name}, {city.location.country}
      </h2>

      <div className="flex justify-center my-4">
        <img src={`https:${icon}`} alt={condition} className="w-20 h-20" />
      </div>

      <p className="text-5xl font-bold text-center">{temperature}°C</p>
      
      <p className="text-lg text-center italic">{condition}</p>

      <div className="flex justify-between mt-4 text-sm">
        <p>Humidity: <span className="font-semibold">{humidity}%</span></p>
        <p>Rain: <span className="font-semibold">{rainProbability}mm</span></p>
        <p>Wind: <span className="font-semibold">{windSpeed} kph</span></p>
      </div>
    </div>
  );
}
