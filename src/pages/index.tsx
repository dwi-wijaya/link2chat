import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { countryCode } from "../constants/country.js";
import { Raleway } from "next/font/google";
import axios from "axios";
import ThemeToggle from '@/components/ThemeToggle';
const raleway = Raleway({ subsets: ["latin"] });

interface HomeProps {
  initialCountry: {
    code: string;
    dial_code: string;
    name: string;
    img: string;
  };
}

const IPDATA_API_KEY = process.env.NEXT_PUBLIC_IPDATA;

const Home: React.FC<HomeProps> = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCode[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPasteClicked, setIsPasteClicked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClickOutside = (event: MouseEvent) => {
    // Periksa apakah event.target adalah elemen yang valid
    if (
      dropdownRef.current &&
      event.target instanceof Node &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
      setSearchQuery("");
    }
  };
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await axios.get(`https://api.ipdata.co?api-key=${IPDATA_API_KEY}&fields=country_code`);
        // Set state dengan data lokasi user
        const foundCountry = countryCode.find(
          (country) => country.code === response.data.country_code
        );

        if (foundCountry) {
          setSelectedCountry(foundCountry) ;
        }
        
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredCountries = countryCode.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery)
  );

  const handleSelectCountry = (country: any) => {
    setSelectedCountry(country);
    setSearchQuery("");
    setDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setPhoneNumber(sanitizedValue);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipText) => {
      const sanitizedText = clipText.replace(/\D/g, ""); // Sanitize input
      setPhoneNumber(sanitizedText);
      setIsPasteClicked(true);
    });
  };

  const clearInput = () => {
    setPhoneNumber("");
    setIsPasteClicked(false);
  };

  const generateWaLink = () => {
    const fullPhoneNumber = selectedCountry.dial_code + phoneNumber;
    const waLink = `https://wa.me/${fullPhoneNumber}`;
    window.open(waLink, "_blank");
  };

  return (
    <div
      className={`${raleway.className} flex justify-center items-center h-[100svh] w-full`}
    >
      <div className="flex flex-col justify-between items-center p-6 h-full sm:h-3/4 bg-container w-full sm:w-[32rem] border border-stroke rounded-xl shadow-sm">
        <main>
        <ThemeToggle/>
          <header className="text-center my-8">
            <h1 className="text-4xl font-bold text-green-500 dark:text-green-300 mb-4">
              Link2Chat
            </h1>
            <p className="text-balance text-text">
              Simplify your communication! Easily generate a WhatsApp link and
              connect with anyone instantly.
            </p>
          </header>

          <div className="bg-white dark:bg-background flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-stroke shadow-sm w-full">
            <div className="flex items-center bg-container border border-stroke rounded-md relative">
              <button
                title="Select country"
                className="group flex items-center bg-container gap-2 text-slate-600 w-fit p-3 min-w-fit border-r border-stroke flex-wrap"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="fal group-hover:scale-105 base-transition fa-circle-chevron-down text-title"></i>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-[100] top-9 sm:top-10 border border-stroke bg-background mt-4 w-full rounded shadow-sm max-h-60 overflow-y-auto"
                >
                  <input
                    type="text"
                    placeholder="Search country"
                    className="p-2 w-full bg-container border-b border-stroke sticky top-0 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      className={`flex items-center justify-between w-full p-2 hover:bg-container pr-3  ${selectedCountry.dial_code === country.dial_code ? "font-semibold bg-container" : ""}`}
                      onClick={() => handleSelectCountry(country)}
                    >
                      <div className="flex items-center">
                        <Image
                          width={0}
                          height={0}
                          sizes="100"
                          src={country.img}
                          alt={country.code}
                          className="w-8 h-6 mr-2"
                        />
                        {country.name}
                      </div>{" "}
                      {country.dial_code}
                    </button>
                  ))}
                </div>
              )}
              <span className="leading-4 p-2 pr-0">
                {selectedCountry.dial_code}
              </span>
              <input
                type="text"
                value={phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="min-w-max flex-1 p-2 bg-inherit outline-none focus:outline-none"
              />
              <button
                title={isPasteClicked ? "Clear" : "Paste"}
                className="group pr-3 w-fit text-title"
                onClick={
                  isPasteClicked || phoneNumber ? clearInput : handlePaste
                }
              >
                <i
                  className={`group-hover:scale-105 base-transition fad ${
                    isPasteClicked || phoneNumber ? "fa-trash" : "fa-paste"
                  }`}
                />
              </button>
            </div>

            {/* Generate WhatsApp Link Button */}
            <button
              className={`groupflex items-center group gap-2 justify-center w-full p-2 transition-all duration-300 text-green-800 border border-green-400 rounded disabled:bg-gray-200 dark:disabled:bg-gray-700 bg-green-200 disabled:cursor-not-allowed disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-subtext`}
              onClick={generateWaLink}
              disabled={!phoneNumber}
            >
              <i className="group-hover:scale-105 base-transition mr-2 fa-duotone fa-solid fa-arrow-up-right-from-square"></i>
              <span className="">Open in WhatsApp</span>
            </button>
          </div>
        </main>

        <footer className="group mt-8 text-center text-subtext">
          <div className="">
            Created with <i className="group-hover:scale-105 base-transition group-hover:mx-1 fas fa-heart text-red-500"></i> by <strong>Dwi</strong>
          </div>
          <p>
            <a
              href="https://github.com/dwi-wijaya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline underline-offset-4 decoration-1"
            >
              GitHub Profile
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};
export default Home;
