---
title: "What changes when the app is actually live"
description: "Since July 2025 I've owned mobile for RangeNow, an EV-charging app on both stores. Most of what the job actually involves didn't exist in my description of it a year ago."
date: 2026-09-04
tags: ["React Native", "Expo", "App Store", "Play Store", "Production"]
---

Since July 2025 I've been the mobile engineer on [RangeNow](https://play.google.com/store/apps/details?id=now.range.app), an EV-charging app for India. What it does is simple to describe: find a charger near you, plan a trip around the ones on your route, then book and pay for a session. It's live on the [App Store](https://apps.apple.com/in/app/rangenow-ev-charging/id6759698887) and Google Play.

Building it was the part I expected. Owning it afterwards is the part that actually taught me something, and it's why I now describe what I do as *build, ship, and keep alive* rather than just development.

## Building was the first half

An empty repo, React Native and Expo, iOS and Android from one codebase. Maps and live location, trip planning, booking and payment, authentication, deep links, push notifications. The usual shape of a consumer app, with the usual pressure to get a first version in front of people.

I'll skip the internals — it's someone else's product, and their architecture isn't mine to publish. What I will say is that maps are where React Native stops being comfortable. Live location, hundreds of markers, clustering, and behaviour that diverges between platforms in ways the documentation doesn't warn you about. If you want to find the edges of the framework quickly, put a map at the centre of your app.

## Then it went live, and the job changed

A production app is never finished. That sounds like a platitude until you're the person carrying it.

**Releases stop being events and become a process.** Signing and provisioning, TestFlight, App Store Connect, Play Console, staged rollout, and review — which will occasionally reject you for something that has nothing to do with your code. Over-the-air updates change the calculus again: some fixes ship in minutes, and knowing which category a fix falls into is its own skill.

**Crashes arrive as statistics, not bug reports.** Nobody files a ticket saying "the app died on cold start." You find it because a number moved on a dashboard — and there are four dashboards, because Sentry, Crashlytics, Play Vitals and App Store Connect each see a different slice of the same reality and none of them quite agrees with the others. Reconciling them is genuinely difficult, and I've spent more time on it than I expected to.

The lesson underneath that: **a crash you can't reproduce is a data problem before it's a debugging problem.** Reaching for the debugger first is almost always the slow path.

**Performance means the phones people actually own.** Not the flagship on your desk. A mid-range Android two OS versions behind, on a bad connection, in battery-saver mode. Most of the performance work I've done has been about that device rather than about raw framework speed.

**SDK upgrades are a recurring tax.** Expo and React Native move quickly, and staying current isn't optional — it's what keeps the app buildable and submittable at all. Each upgrade is an exercise in working out which of your dependencies has become the problem.

**Analytics has to be correct before it's useful.** An event that fires twice, or fires on a screen you didn't intend, will quietly mislead everyone who trusts the dashboard. Auditing instrumentation is unglamorous, and it has changed more decisions than most features I've built.

## Which is where the upstream work comes from

Running current versions in production means you find things.

Recently I noticed our iOS error reporting had gone quiet in a way that didn't add up — the SDK was returning HTTP 200 for every envelope while nothing arrived at the other end. It turned out Sentry was silently dropping all logs and spans on React Native 0.86 and above, caused by an unreliable `performance.timeOrigin`. Anyone on that version had error reporting that looked completely healthy and collected nothing.

I filed it with a reproduction. Sentry shipped the fix six days later, in [8.25.0](https://github.com/getsentry/sentry-react-native/releases/tag/8.25.0).

That's the example I'd point to if someone asked what owning a production app actually involves. You don't find that bug by reading a changelog. You find it because you're running the thing, watching it closely, and you notice when something that should be noisy goes quiet.

## The short version

The second release is harder than the first. You have users now, and you can't break them.
