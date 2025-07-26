const apiKey = "AIzaSyBnvrcNZghkV7AdpalpARHBGumAAk_744U"; // 
const cx = "47e7cf3aabf754111";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function displayResults(results) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(item => {
    const image = item.pagemap?.cse_image?.[0]?.src || null;

    const div = document.createElement("div");
    div.innerHTML = `
      ${image ? `<img src="${image}" alt="Thumbnail" style="max-width:100px; margin-bottom: 8px;" />` : ""}
      <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
      <p>${item.snippet}</p>
      <a href="${item.link}" target="_blank" style="font-size: 0.9em; color: gray;">${item.link}</a>
      <hr/>
    `;
    container.appendChild(div);
  });
}


async function searchGoogle(query) {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "<p style='color: gray; font-style: italic;'>🔄 Loading results...</p>";

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data.items || []);
  } catch (e) {
    container.innerHTML = `<p style="color:red;">❌ Error: ${e.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("results.html")) {
    const query = getQueryParam("q");
    const input = document.getElementById("resultsSearchInput");

    if (query) {
      input.value = query;
      searchGoogle(query); // Now loading message works
    }

    document.getElementById("resultsSearchForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const newQuery = input.value;
      if (newQuery.trim()) {
        window.location.href = `results.html?q=${encodeURIComponent(newQuery)}`;
      }
    });
  }
});
