// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#app',
  data: {
    scroller: scrollama(),
    width: 500,
    height: 300,
    step: 0,
    progress: 0,
    data: [],
    margin: 64,
    currentTimestamp: ''
  },
  mounted () {
    this.scroller.setup({
      step: '.scrolly article .step',
      offset: 0.5,
      progress: true,
      debug: true
    }).onStepEnter(this.onEnter)
      .onStepProgress(this.onProgress)
      .onStepExit(this.onExit)

    this.resize()
    window.addEventListener('resize', this.resize)

    // eslint-disable-next-line no-unused-vars
    // var mymap = L.map('mapid').setView([52.52, 13.41], 12)
    //
    // L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(mymap)

    d3.json('../assets/data/pathway.json').then(data => {
      // console.log(data)
      this.data = data.map(d => {
        return {
          unix_timestamp: d.unix_timestamp,
          timestamp: d.timestamp,
          longitude: +d.longitude,
          latitude: +d.latitude,
          speed: +d.speed
        }
      })
    })

    console.log(this.timeScale)
  },
  computed: {
    // onlyCoordinates () {
    //   return {
    //     type: 'LineString',
    //     coordinates: this.data.map(d => {
    //       return [d.latitude, d.longitude]
    //     })
    //   }
    // },
    innerHeight () {
      return this.height - this.margin * 2
    },
    innerWidth () {
      return this.width - this.margin * 2
    },
    timeScale () {
      const max = d3.max(this.data.map(d => d.timestamp))
      const min = d3.min(this.data.map(d => d.timestamp))
      return d3.scaleLinear().domain([new Date(min), new Date(max)]).range([0, this.height])
    },
    invertedScale () {
      const max = d3.max(this.data.map(d => d.timestamp))
      const min = d3.min(this.data.map(d => d.timestamp))
      return d3.scaleLinear().domain([0, 2080]).range([new Date(min), new Date(max)]).nice()
    },
    timeFormat () {
      return d3.timeFormat('%H:%M:%S')
    }
    // projection () {
    //   return d3.geoMercator().center([52.52, 13.41]).translate([this.innerWidth + (this.margin * 5), this.innerHeight / 12]).scale(150000)
    // },
    // pathGeometry () {
    //   return d3.geoPath().projection(this.projection)
    // },
    // tripShape () {
    //   return this.pathGeometry(this.onlyCoordinates)
    // }
  },
  methods: {
    resize () {
      const bounds = this.$refs.figure.getBoundingClientRect()
      this.width = bounds.width
      this.height = bounds.height
      this.scroller.resize()
    },
    calcCurrentTime () {
      const bounds = document.scrollingElement.scrollTop - this.$refs.intro.scrollHeight
      this.currentTimestamp = this.timeFormat(Math.round(this.invertedScale(bounds)))
    },
    onEnter (step) {
      this.step = step.index
    },
    onProgress (step) {
      this.calcCurrentTime()

      this.step = step.index
      this.progress = step.progress
    },
    onExit (step) {
      // console.log('exit', step)
      this.step = step.index
    }
  }
})
