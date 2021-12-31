---
title: 2021 In Review
date: '2021-12-31'
tags:
  [
    'react',
    'relay',
    'frontend',
    'backend',
    'graphql',
    'svelte',
    'java',
    'kotlin',
    'backend',
    'spring',
    'node',
  ]
draft: false
summary: A quick breakdown of programming related goals and achievements in 2021
images: []
layout: PostLayout
---

# Goodbye 2021

To send off 2021 I thought it might be beneficial to quickly jot down some of the highlights of the past year, especially those programming related. Just a fair warning, this post is just a long list of technical jots. Feel free to just skim through it!

_Note: Obligatory fireworks GIF since I can't be bothered filming the real fireworks show_

<div style={{width: "100%", maxWidth: "600px", margin: "0 auto"}}><div style={{width:"100%",height:0,paddingBottom:"67%",position:"relative"}}><iframe src="https://giphy.com/embed/26tOZ42Mg6pbTUPHW" width="100%" height="100%" style={{position:"absolute"}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div></div><p><a href="https://giphy.com/gifs/26tOZ42Mg6pbTUPHW">via GIPHY</a></p>

# Career

## Atlassian

Transitioned from intern to full-time software engineer at Atlassian! Currently working as a full-stack developer on Jira 🙃. It's been a great experience to learn about development processes in the context of a large company. Especially those entailing best practices, security, reliability and performance.

## Ewokii

Co-founded a startup called Ewokii! Currently working as one of the technical co-founders and have been learning a lot about building a product from scratch. It's a whole different challenge as opposed to working in the confines of Atlassian where a lot of the tougher architectural decisions are already made for you.

# University

Finally graduated from Uni! Glad that ship has sailed. Was so done with it by third year especially after realising that I hated engineering. I did two final courses, both were which related to introductory computer science. One was in `Python` and another in `C`. Did I learn anything new? Probably not. But being able to breeze through these courses meant that I was able to spend time learning other more important things!

# Technologies

## AWS

Had my first proper taste of deploying a production application to AWS. This involved learning how to use tools such as RDS, S3, Secret manager, Elastic Beanstalk and more. I can safely say that AWS is a pain in the ass to use.

## CI/CD

Learned a mix of Github Actions and Circle CI to implement automated tests and deployments. It was a lot of `yaml` to write...

## Frontend

Spent the better part of the year honing my React and NextJS skills. More recently I have been obsessed with the upcoming improvements to data-fetching (literally blows my mind what's been happening in this space). Here's the few takeaways that I have found.

### Relay

For some reason I always stayed away from Relay due to potentially misinformed opinions saying that alternatives such as `urql` and `Apollo` were better. I have since realised that Relay actually provides a lot of benefits for client-side GraphQL that the other libraries don't provide including:

1. Data-masking
2. Fragment stitching to compose a single query
3. Data requirement collocation
4. Separation of fetching and rendering behaviour
5. Connections for pagination being built-in
6. Built-in Directives

### Suspense

I'm a bit late to the party but I only fully learned about suspense this year and oh boy does it change things. No more imperative handling of datafetching and rendering inside the component. All you need to do is write the error boundary and suspense boundary and you can safely assume that the component will work!

Without Suspense:

```js
// component imperatively handles all logic
export function Foo() {
  const { data, loading, error } = useQuery(MY_QUERY)

  if (loading) return 'Loading...'

  if (error) return 'Error...'

  return <div>{data}</div>
}
```

With Suspense:

```js
// parent component contains boundaries
export function Bar() {
  return (
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <Foo />
      </Suspense>
    </ErrorBoundary>
  )
}

// child component contains just data fetching logic
export function Foo() {
  const { data } = useQuery(MY_QUERY)

  // ignore loading and error because those will bubble up to the nearest boundary

  return <div>{data}</div>
}
```

### React Server Components

Haven't played around with it too much but I've been deep-diving the Github discussions, React documentation and videos about this. Instead of rendering React client-side, we can render it on the server and just stream the resulting `HTML`. The benefit of this approach is that we will now have the power of the server at our disposal. We are no longer constrained by the client-side bottlenecks and can fully leverage the power of the server!

### Svelte

Built a nice little app in Svelte just to demo it out. It's awesome and I can see why people love it. Only downside is that there aren't enough libraries in the Svelte ecosystem yet. (A lot of things I rely on are still React related)

## Backend

### JVM

This year I finally got acquainted with the JVM via both Java and Kotlin! Kotlin I've been using both at work and for personal projects while I use Java exclusively for work. IntelliJ is a god-send for working with these languages, especially since I get the Ultimate edition for free courtesy of Atlassian.

### Spring Framework

I don't know if I'm stupid or whether Spring is just both a really powerful yet convoluted backend framework. At times I know 100% what is going on and what I'm doing and other times I'm scouring a bunch of docs and tutorials just to get a simple feature working.

1. Nice dependency injection setup
2. Mockito + JUnit (+ Mockk) is testing heaven
3. Annotations make common tasks trivial! (`@RequestBody`, `@PathVariable` and more)
4. I hate Spring Security because I don't understand it
5. JPA is nice but I don't know if I'm missing anything by not writing raw SQL

### Databases

I learnt the bare minimum about of SQL and it has been life-changing. Also played around with `Prisma` which is a new type of ORM. Instead of mapping objects to database tables, it uses a schema file instead. From this schema it can then generate a fully-typed database client. Pretty neat and quick to get up and running. Apparently there's some issues related to transactions and scalability but I have not faced such issues just yet.

### Node

Migrated from using `express-js` to `koa`. Seems nicer albeit perhaps some of the middleware is missing. But support for `async/await` without having to hack it together is so good!

## Functional Programming

Became a functional programming fanatic with some exposure to the paradigm via pet projects and usage of if libraries at work. Here is my rundown of what's cooking:

### Typescript

I've been writing a backend using the `fp-ts` library which exposes a lot of the concepts that you might find in Haskell but for Typescript instead. It took some time to really grok how to use this library as there aren't specific tutorials on it. You mostly have to learn functional programming first before attempting to utilise the functions in `fp-ts` but it has been worth it.

The biggest takeaway from this library is the usage of a `Task` instead of a `Promise`. Promises are eagerly evaluated which is a bad thing if you forget to `await` it or `catch` errors. A Task in `fp-ts` enforces that you handle the error case and is not evaluated until you directly invoke it! Additionally the usage of `Option` and `Either` enforces that I correctly handle missing values and error types.

### Java

When working at Atlassian, we use a library called `Fugue` to write functional code. I believe the author of this library was annoyed that Java 8 lacked support for `Option` and `Either` and a myriad of features that one might get from Scala.

Similarly, I recently picked up a functional library called `Arrow` which is specific to Kotlin. This too has been a pleasure to work with.

### Elixir

Had a brief stint writing a backend using `Elixir` and it's web framework `Phoenix`. Apparently it is somewhat of a successor to Ruby on Rails, but much faster. It's nice but didn't have the nice guardrails of a fully typed functional language. Metaprogramming isn't my strong suit either. If I had time or motivation I might dive back into it again. I will say though, `Ecto` is a pretty nice library for interacting with the database.

### Elm

Elm was my first introduction to FP this year and it was awesome. Nice error messages, and you can never compile code that will cause a runtime error! My only gripe is that the project looks like its stagnated.

## Tools

My tools have been refined a little since last year. During the middle of the year I became frustrated with the slowness of my Dell XPS which I bought in 2016 and decided to overhaull all of my tooling. This included wiping my laptop of Windows and installing Linux as well as replacing `VsCode` for `neovim` (with a side of `tmux`) and `emacs` (`Spacemacs` and `Doom-emacs`).

### Neovim and Tmux

Nice, fast, lightweight. Had to write a bit of configuration to get the editing experience just the way I liked it. Used `coc` to implement language server protocols. Since then I believe it's upgraded to use its own built-in lsp server but I have not tried that out yet.

### Various flavours of Emacs

Initially tried Spacemacs but it was way too bloated for my use case. Additionally I had to grok a whole lot of documentation specific to Spacemacs rather than the Emacs platform itself (such as their config system called layers). Not my cup of tea. Instead I opted for a more lightweight option called Doom-emacs. It was past, performant and easy to configure and extend when needed. I liked this one a lot and spent a few months working full-time in it. Emacs itself has its own lsp implementation so I was able to replicate some of the features of VsCode.

My favourite parts of using Emacs were `org-mode`, `magit` and how it introduced me to using `SPACE` as one of the main modifier keys in which I could combine to perform a myriad of other actions. This was so good I simply had to download plugins in `VsCode` and `IntelliJ` which port over the same key mappings to each respective editor.

### VsCode

After working with Emacs on my old laptop, I was then blessed with a full-spec Macbook Pro from work. With the extra resources I was able to go back to VsCode. My favourite parts of VsCode was that it just worked. Whenever I needed something done I could just add an extension and everything would be ready. Compare this with writing extra config files for Emacs or Neovim. The one thing I did miss however was `org-mode` and editting `markdown` in VsCode is nice, but lacks the features and hotkeys of `org-mode`.

### IntelliJ

IntelliJ just blows me away with all the features that I didn't know could exist. Things such as jumping from an interface to an implementation, searching through the entire project and running individual tests are the quality of life improvements I didn't know that I needed. I'm using it for Java and Kotlin development right now (duh), but am still not yet sold on it for Typescript development. Not much more to say here.

## Work Setup

Here are some of my key purchases this past year or two:

1. MX Master 3 Mouse - I remapped the extra mouse buttons for copy-pasting and the scrollbar is just so damn smooth!
2. Keycron K2 - Brown switches are nice and the keys have good depth. My first mechanical keyboard ever! (Hot tip, remap the `CAPS` key to `CTRL`)
3. Steelcase Leap V2 - Better than the Herman Miller Aeron IMHO
4. Omnidesk - I don't use the standing feature, but instead I like being able to adjust the table so it is slightly lower to keep my arms in an ergonomic position
5. Samsung Ultrawide monitor - So I can read my Java classnames on a single line xd. Also connects via USB-C so it acts as a dock by itself without any extra charging cables required

## Concluding Statements

I've only been writing for about an hour but I feel like I've already vomited out way too much information in a single article. Regardless it was good to reflect on what's been going through my head the past year.

Happy new year to you all and thanks for reading!

Keep it spicy 🌶️

~ Jing
