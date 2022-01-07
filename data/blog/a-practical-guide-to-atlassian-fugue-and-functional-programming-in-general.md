---
title: A Practical Guide to Atlassian Fugue (and functional programming in general)
date: '2022-01-07'
tags: ['functional programming', 'Atlassian', 'Fugue', 'Java']
draft: false
summary: Learn Atlassian Fugue, functional programming and more!
images: []
layout: PostLayout
---

# Introduction

Atlassian Fugue is a library used to bridge the gap between Java’s OO and imperative style of coding with a functional style such as Scala. The key features of this library include the Option and Either monads, both of which have a number of utility methods to construct a sequence of operations.

## Option

You can consider the Option from Fugue to be similar with the built-in Java Optional with a number additional superpowers. It contains either “Something” or “Nothing”.

Below is an example of how to create Options from something or nothing:

```java
Option<String> some = Option.some("Something exists here");
Option<String> none = Option.none();
```

The most basic benefit of using this class is the ability to have a type-safe way define a null value. We will see later on that using this class enables us to compose a set of functions without ever having to explicitly perform a null check.

_Note: If you’re coming from other languages such as Elm or Haskell. You might know this by another name such as Maybe._

## Either

When discussing the Option type, we had two cases, nothing i.e. null and something i.e. String. Option is great for when we want to work with functions that return something or nothing. But what if the function returns an Error or throws an Exception?

We can represent this using an Either type, by replacing the “Nothing” and “Something” cases of an Option with a “Left” and “Right” case. By convention, a “Left” value means something went wrong and the “Right” value means a successful value.

You could also say that that Option type is a glorified Either type which has “Nothing” as the “Left” value and “Something” as the “Right” value.

Below is an example of how to create Eithers for a successful and error state:

```java
Either<Error, String> = Either.right("Successful value here");
Either<Error, String> = Either.left(new Error("Something went wrong"));
```

Perhaps a common use case would be inside of a function that could potentially throw an exception (Note: Fugue also provides a Try class to handle this scenario)

```java
try {
    String result = doSomething();
    return Either.right(result);
} catch (e: Exception) {
    return Either.left(new Error(e.message));
}
```

The Either type allows us to have more control over our programs by explicitly handling the error states, instead of throwing exception anywhere in the call stack. Ideally, you’d want to push the handling of errors to the outermost layer of the application, before deciding if you want to throw it as an Exception or handle it in some other graceful manner.

If you’re coming from other languages such as F# or Elm, you might know of Either as a Choice or Result type.

# Composing programs with Fugue

Now that the basic concepts of Option and Either have been laid out, it’s time to see how we can use them to compose functional programs. Both classes have methods on them called map and flatMap

## Map

Practically, map allows to take an Option or Either container, check to see if a value exists, apply a function to it and then put that new value into its original container.

```java
Option<Int> some = Option.some(1).map(i -> i + 1); // same as Option.some(2)
Either<Error, Int> right = Either.right(1).map(i -> i + 1); // same as Either.right(2)
```

On the other hand, if the value is Nothing or an Error, then map will skip the function call and just fall back to the original value.

```java
Option<Int> none = Option.none().map(i -> i + 1); // same as Option.none()
Either<Error, Int> right = Either.left(new Error()).map(i -> i + 1); // same as Either.left(new Error())
```

The map function in an imperative style can be represented as:

```
if (i != null) {
    return i + 1;
} else {
    return null;
}
```

## Flatmap

Similar to map, flatMap can be applied to an Option or Either container, check if a values exists and apply a function to it. The key difference is that the output value is not automatically placed into the new container. Why would we need this?

Consider the following scenario:

```java
// A function that returns something if a number is even or nothing
Option<Int> onlyEvens(Int i) {
    if (i % 2 == 0) {
        return Option.some(i);
    }
    return Option.none();
}

// Naive call using map
Option<Int> some = Option.some(2).map(this::onlyEven); // results in Option.some(Options.some(2))
Option<Int> some = Option.some(1).map(this::onlyEven); // results in Option.some(Options.none())
```

Notice how the output is a nested Option? This is a bit odd to work with. It would be much nicer if there was only one Option layer to deal with. We can solve this issue using flatMap, which flattens the layers of Options into a single layer, while also handling the Nothing cases for us as well:

```java
Option<Int> some = Option.some(2).map(this::onlyEven); // results in Options.some(2)
Option<Int> some = Option.some(1).map(this::onlyEven); // results in Options.none()
```

This is analogous to how flatMap is applied on arrays. An Array is a similar container to an Either or Option and we use flatMap to convert nested arrays into a single array. Just as we just did to convert nested Options into a single Option!

The above examples were used with the Option class. However, the same concepts can directly be applied to the Either class as well.

## GetOrElse and Fold

The final step to working with Option and Either is finding a way to unwrap the values out of their container. It wouldn’t make sense for example to have our API return Option.some(userData) inside of a JSON response!

We can use the methods such as getOrElse and fold to extract our values:

```java
Int i = Option.some(1).map(i -> i + 1).getOrElse(0); // 2
Int i = Option.none().map(i -> i + 1).getOrElse(0); // 0

Int i = Either.right(1).map(i -> i + 1).fold(e -> throw e, i -> i * 2); // 4
Int i = Either.left(new Error()).map(i -> i + 1).fold(e -> throw e, i -> i * 2); // Thrown Exception
```

For the Option type, we can get the value if it exists or fall back to a default value if it was Nothing. For the Either type, we can use the fold method to define what to do when there is a Left case i.e. Error or Right case. In the above example, we threw the error or multiplied an existing value by 2.

There are more destructor methods for these types, but the most commonly used ones are the fold and getOrElse.

## Railway oriented programming

To put the above concepts all together, we will leverage an important mental model called railway oriented programming model. In relation to the following image, we have a green railway line and a red one. Big surprise, the green one represents the successful or happy path while the red indicates the sad or error path.

![](https://miro.medium.com/max/1400/1*pxXvepfiDZlsO2X-KSwFqQ.png)

Going from left to right, consider each intersection (where there is a connection from the happy to sad path) as a single function call, where the output of the function may continue along the happy path or switch to the sad path.

This is exactly what our map and flatMap functions are doing. As long as we have “Something” in an Option or “Right” in an Either, we can continue along the green happy path and call each successive function.

The moment we hit a “Nothing” or “Left” we immediately switch to the red sad path. The best part is that the due to the way map and flatMap work, even if we hit the red sad path early on in the program. All successive function calls are skipped.

Here is an example of a snippet for a GraphQL Datafetcher I wrote recently:

```java
@Override public DataFetcherResult<String> get(DataFetchingEnvironment environment) {
    return Option.option(environment.getLocalContext())
            .flatMap(this::getJqlContext)
            .map(JqlContext::getJql)
            .map(jqlStringSupport::generateJqlString)
            .fold(() -> buildResult(null), this::buildResult);
}
```

Here are some important things to note about this example:

1. environment.getLocalContext() can potentially return null
2. getJqlContext will convert LocalContext into JQLContext but returns null if it fails to cast
3. getJql can potentially return null
4. generateJqlString will always succeed
5. buildResult can take in a null or String and generates a GraphQL response

We can see that each operation is chained one after another. A happy path example would be to:

1. Get LocalContext
2. Cast to JqlContext
3. Get the JQL
4. Generate the JQLString
5. Return a successful result

On the flip side, if steps 1 or 2 or 3 fail then we skip any of their subsequent functions and go straight to the () -> buildResult(null) function.

For comparison’s sake, here is what this snippet might look like without Fugue:

```java
@Override public DataFetcherResult<String> get(DataFetchingEnvironment environment) {
    LocalContext localContext = environment.getLocalContext();
    if (localContext == null) {
        return buildResult(null);
    }
    JqlContext jqlContext = getJqlContext(localContext);
    if (jqlContext == null) {
        return buildResult(null);
    }
    Query jql = jqlContext.getJql();
    if (jql == null) {
        return buildResult(null);
    }
    String jqlString = generateJqlString(jql);
    return buildResult(jqlString);
}
```

Personally, I prefer the Fugue functional style as there is less boilerplate null checking to do such as i.e. if (something == null) {}.

# Where next?

If this little post about functional programming and Fugue sparked your interest then I highly suggest playing around with it in your own code. Personally, I’ve been using Fugue a lot when programming in Jira Monolith as it is still heavily used there. For more personal projects I have been using a library called for Typescript called fp-ts to bring functional programming concepts to the Typescript language. Similarly for Kotlin I have been using Arrow.

If you are feeling extra red-hot you can go all in using something like Purescript, ReScript or Elm on the frontend. On the backend there is F#, Scala and Haskell.

Apart from the languages, you might be interested in the more technical terms of these concepts such as Functor, Applicative and Monad. These words might seem scary at first, but give it some time and try to really understand them. Think back to when you first heard of big scary words like Encapsulation, Singleton, Factor when learning OOP or Observable, Mono and Flux when learning reactive programming. These are just fancy words to explain core concepts associated with a programming paradigm.

Hope this helps and thanks for reading!

Keep it spicy 🌶 ️

~ Jing
