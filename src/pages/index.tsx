import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { countryCode } from '../constants/country.js';
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState(countryCode[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPasteClicked, setIsPasteClicked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    // Periksa apakah event.target adalah elemen yang valid
    if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Menutup dropdown jika klik di luar
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <div className="flex items-center mb-4 bg-neutral-50 border border-slate-200 rounded-md relative">
          <button
            className="flex items-center w-full pl-2 min-w-fit gap-0 flex-wrap"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image width={0} height={0} sizes="100" src={selectedCountry.img} alt={selectedCountry.code} className="w-9 h-6 rounded-sm mr-2" />
            <i className="fa fa-caret-down mr-2"></i>
            <span className="leading-4">{selectedCountry.dial_code}</span>
          </button>
          {dropdownOpen && (
            <div ref={dropdownRef} className="absolute z-[100] top-8 border border-neutral-300 bg-neutral-100 mt-4 w-full rounded shadow-sm max-h-60 overflow-y-auto">
              <input
                type="text"
                placeholder="Search country"
                className="p-2 w-full border-b sticky top-0 focus:outline-none"
                onChange={(e) => { }}
              />
              {countryCode.map((country) => (
                <button
                  key={country.code}
                  className="flex items-center w-full p-2 hover:bg-gray-100 "
                  onClick={() => handleSelectCountry(country)}
                >
                  <Image width={0} height={0} sizes="100" src={country.img} alt={country.code} className="w-8 h-6 mr-2" />
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
            className="min-w-max flex-1 p-2 bg-inherit outline-none focus:outline-none"
          />
          <button
            className="pr-3 w-fit"
            onClick={isPasteClicked || phoneNumber ? clearInput : handlePaste}
          >
            {isPasteClicked || phoneNumber ? <i className="fad fa-trash"></i> : <i className="fad fa-paste"></i>}
          </button>
        </div>

        {/* Generate WhatsApp Link Button */}
        <button
          className={`flex items-center group gap-2 justify-center w-full p-2 transition-all duration-300 text-green-800 border border-green-400 rounded disabled:bg-gray-100 bg-green-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400`}
          onClick={generateWaLink}
          disabled={!phoneNumber}
        >
          <i className="fa-duotone fa-solid fa-arrow-up-right-from-square"></i>
          <span className="">Open in WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
