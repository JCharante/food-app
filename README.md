# food-app

## Context

I was previously working on building a food-delivery app targeting a specific niche, but with my business partner decided to stop. I still enjoy working in this tech stack, so I plan to continue developing
this app for recreational purposes and now am able to make the source code publicly available.

This repo was previously hosted on a different service and my other laptop has a different git author identity, so I ran `git rebase -r --root --exec "git commit --amend --no-edit --reset-author"`, which reset the commit times. Additionally past commit names make references to an internal issue board that won't be published. 

Companion repo: https://github.com/JCharante/food-api

# Dev Setup

## Enviroment variables

There is a .env.example file in this repo.

Clone it and rename it to .env.local

Then get the secrets. Instructions for getting some of the keys are below:

## Quick setup


Expo will probably tell you to install xcode. So if you don't have it install it already.

```bash
npm i
npm run ios
```

In the simulator app that opens, there is a choice to switch which model iphone. You can also press shift + i I think
inside the terminal running expo.

## Resources

