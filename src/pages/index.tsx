import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { countryCode } from "../constants/country.js";
import { Raleway } from "next/font/google";
import axios from "axios";

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
      className={`${raleway.className} flex justify-center items-center h-[100svh] bg-slate-50 w-full`}
    >
      <div className="flex flex-col justify-between items-center p-6 h-screen sm:h-3/4 bg-slate-100 w-full sm:w-[32rem] border border-slate-200 rounded-xl shadow-sm">
        <main>
          <header className="text-center my-8">
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Link2Chat
            </h1>
            <p className="text-balance text-gray-700">
              Simplify your communication! Easily generate a WhatsApp link and
              connect with anyone instantly.
            </p>
          </header>

          <div className="bg-white flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm w-full">
            <div className="flex items-center bg-neutral-50 border border-slate-200 rounded-md relative">
              <button
                title="Select country"
                className="flex items-center bg-neutral- gap-2 text-slate-600 w-fit p-3 min-w-fit border-r border-slate-200 flex-wrap"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="fal fa-circle-chevron-down"></i>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute z-[100] top-8 border border-neutral-300 bg-neutral-50 mt-4 w-full rounded shadow-sm max-h-60 overflow-y-auto"
                >
                  <input
                    type="text"
                    placeholder="Search country"
                    className="p-2 w-full border-b sticky top-0 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      className={`flex items-center justify-between w-full p-2 hover:bg-gray-100 pr-3  ${selectedCountry.dial_code === country.dial_code ? "font-semibold !bg-gray-200" : ""}`}
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
                className="pr-3 w-fit text-slate-600"
                onClick={
                  isPasteClicked || phoneNumber ? clearInput : handlePaste
                }
              >
                <i
                  className={`fad ${
                    isPasteClicked || phoneNumber ? "fa-trash" : "fa-paste"
                  }`}
                />
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
        </main>

        <footer className="mt-8 text-center text-gray-600">
          <p>
            Created with ❤️ by <strong>Dwi</strong>
          </p>
          <p>
            <a
              href="https://github.com/dwi-wijaya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
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
