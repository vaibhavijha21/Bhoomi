// Dashboard interactions, demo data, and charts

(function() {
  const dischargeEl = document.getElementById('kpiDischarge');
  const rainEl = document.getElementById('kpiRain');
  const dischargeDeltaEl = document.getElementById('kpiDischargeDelta');
  const rainDeltaEl = document.getElementById('kpiRainDelta');

  // Demo values (replace with real API later)
  const demo = {
    discharge: 1420, // cumecs
    dischargeDelta: 4.2,
    rainfall24h: 18, // mm
    stationsOnline: 12,
    alerts: 1
  };

  if (dischargeEl) dischargeEl.textContent = `${demo.discharge.toLocaleString()} m³/s`;
  if (dischargeDeltaEl) dischargeDeltaEl.textContent = `+${demo.dischargeDelta}%`;
  if (rainEl) rainEl.textContent = `${demo.rainfall24h} mm`;
  if (rainDeltaEl) rainDeltaEl.textContent = `${demo.rainfall24h} mm`;
  // Removed Stations Online and Alerts KPIs

  // Charts
  const ctxDischarge = document.getElementById('chartDischarge');
  const ctxRainVsFlow = document.getElementById('chartRainVsFlow');
  const ctxGauge = document.getElementById('chartGauge');

  // Generate demo time series for 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return `${d.getDate()}/${d.getMonth()+1}`;
  });
  const dischargeSeries = days.map((_, i) => 1100 + Math.round(Math.sin(i/3) * 120 + Math.random()*80));
  const rainfallSeries = days.map((_, i) => Math.max(0, Math.round(12 + Math.cos(i/2) * 8 + Math.random()*6)));

  if (ctxDischarge) {
    new Chart(ctxDischarge, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Discharge (m³/s)',
          data: dischargeSeries,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.15)',
          tension: 0.35,
          fill: true,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#eef2f7' }, ticks: { callback: v => v + ' m³/s' } }
        }
      }
    });
  }

  if (ctxRainVsFlow) {
    new Chart(ctxRainVsFlow, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          {
            type: 'line',
            label: 'Discharge (m³/s)',
            data: dischargeSeries,
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14,165,233,0.15)',
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: 'Rainfall (mm)',
            data: rainfallSeries,
            backgroundColor: 'rgba(99,102,241,0.35)',
            borderRadius: 6,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { position: 'left', grid: { color: '#eef2f7' }, ticks: { callback: v => v + ' m³/s' } },
          y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => v + ' mm' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  if (ctxGauge) {
    // Simple gauge-like doughnut for Flood Risk Index
    const risk = 0.38; // 0..1
    new Chart(ctxGauge, {
      type: 'doughnut',
      data: {
        labels: ['Risk', 'Remaining'],
        datasets: [{
          data: [risk, 1 - risk],
          backgroundColor: ['#f59e0b', '#e5e7eb'],
          borderWidth: 0,
          circumference: 220,
          rotation: 250,
          cutout: '70%'
        }]
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
  }

  // Filters (demo no-op)
  const applyBtn = document.getElementById('applyFilters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Placeholder: wire to data reload
      applyBtn.textContent = 'Applied ✓';
      setTimeout(() => (applyBtn.textContent = 'Apply'), 1000);
    });
  }

  // Export (basic PNG export of charts area)
  document.getElementById('exportReport')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.print();
  });
})();


