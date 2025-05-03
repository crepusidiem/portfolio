import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Define the color
let colors = d3.scaleOrdinal(d3.schemeTableau10);
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

let selectedIndex = -1; // Initialize selectedIndex to -1

// Render the projects in the container
const nav = document.querySelector('nav');
const heading = document.createElement('h1');
heading.textContent = projects.length + ' Projects';

if (nav && nav.parentNode) {
  nav.parentNode.insertBefore(heading, nav.nextSibling);
}

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value)
  let newArcData = newSliceGenerator(newData);
  let newArcGenerator = d3.arc().innerRadius(5).outerRadius(50);
  let newArcs = newArcData.map((d) => newArcGenerator(d));
  //clear up paths and legends
  d3.select('svg').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();  
  // update paths and legends
  // draw slices
  newArcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
          // toggle selection
          selectedIndex = selectedIndex === idx ? -1 : idx;

          // update *all* slices
          d3.select('svg').selectAll('path')
            .classed('selected', (_, i) => i === selectedIndex);

          // update *all* legend items
          d3.select('.legend').selectAll('li')
            .classed('selected', (_, i) => i === selectedIndex);
        });
  });

  // draw legend items (no click handler here!)
  const legend = d3.select('.legend')
  newData.forEach((d, idx) => {
    // 1. append the <li> with an empty .swatch
      let li = legend.append('li')
      .html(`
        <span class="swatch"></span>
        ${d.label} <em>(${d.value})</em>
      `);
      li.select('.swatch').style('background-color', colors(idx));
  });
  
  
}

// Call this function on page load
renderPieChart(projects);

// Add a search input to filter projects
let query = '';
let searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (event) => {
  // Delete existing projects
  projectsContainer.innerHTML = '';
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects and pie chart
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});


