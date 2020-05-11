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
    margin: 64
  },
  mounted () {
    this.scroller.setup({
      step: '.scrolly article .step',
      offset: 0.5,
      progress: true,
      debug: false
    }).onStepEnter(this.onEnter)
      .onStepProgress(this.onProgress)
      .onStepExit(this.onExit)

    this.resize()
    window.addEventListener('resize', this.resize)

    d3.csv('../assets/data/avocado.csv').then(data => {
      console.log(data)
      this.data = data.map(d => {
        return {
          city: d.city,
          price: +d.price,
          volume: +d.volume
        }
      })
    })
  },
  computed: {
    innerHeight () {
      return this.height - this.margin * 2
    },
    innerWidth () {
      return this.width - this.margin * 2
    },
    barWidth () {
      return this.innerWidth / this.data.length
    },
    attribute () {
      return this.step === 0 ? 'price' : 'volume'
    },
    scaleY () {
      const values = this.data.map(d => d[this.attribute])
      const domain = [0, d3.max(values)]
      const range = [0, this.innerHeight]
      return d3.scaleLinear().domain(domain).range(range).nice(5)
    },
    ticksY () {
      return this.scaleY.ticks(5).map(tick => {
        return {
          value: tick,
          y: this.innerHeight - this.scaleY(tick)
        }
      })
    },
    bars () {
      return this.data.map((d, index) => {
        const barHeight = this.scaleY(d[this.attribute])
        return {
          city: d.city,
          value: d[this.attribute],
          y: this.innerHeight - barHeight,
          height: barHeight
        }
      })
    }
  },
  methods: {
    resize () {
      const bounds = this.$refs.figure.getBoundingClientRect()
      this.width = bounds.width
      this.height = bounds.height
      this.scroller.resize()
    },
    onEnter (step) {
      console.log('enter', step)
      this.step = step.index
    },
    onProgress (step) {
      console.log('progress', step)
      this.step = step.index
      this.progress = step.progress
    },
    onExit (step) {
      console.log('exit', step)
      this.step = step.index
    }
  }
})
