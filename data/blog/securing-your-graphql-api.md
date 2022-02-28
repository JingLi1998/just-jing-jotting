---
title: Securing your GraphQL API
date: '2022-02-28'
tags: ['graphql', 'node', 'koa', 'firebase']
draft: false
summary: How to add a permissions layer to your GraphQL API
images: []
layout: PostLayout
---

# Overview

Recently I had the absolute pleasure of implementing my own permissions layer for my GraphQL API.
The stack I ended up choosing for this endeavour included:

- Firebase - for authentication
- Koa - server middleware
- Apollo - GraphQL server
- Prisma - database ORM client
- GraphQL shield - permissions middleware

## Setting up Firebase

I used Firebase auth because it was super simple to get up and running. On the serverside you'll
need to add the admin SDK to do JWT validation logic.

```ts
import { initializeApp, credential } from 'firebase-admin'

export const firebaseApp = initializeApp({
  credential: credential.cert({
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
})
```

## Setting up Koa middleware

Now that Firebase is setup, we need to extract the authorisation token from the request headers.
To do that in Koa we need to write our own middleware function.

```ts
export type User = {
  uid: string
  role: string
}

const roles: Map<string, string> = new Map()

export const verifyUser: () => Koa.Middleware = () => async (ctx, next) => {
  const idToken = ctx.request.header.authorization
  if (!idToken) return await next()

  const { uid } = await firebaseApp.auth().verifyIdToken(idToken)
  const role = roles.get(uid)
  if (role) {
    ctx.user = { uid, role } as User
    ctx.state.user = { uid, role } as User
    return await next()
  }

  const dbUser = await prisma.user.findFirst({
    where: { firebaseId: uid },
  })
  roles.set(uid, dbUser?.role ?? 'user')
  ctx.user = { uid, role: dbUser?.role ?? 'user' }
  ctx.state.user = { uid, role: dbUser?.role ?? 'user' }

  return await next()
}
```

The code looks a little funky, but here is what we are trying to do:

1. Get the authorisation header from the Koa `ctx` variable
2. Validate the token using `verifyIdToken`
3. Check to see if the user's role is already stored in the `roles` map
4. If it exists, update the context state to contain the `uid` and `role`
5. If it does not exist, query the db to get the `uid` and `role` then update the map and context state with those values

You might be wondering why we are storing the roles in the in memory map. The reason is because I wanted to have a
quick method of looking up the user's role without having to always query the database. Right now this is done in memory but it can always be extracted to a separate Redis database.

An alternate solution that I attempted was to update the claims of the JWT. This works but the changes only propogate to the clientside once the user refreshes their token, either by relogging or other means. I decided that the in-memory map solution was simpler to implement.

## Applying permissions with GraphQL shield

Now that we have the current user's role stored in the request context, the next step is to validate their role prior to consuming or updating a resource. This is where [GraphQL Shield](https://www.graphql-shield.com/) comes into play.

The library basically allows you to do a permissions check prior to resolving a particular field.

```ts
import { or, rule, shield } from 'graphql-shield'

const isEditor = rule({ cache: 'contextual' })(
  async (_parent, _args, { ctx }: MyContext) => ctx.state.user?.role === 'editor'
)

const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, { ctx }: MyContext) => ctx.state.user?.role === 'admin'
)

export const permissions = shield({
  Query: {}, // anyone can query anything
  Mutation: {
    createResource: or(isEditor, isAdmin), // admins and editors can create and edit resources
    updateResource: or(isEditor, isAdmin),
    deleteResource: isAdmin, // only admins can delete resources
  },
} as PermissionsSchema)
```

I won't discuss the intricacies of the caching options, but the core idea is that you have a function that has access to the typical resolver parameters i.e. `parent`, `args`, `ctx` and `info`. That result of that function needs to return a boolean to determine if a user should or shouldn't have access to that field. You wrap this function in a `rule` provided by the `graphql-shield` library and then apply it to the `shield` object. The `shield` object is basically a copy of your schema with the values being your rule functions rather than resolver functions.

Additionally you can mix and match different rules by using the provided `or`, `and` and `not` functions.

## Putting it all together

Now that you have the pieces all nicely collected, it's time to put them together. Basically, you have to wire up the middleware into your main server instance:

```ts
const schema = makeExecutableSchema({ typeDefs, resolvers }) // create your schema separately

const app = new Koa() // init Koa app
app.use(verifyUser()) // apply middleware to read JWT

const httpServer = http.createServer()
const server = new ApolloServer({
  schema: applyMiddleware({
    schema: applyMiddleware(schema, permissions), // apply graphql-shield permissions middleware
    context: ({ ctx }) => ({ ctx }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }),
})
await server.start()
server.applyMiddleware({
  app,
  path: '/api/graphql',
})

// ...listen on port 3000
```

This isn't the whole picture but in a nutshell:

1. Create your schema
2. Create your Koa app
3. Create your Apollo server
4. Pass in your schema wrapped in the permissions middleware
5. And you're good to go!

Now whenever you make a request to the server with insufficient permissions on a particular field, you'll receive a `GraphQLError` stating "Not Authorised!".

# Conclusion

This is only the tip of the iceberg when it comes to adding a permissions layer for any application. Right now we are only performing a very crude method of role based access control, where all editors can create/update and all admins can create/update/delete. However it might be beneficial to have fine-grained permissions where people are only allowed to delete their own resource.

A basic implementation would leverage the `parent` argument in the rule function to check if the the `parent.ownerId === ctx.state.user.uid` or something similar, but I'm sure there are other suitable methods.

Anyways, hope this helps. That's all for today!

Keep it spicy 🌶️

~ Jing
