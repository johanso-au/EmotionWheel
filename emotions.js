// Emotion wheel data: core → secondary → tertiary.
// Base: Geoffrey Roberts' Feelings Wheel (after Gloria Willcox, 1982).
// Extended with words from newer wheels (Mentalyc, BestSelf, MyLifeNote) — see emotion-wheel.md.
const WHEEL = [
  {
    name: "happy", color: "#f2c35b",
    children: {
      "playful": ["aroused", "cheeky", "amused", "goofy", "sensual"],
      "content": ["free", "joyful", "delighted", "satisfied"],
      "interested": ["curious", "inquisitive"],
      "proud": ["successful", "confident", "accomplished", "worthy", "bold"],
      "accepted": ["respected", "valued", "connected", "loved", "close"],
      "powerful": ["courageous", "creative", "purposeful", "intentional", "aware"],
      "peaceful": ["loving", "thankful", "grateful", "calm", "relaxed", "at ease", "present", "clear", "thoughtful"],
      "trusting": ["sensitive", "intimate", "open", "faithful", "affectionate", "tender", "warm", "empathetic", "attentive"],
      "optimistic": ["hopeful", "inspired", "encouraged", "uplifted"]
    }
  },
  {
    name: "surprised", color: "#f0956a",
    children: {
      "startled": ["shocked", "dismayed", "rattled", "jumpy", "speechless"],
      "confused": ["disillusioned", "perplexed", "puzzled", "mixed up", "disoriented"],
      "amazed": ["astonished", "awe", "awestruck", "wowed", "fascinated"],
      "excited": ["eager", "energetic", "intrigued"]
    }
  },
  {
    name: "angry", color: "#e2676a",
    children: {
      "let down": ["betrayed", "resentful", "deceived", "used"],
      "humiliated": ["disrespected", "ridiculed"],
      "bitter": ["indignant", "violated", "hateful"],
      "mad": ["furious", "jealous", "envious", "enraged", "outraged", "explosive"],
      "aggressive": ["provoked", "hostile", "defensive"],
      "frustrated": ["infuriated", "annoyed", "irritated", "impatient", "exasperated", "stuck"],
      "distant": ["withdrawn", "numb"],
      "critical": ["sceptical", "dismissive"]
    }
  },
  {
    name: "disgusted", color: "#7fbf8e",
    children: {
      "disapproving": ["judgmental", "embarrassed", "offended", "superior"],
      "disappointed": ["appalled", "revolted"],
      "awful": ["nauseated", "detestable", "sickened", "grossed out"],
      "repelled": ["horrified", "hesitant", "repulsed", "uncomfortable", "resistant"],
      "distrustful": ["suspicious", "guarded"]
    }
  },
  {
    name: "sad", color: "#6fa3d8",
    children: {
      "lonely": ["isolated", "abandoned", "left out", "unseen", "longing"],
      "vulnerable": ["victimised", "fragile"],
      "despair": ["grief", "powerless", "hopeless", "defeated", "heartbroken", "bereft", "miserable"],
      "guilty": ["ashamed", "remorseful", "regretful"],
      "depressed": ["inferior", "empty", "lost", "discouraged"],
      "hurt": ["embarrassed", "disappointed", "wounded"]
    }
  },
  {
    name: "fearful", color: "#a98bd6",
    children: {
      "scared": ["helpless", "frightened", "terrified", "petrified", "panicked", "frozen"],
      "anxious": ["overwhelmed", "worried", "uneasy", "dreading"],
      "insecure": ["inadequate", "inferior", "unsure", "self-doubting", "self-conscious", "awkward"],
      "weak": ["worthless", "insignificant", "passive"],
      "rejected": ["excluded", "persecuted"],
      "threatened": ["nervous", "exposed", "unsafe", "on guard", "alarmed", "trapped"]
    }
  },
  {
    name: "low", color: "#9fadbd",
    children: {
      "bored": ["indifferent", "apathetic", "flat", "disconnected", "restless", "unmotivated"],
      "busy": ["pressured", "rushed", "stretched thin"],
      "stressed": ["overwhelmed", "out of control", "on edge"],
      "tired": ["sleepy", "unfocused", "drained", "worn out"]
    }
  }
];
