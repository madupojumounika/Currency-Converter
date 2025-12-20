// codes.js
// Creates a global countryList map and fills the select boxes (only if they're empty)
document.addEventListener("DOMContentLoaded", () => {
  // Expose global for other scripts
  window.countryList = {
    USD: "US", INR: "IN", EUR: "EU", GBP: "GB", JPY: "JP", AUD: "AU", CAD: "CA",
    SGD: "SG", CHF: "CH", CNY: "CN", NZD: "NZ", ZAR: "ZA", AED: "AE", KRW: "KR",
    HKD: "HK", SEK: "SE", NOK: "NO", DKK: "DK", PHP: "PH", PKR: "PK", BDT: "BD",
    MYR: "MY", THB: "TH", VND: "VN", RUB: "RU", BRL: "BR", MXN: "MX", PLN: "PL",
    TRY: "TR", ILS: "IL", HUF: "HU", CZK: "CZ", RON: "RO", ARS: "AR", CLP: "CL",
    COP: "CO", EGP: "EG"
  };

  const dropdowns = document.querySelectorAll(".dropdown select");
  if (!dropdowns || dropdowns.length === 0) {
    console.warn("codes.js: No .dropdown select elements found on the page.");
    return;
  }

  // Only fill select options if there are no or just a couple options present
  dropdowns.forEach((select) => {
    // If select already has many options, skip filling to avoid duplicates
    if (select.options.length > 3) return;

    for (let currCode in window.countryList) {
      const option = document.createElement("option");
      option.value = currCode;
      option.textContent = currCode;

      // sensible defaults
      if (select.name === "from" && currCode === "USD") option.selected = true;
      if (select.name === "to" && currCode === "INR") option.selected = true;

      select.appendChild(option);
    }
  });
});
