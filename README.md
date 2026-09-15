# Grandma's Porch Chat

Build me a mobile-first web app called "Porch — Grandma's Wisdom"

Tagline under logo: "Not therapy. Just a porch."

Design: Warm, cozy, grandma's porch. Cream background #FFF8F0, dark brown text #3D2C2C, soft peach buttons #FFB085, rounded corners, big readable font 18px. Feels safe, not clinical.

Pages:

1. Home Screen (The Porch):

Top text: "What's on your porch today, honey?"

Big text box with placeholder: "Write what's on your heart... I'm listening."

Button: "Sit with Grandma"

Below button small text: "Porch is not therapy or medical advice. Wellness reflection only. If in crisis call/text 988."

2. Response Screen:

Show their entry on top in a faded card, then below show Grandma's response in a warm card with a little flower icon.

At bottom: 3 small buttons: "Breathe with me" "Walk it off" "Write more"

And: Weather check: "How's your porch now? Sunny / Cloudy / Rainy / Stormy" — 4 emoji buttons. Save selection.

3. History Screen (My Porch Weeks):

List of past entries by date with weather emoji.

AI Logic — CRITICAL, must follow:

Use OpenAI or Claude API. System prompt for Grandma is:

You are Grandma Rose, 78, sitting on her porch in New Jersey. Warm, wise, has lived through a lot, a little funny. You are NOT a therapist, NOT medical, NEVER diagnose. Never use words: anxiety, depression, disorder, trauma, treatment, diagnosis, symptoms. You speak like a loving grandmother. You always: 1) Validate warmly in 1 sentence, 2) Reflect back what they said in plain simple words, 3) Share a tiny homespun thought or memory, 4) Ask ONE gentle question, 5) Suggest ONE tiny 2-minute action (make tea, step outside, write one line, drink water). Keep replies under 120 words. End with warmth: "I'm proud of you for sitting with this." If user input contains self-harm, suicide, harm to self/others — DO NOT give Grandma response. Instead respond only: "Thank you for trusting me with this, sweetheart. I'm just a porch app and can't help safely with this. You deserve real support right now. Please call or text 988 in the US right now, or go to your local emergency room. If you can, please reach out to someone you trust nearby."

Safety & Data:

Save entries in Supabase table: entries (id, text, grandma_response, weather, created_at)

Add filter before AI call for self-harm keywords: suicide, kill myself, want to die, hurt myself, self harm

Footer on every page: "Not medical advice. For wellness and reflection only. Crisis? Call/text 988."

Add button: "Upgrade to Unlimited Porch Sits — $7.99/mo" with Stripe checkout placeholder.

Build it now, mobile responsive.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://grandma-porch-sits.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7087e8d4-68db-4554-988a-4c2b86df1da2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
