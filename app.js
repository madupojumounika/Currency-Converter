// app.js
document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

  const dropdowns = document.querySelectorAll(".dropdown select");
  const btn = document.querySelector("form button");
  const amountInput = document.querySelector(".amount input");
  const msg = document.querySelector(".msg");

  if (!dropdowns || dropdowns.length < 2) {
    console.error("app.js: Need two select elements inside .dropdown.");
    msg.innerText = "Setup error: dropdowns not found.";
    return;
  }

  // pick selects by name if possible, otherwise by position
  const fromSelect = document.querySelector('select[name="from"]') || dropdowns[0];
  const toSelect = document.querySelector('select[name="to"]') || dropdowns[1];

  // If countryList from codes.js exists, use it. If not, create small fallback.
  const countryList = window.countryList || { USD: "US", INR: "IN" };
  if (!window.countryList) {
    console.warn("app.js: window.countryList not found. Using fallback list.");
  }

  // If selects are nearly empty, populate them (safe guard if codes.js didn't run)
  function populateIfEmpty(select) {
    if (select.options.length <= 2) {
      for (let currCode in countryList) {
        const option = document.createElement("option");
        option.value = currCode;
        option.textContent = currCode;
        select.appendChild(option);
      }
      // set defaults
      if (select === fromSelect) select.value = "USD";
      if (select === toSelect) select.value = "INR";
    }
  }
  populateIfEmpty(fromSelect);
  populateIfEmpty(toSelect);

  // Update flags for a select element
  function updateFlag(selectEl) {
    try {
      const curr = selectEl.value;
      const countryCode = countryList[curr];
      if (!countryCode) {
        console.warn("updateFlag: no country code for", curr);
        return;
      }
      // search for nearest img inside same .select-container
      const container = selectEl.closest(".select-container");
      if (!container) {
        console.warn("updateFlag: .select-container not found for select", selectEl);
        return;
      }
      const img = container.querySelector("img");
      if (!img) {
        console.warn("updateFlag: img tag not found next to the select", selectEl);
        return;
      }
      img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    } catch (err) {
      console.error("updateFlag error:", err);
    }
  }

  // attach change listeners
  [fromSelect, toSelect].forEach((sel) => {
    sel.addEventListener("change", () => updateFlag(sel));
  });

  // ensure flags reflect initial value
  updateFlag(fromSelect);
  updateFlag(toSelect);

  // main conversion
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const amt = parseFloat(amountInput.value);
    if (isNaN(amt) || amt <= 0) {
      msg.innerText = "⚠️ Enter a valid positive amount.";
      return;
    }

    msg.innerText = "Fetching latest rates... ⏳";

    try {
      const fromCode = fromSelect.value;
      const toCode = toSelect.value;

      const resp = await fetch(`${BASE_URL}${fromCode}`);
      if (!resp.ok) {
        throw new Error(`Network response not ok (${resp.status})`);
      }
      const data = await resp.json();

      if (!data.rates || typeof data.rates[toCode] === "undefined") {
        msg.innerText = `No rate available for ${toCode}`;
        console.error("Rates object:", data.rates);
        return;
      }

      const rate = data.rates[toCode];
      const converted = (amt * rate).toFixed(2);
      msg.innerText = `${amt} ${fromCode} = ${converted} ${toCode}`;
    } catch (err) {
      console.error("Conversion error:", err);
      msg.innerText = "❌ Could not fetch exchange rate. Open console for details.";
    }
  });
});
const toggleBtn = document.getElementById('toggleBtn');
const container = document.querySelector('.container');

toggleBtn.addEventListener('click', () => {
    container.classList.toggle('dark-mode'); 
    container.classList.toggle('light-mode'); 
});
