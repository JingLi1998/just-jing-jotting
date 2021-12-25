---
title: Git Init Jing
date: '2021-12-25'
tags: ['Command Line', 'React']
draft: false
summary: Welcome to my blog. Coming up today - command line tools and Remix!
images: []
---

# Welcome

Hi there and Merry Christmas! 🎄

On a whim, I have decided to start a blog about all random things coding. I haven't decided on the scope of topics yet but I feel like it will range from things I pick up while working at my current Atlassian job, lessons about the f\*ck-ups I make running my own startup Ewokii and even just random tidbits I learn from time to time.

# What I've Learnt This Week

## Command Line Tools

I've never been a sysadmin type of guy, but I'm not one to shy away from running scripts in the terminal to do menial tasks. Last week I decided to get my hands dirty with `grep` and `xargs`.

Here is a brief rundown of what each do:

- `grep` find instances of a regex expression (can be done per line or per file)
- `xargs` pipe multiple inputs into another command

So my task at hand was to find all packages in a monorepo which contain `moment-js`. For context, my team is migrating `moment-js` to `date-fns` to reduce bundle size. A nice way to quickly list the packages and open them in my editor was the following:

```
grep --recursive --files-with-matches 'My Team Name' --include package.json ./src \
  | xargs grep --recursive --ignore-case -l --extended-regexp 'moment'
  | xargs code
```

What this does is recursively scan the `src` directory for files named `package.json` containing the string `My Team Name` and outputs the file name. This is then passed into a second grep command to filter for files with the package name `moment`. I then pass the final output to `code` which opens up each file in the editor. This is a fairly simple example, but snippets become a superpower when combined with other tools like `sed`, `awk` and `tr`. But that can be saved for a separate blog post.

## Remix

If you've been delving into the non-stop churn of frontend frameworks, you might've heard of one of the most recent ones to hit the market called **Remix**. Built on top of React, this is a framework focussed on providing the necessary tools to create a fully-fledged server-side application.

I spent an afternoon writing a blog app in it (following the tutorial in their documentation) and can say that I'm pleasantly surprised. Similar to **NextJS**, you can define loader functions which act similar to the `getServerSideProps` function. The only difference is that instead of receiving them as props, you can access them via hook `useLoaderData`. Another nice improvement is the move back to native HTML form behaviour. Typically in the React ecosystem, you might reach out for a library such as **React Final Form**, **Formik** or **React Hook Form** and then calling the `onSubmit` function. Remix however goes back to the default form behaviour where you specify the `method` to make a put, post or delete request. Then you define a separate `action` function to run serverside to handle submission and error handling. Pretty nifty in my opinion!

Walking away from app I made in Remix made me appreciate how simple server-side websites could be. It felt a lot less like writing React but more like native HTML, CSS and JS with some quality of life improvements sprinkled on top. I have yet to leverage some of the deeper features of Remix.

# Shoutouts

Not necessarily gonna provide shoutouts on every blog post, but I always have a soft spot for people learning how to code without a computer science degree. After all, this was the same humble beginning I came from as well. As such, please go visit my friend (are we even friends? 🤔) Renee Zhang's first portfolio website [here](https://reneezhang23.github.io/personal-website/). Not bad for only several weeks of coding!

That's all from me today. Hope you enjoyed the first of many blog posts. Thanks for reading!

Keep it spicy 🌶️

~ Jing
