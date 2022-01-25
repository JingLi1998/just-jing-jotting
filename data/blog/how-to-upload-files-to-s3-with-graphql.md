---
title: How to Upload Files to S3 with GraphQL
date: '2022-01-25'
tags: ['react', 'graphql', 'node', 'koa', 'aws', 's3']
draft: false
summary: A quick primer on file uploads with GraphQL to AWS S3
images: []
layout: PostLayout
---

# Overview

Some time ago I had the pleasure of figuring out end to end how to take an image from a client's browser, upload it to a backend server then pipe it S3. Unfortunately the documentation out there is not so great and when I did find some guides, some of them were outdated. Rather than having a step by step tutorial on how to implement this kind of functionality, instead I'll just outline some key concepts required in order to get this feature up and running.

## GraphQL Multipart Request Specification

Core to the implementation of a GraphQL upload is a way to define it in the schema and how to handle it when inside of a resolver. Fortunately there already exists a specification called the [GraphQL Multipart Request Specification](https://github.com/jaydenseric/graphql-multipart-request-spec). Even better is the fact that numerous popular GraphQL client and server libraries have implemented this specification such as Apollo.

### Schema

By using this specification you can define an `Upload` scalar that can be used in your schema. Just like any schema you can use it in a field like so:

```graphql
scalar Upload

type Mutation {
  uploadFile(file: Upload!): Boolean
}
```

Inside of a mutation you can do a little something like this:

```graphql
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}
```

### Server

On the server-side, we must then handle the `Upload` input. Taking the `node` implementation of the spec, the resolver will receive an `Upload` class which implements the native `Promise` type. It can either `resolve` and return a `FileUpload` object or `reject` and throw an error.

The `FileUpload` interface looks something like the following, containing all relevant data related to the upload:

```ts
interface FileUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadstream: () => ReadStream
}

// example use case
async function UploadFileResolver(_parent, args) {
  const fileUpload: FileUpload = await args.file

  // do something with the fileUpload now!
}
```

You can learn more about the `node` implementation of the GraphQL Upload Specification [here](https://github.com/jaydenseric/graphql-upload). Basically you'll need to add the `GraphQLUpload` scalar and middleware to allow your server to process these kinds of upload requests.

### Client

Similarly, there already exist a number of client-side implementations of the specification. Each have their own unique names and configurations such as the [URQL Multipart Fetch Exchange](https://formidable.com/open-source/urql/docs/api/multipart-fetch-exchange/) or using `createUploadLink` for a [Terminating Apollo Link](https://github.com/jaydenseric/apollo-upload-client#function-createuploadlink).

Once configured, your chosen GraphQL client can now send requests including file uploads using the native `FileList`, `File`, or `Blob` objects in the Browser. You can read more into them in the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API).

A quick example is shown below:

```tsx
import { gql, useMutation } from '@apollo/client'

function UploadFiles() {
  const [mutate] = useMutation(gql`
    mutation UploadFile($file: Upload!) {
      uploadFile(file: $file)
    }
  `)

  const onChange = ({ target: { validity, files } }) => {
    if (validity.valid) mutate({ variables: { files } })
  }

  return <input type="file" multiple required onChange={onChange} />
}
```

As you can see, the native HTML file input can immediately be used to pass a file upload into a GraphQL mutation to be sent to the server.

## Uploading Files to S3

With the above specification, we now have a valid way to send and receive file uploads via GraphQL. If we wanted to, we could simply persist them directly on the server. But that's no fun, we'd much rather be offloading file/image storage to a cloud service such as AWS S3.

You will of course need the following things in place set up in S3 already:

1. An existing S3 Bucket
2. API Credentials with `s3:PutObject` IAM permissions on the bucket

I won't go into the specifics into how to set the above things up. I will however wish you the best of luck as AWS can sometimes be a mess to understand 🙃.

On the server we can then leverage the [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) to upload our files. I should mention that for some reason all examples online still only show how to use v2 and not even the AWS documention outlines an example on how to use v3 for multipart uploads. It is what it is.

The modules we are interested in are `@aws-sdk/client-s3` and `aws-sdk/lib-storage` which provide a number of commands to work with S3. Naively, you might consider using the `PutObjectCommand`. However this is actually a footgun as part of its input requires that we specify the number of parts being sent over the wire. Our `FileUpload` interface from GraphQL does not have this info readily available.

What is actually required is an `Upload` class provided by the `lib-storage` module. This one is specifically made to handle multipart file and blob requests of unknown size to S3. Awesome!

Combined with the previous server code, a hacky implementation might look like this:

```ts
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'

// S3Client will automatically obtain API credentials from environment variables
const s3Client = new S3Client({ region: REGION })

async function UploadFileResolver(_parent, args) {
  try {
    const fileUpload: FileUpload = await args.file

    const upload = new Upload({
      client: s3Client,
      params: {
        Body: fileUpload.createReadStream(),
        Bucket: BUCKET,
        ContentType: fileUpload.mimetype,
        Key: fileUpload.filename,
      },
    })

    // add callbacks on when progress is made
    upload.on('httpUploadProgress', (progress) => console.log(progress))

    // wait till upload is finished
    await upload.done()

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
```

It's important that you make sure that the `ContentType` is populated with the correct `mimetype`, otherwise S3 will assume it is of type `octet-stream`. This will cause trouble for you when you attempt to view images via their respective s3 urls.

## Extra Spicy Tip

Say you follow this guide to a tee and implement everything perfectly. You still might get a potential error when attempting to perform file uploads. How? Basically a 413 error. This can potentially arise from your load balancer configuration. Coincidentally this happened to me a few days ago. My Elastic Beanstalk NGINX instance had a max file limit of 1mb. With the following line of configuration, I was able to set it to 15mb and call it a day:

```bash
# place this inside of .platform/nginx/conf.d
client_max_body_size 15M;
```

You might need to do something slightly different depending on your choice of load balancer and cloud provider.

# Conclusion

So there you have it. A short and dirty overview of how to implement GraphQL file uploads and persist them in S3. Of course it doesn't contain a hand-holding guide on implementation, it should still provide the basic building blocks to do so. You can even take this guide apart and only try out the GraphQL upload spec. Or skip the GraphQL and focus purely on how to implement S3 uploads. The choice is yours!

Thats all for today!

Keep it spicy 🌶️

~ Jing
