
#  Performance-Critical Data Visualization Dashboard

A high-performance **real-time data visualization dashboard** built using **Next.js 14 (App Router) + TypeScript**.  
It can smoothly render and update **10,000+ data points at 60 FPS**, optimized for **low-latency streaming**, **interactive charts**, and **efficient resource usage**.

---

##  Features

###  Core Functionalities
- **Multiple Chart Types:** Line, Bar, Scatter, and Heatmap  
- **Real-time Updates:** New data points generated every 100ms  
- **Interactive Controls:** Zoom, Pan, Data Filtering, and Time Range Selection  
- **Data Aggregation:** Group by `1min`, `5min`, `1hour`  
- **Virtual Scrolling:** Efficient rendering for large data tables  
- **Responsive Design:** Optimized for desktop, tablet, and mobile  

###  Performance Targets
- 60 FPS rendering even with 10,000+ points  
- <100ms user interaction latency  
- Stable memory usage with continuous streaming  
- Efficient use of `Web Workers` for data generation  

---

##  Technical Stack

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

##  Setup & Installation

### 1) Clone the project

git clone https://github.com/pallavi-1311/Flam-PerformanceDashboard.git
cd performance-dashboard
### 2)Install dependencies
npm install
### 3) Run the development server
npm run dev


➡ Open http://localhost:3000/dashboard

### 4) Build for production
npm run build
npm start

##  Performance Testing Instructions

### Run the app using npm run dev.

Open it in Google Chrome.

Go to DevTools → Performance Tab → Record.

Interact with the dashboard or enable “Stress Mode” from the control panel.

Observe the FPS (frames per second) and memory usage for 30–60 seconds.
---
##  Browser Compatibility

| Browser | Status | Notes |
|----------|---------|-------|
| **Google Chrome (v120+)** | ✅ | Best overall performance and optimized for V8 engine. Recommended for FPS and memory benchmarking. |
| **Microsoft Edge (v120+)** | ✅ | Similar performance to Chrome. Stable for real-time rendering and stress testing. |
| **Mozilla Firefox (v118+)** | ⚠️ | Slightly reduced FPS during heavy data streaming due to different JavaScript engine handling. |
| **Apple Safari (v17+)** | ⚠️ | Minor lag in Canvas rendering; OffscreenCanvas support partially limited. |

>  **Recommendation:** Use **Google Chrome** or **Microsoft Edge** for the most stable and accurate performance results.


## Expected Results:
## Line Chart (High-Frequency Stream)
<img width="1906" height="874" alt="image" src="https://github.com/user-attachments/assets/3efb5a95-09b4-4c31-a465-ffa67982359e" />

The high-frequency line chart processes ~2,500 streaming points in real time with 0.36 ms render time and perfect 60 FPS, validating the dashboard’s responsive architecture.
<img width="1905" height="874" alt="image" src="https://github.com/user-attachments/assets/dfe2020d-f682-4907-9d30-0e892228d3bf" />
## Bar Chart (Medium Load)

The bar chart visualization runs smoothly with around 10,000 data points, keeping 60 FPS and quick render times (0.13 ms) during real-time streaming updates.
<img width="1912" height="863" alt="image" src="https://github.com/user-attachments/assets/eef88447-f895-4d37-bcac-bf15901dda53" />
## Scatter Plot (Stress Test Mode)

The scatter plot efficiently handles a 50,000-point stress load, maintaining ~51 average FPS and stable memory usage (~53 MB) without frame drops or rendering lag.
<img width="1912" height="867" alt="image" src="https://github.com/user-attachments/assets/35a54825-e55b-40ad-a9ce-bae82700f04b" />
## Line Chart (Aggregated - 5 Minute View)

The line chart under 5-minute aggregation mode shows optimized rendering with minimal data points, achieving instant updates (0.19 ms render time) and constant 60 FPS.
<img width="1918" height="865" alt="image" src="https://github.com/user-attachments/assets/5d8b407d-d58d-4438-8bb0-48c207873393" />
## Heatmap View — Real-Time Streaming

The heatmap visualization efficiently renders over 15,000 live data points at a steady 60 FPS, demonstrating stable real-time streaming and smooth color mapping performance


1) Maintain ~60 FPS during real-time updates

2) Memory usage below 250 MB during extended runs
---

## Advanced Next.js Features Implemented

1) Streaming UI with Suspense boundaries

2) Server Actions for data updates

3) Edge Middleware for caching and route optimization

4) Static Generation for chart configuration

5) Route Handlers under /api/data/

 6) Web Workers for async data processing
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























