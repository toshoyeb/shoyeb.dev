---
title: "Building an app from zero and shipping it to the Play Store"
description: "I joined kuttl.in as part of the founding team. There was no mobile app. Eighteen months later it was on the Play Store with a release pipeline behind it."
date: 2026-09-04
tags: ["React Native", "Expo", "Play Store", "Node.js"]
---

I joined kuttl.in in late 2023 as part of the founding team. The product had a clear idea behind it: purchases, refunds, subscriptions and shipments all end up scattered across your inbox, so pull them into one place — by linking Gmail or entering them manually — and turn that into analytics and expense tracking you can actually use.

There was no mobile app when I arrived. That was the job.

## Starting from an empty repo

I built it in React Native. Starting from nothing is a luxury and a trap at the same time: nobody is stopping you, and every decision you make quietly becomes the thing everyone builds on for the next year.

The parts that mattered early were unglamorous. React Navigation for routing, with Expo Linking so deep links resolved into the right screen instead of dumping people on the home tab. Login, signup and file-upload flows built to feel responsive — real-time feedback rather than a spinner and hope. Modular UI components off Figma designs, so adding the fourth screen cost less than the first.

Then the data layer, which is where most of the mess in a young app accumulates. Redux with RTK Query centralised state and gave us cache invalidation for free, which cut the amount of hand-written API handling code by roughly 40%. That number matters less than what it bought: one place to look when a request behaved oddly.

## Making it feel fast

A finance app is a list app. Long lists of transactions, grouped and filtered and searched, and all of it needs to feel instant on a mid-range Android phone.

Two things did most of the work. Rendering large datasets through `FlatList` with search, filter and grouping logic built to run over the already-loaded set rather than round-tripping to the server. And a caching layer with its own invalidation rules for media and profile images, which brought load times down from about three seconds to one.

That second one taught me something I still lean on: **the perceived speed of an app almost never lives where the benchmark says it does.** It lives in whether the screen someone opens twenty times a day has to fetch anything at all.

Financial data also has to be legible, not just present — dashboards built with `rn-gifted-charts` did more for engagement than any amount of layout polish.

## The part nobody plans for

Shipping it.

I led the release to the Play Store, which means I learned Play Console the way everyone learns Play Console: by hitting each wall once. APK versus AAB. Signing keys, and what happens if you lose one. Version codes. Staged rollout percentages. The review queue, which does not care about your sprint.

Alongside that I set up CI/CD through Expo so we could push live updates without a store round-trip. Being able to fix a bad screen the same afternoon, rather than waiting two days for review, changes how a small team operates more than any single feature does.

Push notifications went in through Expo and FCM, reaching about 95% of users.

## Going down the stack

I also wrote the backend behind the features I shipped: CRUD APIs in Express and Node for upload status and profile data, with MongoDB aggregation pipelines doing the heavy lifting on the reporting side. Uploads were secured with HMAC validation, which matters more than it sounds when the files are people's receipts.

The most interesting piece was shipment tracking. Fetching and updating status from third-party carrier APIs sounds trivial until you enumerate the states — delivered, cancelled, exception, and the long tail where the carrier simply stops responding. I built it as a Temporal workflow, which meant retries, timeouts and partial failure stopped being something I hand-rolled and became configuration.

## What I took from it

Eighteen months on one product, from empty repo to something with real users and a release pipeline, is a particular kind of education. You cannot hand a problem to another team. Whatever breaks is yours, and you find out quickly which of your decisions were load-bearing.

The habit it left me with is that I now think about the release before I think about the feature. Most of what makes a mobile app hard to work on is not the code — it is everything standing between the code and a user's phone.
