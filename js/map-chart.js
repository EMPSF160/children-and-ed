/* ==========================================================================
   Leaflet.js Map & Chart.js Impact Analytics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Leaflet Interactive India Map
  // --------------------------------------------------------------------------
  const mapElement = document.getElementById('reach-map');
  if (mapElement && typeof L !== 'undefined') {
    // Center of India
    const map = L.map('reach-map', {
      center: [22.9734, 78.6569],
      zoom: 5,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Clean Tile Layer (CartoDB Positron for high-end modern look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);

    // State Hubs Data
    const stateHubs = [
      {
        id: 'haryana',
        name: 'Haryana',
        lat: 29.0588,
        lng: 76.0856,
        schools: '14,200+',
        children: '18,50,000+',
        teachers: '38,000+',
        districts: '22 Districts',
        status: 'Active MoU with Education Dept.'
      },
      {
        id: 'rajasthan',
        name: 'Rajasthan',
        lat: 27.0238,
        lng: 74.2179,
        schools: '32,500+',
        children: '34,00,000+',
        teachers: '72,000+',
        districts: '33 Districts',
        status: 'Statewide Smart Shala Rollout'
      },
      {
        id: 'uttar-pradesh',
        name: 'Uttar Pradesh',
        lat: 26.8467,
        lng: 80.9462,
        schools: '45,000+',
        children: '58,00,000+',
        teachers: '1,10,000+',
        districts: '75 Districts',
        status: 'Nipun Bharat Mission Partner'
      },
      {
        id: 'uttarakhand',
        name: 'Uttarakhand',
        lat: 30.0668,
        lng: 79.0193,
        schools: '11,400+',
        children: '9,20,000+',
        teachers: '24,000+',
        districts: '13 Districts',
        status: 'Primary Education Excellence'
      },
      {
        id: 'chhattisgarh',
        name: 'Chhattisgarh',
        lat: 21.2787,
        lng: 81.8661,
        schools: '21,800+',
        children: '22,40,000+',
        teachers: '48,000+',
        districts: '28 Districts',
        status: 'Tribal & Rural School Outreach'
      },
      {
        id: 'himachal',
        name: 'Himachal Pradesh',
        lat: 31.1048,
        lng: 77.1734,
        schools: '9,600+',
        children: '6,80,000+',
        teachers: '18,500+',
        districts: '12 Districts',
        status: 'Digital TV Classroom Project'
      },
      {
        id: 'maharashtra',
        name: 'Maharashtra',
        lat: 19.7515,
        lng: 75.7139,
        schools: '16,700+',
        children: '21,00,000+',
        teachers: '42,000+',
        districts: '36 Districts',
        status: 'Foundational Numeracy Drive'
      },
      {
        id: 'jharkhand',
        name: 'Jharkhand',
        lat: 23.6102,
        lng: 85.2799,
        schools: '18,300+',
        children: '19,50,000+',
        teachers: '36,000+',
        districts: '24 Districts',
        status: 'Smart Kit Pedagogy Program'
      }
    ];

    // Custom Icon Generator
    const createCustomIcon = () => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="custom-map-pin"><i class="fa-solid fa-graduation-cap"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30]
      });
    };

    const markers = {};

    stateHubs.forEach((state) => {
      const marker = L.marker([state.lat, state.lng], { icon: createCustomIcon() }).addTo(map);

      const popupContent = `
        <div class="map-popup-card">
          <h4>${state.name}</h4>
          <div class="map-popup-stat"><span>Schools Transformed:</span> <strong>${state.schools}</strong></div>
          <div class="map-popup-stat"><span>Children Benefited:</span> <strong>${state.children}</strong></div>
          <div class="map-popup-stat"><span>Teachers Trained:</span> <strong>${state.teachers}</strong></div>
          <div class="map-popup-stat"><span>Coverage:</span> <strong>${state.districts}</strong></div>
          <p style="margin-top: 8px; font-size: 0.75rem; color: #059669; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${state.status}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      markers[state.id] = marker;
    });

    // Sidebar state card click interaction
    const stateCards = document.querySelectorAll('.state-item-card');
    stateCards.forEach((card) => {
      card.addEventListener('click', () => {
        stateCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const stateId = card.getAttribute('data-state-id');
        const targetState = stateHubs.find(s => s.id === stateId);
        if (targetState && markers[stateId]) {
          map.flyTo([targetState.lat, targetState.lng], 7, {
            duration: 1.2
          });
          markers[stateId].openPopup();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Chart.js Data Visualizations
  // --------------------------------------------------------------------------
  const outcomeCtx = document.getElementById('learningOutcomeChart');
  if (outcomeCtx && typeof Chart !== 'undefined') {
    const learningChart = new Chart(outcomeCtx, {
      type: 'bar',
      data: {
        labels: ['Class 1 Math', 'Class 2 Math', 'Class 3 Math', 'Class 1 English', 'Class 2 English', 'Class 3 English'],
        datasets: [
          {
            label: 'Baseline Competency (Before)',
            data: [26, 31, 29, 22, 28, 25],
            backgroundColor: '#CBD5E1',
            borderRadius: 6,
            barPercentage: 0.7
          },
          {
            label: 'Endline Competency (With Smart Shala)',
            data: [78, 84, 81, 74, 82, 79],
            backgroundColor: '#0F52BA',
            borderRadius: 6,
            barPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
              color: '#334155'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}% Mastery`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: value => value + '%',
              color: '#64748B'
            },
            grid: {
              color: '#F1F5F9'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#334155', font: { weight: '600' } }
          }
        }
      }
    });

    // Toggle Chart Types / Filters
    const outcomeToggleBtns = document.querySelectorAll('[data-chart-filter]');
    outcomeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        outcomeToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-chart-filter');
        if (filter === 'math') {
          learningChart.data.labels = ['Class 1 Math', 'Class 2 Math', 'Class 3 Math', 'Class 4 Math', 'Class 5 Math'];
          learningChart.data.datasets[0].data = [26, 31, 29, 34, 30];
          learningChart.data.datasets[1].data = [78, 84, 81, 86, 83];
        } else if (filter === 'english') {
          learningChart.data.labels = ['Class 1 English', 'Class 2 English', 'Class 3 English', 'Class 4 English', 'Class 5 English'];
          learningChart.data.datasets[0].data = [22, 28, 25, 29, 27];
          learningChart.data.datasets[1].data = [74, 82, 79, 81, 78];
        } else {
          learningChart.data.labels = ['Class 1 Math', 'Class 2 Math', 'Class 3 Math', 'Class 1 English', 'Class 2 English', 'Class 3 English'];
          learningChart.data.datasets[0].data = [26, 31, 29, 22, 28, 25];
          learningChart.data.datasets[1].data = [78, 84, 81, 74, 82, 79];
        }
        learningChart.update();
      });
    });
  }

  // Growth Trajectory Line Chart
  const trajectoryCtx = document.getElementById('growthTrajectoryChart');
  if (trajectoryCtx && typeof Chart !== 'undefined') {
    new Chart(trajectoryCtx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026 (Target)'],
        datasets: [
          {
            label: 'Children Enrolled (Lakhs)',
            data: [25, 45, 70, 95, 120, 150, 200],
            borderColor: '#FF6B00',
            backgroundColor: 'rgba(255, 107, 0, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#FF6B00',
            pointRadius: 5
          },
          {
            label: 'Schools Equipped (Thousands)',
            data: [15, 30, 52, 78, 98, 125, 160],
            borderColor: '#0F52BA',
            backgroundColor: 'rgba(15, 82, 186, 0.05)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0F52BA',
            pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
              color: '#334155'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#334155', font: { weight: '600' } }
          }
        }
      }
    });
  }
});
