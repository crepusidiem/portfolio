import { fetchJSON, renderProject } from "../global.js";

function renderProjects(projects, containerElement, headingLevel) {
  // Iterate through projects and render each project using renderProject function
  projects.forEach((project) => {
    containerElement.innerHTML = ''; // Clear the container before appending new projects
    const projectElement = renderProject(project, containerElement, headingLevel); // Pass the containerElement to renderProject to append an article
  });
}
// Fetch the projects data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

