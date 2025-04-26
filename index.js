import { fetchJSON, renderProjects, fetchGitHubData} from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('crepusidiem');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  const stats = [
    { label: "Followers", value: githubData.followers },
    { label: "Following", value: githubData.following },
    { label: "Public Repos", value: githubData.public_repos },
    { label: "Public Gists", value: githubData.public_gists }
  ];

  profileStats.innerHTML = `
    <h2>My GitHub Stats</h2>
    <div class="stats-grid">
      ${stats.map(stat => `
        <div class="stat-block">
          <div class="stat-label">${stat.label.toUpperCase()}</div>
          <div class="stat-value">${stat.value}</div>
        </div>
      `).join('')}
    </div>
  `;
}

