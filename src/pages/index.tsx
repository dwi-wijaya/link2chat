import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { countryCode } from '../constants/country.js';
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(countryCode[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPasteClicked, setIsPasteClicked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectCountry = (country: any) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setPhoneNumber(sanitizedValue);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipText) => {
      const sanitizedText = clipText.replace(/\D/g, ''); // Sanitize input
      setPhoneNumber(sanitizedText);
      setIsPasteClicked(true);
    });
  };

  const clearInput = () => {
    setPhoneNumber('');
    setIsPasteClicked(false);
  };

  const generateWaLink = () => {
    const fullPhoneNumber = selectedCountry.dial_code + phoneNumber;
    const waLink = `https://wa.me/${fullPhoneNumber}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">WhatsApp Link Generator</h1>

        {/* Country Code Dropdown */}


        {/* Phone Number Input */}
        <div className="flex items-center mb-4">
            <button
              className="flex items-center w-full p-2 border border-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={selectedCountry.img} alt={selectedCountry.code} className="w-6 h-6 mr-2" />
              {selectedCountry.dial_code}
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search country"
                  className="p-2 w-full border-b"
                  onChange={(e) => { }}
                />
                {countryCode.map((country) => (
                  <button
                    key={country.code}
                    className="flex items-center w-full p-2 hover:bg-gray-100"
                    onClick={() => handleSelectCountry(country)}
                  >
                    <img src={country.img} alt={country.code} className="w-6 h-6 mr-2" />
                    {country.name} ({country.dial_code})
                  </button>
                ))}
              </div>
            )}
          <input
            type="text"
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="min-w-max p-2 border outline-none focus:outline-none"
          />
          <button
            className="p-2 bg-slate-200 min-w-16 max-w-16 rounded border border-neutral-200"
            onClick={isPasteClicked ? clearInput : handlePaste}
          >
            {isPasteClicked ? 'Clear' : 'Paste'}
          </button>
        </div>

        {/* Generate WhatsApp Link Button */}
        <button
          className={`w-full p-2 text-green-800 rounded disabled:bg-green-200 bg-green-300`}
          onClick={generateWaLink}
          disabled={!phoneNumber}
        >
          Generate WhatsApp Link
        </button>
      </div>
    </div>
  )
}
