// Select elements
const countriesSection = document.getElementById("countries");
const countriesList = document.getElementById("countries-list");
const detailsSection = document.getElementById("details-content");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const darkModeBtn = document.getElementById("darkModeBtn");

// Fetch all countries with selected fields
async function fetchCountries(url = "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,languages,region,population,timezones,maps") {
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch countries");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>Error loading countries.</p>";
  }
}

// Display countries
function displayCountries(countries) {
  countriesList.innerHTML = "";
  countries.forEach((country) => {
    const countryDiv = document.createElement("div");
    countryDiv.classList.add("country-card");

    countryDiv.innerHTML = `
      <h3>${country.name.common}</h3>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;

    // Show details on click
    countryDiv.addEventListener("click", () => showCountryDetails(country));
    countriesList.appendChild(countryDiv);
  });
}

// Show details of one country
function showCountryDetails(country) {
  detailsSection.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="200">
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
    <p><strong>Currencies:</strong> ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <p><a href="${country.maps.googleMaps}" target="_blank">📍 View on Google Maps</a></p>
  `;
}

// Search functionality
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim();
  if (!searchTerm) {
    fetchCountries();
    return;
  }
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}?fields=name,capital,currencies,flags,languages,region,population,timezones,maps`);
    if (!response.ok) throw new Error("Not found");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>No countries found.</p>";
  }
});

// Filter by region
regionSelect.addEventListener("change", async (e) => {
  const region = e.target.value;
  if (!region) {
    fetchCountries();
    return;
  }
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}?fields=name,capital,currencies,flags,languages,region,population,timezones,maps`);
    if (!response.ok) throw new Error("Failed to fetch region");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>Error loading region data.</p>";
  }
});

// Dark Mode
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Load countries on page load
fetchCountries();
