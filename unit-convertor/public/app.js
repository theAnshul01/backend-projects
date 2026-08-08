const unitsByType = {
    length: ["mm", "cm", "m", "km", "inch", "foot", "yard", "mile"],
    weight: ["mg", "g", "kg", "oz", "lb"],
    temperature: ["celsius", "fahrenheit", "kelvin"],
}

const typeSelect = document.getElementById("type");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const form = document.getElementById("convert-form");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

function populateUnits() {
    const units = unitsByType[typeSelect.value];
    fromSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
    toSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join("");
}

typeSelect.addEventListener("change", populateUnits);
populateUnits();

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    resultEl.textContent = "";
    errorEl.textContent = "";

    const type = typeSelect.value;
    const value = document.getElementById("value").value;
    const from = fromSelect.value;
    const to = toSelect.value;

    const response = await fetch(`/api/${type}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({value, from, to}),
    });

    const data = await response.json();

    if(!response.ok){
        errorEl.textContent = data.error;
    } else {
        resultEl.textContent = `Result: ${data.result} ${to}`;
    }
});