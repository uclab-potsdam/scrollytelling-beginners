**Session #1**
### How does our template works?

In this session we will work on the template.
We will understand how to add new blocks for text, how to incorporate and edit svg elements and how to hide or show custom elements during the scroll.
[S01-Solutions.md](S01-Solutions.md)

**Session #2**
### How do we build data driven figures?

In this session we will go beyond our basic template structure and usage.
We will build (with the help of D3.js) a bar-chart using REAL data. We will start by preparing and exporting the data in `csv` and by calculating chart width, height and spacing.
Then we will import data and use them to build our chart.
[S02-Solutions.md](S02-Solutions.md)

**Session #3**
### How do we trigger transitions?

In this session we will approach transitions in different ways.
First we will use CSS classes and Vue to implement a simple transition, then we will use Vue Transitions to approach a possible alternative. The last two exercises will focus on Javascript.

---

#### Exercise 1
When `step >= 2` change color to the Los Angeles bar to highlight its high volume of sold avocados.

**Step 1** - Go at the bottom of the `index.css` file and add a class called `highlight`. The class has to target the rectangle elements in our bar-chart `svg`. Inside brackets, specify a new `fill` color.

```css
svg rect.highlight {
  fill: yellow;
}
```

Then go back to `index.html` and add the newly generated class to the `<rect/>` tag.

```html
<svg>
  ...
  <rect x="-10" :y="bar.y" width="20" :height="bar.height" class="highlight"/>
</svg>
```

By saving and refresh you will notice than now *all* the bars are yellow regardless the reader position in the text. We need to specify a condition to actually select only one of them (the Los Angeles one) and make this change happening only when the step is greater than 2.

**Step 2** - Reactive HTML comes in again. Instead of this `class="highlight"` we will write something like this:

```html
<svg>
  ...
  <rect x="-10" :y="bar.y" width="20" :height="bar.height"
   :class="{ highlight: bar.city === 'Los Angeles' && (step + progress) > 2}"/>
</svg>
```
What is happening here? First of all we are making the attribute `class` reactive.
Then we are specifiying the name of the class we are interested in toggle on and off: `highlight`.
By writing `highlight:` we are preparing to write a condition that will toggle the class only if true. The first condition is `bar.city === 'Los Angeles'`, which can be true only when the HTML element correspond to the Los Angeles data. The second one is `(step + progress) > 2`, which can become true only when the reader scrolls past the corresponding text paragraph. We use `&&` to chain the two conditions, in this way `higlight` will be added **only when both conditions are true**.

On save and refresh you will notice that our Los Angeles bar is becoming yellow when scrolling down. Now we have to make this transition smooth.

**Step 3** - In `index.css`, just above our newly added class, you can see the original one (which is making our rectangles pink). To make our transition smoother we have to add the `transition` property to this class.

```css
svg rect {
  /* we use var to predefine colors and properties that can be re-used */
  fill: var(--color-accent);
  /* Here it goes */
  transition: fill 1s;
}
```
First we write down which property should be transitioned and then the duration (in seconds) of our transition. The final result in your CSS should look like this:

```css
svg rect {
  fill: var(--color-accent);
  transition: fill 1s;
}

svg rect.highlight {
  fill: yellow;
}
```

#### Exercise 2
When `step > 2` fade out the axis from the chart.

This task consists in fading out a group of elements. We could achieve it in the same way we did previously - entirely via CSS and conditional class assignment. However, we will use Vue transitions to do that.

**Step 1** - Go to 'index.html' and in the part of the `svg` where the Y axis is defined let's wrap everything together using a new `<g>`.
Like this:

```html
<g>
  <g v-for="(tick, i) in ticksY" :key="`tick-${i}`" :transform="`translate(0 ${tick.y})`">
    <line :x1="0" :x2="innerWidth" :y1="0" :y2="0"/>
    <text class="tick" x="0" :y="0" dy="-0.5em">
      {{ tick.value }}
    </text>
  </g>
</g>

```
Now let's use our old friend `v-if` to determine when our elements will be visible.
```html
<g v-if="(step + progress) <= 2">
  <g v-for="(tick, i) in ticksY" :key="`tick-${i}`" :transform="`translate(0 ${tick.y})`">
    <line :x1="0" :x2="innerWidth" :y1="0" :y2="0"/>
    <text class="tick" x="0" :y="0" dy="-0.5em">
      {{ tick.value }}
    </text>
  </g>
</g>

```
As you can see the condition is reverse than in Exercise 1: the Y axis will be visible only when `step + progress` will be smaller or equal 2. Now our axis is disappearing quite abruptly when the condition is met.

>⚠️ We created an extra `<g>` because it's not best practice to use `v-if` together with `v-for` and it could lead to update problems.

**Step 2** - Now we want to shape a proper smooth transition. To do so we can wrap the `v-if` group in a Vue wrapper component called `<transition>`
```html
<transition name="fade">
  <g v-if="(step + progress) <= 2">
    <g v-for="(tick, i) in ticksY" :key="`tick-${i}`" :transform="`translate(0 ${tick.y})`">
      <line :x1="0" :x2="innerWidth" :y1="0" :y2="0"/>
      <text class="tick" x="0" :y="0" dy="-0.5em">
        {{ tick.value }}
      </text>
    </g>
  </g>
</transition>
```
For now this should not cause any change. We need classes.

**Step 3** - As mentioned in the [Medium article](https://medium.com/@scrollyforbeginners/scrollytelling-for-beginners-3-73506cb84165), `<transition>` components come with pre-defined classes that we can use to deal with our transitions timing. For a full list of classes and their characteristics you can check the [Vue documentation](https://vuejs.org/v2/guide/transitions.html).

To adjust the behaviour of our transition we will use four classes (preceded by the transition name): `.fade-enter-active`, `.fade-leave-active`, `.fade-enter` and `.fade-leave-to`.

>⚠️If your transition name changes also the classes will change accordingly, e.g. if I have `<transition name="right-move">` my class will be `.right-move-leave-active`

```css
/* active classes are used to define the duration and delay of our transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
/* These are applied just before enter or leave transitions are triggered */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
```
>⚠️In Vue is also possible to use `<transition>` on [multiple elements](https://vuejs.org/v2/guide/transitions.html#List-Transitions) (for examples the one we dynamically generate with `v-for`), in this case you will have to use the `<transition-group>` component and each element must have an unique `:key` value.

#### Exercise 3 - JS -> scale
Between step 3 and 4 add a transition to scale the bar-chart at half of its original height.

**Step 1** - Since we are not dealing anymore with CSS properties we need to intervene on JavaScript.
In the `index.js` file we will create a new computed property called `chartHeightScale`. This property will be a scale (very similar to the one we created in Session 02).

```js
chartHeightScale () {
  // In this case the domain are the two step values
  const domain = [3, 4]
  // The range is the actual size we want our bar-chart to be
  const range = [this.innerHeight, this.innerHeight / 2]
  return d3.scaleLinear.domain(domain).range(range).clamp(true)
}
```  
**Step 2** - Now that we have our scale we need a second computed property that returns the chart height. To do so we pass to our new scale `step + progress` (similarly to what we did in the previous steps)

```js
chartHeight () {
  return this.chartHeightScale(this.step + this.progress)
}
```

We are doing so because - as we know - computed properties are cached based on reactive attributes. Therefore by scrolling down the page our readers will trigger a gradual transformation to our bar height.

**Step 3** - Now (always in the `index.js`) we substitute `innerHeight` with `chartHeight`.

In the `scaleY` property:
```js
scaleY() {
  const values = this.data.map(d => d[this.attribute])
  const domain = [0, d3.max(values)]
  // Here in the range.
  const range = [0, this.chartHeight]
  return d3.scaleLinear().domain(domain).range(range).nice(5)
}
```
In `ticksY` as well:

```js
scaleY() {
  return this.scaleY.ticks(5).map(tick => {
    return {
      value: tick,
      // Here!
      y: this.chartHeight - this.scaleY(tick)
    }
  })
}
```
And in the `bars` property:
```js
bars () {
  return this.data.map((d, index) => {
    const barHeight = this.scaleY(d[this.attribute])
    return {
      city: d.city,
      value: d[this.attribute],
      // Here where the y position is defined
      y: this.chartHeight - barHeight,
      height: barHeight
    }
  })
}
```
Now on refresh you should notice how the transformation happens gradually as you scroll down.

**Step 4** - As a final touch, go to `index.html` and substitute the `y` position for the cities name as well:

```html
<!-- Here! -->
<text x="0" :y="chartHeight" dy="1.5em">
  {{ bar.city }}
</text>

```
Et voilà!

#### BONUS! Exercise 4
What if we want to trigger the same transition we just created, but instead of making it dependent entirely on the scroll progress we want it to be timed?

The approach would be slightly different. We will use Vue `methods` in combination with the computed properties we just calculated in Exercise 3.

**Step 1** - In `index.js` add to the `data` container five elements.

```js
data: {
  scroller: scrollama(),
  width: 500,
  height: 300,
  step: 0,
  progress: 0,
  data: [],
  margin: 64,
  // Our new elements
  transitionProgress: 0,
  transitionDirection: 'down',
  transitionStarted: false,
  transitionLastTime: null,
  transitionDuration: 1000
}
```
We will use `transitionProgress` to store the actual number we want to pass to our scale. Its default value has to be `0`.

`transitionDirection` will holds a string with a value of either `up` or `down`. We will use it to determine whether the user is scrolling down or up and later to create a series of `if statements` and calculate `transitionProgress`.

`transitionStarted` is boolean. As the name says we will use it to make our code react differently if the transition is happening or not. This is core, since we will use it to trigger our transition via `requestAnimationFrame()`.

`transitionLastTime` is set to `null` when `transitionStarted` is `false`, otherwise it will store the last `time` value before the current one. We will use to keep the transition similar across different browser (slower or faster broswers could cause the transition to last differently).

`transitionDuration` is the milliseconds the actual transition will last. In our case `1000` (one second).

**Step 2** - Now that we have everything we need it's time to put it together. At the bottom of our `index.js` there is another container called `methods`. As you can see there are already some functions: `onEnter()`, `onProgress()` and `onExit()`. These functions are proper of scrollama and every time our reader enter a new paragraph of text they are executed. They are different from computed properties because we don't need to return something (we can just do assignments or call other functions) and they are not cached, so we re-run them everytime the user perform a specific action (in this case scroll through a paragraph.)

We will now add a couple of methods here.
The first one will be called `transition`, the second one `startTransition`.

```js
methods: {
  transition (time) {

  }
}
```
`transition()` has a parameter `time`, we will use it to calculate the interval between milliseconds and to stop the transition from executing after a certain threshold.

```js
methods: {
  transition (time) {
    // When the function is executed we want transitionLastTime to change its value and store time
    if (this.transitionLastTime === null) this.transistionLastTime = time
    // Now we define a local constant named p to get the difference between time and last time
    const p = (time - this.transitionLastTime) / this.transitionDuration
  }
}
```
This part of the function will provide us with the values that we will be evaluated at runtime. The second part of the function is all about evaluation: if a certain set of conditions become true our transition will do something.

```js
transition (time) {
  // When the function is executed we want transitionLastTime to change its value and store time
  if (this.transitionLastTime === null) this.transistionLastTime = time
  // Now we define a local constant named p to get the difference between time and last time
  const p = (time - this.transitionLastTime) / this.transitionDuration
  // The first if statement is taking care of direction: if the reader is scrolling down then p will be added to transitionProgress, if the reader will go down p will be subtracted
  if (this.transitionDirection === 'down') {
    this.transitionProgress += p
  } else {
    this.transitionProgress -= p
  }
  // The second statement is running the transition only if transitionProgress is in a delta between 0 and 1, otherwise it will reset some parameters in order to start a new transition
  if (this.transitionProgress >= 0 && this.transitionProgress <= 1) {
    this.transitionLastTime = time
    requestAnimationFrame(this.transition)
  } else {
    this.transitionStarted = false
    this.transitionLastTime = null
  }
}
}
```

The logic behind the second part is: we need to control the flow to be sure that something will happen only when we want to and that its duration will be more or less always constant.

**Step 3** - However our transition is still not happening. We are still missing a couple of things: one method to take care of kicking it off and some other thing that changes the `transitionDirection` property according to scroll.

In the `methods` container we add a new function, `startTransition()` with a `direction` parameter:

```js
methods: {
  startTransition (direction) {

  }
}
```
Inside this function we will write the following code:
```js
methods: {
  startTransition (direction) {
    // Here we set the transitionDirection property to direction
    this.transitionDirection = direction
    // If the transition has started (it's different from false) then the progress will also be changed so that we can always keep it between 0 and 1 (inside our domain)
    if (!this.transitionStarted) {
      this.transitionProgress = direction === 'up' ? 1 : 0
      // We change the transitionStarted property as well, so that it's not false anymore
      this.transitionStarted = true
      // We use requestAnimationFrame to kick it off
      requestAnimationFrame(this.transition)
    }

  }
}
```

**Step 4** - Now we need to change the `direction` parameter based on our use behaviour. To do so we will use scrollama.

Inside `onEnter()` and `onExit()` we will add - below the existing code - a few lines:

```js
onEnter (step) {
  this.step = step.index
  // We add an if statement that pass down to startTransition only if the step is equal to 2 and the scroll direction is downward
  if (step.index === 2 && step.direction === 'down') {
    this.startTransition('down')
  }
}
```
and
```js
onExit (step) {
  this.step = step.index
  // We add a specular if statement on step exit, so that the direction will be up if the user scrolls back.
  if (step.index === 2 && step.direction === 'up') {
    this.startTransition('up')
  }

}
```
`step.index` and `step.direction` are directly provided by scrollama. Once that the library is installed and we initiated the instance in the `mounted()` container we can use them to deal with our use behaviour.

**Step 5** - Now that we have our transition ready, we need to somehow connect it to our svg element. To do so we can use the `chartHeightScale` property in combination with `chartHeight`.

We only need to change our domain from `[3,4]` to `[0,1]` which are the values we generate in the `transition()` method and instead of using `(this.step + this.progress)` we have to switch to `this.transitionProgress`.

```js
chartHeightScale () {
  // we changed the domain
  const domain = [0, 1]
  const range = [this.innerHeight, this.innerHeight / 2]
  return d3.scaleLinear().domain(domain).range(range).clamp(true)
},
chartHeight () {
  // we changed the passed value to calculate the height
  return this.chartHeightScale(this.transitionProgress)
}
```
Here we go!
Now the transition should happens: it's not controlled via scroll anymore, at least not entirely. We trigger the start via step, but then we use the native JS method `reuqestAnimationFrame()` to change values.

---
#### Final Remarks
This exercise requires a good degree of knowledge in JS, if you don't entirely get what is happening you might want to break it down step by step and use `console.log` to check what is going on.
