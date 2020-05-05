// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#app',
  data: {
    scroller: scrollama(),
    width: 500,
    height: 300,
    step: 0,
    progress: 0
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
  },
  computed: {
    rects () {
      const centerX = this.step < 1 ? this.width / 4 : this.width / 6
      const size = 50
      return [{
        x: centerX - size / 2,
        y: -size / 2,
        size
      }, {
        x: -centerX - size / 2,
        y: -size / 2,
        size
      }]
    },
    circleColor () {
      const colors = ['#ee00aa', '#f35580', '#f8aa57', '#fdff2d']
      return colors[this.step]
    },
    lineColor () {
      const colors = ['#ee00aa', '#fdff2d']
      const steps = [0, 3]
      const scale = d3.scaleLinear().domain(steps).range(colors)
      return scale(this.step + this.progress)
    },
    fontWeight () {
      const weights = [100, 700]
      const steps = [1, 2]
      const scale = d3.scaleLinear().domain(steps).range(weights)
      return scale(this.step + this.progress)
    },
    radius () {
      const { step, height, progress } = this
      if (step === 2) return height / 4 * (1 + progress)
      if (step === 3) return height / 4 * (2 - progress)
      return height / 4
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
