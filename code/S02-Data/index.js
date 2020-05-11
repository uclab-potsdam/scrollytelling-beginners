// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#app',
  data: {
    scroller: scrollama(),
    width: 500,
    height: 300,
    step: 0,
    progress: 0,
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
