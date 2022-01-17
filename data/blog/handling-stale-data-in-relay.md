---
title: Handling Stale Data in Relay
date: '2022-01-16'
tags: ['react', 'relay', 'graphql']
draft: false
summary: Some short jots related to Relay and updating a stale cache with fresh data
images: []
layout: PostLayout
---

# Overview

[Relay](https://relay.dev/) is Facebook's implementation of data fetching via GraphQL. Having used it at work, I honestly have to say it is incredibly useful. However, it does have a more opinionated way of doing things. Pair that with documentation that does not look so great, it becomes quite confusing to work with.

To keep things short and simple, this post will discuss some basic methods of replacing stale data in the cache. There are multiple ways to do this, each with differing layers of complexity and use cases.

## Fetch Policies

The simplest way to invalidate data is through a one-line piece of configuration known as a `fetch-policy`. This tells the Relay client what to do whenever it has to fetch data from the server:

- `store-only` - never make a network request
- `store-or-network` - don't make a network request if there is cached data, otherwise make one
- `store-and-network` - immediately show cached data but always make a network request and update as necessary
- `network-only` - never use cached data and always make a network request

The fetch policy you select will depend on your use case. You might have a requirement of how much load you wish to place on the server. In this case a `store-only` or `store-or-network` approach might work best for you. On the other hand, you might need to always show the most up-to-date data. For this scenario, if you wish to avoid hitting the `Suspense` boundary and showing a loading state, `store-and-network` will give you the most bang for your buck. Otherwise if UX and server load are not an issue, you can go all in on `network-only`.

Using fetch policies thus allow you to specify whether or not you want to use stale data from the cache. If you are interested in invalidating data when you navigate away from a page/component and return to it, then you can achieve that by using `network-only` or `store-and-network` on the root query for that page.

Here is a snippet in action:

```js
loadQuery({ ...variables }, { fetchPolicy: 'store-or-network' })
```

## Refetchable Queries

Fetch policies are great when you are able to retrigger the `loadQuery` function by unmounting and remounting a component or by navigating to different pages or components that have different queries. For example, you might render a modal on the same page that will somehow trigger a data update on the server. However, because the modal unmounts but not the page, you will still have stale data on the page, without a way for the fetch policy to kick in. Assuming `updater` functions are unavailable to you (which we will discuss later) refetchable queries are your next option.

A refetchable query can be created by using the `@refetchable` directive on a fragment. For example, Relay exposes hooks such as `usePaginationFragment` and `useRefetchableFragment` that allow you to define a fragment that can be refetched independently of the root `loadQuery` function.

A `useRefetchableFragment` snippet example:

```js
const [data, refetch] = useRefetchableFragment<RefetchQuery, _>(
graphql`
    fragment Fragment_component on Component
    @refetchable(queryName: "RefetchQuery") {
        ...Other_fragments
    }
`,
props.queryReference,
);

// call this somewhere else in your component tree
const refetchHandler = () => refetch({}, { fetchPolicy: "store-or-network"});
```

The `refetch` function provided by the `useRefetchableFragment` hook can be invoked as needed whenever you require new data from the server. This way, you have control over flushing stale cache data by manually calling `refetch`. Another use case would be automatically updating data ever 30 seconds from the server without a subscription. You can run a `useEffect` and `setInterval` that will call `refetch` every few seconds to ensure the data is always up to date.

## Updater Functions

In GraphQL, mutations are used to update data on the server. This means whenever we perform a mutation, we already know in advance that the currently cached data is potentially stale. Because we know this, `useMutation` hooks come with an `updater` function which allow us to directly go to the Relay store and update it.

A simple example would be a form submission that creates a new item in some list. This form submission would call the `commit` function from a `useMutation`. Inside of the `commit` options we can add an `updater` function that will get the return value of the mutation and immediately update the store. This is great because we don't need to make a separate network request to update stale cached data (`refetch` and `fetch-policy` will need to make a new network request). Really mad about good UX? You can do one better by using `optimisticUpdater` instead of the plain old `updater` function.

```js
const [commit] = useMutation()

const submitHandler = () => {
  commit({
    variables,
    updater: (store, payload) => {
      // update Relay store here
      // payload is the mutation response
    },
  })
}
```

## Committing Local Updates

Outside the context of an `updater` function, you might still need to commit a store update or invalidate data. Ideally, you wouldn't want to do this, but in a larger application that might not be fully writting in Relay and GraphQL, you might perform a REST API call to update some data and need to invalidate data afterwards.

You can achieve cache updates in this scenario with `commitLocalUpdate`. This does require that you pass in a Relay environment which you can easily obtain with the `useRelayEnvironment` hook. Here is a quick example:

```js
const environment = useRelayEnvironment()

const submitHandler = () => {
  // perform a REST API call or similar
  commitLocalUpdate(environment, (store) => {
    // manually update Relay store here
  })
}
```

## Refresh The Page

If all goes wrong. Just refresh the page. Terrible UX. Simplest result.

# Conclusion

In summary, there are a plethora of ways in Relay to handle stale data. Discussed were simple methods such as `fetch-policy` and `refetch` that tell Relay to make a new network request to replace stale data. Other methods such as `updater` and `commitLocalUpdate` functions allow you to directly interact with the store, allowing you to perform store updates without a separate network request. While each method has it's own use case, I highly suggest working with the simplest solutions first before working up the chain of complexity.

That's all for today!

Keep it spicy 🌶️

~ Jing
