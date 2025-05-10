import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    return data;
}

function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
  
        // We can use object destructuring to get these properties
        let { author, date, time, timezone, datetime } = first;
  
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author: author,
          date: date,
          time: time,
          timezone: timezone,
          datetime: datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
          // What other properties might be useful?
        };

        Object.defineProperty(ret, 'lines', {
            value: lines,
            writable: false, // Prevents modification of the lines property
            enumerable: true, // Makes the property show up in loops and JSON.stringify
            configurable: false, // Prevents the property from being deleted or reconfigured
          });

        return ret;
      });
  }

function renderCommitInfo(data, commits) {
    d3.select('body')
        .append('h2')
        .text('Commit Statistics')
        .style('text-align', 'left')
        .style('display', 'flex')
        .style('align-items', 'start')
        .style('width', '88%')
        .style('margin', '2em 0 0.6em 0')
        .style('font-size', '2em')
        .style('font-weight', 'bold')
        .style('color', '#333')
        .style('font-family', 'Baskerville, serif')
        .style('font-variant-numeric', 'oldstyle-nums');
    const container = d3.select('body').append('div').attr('class', 'stats-grid');
    // Create the dl element
    // Add total LOC
    const totalLocBlock = container.append('dl').attr('class', 'stat-block');
    totalLocBlock.append('dt').attr('class', 'stat-label').html('Total <abbr title="Lines of code">LOC</abbr>');
    totalLocBlock.append('dd').attr('class', 'stat-value').text(data.length);

    // Add total commits
    const commitsBlock = container.append('dl').attr('class', 'stat-block');
    commitsBlock.append('dt').attr('class', 'stat-label').text('Commits');
    commitsBlock.append('dd').attr('class', 'stat-value').text(commits.length);

    // Add Number of unique files in the codebase
    const filesBlock = container.append('dl').attr('class', 'stat-block');
    const uniqueFiles = new Set(data.map(d => d.file)).size;
    filesBlock.append('dt').attr('class', 'stat-label').text('Files');
    filesBlock.append('dd').attr('class', 'stat-value').text(uniqueFiles);

    // Add average file length (in lines)
    const avgFileLengthBlock = container.append('dl').attr('class', 'stat-block');
    const avgFileLength = d3.mean(data, d => d.length).toFixed(2);
    avgFileLengthBlock.append('dt').attr('class', 'stat-label').text('Avg. file length (lines)');
    avgFileLengthBlock.append('dd').attr('class', 'stat-value').text(avgFileLength);

    // Add Longest line length
    // const longestLineBlock = container.append('dl').attr('class', 'stat-block');
    // const longestLine = d3.max(data, d => d.length);
    // longestLineBlock.append('dt').attr('class', 'stat-label').text('Longest line length');
    // longestLineBlock.append('dd').attr('class', 'stat-value').text(longestLine);

    // Add Day of the week that most work is done
    const dayOfWeekBlock = container.append('dl').attr('class', 'stat-block');
    const dayOfWeek = d3.timeFormat('%A')(d3.max(data, d => d.datetime));
    dayOfWeekBlock.append('dt').attr('class', 'stat-label').text('Most work done on');
    dayOfWeekBlock.append('dd').attr('class', 'stat-value').text(dayOfWeek);
    
}

function renderScatterPlot(data, commits) {

  function createBrushSelector(svg) {
    svg.call(d3.brush().on('start brush end', brushed));
    // Raise dots and everything after overlay
    svg.selectAll('.dots, .overlay ~ *').raise();
  }

  function isCommitSelected(selection, commit) {
    if (!selection) {
      return false;
    }
    // TODO: return true if commit is within brushSelection
    // and false if not
    const [[x0, y0], [x1, y1]] = selection;
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  }
  
  function brushed(event) {
    const selection = event.selection;
    d3.selectAll('circle').classed('selected', (d) =>
      isCommitSelected(selection, d),
    );
    renderSelectionCount(selection);
    renderLanguageBreakdown(selection);
  }


  function renderSelectionCount(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];
  
    const countElement = document.querySelector('#selection-count');
    countElement.textContent = `${
      selectedCommits.length || 'No'
    } commits selected`;
  
    return selectedCommits;
  }

  function renderLanguageBreakdown(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];
    const container = document.getElementById('language-breakdown');

    if (selectedCommits.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = '';
    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);

    // Use d3.rollup to count lines per language
    const breakdown = d3.rollup(
      lines,
      (v) => v.length,
      (d) => d.type,
    );

    // Update DOM with breakdown
    container.innerHTML = '';

    for (const [language, count] of breakdown) {
      const dl = d3.select(container).append('dl').attr('class', 'stat-block');
      const proportion = count / lines.length;
      const formatted = d3.format('.1~%')(proportion);

      dl.append('dt').attr('class', 'stat-label').text(language);
      dl.append('dd')
      .attr('class', 'stat-value')
      .style('font-size', '1.5em')
      .text(`${count} lines (${formatted})`);
    }
  }

  

  const tooltip = d3.select('#commit-tooltip');
  tooltip.style('visibility', 'hidden');
  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([3, 20]); // adjust these values based on your experimentation
  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

  // Put all the JS code of Steps inside this function
  const width = 1000;
  const height = 600;

  const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

  createBrushSelector(svg);

  const xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([0, width])
      .nice();
  
  const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };
    
  // Update scales with new ranges
  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  // Gridlines with color based on time of day
  const gridGroup = svg.append('g')
  .attr('class', 'gridlines-colored')
  .attr('transform', `translate(${usableArea.left}, 0)`);

  // Set up a sequential color scale (blues at night, oranges at day)
  // const colorScale = d3.scaleSequential()
  // .domain([0, 24])
  // .interpolator(d3.interpolatePuOr); // or d3.interpolateTurbo / d3.interpolateWarm

  // Custom interpolator that favors blue–orange
  const colorScale = d3.scaleLinear()
    .domain([0, 6, 12, 18, 24])
    .range(["#1f77b4", "#add8e6", "#fdd835", "#ffa726", "#1f77b4"]); // midnight → morning → noon → evening → midnight

  // Generate hourly ticks
  const ticks = d3.range(0, 25); // hours from 0 to 24

  // Draw horizontal lines manually
  gridGroup.selectAll('line')
  .data(ticks)
  .join('line')
    .attr('x1', 0)
    .attr('x2', usableArea.width)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', d => colorScale(d))
    .attr('stroke-width', 1);

  // Create the axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00')

  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines))
    .style('fill-opacity', 0.65) // Add transparency for overlapping dots
    .attr('fill', 'steelblue')
    .on('mouseenter', (event, commit) => {
      d3.select(event.currentTarget).style('fill-opacity', '1'); // Highlight the hovered dot
      renderTooltipContent(commit);
      tooltip
        .style('visibility', 'visible')
        .style('left', event.clientX + 10 + 'px')
        .style('top', event.clientY + 10 + 'px');
    })
    .on('mouseleave', (event) => {
      // TODO: Hide the tooltip
      d3.select(event.currentTarget).style('fill-opacity', 0.7);
      tooltip.style('visibility', 'hidden');
    });


  // Add X axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  // Add Y axis
  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

}

function renderTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');

  if (Object.keys(commit).length === 0) return;

  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
}


  
let data = await loadData();
let commits = processCommits(data);
renderCommitInfo(data, commits);

// Add a heading for the chart
d3.select('body')
    .append('h2')
    .text('Commits by time of day')
    .style('text-align', 'left')
    .style('margin', '1.2em 0 0.5em 0')
    .style('font-size', '2em')
    .style('font-weight', 'bold')
    .style('color', '#333')
    .style('width', '88%')
    .style('font-family', 'Baskerville, serif');

// Add a div container for the chart
d3.select('body')
    .append('div')
    .attr('id', 'chart');

// Add a paragraph for selection count
d3.select('body')
  .append('p')
  .attr('id', 'selection-count')
  .text('No commits selected')
  .style('margin', '1em 0')
  .style('font-size', '1.2em')
  .style('color', '#555')

// Add a definition list for language breakdown
d3.select('body')
  .append('dl')
  .attr('id', 'language-breakdown')
  .attr('class', 'stats-grid')
  .style('margin', '1em 0')
  .style('display', 'none') // Initially hidden
  .style('font-size', '1em')
  .style('color', '#333')
  .style('font-family', 'Arial, sans-serif');


renderScatterPlot(data, commits);