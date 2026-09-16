---
title: "The wrong answers are the lesson"
description: "Notes from working on Smriti, a study app holding 7,378 UPPSC previous-year questions. The interesting problems were in the data, the sync and the entitlement checks — not the framework."
date: 2026-09-16
tags: ["Next.js", "TypeScript", "MongoDB", "Product", "Razorpay"]
---

[Smriti](https://smritipyq.in/uppsc) is a study tool for people preparing for the UPPSC civil-services exam in India. It holds 7,378 previous-year General Studies questions, organised by subject and topic, and it is built around one observation: for an exam like this, the answer key is the least useful part of a previous-year question.

Knowing the answer is B teaches you one fact. The three wrong options are also real people, real treaties, real articles of the constitution — and any of them could be the correct answer to next year's paper. So each question is rendered as a micro-lesson: the fact the question is really testing, then every wrong option explained in its own right — what it actually is, what it is known for, and why it does not fit here.

I contribute to the engineering. It is the web half of what I do, and a good counterweight to a year spent inside a React Native app.

## The data is the hard part

The app is the visible half. The work that actually decides whether the product is any good happens before a page is rendered: turning a flat question bank into something worth reading.

That means an enrichment pipeline — each question run through an LLM to produce the per-option analysis, the core fact, the reverse question that asks the same thing from the opposite direction — and then the much less glamorous business of checking it. Coverage is uneven by nature: nearly every question ends up with a core fact, while only about 2% earn a mnemonic worth keeping. The rule the code enforces because of it is **allowlist, never denylist**. Anything filtering enriched fields must name what it wants. Assume a field exists and you ship a blank card to someone studying at 6am.

My favourite piece of the data is the one nobody would design on purpose. 258 of the questions carry a withdrawn answer key — the exam body annulled them after the paper, so there is no correct option. Scored normally, they mark you wrong whatever you pick. The obvious fix is to delete them, and it is the wrong one: question IDs are positional (`topic__q7`), user progress is keyed by those IDs, and removing one silently changes the meaning of every answer already recorded against that topic. So they stay, they are excluded from accuracy, and a test keeps them that way.

That is the general shape of working with real data. The correction you want to make is usually less safe than the correction you can afford.

## The app around it

Next.js on the App Router, MongoDB, TypeScript. The hub pages — subject, chapter, topic — are server-rendered and effectively static, because they are also the pages Google indexes. The question page is a server shell with a small client island inside it, and the complete teaching material for a question is fetched only after the reader has answered or asked to see it. That boundary began as a product decision and ended up load-bearing for everything else: what is free, what is paid, and what a scraper can take in a single pass.

Progress is local-first. Answers land in `localStorage` immediately and sync to the server on a debounce, merging last-write-wins by timestamp. Signed out, the app still works and still remembers you. Signed in, it follows you to your phone. The thing worth saying to anyone building this: the sync is not the hard part, the *merge* is, and you want to decide what wins before you write a line of it.

Questions you get wrong come back on an [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) schedule — correct is a *good*, wrong is an *again*, and "I knew that cold" is an *easy*. The scheduler is a pure function over stored progress, which means it is testable without a browser, a database or a user.

## The boring, decisive parts

**Money.** A paid pass, Razorpay checkout, webhooks, a ledger, and a reconciliation path for the day the webhook does not arrive — because eventually it does not. The rule I would not bend anywhere: entitlement is resolved on the server, from the database, on every request that matters. The client is told what it may *render*, never what it may *have*.

**Long sessions.** People use this for three or four hours at a stretch, which is a different design problem from a five-minute app. There are five themes, two of them colourblind-safe — correct is blue rather than green, wrong is orange rather than red. Holding that line meant banning raw colour utilities in favour of semantic tokens, because a single stray `text-red-600` quietly breaks the accessible themes for exactly the people who need them.

**Being found.** An exam app nobody can find is a hobby. The public hubs, the FAQ and a small set of genuinely useful articles are part of the product rather than marketing bolted onto it.

**No staging.** Merging to `main` deploys to production. The compensation is that every commit runs the full test suite before it is allowed to exist, with coverage thresholds on the logic deciding what a reader is shown and what they have paid for.

## What I take from it

Most of my work is mobile, and the habits transfer better than I expected. Guard every optional field. Decide your merge rules before you need them. Never let the client be the authority on what someone has paid for. Treat the data as a system with its own failure modes rather than as content.

The framework was never the hard part. It rarely is.
