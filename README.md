<p align="center"><svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 30 30" fill="none" style="background: transparent;"><g clip-path="url(#clip0)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8053 7.4419C21.6288 7.13789 21.3438 6.99906 21.3438 6.99906L27.5695 3.40465C27.8847 3.22265 28.2878 3.33066 28.4698 3.6459C28.6518 3.96113 28.5438 4.36423 28.2285 4.54623L22.3657 7.93112C22.3657 7.93112 21.9819 7.74591 21.8053 7.4419Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.241 22.3767C24.6955 19.805 26.2217 14.1091 23.6499 9.65462C23.2826 9.01845 22.8516 8.44202 22.3696 7.92871L13.931 12.8007C13.6158 12.9827 13.2127 12.8747 13.0307 12.5595C12.8487 12.2442 12.9567 11.8411 13.272 11.6591L21.3509 6.99477C18.446 4.70671 14.3257 4.28396 10.9278 6.24573C6.47335 8.81751 4.94714 14.5134 7.51892 18.9679C7.88622 19.604 8.31725 20.1805 8.79927 20.6938L17.4581 15.6946C17.7733 15.5126 18.1764 15.6207 18.3584 15.9359C18.5404 16.2511 18.4324 16.6542 18.1172 16.8362L9.81802 21.6277C12.7229 23.9158 16.8432 24.3385 20.241 22.3767Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.05318 25.3494C1.87118 25.0341 1.97919 24.6311 2.29442 24.449L8.78969 20.699C8.78969 20.699 9.18397 20.8696 9.37561 21.0678C9.56725 21.2659 9.82767 21.6218 9.82767 21.6218L2.95352 25.5906C2.63828 25.7726 2.23518 25.6646 2.05318 25.3494Z" fill="black"/></g><defs><clipPath id="clip0"><rect width="30" height="30" fill="black"/></clipPath></defs></svg></p>
<p align="center">
  A workflow for developing and deploying website sections
</p>

# Slice Machine

Slice Machine is a tool that helps you build and maintain page sections, define their model, edit properties, deploy them, and much more! It also comes with a visual interface, Prismic, that allows even your most technically challenged colleagues to easily build pages without any further help from the dev team.

As of today, Slice Machine works with [Nuxt.js](https://nuxtjs.org/) and [Next.js](https://nextjs.org/) but support for other technologies is coming soon!

You can learn more about Slice Machine itself at **[slicemachine.dev](https://slicemachine.dev/)**.

## Prismic?

Prismic is a Headless CMS that offers unlimited custom types, API calls, and a bunch of other great things. You can check it out **[here](https://prismic.io/)**.

## Documentation

If you're looking for how to use Slice Machine with your project check out our **[Quick Start guide](https://www.slicemachine.dev/documentation/getting-started)** or have a look at **[Slice Machine documentation](https://www.slicemachine.dev/documentation)**.

# This repository

This repository is the main repository of the Slice Machine project, it is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) by [Lerna](https://github.com/lerna/lerna) and composed of many [npm packages](https://github.com/babel/babel/blob/main/packages/README.md).

## Packages

Here is some information about inner packages:

- [next-slicezone](/packages/next-slicezone): slice zone component for Next.js ;
- [nuxt-sm](/packages/nuxt-sm): Nuxt.js companion module for Vue.js slice zone ;
- [sm-api](/packages/sm-api): Slice Machine API serving different parts of the project ;
- [sm-commons](/packages/sm-commons): common utilities for Slice Machine ;
- [vue-slicezone](/packages/vue-slicezone): slice zone component for Vue.js.

# Some resources

- Want to contribute? Check out our **[Contribution Guide](https://www.slicemachine.dev/documentation/contributing)** ;
- Having an issue? Reach out to us on our **[Community Forum](https://community.prismic.io/c/slice-machine/27)** ;
- Discussions around the evolution of Slice Machine often take the form of RFCs, feel free to **[take part in them](https://github.com/prismicio/slice-machine/issues?q=is%3Aopen+is%3Aissue+label%3Adiscussion)**.

## Slice libraries

A _"libraries page"_ will drop soon on **[Slice Machine website](https://slicemachine.dev/)**, in the meantime here are existing slice libraries:

- [vue-essential-slices](https://github.com/prismicio/vue-essential-slices): Vue.js default slice library ;
- [essential-slices](https://github.com/prismicio/essential-slices): React.js default slice library.
