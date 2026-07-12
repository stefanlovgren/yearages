# Family Ages Tracker

A modern, client-side web application designed to track and visualize family lifespans and ages across a dynamic timeline.

## Features

- **Visual Timeline**: See your family members' ages mapped across a grid of years. Cells are color-coded based on the person's exact age in that specific year:
  - **Child (0-12)**: Rose
  - **Teenager (13-19)**: Emerald
  - **Young Adult (20-39)**: Blue
  - **Middle Age (40-64)**: Amber
  - **Senior (65+)**: Purple
- **Precise Age Calculations**: Add members using just birth/death years, or provide exact months and days for perfectly precise age tracking.
- **Dynamic Range Controls**: Easily adjust the visible timeline. Use quick presets to jump to important times (e.g., "First Born Year", "This Year").
- **Center Tool**: Focus your view on a specific year and automatically display a set number of years before and after it.
- **Data Management**: All data is saved locally in your browser. You can export your family data to a `.json` file, import existing data, or clear everything.
- **Demo Data**: Quickly load a completely made-up example family to see how the application works.
- **Clean UI**: Built with modern CSS (glassmorphism, vibrant colors, responsive layout) and vanilla JavaScript.

## How to Run

Since this is a client-side only application built with HTML, CSS, and Vanilla JavaScript, you don't need any complex build tools or dependencies. 

Simply serve the directory using any basic HTTP server. For example, if you have Python installed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your web browser.

## Tech Stack

- **HTML5**
- **CSS3** (Vanilla CSS with CSS Variables for easy theming)
- **JavaScript** (ES6+)
- **FontAwesome** (for icons)
- **Google Fonts** (Inter)
