const apiKey = 'd0ce870163a5038075d6be6c83cfdcf5'; // Ganti dengan API Key kamu
const citySelector = document.getElementById('city');
const cityName = document.getElementById('city-name');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const ctx = document.getElementById('weatherChart').getContext('2d');

let weatherChart;

// Fetch dan update data cuaca
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`
    );
    const data = await response.json();

    if (data.cod !== "200") {
      alert("Gagal mengambil data cuaca");
      return;
    }

    updateWeatherInfo(data);
    updateChart(data);

  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan dalam mengambil data cuaca");
  }
}

// Update informasi dasar cuaca
function updateWeatherInfo(data) {
  const currentWeather = data.list[0];
  cityName.textContent = data.city.name;
  description.textContent = currentWeather.weather[0].description;
  temperature.textContent = `Suhu: ${currentWeather.main.temp}°C`;
}

// Update grafik cuaca
function updateChart(data) {
  const labels = data.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .map(item => new Date(item.dt_txt).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }));

  const temps = data.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .map(item => item.main.temp);

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Suhu Siang (°C)',
        data: temps,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
        tension: 0.3,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

// Event listener perubahan kota
citySelector.addEventListener('change', (e) => {
  fetchWeather(e.target.value);
});

// Inisialisasi awal
fetchWeather(citySelector.value);
