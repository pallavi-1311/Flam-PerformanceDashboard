readme
# 🚀 Performance-Critical Data Visualization Dashboard

A high-performance **real-time data visualization dashboard** built using **Next.js 14 (App Router) + TypeScript**.  
It can smoothly render and update **10,000+ data points at 60 FPS**, optimized for **low-latency streaming**, **interactive charts**, and **efficient resource usage**.

---

## 📊 Features

### 🔹 Core Functionalities
- **Multiple Chart Types:** Line, Bar, Scatter, and Heatmap  
- **Real-time Updates:** New data points generated every 100ms  
- **Interactive Controls:** Zoom, Pan, Data Filtering, and Time Range Selection  
- **Data Aggregation:** Group by `1min`, `5min`, `1hour`  
- **Virtual Scrolling:** Efficient rendering for large data tables  
- **Responsive Design:** Optimized for desktop, tablet, and mobile  

### 🔹 Performance Targets
- 🏎 60 FPS rendering even with 10,000+ points  
- ⚡ <100ms user interaction latency  
- 💾 Stable memory usage with continuous streaming  
- 🔄 Efficient use of `Web Workers` for data generation  

---

## 🧠 Technical Stack

| Layer | Technology Used |
|-------|------------------|
| Framework | **Next.js 14+ (App Router)** |
| Language | **TypeScript** |
| State Management | **React Hooks + Context API** |
| Rendering | **Canvas + SVG Hybrid** |
| Performance | **Web Workers**, **OffscreenCanvas** |
| Data | Custom time-series simulation |
| Build Optimization | **SWC Minify**, **Bundle Analyzer**, **Edge Middleware** |

---

## ⚙️ Setup & Installation

### 1 Clone the project

git clone https://github.com/your-username/performance-dashboard.git
cd performance-dashboard
2 Install dependencies
npm install
3 Run the development server
npm run dev


➡ Open http://localhost:3000/dashboard

4 Build for production
npm run build
npm start
---
## 🧪 Performance Testing InstructionsClone the projec

### Run the app using npm run dev.

Open it in Google Chrome.

Go to DevTools → Performance Tab → Record.

Interact with the dashboard or enable “Stress Mode” from the control panel.

Observe the FPS (frames per second) and memory usage for 30–60 seconds.

## Expected Results:

1 Maintain ~60 FPS during real-time updates

2 Memory usage below 250 MB during extended runs

---
File Structure
performance-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── data/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── charts/ (LineChart, BarChart, ScatterPlot, Heatmap)
│   ├── controls/ (FilterPanel, TimeRangeSelector)
│   ├── ui/ (PerformanceMonitor, DataTable)
│   └── providers/ (DataProvider)
├── hooks/ (useDataStream, usePerformanceMonitor, useChartRenderer)
├── lib/ (dataGenerator, canvasUtils, types)
├── middleware.ts
├── public/
├── next.config.js
├── README.md
└── PERFORMANCE.md
---

##Advanced Next.js Features Implemented

1 Streaming UI with Suspense boundaries

2 Server Actions for data updates

3 Edge Middleware for caching and route optimization

4 Static Generation for chart configuration

5 Route Handlers under /api/data/

6 Web Workers for async data processing
---

### Optimization Techniques

useMemo & useCallback to prevent re-renders

React.memo for heavy components (charts)

Efficient requestAnimationFrame loop for Canvas rendering

useTransition for smooth state updates

Time-series data aggregation to reduce render load

### Future Enhancements

Add dark/light theme support

Enable persistent caching with Service Workers

Integrate WebSocket streaming for live IoT data

Add testing with Jest and React Testing Library










