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

**Step 2** - Now our data are ready to be used. We have to prepare our code. To do so we start by calculating width and height of our chart, which will be used later to position our figure inside the `svg` tag in the `index.html` file.

Go to `index.js`. You will notice that our file is organised in "boxes". We have a bigger box called `app` and inside we have *smaller* boxes such as: `data`, `mounted`, `computed` and so on. This structure is proper of Vue.js and it will allow us to keep our code consistent. If you want to learn more about what does what you can take a look here: [The Vue Instance](https://vuejs.org/v2/guide/instance.html).

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

**Step 3** - Inside `then()` we can map our data to return a JS object representing only the fields we need or converting strings to numbers for a easier usage later:

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

**Step 3** - Let's create another group. This one will be a special one. By using the `v-for` directive we can use an array of data and loop through it to *create as much svg groups as there are elements in the array itself*.

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
<!-- data is our data! As simple as that -->
<!-- bar is a single element in data, we call it `bar` so that we actually know what we are referring to-->
<!-- i is the index for that specific element -->
<g v-for="(bar, i) in data" :key="`bar-${i}`" :transform="`translate(${barWidth * (i + 0.5)} 0)`"></g>
```
**Long story short:** I can create one unique element and use the `v-for` directive to generate as much other elements as I need, be them 5 or 50000. Then I can also use the properties of this single element!

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
**Step 3** - Now we can also generate some `<rect>` elements: our bars!

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
Actuallky...
Now you will just see tiny little rectangles. Absolutely meaningless. In the next exercise we will see how to appropriately scale them according to our viewport.
