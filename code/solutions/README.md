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

---

#### Exercise 0
Export a `csv` from Excel (or OpenOffice, or Google Sheets...). Then prepare your code.

**Step 1** - Let's open our spreadsheet assuming that you want to take a look at your data or even edit them,
common formats could be `.xlsx`, `.ods` or directly `.csv`. After working with them we want
to export a `.csv` table, ready to be used.

* In OpenOffice go to 'File > Save As...', now you can select a file extension from the dropdown menu at the bottom. Select Text CSV (`.csv`).
* If asked click on 'Keep current format'.
* Select text and field delimiter. A common field delimiter is ','.
* Save your file and move it to the `data` directory, located at `code/assets/data`

>⚠️(When working in Excel or Google Sheets the process is quite similar: instead of 'Save As...' you might have to select 'Export' or 'Download')

**Step 1.1** - Before you dive into code: [start a local server!](https://github.com/more-ginger/scrollytelling-beginners#getting-started-advanced)

**Step 2** - Now our data are ready to be used. We have to prepare our code. To do so we start by calculating width and height of our chart, which will be used later to position our figure inside the `svg` tag in the `index.html` file.

Go to `index.js`. You will notice that our file is organised in "containers". We have a bigger container called `app` and inside we have *smaller* containers such as: `data`, `mounted`, `computed` and so on. This structure is proper of Vue.js and it will allow us to keep our code consistent. If you want to learn more about what does what you can take a look here: [The Vue Instance](https://vuejs.org/v2/guide/instance.html).

In data define `margin`:
```js
el: '#app',
data: {
  scroller: scrollama(),
  width: 500,
  height: 300,
  step: 0,
  progress: 0,
  margin: 64 //You can do it like this!
}
```
**Step 3** - Let's add to `computed` two functions to calculate inner width and height, based on the original `width` and `height` properties in `data`.

```js
computed: {
  innerHeight() {
    //Using this allows us to access properties defined in data (or calculated in another computed property)
    return this.height - this.margin * 2
  },
  innerWidth() {
    return this.width - this.margin * 2
  }
}
```
The cool thing about computed properties is that **they are cached based on their reactive dependencies**. Which is a very fancy way to say: as long as width and height will remain unchanged our computed properties won't change, if they will update accordingly! Wow!

---

#### Exercise 1
Import and parse data, create a JS object that can be used to build our chart.

**Step 1** - Now it's time to use the data in the assets folder. First thing first we have to create an empty array `[]` named data inside `data`.

```js
el: '#app',
data: {
  scroller: scrollama(),
  width: 500,
  height: 300,
  step: 0,
  progress: 0,
  data: [], //here our empty array!
  margin: 64
}
```

**Step 2** - Always, in the `index.js` file you will notice just before the `computed` a function called `mounted()`.

The code inside this function will be executed only after the view on our browser is rendered. Here we want to use the `d3.csv` method to import our data.

We will write something like this:
```js
mounted() {
  //some other code you don't want to touch
  d3.csv('../assets/data/avocado.csv').then(data => {
    console.log(data)
  })
}
```
What are we doing? We are using the path to our file (could also be an external URL) as an input for an async request and then we are returning it by using the standard JS method `then()`.

**Step 3** - Inside `then()` we can [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) our data to return a JS object representing only the fields we need or converting strings to numbers for a easier usage later:

```js
d3.csv('../assets/data/avocado.csv').then(data => {
  //If we log our data initially...
  console.log(data)
  //...Then we assign to our empty array a new map...
  this.data = data.map(d => {
    return {
      city: d.city,
      price: +d.price,
      volume: +d.volume
    }
  })
  //...And then we log them again, we can see that they are quite different before and after map. Beware, we are using this.data, not data!
  console.log(this.data)
})
```
Now our data are ready to be used!

---

#### Exercise 2
Access data in the `html`, create on bar for each row in data.

**Step 1** - Go to the `index.html` file. Inside the `svg` tag we can now access our data!

First of all let's create a `g`, we can use `margin`
to translate it horizontally and vertically.

```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
  </g>
</svg>

```
**Step 2** - Then **inside** the group let's create an horiztonal axis at the bottom, by adding a `line`

```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
    <!-- This line uses innerHeight and innerWidth to determine how long it is and where it is positioned on the page -->
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>
```

**Step 3** - Let's create another group. This one will be a special one. By using the [`v-for` directive](https://medium.com/javascript-in-plain-english/list-rendering-with-vue-js-v-for-directive-91a0a7756a68) we can use an array of data and loop through it to *create as much svg groups as there are elements in the array itself*.

Bear with me for a sec, it's tough but if you get it the magic will be yours.

While on our code editor we will have something like this:

```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
    <g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <!-- This group is empty, so you will see only empty groups on refresh -->
    </g>
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>

```

If we use the inspector tool in our browser we will see something like this:

```html
<!-- This is the first group we defined -->
<g transform="translate(64 64)">
  <!-- These groups here are dinamically generated via the v-for directive based on the data we have -->
  <g transform="translate(103.25 0)"></g>
  <g transform="translate(309.75 0)"></g>
  <g transform="translate(516.25 0)"></g>
  <g transform="translate(722.75 0)"></g>
</g>

```
`v-for` is a directive that is used to render a list of elements. It has a special syntax in the form of `item in items`, where `item` our single element. (It could be whatever, also `banana in bananas`, this syntax is helpful for us in understanding what is going on).

Let's look at it in detail:

```html
<!-- data is our data! As simple as that [🍌,🍌,🍌]-->
<!-- bar is a single element in data, we call it `bar` so that we actually know what we are referring to 🍌-->
<!-- i is the index for that specific element [(🍌,0),(🍌,1),(🍌,2]-->
<g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`"></g>
```
**Long story short:** I can create one unique element and use the `v-for` directive to generate as much other elements as I need, be them 5 or 500. Then I can also use the properties of this single element!

>⚠️barWidth is used to position each group so they don't overlap each other. It's a computed property identical to innerWidth, but it's returning the following calculation: **return this.innerWidth / this.data.length** If you do not calculate barWidth all the groups will be stacked on top of each other.

For example:
```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
    <g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <!-- I am generating text using cities names -->
      <text x="0" :y="innerHeight" dy="1.5em">
        {{ bar.city }}
      </text>
    </g>
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>

```

Will look like this in the inspector:
```html
<g transform="translate(64 64)">
    <g transform="translate(103.25 0)">
      <text x="0" y="675" dy="1.5em">
          Boston
        </text>
    </g>
    <g transform="translate(309.75 0)">
     <text x="0" y="675" dy="1.5em">
        Chicago
      </text>
    </g>
    <g transform="translate(516.25 0)">
      <text x="0" y="675" dy="1.5em">
        Los Angeles
      </text>
    </g>
    <g transform="translate(722.75 0)">
      <text x="0" y="675" dy="1.5em">
        New York
      </text>
    </g>
  </g>
```
**Step 4** - Now we can also generate some `<rect>` elements: our bars!

In the previously created `g` where the `v-for` is happening write:

```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
    <g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <!-- I am generating text using cities names -->
      <rect x="-10" :y="0" width="20" :height="innerHeight" />
      <text x="0" :y="innerHeight" dy="1.5em">
        {{ bar.city }}
      </text>
    </g>
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>
```
We did it! We have bars!
Actually...
Now you will just see tiny little rectangles. Absolutely meaningless. In the next exercise we will see how to appropriately scale them according to our data.

---

#### Exercise 3
Create an yScale and apply it to data.

**Step1** - In the `computed` container write a new function, inside this function create one variable named `values`:

```js
computed: {
  // Other code
  scaleY () {
    //Looping through my data to get only price values
    const values = this.data.map(d => d.price)    
  }
}
```

`values` will hold only numbers: avocado prices. It's a plain and simple array and it will look like this: `[1.13, 0.93, 0.8, 1.17]`. Now we need to determine the domain. Inside the same `scaleY` function write a new variable.

```js
computed: {
  // Other code
  scaleY () {
    //Looping through my data to get only price values
    const values = this.data.map(d => d.price)   
    //Our new domain variable will hold the minimum and the maximum values in the data
    const domain = [0, d3.max(values)]
  }
}
```
>⚠️d3.max is a method to get the highest value inside an array of numbers. (To get the lowest you can use d3.min). The domain can also be 'hard-coded' which means that we can directly input numbers such as: [0,1000].
However, in this case, if the data change the domain does not change (and this is not good!).

`domain` is a new array with only two values: 0 and 1.17. Min and max.
Now we need to define a range of pixels to limit the size of our future bars. Inside `scaleY` we can define a third variable.

```js
computed: {
  // Other code
  scaleY () {
    //Looping through my data to get only price values
    const values = this.data.map(d => d.price)   
    //Our new domain variable will hold the minimum and the maximum values in the data
    const domain = [0, d3.max(values)]
    //Our range will be always from 0 to the max number of pixel possible, in our case innerHeight
    const range = [0, this.innerHeight]
  }
}
```
>⚠️Also the range can be hard-coded (e.g. = [0, 5000]), where 5000 are pixels.

After defining `domain` and `range` we can return our scale:


```js
computed: {
  // Other code
  scaleY () {
    //Looping through my data to get only price values
    const values = this.data.map(d => d.price)   
    //Our new domain variable will hold the minimum and the maximum values in the data
    const domain = [0, d3.max(values)]
    //Our range will be always from 0 to the max number of pixel possible, in our case innerHeight
    const range = [0, this.innerHeight]
    // computed properties can also return functions, JS doesn't really care, you do!
    return d3.scaleLinear().domain(domain).range()
  }
}
```
**Step 2** - Now we need to make a fresh copy of our data and apply the scale to it. Right after the `scaleY` function let's create another computed property.

```js
scaleY () {
  const values = this.data.map(d => d.price)   
  const domain = [0, d3.max(values)]
  const range = [0, this.innerHeight]
  return d3.scaleLinear().domain(domain).range()
},
bars () {

}
```

We called it `bars` because later we will use it to generate our actual bars in the `index.html` file.
Inside we will do something really similar to what we did in Exercise 1 - step 3:

```js
bars () {
  // We map our data
  return this.data.map((d, index) => {
  })

}
```

Inside `.map` we can return the data structure we need:

```js
bars () {
  // We map our data
  return this.data.map((d, index) => {
    //I need cities names and non scaled values for prices
    return {
      city: d.city,
      price: d.price
    }
  })

}
```
By using the scale we previously computed we can get the real bars height!

```js
bars () {
  // We map our data
  return this.data.map((d, index) => {
    //We add a variable where we scale all the values according to our scale
    const barHeight = this.scaleY(d.price)
    return {
      city: d.city,
      price: d.price, //this is the dataset value
      height: barHeight //this is the height in pixel achieved by feeding the dataset value to the scale
    }
  })

}
```
Since we are creating a bar-chart we also need to calculate the `y` position of each bar.

```js
bars () {
  // We map our data
  return this.data.map((d, index) => {
    const barHeight = this.scaleY(d.price)
    return {
      city: d.city,
      price: d.price, //this is the dataset value
      height: barHeight, //this is the height in pixel achieved by feeding the dataset value to the scale
      //To get the y position I need to subtract my current bar height to the total inner height of my chart
      y: this.innerHeight - barHeight
    }
  })

}
```

And now we are good to go!
We have a copy of our data slightly changed to better fit our design needs.

**Step 3** - Go to the `index.html` file.

Instead of this:
```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em"> Chart Title </text>
  <g :transform="`translate(${margin} ${margin})`">
    <g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <!-- I am generating text using cities names -->
      <rect x="-10" :y="0" width="20" :height="innerHeight" />
      <text x="0" :y="innerHeight" dy="1.5em">
        {{ bar.city }}
      </text>
    </g>
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>
```
Now we will change things around to get this:

```html
<svg :width="width" :height="height">
  <text :x="width / 2" dy="2em">Chart Title</text>
  <g :transform="`translate(${margin} ${margin})`">
    <!-- Instead of using data now  we are using bars -->
    <g v-for="(bar, i) in bars" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <!-- Here we are using height and y (which we calculated previously in the bar() computed property) -->
      <rect x="-10" :y="bar.y" width="20" :height="bar.height" />
      <text x="0" :y="bar.y" dy="-0.5em">
        {{ bar.value }}
      </text>
      <text x="0" :y="innerHeight" dy="1.5em">
        {{ bar.city }}
      </text>
    </g>
    <line :x1="0" :x2="innerWidth" :y1="innerHeight" :y2="innerHeight"/>
  </g>
</svg>
```
They look really similar, since the logic behind them it's identical. However instead of using data directly we are using the copy we created in `bars()`.

If you look in the browser you should have perfect bars now, scaled and positioned according to data and viewport!

Did you know that avocados are more expensive in New York than in LA? Well, now you know!

---

#### Exercise 4
When `step > 0` instead of showing avocados `prices` show `volumes` of sold avocados according to cities.

In Session 01 we learned how to use step to trigger svg elements and pictures. Step can also be used in js to trigger other changes.

**Step 1** - In 'index.js' let's add another computed property:

```js
attribute () {

}
```

Inside we can use our step to return different strings based on the reader position on the page:

```js
attribute () {
  return this.step === 0 ? 'price' : 'volume'
}
```
This literally means: dear attribute, if `step` is equal to 0 return `'price'`, otherwise (if `step`is different) return `'volume'`.

>⚠️If we write `console.log(this.attribute)` in our `mounted()` container we can directly use the browser console to check when and how this change is triggered. Remember: `console.log` is your friend!

**Step 2** - Now that we defined an attribute dependent on a condition we need to edit our code whenever we used `d.price` to determine what data were needed to create our bars.

```js
scaleY () {
  const values = this.data.map(d => d[this.attribute]) // We need to change it here...
  const domain = [0, d3.max(values)]
  const range = [0, this.innerHeight]
  return d3.scaleLinear().domain(domain).range(range)
},
bars () {
  return this.data.map((d, index) => {
    const barHeight = this.scaleY(d[this.attribute]) // ...here...
    return {
      city: d.city,
      value: d[this.attribute], // ... and here.
      y: this.innerHeight - barHeight,
      height: barHeight
    }
  })
}
```

>⚠️Cute Atom trick: select d.price in the code once > cmd + F and youwill trigger the find function in Atom. By writing 'this.attribute' in the *'Replace in current buffer'* and then hitting *Replace* you will be done!

By doind so we are exchanging `d.price` which is a fixed key with a dynamic property: `d.[this.attribute]`.

On refresh you should see the same bar-chart than before, however if you scroll down the data will switch.

---

#### Exercise 5
Create thicks and labels to generate a vertical axis.

**Step 1** - We start again by creating a new computed property! This time we will call it `ticksY`, since we will use it to build our axis ticks.

```js
ticksY () {

}
```
Inside we want to combine the [d3 `ticks()`](https://github.com/d3/d3-axis#axis_ticks) method with `map`. While the first one is automatically returning an array of numbers inside the domain, we also want to loop through them in order to obtain a better designed array of objects for our html.

```js
ticksY () {
  //this.scaleY.ticks(5) = [ 0, 0.2, 0.4, 0.6, 0.8, 1, 1.2 ]
  return this.scaleY.ticks(5).map(tick => {
    return {
      //Inside map we return value, which is the value (without scaling it)
      value: tick,
      //Then we return y, which is the scaled position of our tick
      y: this.innerHeight - this.scaleY(tick)
    }
  })
}
```

**Step 2** - Now, in `index.html` we use again a `v-for` instance to generate our axis with its ticks.

```html
<svg :width="width" :height="height">
<!-- Some other code, probably the bars one -->
    <!-- Here we start by creating a group -->
    <g v-for="(tick, i) in ticksY" :key="`tick-${i}`" :transform="`translate(0 ${tick.y})`">
      <!-- Here we use value and y to position and write the correct number -->
      <line :x1="0" :x2="innerWidth" :y1="0" :y2="0"/>
      <text class="tick" x="0" :y="0" dy="-0.5em">
        {{ tick.value }}
      </text>
    </g>
</svg>

```
At the end we should obtain an `svg` that looks like this:

```html
<svg :width="width" :height="height">
  <!-- Here we use the attribute to assign the correct name to the chart when the data change -->
  <text :x="width / 2" dy="2em">{{ attribute }}</text>
  <g :transform="`translate(${margin} ${margin})`">
    <!-- First v-for: we are creating bars! -->
    <g v-for="(bar, i) in bars" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`">
      <rect x="-10" :y="bar.y" width="20" :height="bar.height" />
      <text x="0" :y="bar.y" dy="-0.5em">
        {{ bar.value }}
      </text>
      <text x="0" :y="innerHeight" dy="1.5em">
        {{ bar.city }}
      </text>
    </g>
    <!-- Second v-for: we are creating the ticks for our axis -->
    <g v-for="(tick, i) in ticksY" :key="`tick-${i}`" :transform="`translate(0 ${tick.y})`">
      <line :x1="0" :x2="innerWidth" :y1="0" :y2="0"/>
      <text class="tick" x="0" :y="0" dy="-0.5em">
        {{ tick.value }}
      </text>
    </g>
  </g>
</svg>

```

---

#### Final Remarks
**The general logic behind what we did**
While we use JS to calculate values, scale them and prepare all the small parts we need for creating a chart, we use HTML and svg to actually *draw* on screen.
It's like playing with legos and make sure before we start building that we have all the blocks and pieces we need. Our resulting house will be way better if we take care of organising what we need beforehand and it will also become easier to adjust the house if we need to make space for a new room.

**Are there other possible ways of doing it?**
Yes, there are. If you dive into D3 you will probably notice that the majority of tutorials, guides and official documentation are using a completely different approach. The one that we just showed you works since we are integrating Vue.js, a framework that allows special features. Frameworks in general are very popular and they are used more and more everyday, it's important to learn how they work.

**What if I am stuck even after this tutorial and I am panicking?**
All the necessary knowledge to successfully integrate your graphics in our template are covered in Session 01.
Coding requires time and patience, sometimes you might just not be interested in getting there!
Use the examples provided in Session 01 and you will be more than fine ☺️
