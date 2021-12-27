---
title: Cyanara Default Theme!
date: '2021-12-26'
tags: ['design', 'tailwind']
draft: false
summary: Learn all the ins and outs of how I updated the theme for this blog website.
images: []
layout: PostLayout
---

# Say hello to the new colour theme

It's only been one day, but I've already done a sneaky little update to the entire website. The entire colour palette!

<div style={{width: "100%", maxWidth: "400px", margin: "0 auto"}}><div style={{width: "100%", height: 0, paddingBottom: "88%", position: "relative"}}><iframe src="https://giphy.com/embed/Z2u1rkERW1Ohy" width="100%" height="100%" style={{position:"absolute"}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div></div><p><a href="https://giphy.com/gifs/cartoon-creepy-aph-america-Z2u1rkERW1Ohy">via GIPHY</a></p>

Interested in how I went about designing implementing the theme? No? Great! I will still explain regardless 😝.

## Selecting a base theme

To begin, I needed to create a base set of colours to act as the foundation of the new site look. Since this blog is about coding, I decided to take inspiration from my editor and use the [Moonlight VSCode Theme](https://github.com/atomiks/moonlight-vscode-theme). This is my go-to theme and I have already spiced up my IntelliJ, VsCode and terminal with it! So why not apply it to my blog too?

If you click into the Github repository linked above, you'll be able to locate a `colors.js` file with all the goodies we're looking to copy paste:

```js
// colors.js
module.exports = {
  '--moonlight-desaturated-gray': '#7f85a3',
  '--moonlight-dark-blue': '#3e68d7',
  '--moonlight-blue': '#82aaff',
  '--moonlight-sky-blue': '#65bcff',
  '--moonlight-cyan': '#86e1fc',
  '--moonlight-red': '#ff757f',
  '--moonlight-dark-red': '#ff5370',
  '--moonlight-light-red': '#ff98a4',
  '--moonlight-yellow': '#ffc777',
  '--moonlight-orange': '#ff966c',
  '--moonlight-dark-orange': '#fc7b7b',
  '--moonlight-teal': '#4fd6be',
  '--moonlight-green': '#c3e88d',
  '--moonlight-purple': '#c099ff',
  '--moonlight-pink': '#fca7ea',
  '--moonlight-indigo': '#7a88cf',
  '--moonlight-bright-cyan': '#b4f9f8',

  '--moonlight-gray-10-alt': '#bcc4d6',
  '--moonlight-gray-10': '#c8d3f5',
  '--moonlight-gray-9': '#b4c2f0',
  '--moonlight-gray-8': '#a9b8e8',
  '--moonlight-gray-7': '#828bb8',
  '--moonlight-gray-6': '#444a73',
  '--moonlight-gray-5': '#2f334d',
  '--moonlight-gray-4': '#222436',
  '--moonlight-gray-3': '#1e2030',
  '--moonlight-gray-2': '#191a2a',
  '--moonlight-gray-1': '#131421',
}
```

Woohoo! This code snippet contains all the base colours we will need to work with to overhaul the website theme!

If you're looking for something a little more creative, I definitely recommend using the [Coolors Generator](https://coolors.co/) to spice up your next website theme 💯.

## Extending the Tailwind Configuration

The blog template I'm currently using uses Tailwind as it's styling method. If you haven't heard of Tailwind, I highly recommend you check out their [website](https://tailwindcss.com/). Instead of leveraging plain `css` or component libraries, you simply use small, reusable utility classes to style your application.

Without going too into the weeds about how it works, Tailwind basically has a `tailwind.config.js` file to store all of the global styles which it compiles down to css variables and exposes in its utility classes.

This configuration is where we want to add the color styles we previously selected:

```js
// tailwind.config.js
module.exports = {
  // ...other configuration properties
  colors: {
    moonlight: {
      desaturatedgray: '#7f85a3',
      darkblue: '#3e68d7',
      // ...other colours

      gray: {
        // ...other shades
        200: '#191a2a',
        100: '#131421',
      },
    },
  },
}
```

As an additional note, I've slightly manipulated the object and naming to better adhere to how Tailwind likes to view its colour objects. This includes converting namespaces into nested objects and converting the shade values into multiple of 100. So far so good, we are nearly done with our color theme object.

## Super Secret Theming Hack

If you're not too well-versed in how to create a nice theme, I've got a neat little tip for you! It's called a shade generator. Basically, when working with designated colour palette, there is no absolute need to mix all your colours together in one go. In fact that will probably result in a pretty terrible looking website. Instead, pick a small subset of colours from the main palette, and use light and darker shades to design your UI.

You'll see this already in libraries such as Tailwind where you have shades of a colour from `100, 200 ..., 900`. I'm a big fan of this system, so I simply use a website called [Tailwind Shades Generator](https://www.tailwindshades.com/) to generate shades for the colours. Here is a quick example:

```js
const originalColour = '#FFC777'

const generatedColourObject = {
  yellow: {
    DEFAULT: '#FFC777',
    50: '#FFFFFF',
    100: '#FFFFFF',
    200: '#FFF9F1',
    300: '#FFE9C9',
    400: '#FFD8A0',
    500: '#FFC777',
    600: '#FFB03F',
    700: '#FF9907',
    800: '#CE7900',
    900: '#965800',
  },
}
```

How awesome is that? Simply rinse and repeat this for each of the colours you want to generate shades for. You might be wondering in what scenarios would differing shades matter. I typically use them for when I want to darken or lighten the colour of a button or link when hovering the mouse cursor over it. Another use case would be to adjust the shade of a colour between dark mode and light mode. Sometimes the default colour is just a tad too hard to read, so we can simply adjust its shade for better readability.

## And Away We Go! 🏁

With the configuration and setup complete, we can now use the colours throughout our application. These colours are exposed inside of Tailwind classes such as `text-moonlight-darkblue-600` or `bg-moonlight-gray-400`. I've tweaked the colours and shades for both light mode and dark mode, finding a good balance between readability and spiciness 🌶️. Personally, I am now in love with the dark mode of the website, and it really reminds me of my own editor. Light mode however sacrifices a bit of zestiness 🍋 in favour of readability, so most of the text as been reverted to black instead of a cooler colour scheme.

If you are interested in taking a look at my updated Tailwind configuration, you can easily find it on the Github repository for this blog. It's not the best or most scalable way to theme a site, but it works. Leave a comment if you enjoy the new site theme!

Keep it spicy 🌶️

~ Jing
