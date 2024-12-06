const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("background-color", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("padding", "5px 10px")
  .style("border-radius", "4px")
  .style("visibility", "hidden")
  .style("pointer-events", "none");

let dataset;
let currentSeason = "all";
let currentYear = "2015";
const seasonShapes = {
    Spring: "M15 6 C16.5 3, 19.5 3, 21 6 Q22.5 10.5, 18 12 Q22.5 13.5, 21 18 C19.5 21, 16.5 21, 15 18 C13.5 21, 10.5 21, 9 18 Q7.5 13.5, 12 12 Q7.5 10.5, 9 6 C10.5 3, 13.5 3, 15 6 Z", // Cherry Blossom
    Summer: "M15 7.5 A7.5 7.5 0 1 1 15 22.5 A7.5 7.5 0 1 1 15 7.5 M15 0 L16.5 6 L13.5 6 Z M22.5 7.5 L18 9.75 L20.25 6 Z M30 15 L24 16.5 L24 13.5 Z M22.5 22.5 L20.25 20.25 L18 24 Z M15 30 L16.5 24 L13.5 24 Z M7.5 22.5 L9.75 20.25 L6 18 Z M0 15 L6 13.5 L6 16.5 Z M7.5 7.5 L9.75 9.75 L6 12 Z", // Sun
    Fall: "M18 0 L19.5 6 L24 6 L21 10.5 L25.5 12 L22.5 15 L24 19.5 L18 18 L16.5 22.5 L15 18 L9 19.5 L10.5 15 L7.5 12 L12 10.5 L9 6 L13.5 6 Z", // Leaf
    Winter: "M15 3 L15.75 7.5 L18 9 L16.5 10.5 L18 13.5 L15 12 L12 13.5 L13.5 10.5 L12 9 L14.25 7.5 L15 3 M15 27 L15 22.5 L12.75 21 L13.5 19.5 L12 16.5 L15 18 L18 16.5 L16.5 19.5 L17.25 21 L15 22.5 L15 27 M3 15 L7.5 15.75 L9 18 L10.5 16.5 L13.5 18 L12 15 L13.5 12 L10.5 13.5 L9 12 L7.5 14.25 L3 15 M27 15 L22.5 15.75 L21 18 L19.5 16.5 L16.5 18 L18 15 L16.5 12 L19.5 13.5 L21 12 L22.5 14.25 L27 15", // Snowflake
  };
  

d3.csv("data/dc_weather.csv").then((data) => {
  data.forEach((d) => {
    d.datetime = new Date(d.datetime);
    d.temp = +d.temp;
    d.precip = +d.precip;
    d.humidity = +d.humidity;
    d.season = getSeason(d.datetime);
    d.year = d.datetime.getFullYear();
  });
  dataset = data;
  updateVisualization("2015", "all"); 
});
const yAxisLabels = {
    temp: "Temperature (°C)",
    humidity: "Humidity (%)",
    precip: "Precipitation (mm)"
  };
  
function getSeason(date) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}






function updateVisualization(selectedYear, selectedSeason) {
  const filteredData = dataset.filter((d) => {
    const yearCondition = selectedYear === "all" || d.year === +selectedYear;
    const seasonCondition = selectedSeason === "all" || d.season === selectedSeason;
    return yearCondition && seasonCondition;
  });
  drawScatterPlot(filteredData);
  const currentMonth = +d3.select("#month-slider").property("value");
  updateYearlyGraphs(currentMonth);
}
function drawScatterPlot(data) {
  const container = d3.select("#chart");
  const width = container.node().clientWidth;
  const height = container.node().clientHeight;
  const margin = { top: 50, right: 50, bottom: 60, left: 70 };

  const svg = container.selectAll("svg").data([null]);
  const svgEnter = svg
    .enter()
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const mergedSvg = svgEnter.merge(svg);
  mergedSvg.selectAll(".x-axis-label, .y-axis-label").remove();
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.datetime))
    .range([margin.left, width - margin.right]);

    const yDomain = d3.extent(data, (d) => d[currentYAxisAttribute]); 
    const yPadding = (yDomain[1] - yDomain[0]) * 0.1; 
    
    const yScale = d3
      .scaleLinear()
      .domain([yDomain[0] - yPadding-1, yDomain[1] + yPadding])
      .range([height - margin.bottom, margin.top]);
    

  const xAxis = mergedSvg
    .selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat(currentYear === "all" ? "%Y" : "%b %Y")));


  const yAxis = mergedSvg
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .transition()
    .duration(1000)
    .call(d3.axisLeft(yScale));


  mergedSvg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 4)
    .style("text-anchor", "middle")
    .style("fill", "white") 
    .text("Year" + (currentYear === "all" ? "" : " and Month"));


  mergedSvg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -height / 2)
    .attr("y", margin.left / 4)
    .style("text-anchor", "middle")
    .style("fill", "white")  
    .attr("transform", "rotate(-90)")
    .text(yAxisLabels[currentYAxisAttribute]);


  const glyphs = mergedSvg.selectAll(".glyph").data(data, (d) => d.datetime);

//   const tooltip = d3.select("#tooltip");

  glyphs
    .enter()
    .append("path")
    .attr("class", "glyph")
    .attr("d", (d) => seasonShapes[d.season])
    .attr("transform", (d) => `translate(${xScale(d.datetime)}, ${yScale(d[currentYAxisAttribute])}) scale(0)`) 
    .attr("fill", (d) => getColor(d.season, d.temp))
    .attr("stroke", "black")
    .attr("opacity", (d) => d.precip / 20)
    .attr("stroke-width", 1)
    .merge(glyphs)
    .on("mouseover", (event, d) => {
      tooltip
        .html(`
            <strong>Date:</strong> ${d.datetime.toDateString()}<br>
            <strong>Temperature:</strong> ${d.temp}°C<br>
            <strong>Precipitation:</strong> ${d.precip}mm<br>
            <strong>Humidity:</strong> ${d.humidity}%<br>
            <strong>Season:</strong> ${d.season}
        `)
        .style("visibility", "visible")
        .style("top", `${event.pageY + 10}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"))
    .on("click", (event, d) => {
      drawLollipopChart(d);
    })
    .transition()
    .duration(1000)
    .attr("transform", (d) => `translate(${xScale(d.datetime)}, ${yScale(d[currentYAxisAttribute])}) scale(${(d.humidity / 60)})`); // Size based on humidity

  glyphs.exit().transition().duration(500).attr("transform", "scale(0)").remove();

//lasso doesnt work but keeping it because not hurting
const lasso = d3
  .lasso()
  .closePathSelect(true)
  .closePathDistance(50)
  .items(mergedSvg.selectAll(".glyph"))
  .targetArea(mergedSvg);

lasso
  .on("start", () => {
    mergedSvg
      .selectAll(".glyph")
      .classed("not-selected", true)
      .classed("selected", false)
      .attr("opacity", 0.6); 
  })
  .on("draw", () => {
    lasso
      .items()
      .classed("selected", (d) => d.selected)
      .classed("not-selected", (d) => !d.selected)
      .attr("opacity", (d) => (d.selected ? 1 : 0.6));
  })
  .on("end", () => {
    const selectedData = lasso.items().filter((d) => d.selected).data();
    if (selectedData.length > 0) {
      drawLollipopChart(selectedData); 
    }
  });

mergedSvg.call(lasso);

 // legend
d3.select(".legend").remove();
const legend = d3.select("#chart").append("div").attr("class", "legend");

Object.keys(seasonShapes).forEach((season) => {
  legend
    .append("div")
    .attr("class", "legend-item")
    .html(
      `<svg width="20" height="10">
         <path d="${seasonShapes[season]}" 
               fill="${getColor(season, 20)}" 
               stroke="black" stroke-width="0.5"></path>
       </svg>
       <span>${season}</span>`
    );
});


  legend
    .append("div")
    .attr("class", "legend-item")
    .html(
      `<span class="legend-color" style="background-color:gray; opacity:0.7;"></span>Size: Represents Humidity`);

  legend
    .append("div")
    .attr("class", "legend-item")
    .html(
      `<span class="legend-color" style="background-color:gray; opacity:0.5;"></span>Opacity: Represents Precipitation`);
}

// // Get color for season
// function getColor(season, temp) {
//   const baseColor = {
//     Spring: "pink",
//     Summer: "#ffd700",
//     Fall: "#F93800",
//     Winter: "#6495ed"
//   }[season];
//   const brightness = Math.min(1, Math.max(0.5, temp / 40)); // Adjust brightness based on temperature value
//   return d3.color(baseColor).brighter(brightness);
// }


function getColor(season, temp) {

    const gradientColors = {
        Spring: ["#FFB7C5", "#FFF3F0"], // Soft pink to light peach
        Summer: ["#FFD700", "#FFF89A"], // Golden yellow to pale yellow
        Fall: ["#FF7F50", "#FF4500"],   // Coral to deep orange
        Winter: ["#ADD8E6", "#E0FFFF"], // Light blue to pale icy blue
      };
    const gradientId = `${season}-gradient`;

    if (!d3.select(`#${gradientId}`).node()) {
      const defs = d3.select("svg").append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", gradientColors[season][0]);
  
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", gradientColors[season][1]);
    }

    const brightness = Math.min(1, Math.max(0.5, temp / 40));
    d3.select(`#${gradientId}`).attr("opacity", brightness);

    return `url(#${gradientId})`;
  }
let currentYAxisAttribute = "temp"; 
d3.select("#y-axis-dropdown").on("change", function () {
    currentYAxisAttribute = this.value; 
    updateVisualization(currentYear, currentSeason); 
    updateYearlyGraphs(+d3.select("#month-slider").property("value")); 
  });
  
  d3.select("#year-slider")
  .attr("min", "2015") 
  .attr("max", "2025") 
  .attr("step", "1")   
  .attr("value", "2015"); 

d3.select("#year-slider").on("input", function () {
  const yearValue = this.value;
  currentYear = yearValue === "2025" ? "all" : yearValue;
  d3.select("#year-value").text(currentYear === "all" ? "All Years" : currentYear);
  updateVisualization(currentYear, currentSeason);
});
d3.select("#year-value").text("2015"); 


d3.select("#legend").html("");


const legend = d3.select("#legend").append("div").attr("class", "legend");

legend.append("div").html(`<strong></strong>`);


Object.keys(seasonShapes).forEach((season) => {
    legend
      .append("div")
      .attr("class", "legend-item")
      .html(
        `<svg width="30" height="30" viewBox="0 0 40 40" style="margin-right:0px; vertical-align:middle;">
           <path d="${seasonShapes[season]}" 
                 fill="${getColor(season, 20)}" 
                 stroke="black" stroke-width="0.5"></path>
         </svg>
         <span>${season}</span>`
      );
  });
  
legend
  .append("div")
  .html(
    `<span class="legend-color" style="width:15px; height:15px; border-radius:50%; display:inline-block;"></span> Size: Humidity`
  );

legend
  .append("div")
  .html(
    `<span class="legend-color" style="width:15px; height:15px; opacity:0.5; display:inline-block;"></span> Opacity: Precipitation`
  );

legend
  .append("div")
  .html(
    `<span class="legend-color" style="width:15px; height:15px; display:inline-block;"></span> Brightness: Temperature`
  );


d3.selectAll("#season-buttons button").on("click", function () {
  currentSeason = this.dataset.season;
  d3.selectAll("#season-buttons button").classed("active", false);
  d3.select(this).classed("active", true);
  updateVisualization(currentYear, currentSeason);
});

function updateGlowColor(month) {
    const monthSeasonColors = {
      Spring: "rgb(255, 182, 193)", // Baby pink
      Summer: "rgb(255, 223, 0)",   // Golden yellow
      Fall: "rgb(255, 69, 0)",      // Deep orange
      Winter: "rgb(173, 216, 230)"  // Light blue
    };
  
    const season = getSeasonForBackground(month);
    const glowColor = monthSeasonColors[season];
  

    d3.select("#description-text")
      .style("color", glowColor)
      .style(
        "text-shadow",
        `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`
      )
      .style("animation", "glow 2s infinite alternate"); 
  }
  


const monthSliderContainer = document.getElementById('month-slider-container');


window.addEventListener('scroll', () => {
  const offsetTop = monthSliderContainer.offsetTop; 
  const scrollY = window.scrollY; 
  if (scrollY >= offsetTop) {
    monthSliderContainer.classList.add('floating'); 
  } else {
    monthSliderContainer.classList.remove('floating'); 
  }
});



function makeMonthSliderFloating() {
    const monthSliderContainer = document.getElementById("month-slider-container");

    if (!monthSliderContainer) {
        console.error("Month slider container not found.");
        return;
    }


    const calculateOffset = () =>
        monthSliderContainer.getBoundingClientRect().top + window.scrollY;

    let initialOffsetTop = calculateOffset();
    window.addEventListener("resize", () => {
        initialOffsetTop = calculateOffset();
    });


    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        if (scrollY >= initialOffsetTop) {

            monthSliderContainer.style.position = "fixed";
            monthSliderContainer.style.top = "10px";
            monthSliderContainer.style.right = "20px";
            monthSliderContainer.style.zIndex = "1000";
            monthSliderContainer.style.backgroundColor = "rgba(30, 30, 47, 0.9)";
            monthSliderContainer.style.padding = "10px";
            monthSliderContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
        } else {
            monthSliderContainer.style.position = "relative";
            monthSliderContainer.style.top = "unset";
            monthSliderContainer.style.right = "unset";
            monthSliderContainer.style.zIndex = "auto";
            monthSliderContainer.style.backgroundColor = "transparent";
            monthSliderContainer.style.boxShadow = "none";
        }
    });
}


function addYearlyGraphs() {
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const seasonsImages = {
        Spring: "./img/spring.png",
        Summer: "./img/summer.png",
        Fall: "./img/fall.png",
        Winter: "./img/winter2.jpg",
    };

    // yearly graphs
    d3.select("#visualization-container")
        .insert("div", "#yearly-graphs")
        .attr("id", "description")
        .style("text-align", "center")
        .style("margin-top", "50px") 
        .style("margin-bottom", "50px") 
        .html(
            "<p id='description-text' style='font-style: italic;'> This visualization leverages <strong>marks</strong> (glyphs and paths) and <strong>channels</strong> (color, size, and opacity) to represent temperature, humidity, and precipitation trends. Interaction features include hover tooltips for detailed data points.This visualization is classified as Combinatorial because it combines multiple established visualization techniques (scatter plots, glyphs, and tooltips) to provide a rich, interactive exploration experience. Each of the next 8 graphs shows weather patterns for different years based on the selected month and attribute.</p>"
        );


    updateGlowColor(0);

    const monthSliderContainer = d3
        .select("#visualization-container")
        .insert("div", "#yearly-graphs")
        .attr("id", "month-slider-container")
        .style("position", "relative")
        .style("margin-top", "20px")
        .style("float", "right") 
        .style("text-align", "left") 
        .style("padding", "10px")
        // .style("background-color", "rgba(255, 255, 255, 0.9)") 
        .style("border-radius", "8px") 
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)"); 
    makeMonthSliderFloating();
    monthSliderContainer
        .append("label")
        .attr("for", "month-slider")
        .text("Select Month:");

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    monthSliderContainer
        .append("input")
        .attr("type", "range")
        .attr("id", "month-slider")
        .attr("min", "0")
        .attr("max", "11")
        .attr("step", "1")
        .attr("value", "0"); 

    monthSliderContainer
        .append("span")
        .attr("id", "month-value")
        .text(monthNames[0]); 

        d3.select("#month-slider").on("input", function () {
            const selectedMonth = +this.value; 
          
            d3.select("#month-value").text(monthNames[selectedMonth]);

            const season = getSeasonForBackground(selectedMonth);
            d3.select("#seasonal-image").attr("src", seasonsImages[season]);

            updateGlowColor(selectedMonth);

            updateYearlyGraphs(selectedMonth);
        });


    const seasonalImageContainer = d3
        .select("#visualization-container")
        .insert("div", "#month-slider-container")
        .attr("id", "seasonal-image-container")
        .style("margin", "10px 0");

    seasonalImageContainer
        .append("img")
        .attr("id", "seasonal-image")
        .attr("src", seasonsImages["Winter"]) 
        .style("width", "80%")
        .style("max-width", "300px")
        .style("opacity", 0.6) 
        .style("border", "2px solid #ccc")
        .style("border-radius", "10px");

    const graphContainer = d3
        .select("#visualization-container")
        .append("div")
        .attr("id", "yearly-graphs");

    years.forEach((year) => {
        const yearDiv = graphContainer
            .append("div")
            .attr("id", `chart-${year}`)
            .attr("class", "year-chart");

        yearDiv
            .append("h3")
            .text(`Year: ${year}`)
            .style("text-align", "center");
    });

    updateYearlyGraphs(0); 
    
    
}



// d3.select("#visualization-container")
//   .append("div")
//   .attr("id", "info-box")
//   .style("margin-top", "20px")
//   .style("padding", "20px")
//   .style("background-color", "white")
//   .style("color", "black")
//   .style("border", "2px solid black")
//   .style("border-radius", "10px")
//   .style("box-shadow", "2px 2px 10px rgba(0, 0, 0, 0.2)")
//   .style("text-align", "center")
//   .html(`
//     <h1 style="margin-bottom: 10px;">How weather changes in Washington DC?</h1>
//     <p style="font-size: 14px; font-style: italic; margin: 0;">
//           </p>
//     <h3 style="margin-top: 15px;">Custom Visualization Category: <span style="font-weight: bold;">Combinatorial</span></h3>
//     <p style="font-size: 14px; font-style: italic;">
//       This visualization is classified as "Combinatorial" because it combines multiple established visualization techniques (scatter plots, glyphs, and tooltips) to provide a rich, interactive exploration experience.
//     </p>
//   `);

function getSeasonForBackground(month) {
    if (month >= 2 && month <= 4) return "Spring"; // March, April, May
    if (month >= 5 && month <= 7) return "Summer"; // June, July, August
    if (month >= 8 && month <= 10) return "Fall";  // September, October, November
    return "Winter"; // December, January, February
}

function updateYearlyGraphs(selectedMonth) {
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    

    const seasonsImages = {
        Spring: "./img/spring.png",
        Summer: "./img/summer.png",
        Fall: "./img/fall.png",
        Winter: "./img/winter3.png",
    };
    // const season = getSeasonForBackground(selectedMonth);
    //d3.select("#seasonal-image").attr("src", seasonsImages[season]);


    years.forEach((year) => {
        const filteredData = dataset.filter(
            (d) => d.year === year && d.datetime.getMonth() === selectedMonth
        );
        drawScatterPlotForYear(filteredData, year);
    });
}

function drawScatterPlotForYear(data, year) {
    const container = d3.select(`#chart-${year}`);
    const width = container.node().clientWidth;
    const height = 400; // Fixed height for all year graphs
    const margin = { top: 50, right: 50, bottom: 100, left: 70 };

container.selectAll("svg").remove();


    // container.style("background-color", "#f5f5f5"); 

    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.datetime))
        .range([margin.left, width - margin.right]);

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d[currentYAxisAttribute])-1, d3.max(data, (d) => d[currentYAxisAttribute])])
        .range([height - margin.bottom, margin.top]);
      
    //  x-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 4)
        .style("text-anchor", "middle")
        .style("fill", "white") 
        .text("Day of Month");

    //  y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", margin.left / 4)
        .style("text-anchor", "middle")
        .style("fill", "white") 
        .attr("transform", "rotate(-90)")
        .text(yAxisLabels[currentYAxisAttribute]);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d")));

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));


    const glyphs = svg.selectAll(".glyph").data(data);

    glyphs
  .enter()
  .append("path")
  .attr("class", "glyph")
  .attr("d", (d) => seasonShapes[d.season])
  .attr("transform", (d) => 
      `translate(${xScale(d.datetime)}, ${yScale(d[currentYAxisAttribute])}) scale(${d.humidity / 60})`
  ) // Scale based on humidity
  .attr("fill", (d) => getColor(d.season, d.temp)) // Color depends on temperature and season
  .attr("stroke", "black")
  .attr("opacity", (d) => (d.precip / 50)*20) // Transparency based on precipitation
  .attr("stroke-width", 1)
  .on("mouseover", (event, d) => {
    tooltip
      .html(`
        <strong>Date:</strong> ${d.datetime.toDateString()}<br>
        <strong>Temperature:</strong> ${d.temp}°C<br>
        <strong>Precipitation:</strong> ${d.precip}mm<br>
        <strong>Humidity:</strong> ${d.humidity}%<br>
        <strong>Season:</strong> ${d.season}
      `)
      .style("visibility", "visible")
      .style("top", `${event.pageY + 10}px`)
      .style("left", `${event.pageX + 10}px`);
  })
  .on("mouseout", () => tooltip.style("visibility", "hidden"));


    svg.selectAll(".y-axis").remove(); 
    svg.selectAll(".y-axis-label").remove(); 
    
}
  



updateGlowColor(0); // Default to January

addYearlyGraphs();
document.addEventListener("DOMContentLoaded", () => {
    addYearlyGraphs();
});