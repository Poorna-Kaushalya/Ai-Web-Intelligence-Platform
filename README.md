# AI Web Intelligence Platform

A modern AI-powered web intelligence system built with **Next.js**, **Tailwind CSS**, and **Recharts**, designed to extract, analyze, and visualize insights from web data through a clean and scalable dashboard interface.

---

## Overview

The AI Web Intelligence Platform is a frontend-driven system that transforms raw web content into structured, interactive insights. It includes reusable UI components for search, visualization, image extraction, and result presentation, making it suitable for AI/ML-powered web analysis pipelines.

---

## Features

- Intelligent search interface for web queries and URL analysis  
- Interactive analytics dashboard using Recharts  
- Image extraction and preview grid with modal viewer  
- Modular and reusable UI components  
- Modern responsive design with Tailwind CSS  
- Semantic design system (background, surface, foreground tokens)  
- Optimised Next.js client components for performance  

---

## Tech Stack

- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** React Icons
- **Language:** TypeScript

---

## Project Structure

```

frontend/
│── src/
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ImageGrid.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── Header.tsx
│   ├── app/
│   └── styles/

````

---

## Key Components

### SearchBar
Handles user input for URLs and queries with loading state support.

### AnalyticsChart
Displays structured data visualizations using bar charts.

### ImageGrid
Renders extracted images in a responsive grid with modal preview and Google Lens integration.

### ResultCard
Displays structured results with title, subtitle, and metadata badges.

### AppShell
Provides global layout structure and consistent UI styling.

---

## Use Cases

- AI-powered web scraping dashboards  
- Research data visualization tools  
- Knowledge extraction systems  
- Smart content analysis platforms  
- Academic or enterprise data intelligence tools  

---

## Installation

```bash
# Clone repository
git clone https://github.com/your-username/ai-web-intelligence-platform.git

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
````

---

## Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```


## Future Improvements

* AI backend integration (LLM-based analysis)
* Advanced web scraping pipeline
* Authentication system
* Export reports (PDF/CSV)
* Dark/light theme toggle
* Real-time data streaming

---

## Author

**Poorna Kaushalya**

Data Science & Software Engineering Enthusiast
Focused on AI systems, ML pipelines, and scalable web applications

---

## License

This project is licensed under the MIT License.

