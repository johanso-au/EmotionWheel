# Emotion Wheel

A calm, simple web app that helps you find the right word for what you're feeling.

**Live site:** https://johanso-au.github.io/EmotionWheel/

Sometimes "sad" or "stressed" doesn't quite capture it. The Emotion Wheel is a well known tool for narrowing a broad feeling down to a more precise one. Naming a feeling accurately can make it easier to understand, talk about and act on.

## How it works

The app has two ways to explore your feelings.

### Words view

The page opens with "I'm feeling..." and seven core emotions, each in its own colour:

**happy** · **surprised** · **angry** · **disgusted** · **sad** · **fearful** · **low**

1. Choose the core emotion closest to how you feel.
2. The other words fade away and more specific feelings appear.
3. Keep choosing until you reach the word that fits, for example "I'm feeling *defeated*."

The final word appears in the colour of its emotion. A "start again" button takes you back to the beginning.

### Wheel view

Tap **"the wheel"** at the bottom of the page to see every feeling at once on a rotating wheel with three rings:

- **Inner ring:** core emotions
- **Middle ring:** more specific feelings
- **Outer ring:** the most precise words

Drag, scroll or use the arrow keys to turn the wheel. Whatever lines up on the highlighted row is shown as "I'm feeling ___." You can also tap any word to turn the wheel straight to it. This view is helpful when you're not sure where to start, or want to browse nearby feelings side by side.

The wheel opens on whatever you have already chosen in the words view. You can also link to it directly: https://johanso-au.github.io/EmotionWheel/#wheel

## The word list

The app covers 7 core emotions, 42 secondary feelings and 178 specific words.

It is based on the Feelings Wheel created by Dr. Gloria Willcox (1982) and the widely used three ring version by Geoffrey Roberts (2015). It has been expanded with words from newer wheels by Mentalyc, BestSelf and MyLifeNote, with a particular focus on adding more positive and calming feelings. "Bad" from the original wheel has been renamed "low".

The full list, its sources and the changes from the original are in [emotion-wheel.md](emotion-wheel.md).

## Design

- Light text on a dark background, with gently fading words for a calm feel
- Colours follow common emotion associations: gold for happy, blue for sad, red for angry, green for disgusted, purple for fearful, orange for surprised and grey for low
- Works on phones, tablets and desktops
- Respects the "reduce motion" setting on your device
- Keyboard and screen reader friendly

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | The page, styles and words view |
| `wheel.js` | The rotating wheel view |
| `emotions.js` | The emotion data used by the app. Edit this to add or change words |
| `emotion-wheel.md` | A readable copy of the word list with sources and notes |

There is no build step or framework. It's plain HTML, CSS and JavaScript, hosted on GitHub Pages from the `main` branch. To run it locally, open `index.html` in a browser.

## Note

This is a tool for self reflection, not a substitute for professional support. If you're struggling, please reach out to someone you trust or a mental health professional.
