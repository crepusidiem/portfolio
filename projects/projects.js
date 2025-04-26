import { fetchJSON, renderProject } from "../global.js";

function renderProjects(projects, containerElement, headingLevel) {
  // Iterate through projects and render each project using renderProject function
  projects.forEach((project) => {
    containerElement.innerHTML = ''; // Clear the container before appending new projects
    const projectElement = renderProject(project, containerElement, headingLevel);
    containerElement.appendChild(projectElement);
  });
}
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

