
# Custom Visualization: How Weather Changes in Washington DC?

**Author:** Shaily Roy  
**ASURITE ID:** shailyro  
**Email:** shailyro@asu.edu  
**Course:** Homework #4: Custom Visualization in D3.js  

---

## Overview

This project presents a **custom combinatorial visualization** that illustrates **weather changes** in Washington, DC, using historical weather data for the year 2016. The visualization is designed for a museum exhibit, making it both **visually engaging** and **informative** to visitors.  

---

## Design Concept  

The visualization explores **temperature, humidity, and precipitation trends** over time, while also allowing users to interactively filter by **year** and **month**.  

The design combines **scatter plots**, **custom glyphs**, and **interaction techniques** to create a rich exploration experience.  

1. **Marks**:  
   - Each data point is represented as a **glyph** with color, size, opacity, and brightness encodings.  

2. **Channels**:  
   - **Y-axis**: Temperature (°C)  
   - **Color**: Seasons (Winter, Spring, Summer, Fall)  
   - **Size**: Humidity levels  
   - **Opacity**: Precipitation  
   - **Brightness**: Temperature intensity  

3. **Interactions**:  
   - **Hover Tooltips**: Detailed data on temperature, humidity, precipitation, and season for each point.  
   - **Filter Slider**: Allows filtering by **year**.  
   - **Month Selector**: Users can filter data to explore trends for specific months.  

4. **Custom Visualization Category**:  
   - This design is classified as **Combinatorial** because it integrates multiple visualization techniques, such as scatter plots, glyphs, tooltips, and dynamic filters.  

---

## Features  

1. **Interactive Scatter Plot**:  
   - Displays weather data across months of 2016.  
   - Glyphs are used to represent weather attributes with clear encoding.  

2. **Dynamic Filtering**:  
   - A slider and month selector allow users to filter and focus on specific time ranges.  

3. **Tooltips**:  
   - Provides additional context about each data point (date, temperature, humidity, and precipitation).  

4. **Custom Glyphs**:  
   - Combines color, size, opacity, and brightness for multiple attribute encodings.  

---

## File Structure  

- **index.html**: The main HTML file that includes the structure and content of the exhibit.  
- **shailyro.js**: D3.js script file for generating the visualization and enabling interactions.  
- **shailyro.css**: CSS file for styling the page.  
- **Screenshot.png**: Screenshot of the final visualization.  
- **data/weather_2016.csv**: Dataset used for this project (subset of Washington DC historical weather data).  

---

## Original Inspiration and Modifications  

This visualization was inspired by scatter plots and glyph techniques. I significantly modified these approaches to include:  
- Interactive filters (slider and dropdown).  
- Multi-attribute encoding using size, color, opacity, and brightness.  
- Customized tooltips for detailed exploration.  

---

## Instructions to Run  

1. Download all project files and store them in the same folder.  
2. Open the **index.html** file in any modern web browser (e.g., Chrome, Firefox).  
3. Interact with the visualization using the year filter and month selector. Hover over the data points for detailed insights.  

---

## Acknowledgments  

- **Dataset Source**: Historical weather data for Washington DC.  
- **Inspiration**: D3 scatter plot examples and glyph techniques.  
- **Libraries Used**: D3.js v7  

---
