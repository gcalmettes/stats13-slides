// Create margins.
const margin = { top: 30, right: 20, bottom: 40, left: 55 }
const width = 800 - margin.left - margin.right
const height = 260 - margin.top - margin.bottom
const populationSize = 10000

// Create svg.
const svg = d3.select('body')
  .append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)

// Create scales.
const x = d3.scaleLinear().range([0, width])
const y = d3.scaleLinear().range([height, 0])

// Helper function to update range output
const updateRangeOutput = (selector, value) =>
  document.querySelector(selector)
            .parentNode.querySelector('output')
		        .textContent = value

const updateElement = (selector, value) =>
	document.querySelector(selector).textContent = value

const drawData = () => {
  // Get adjustable parameters.
  const proportion = document.querySelector('input.proportion').value
  const samples = document.querySelector('input.samples').value
  const size = document.querySelector('input.size').value

  const p = 0.8

  // Update parameters next to sliders.
  updateElement('span.proportion', d3.format('.0%')(proportion))
  updateElement('span.samples', d3.format(',')(samples))
  updateElement('span.size', d3.format(',')(size))

  // Create the population.
  const population = d3.range(populationSize)
		.map((v, index, array) => index < proportion * array.length ? 1 : 0)

  // For a total of `samples` trials,
  const data = d3.range(samples).map(v => {
        // create a random sample of size `size`,
        const sample = d3.shuffle(population).slice(0, size)
        // and return mean.
        return d3.mean(sample)
		    })

	// Bin data.
	const bins = d3.histogram()
		.domain(x.domain())
		.thresholds(x.ticks(Math.min(100, size)))
		(data)

	// Set y-scale based on data.
	y.domain([0, d3.max(bins, d => d.length)])

	// Remove all elements.
	svg.selectAll('*').remove()

	// Draw data.
	const bar = svg.selectAll('.bar')
		.data(bins)
		.enter().append('g')
			.attr('class', 'bar')
			.attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`)

	// Draw bars.
	bar.append('rect')
			.attr('x', 0)
			.attr('width', d => x(d.x1) - x(d.x0))
			.attr('height', d => height - y(d.length))

	// Draw x axis.
	svg.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(x))

  // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top +5) + ")")
      .style("text-anchor", "middle")
      .text("proportion")

  // Add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y))

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("# of values");


    svg.append("svg:line")
      .attr("class", "p of interest")
      .attr("x1", proportion*width)
      .attr("y1", height)
      .attr("x2", proportion*width)
      .attr("y2", 0)
      .style("stroke-width", 2)
      .style("stroke", "red")
      .style("fill", "none");
}

d3.select('#reset_button').on('click', d => drawData());

d3.selectAll('input').on('input', d => drawData())

drawData()
