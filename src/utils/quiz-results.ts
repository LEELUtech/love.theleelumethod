export interface QuizResult {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  psychologicalProfile: string;
  pattern: string;
  fix: string;
}

export const quizResults: QuizResult[] = [
  {
    id: 1,
    type: 'TheOverFunctioner',
    title: 'THE BROKEN HEART STORM',
    subtitle: 'Acute Wound / Unresolved Loop',
    psychologicalProfile:
      'Your heart is broken, yet fully awake, which is why it hurts so much. You cannot sleep. You cannot stop the loop. And underneath the question of "why did he do this to me?" is the louder one: "what did I do wrong?"',
    pattern:
      'This is a live wire, not a dead end. The intensity you feel is not evidence that you will never love again. It is evidence that you still can. But without intervention, the storm becomes the armor, and the woman who comes out the other side stops feeling everything, not just the pain.',
    fix: 'You cannot wait this out. In the Decoded Love Masterclass, Lily will show you how to break the self-blame loop, reclaim your instincts, and come out of this as someone who can love again.',
  },
  {
    id: 2,
    type: 'KarmicLoop',
    title: 'THE LONELY HOPE LOOP',
    subtitle: 'High Standards / Shrinking Return',
    psychologicalProfile:
      'You built a life while others built relationships, and now the available men don\'t match what you\'ve become. Every date is a mismatch. Every almost-relationship confirms the gap between what you hope for and what keeps showing up. You tell yourself it\'s temporary. The loop says otherwise.',
    pattern:
      'This is a calibration problem, not a character flaw. The same drive that built your career is working against you in dating. You are filtering through the wrong signals and reading the wrong results as proof of the wrong conclusion.',
    fix: 'You cannot date your way out of this. In the Decoded Love Masterclass, Lily will show you why high-achieving women keep hitting this wall, and what actually creates attraction with a man worth your time.',
  },
  {
    id: 3,
    type: 'Drifter',
    title: 'THE SILENT BREAKUP',
    subtitle: 'Emotional Exit / No Stated Terms',
    psychologicalProfile:
      'The house is intact. The calendar is full. From the outside, nothing is wrong. But intimacy has been gone for years, you feel invisible to the man you live with, and somewhere inside you a version of your life is playing out that looks nothing like this one. The breakup is already happening. It\'s just silent.',
    pattern:
      'Silence is not peace. It is just a slower kind of leaving. You already know what you feel. You already know what is missing. The longer it goes unnamed, the further you get from any version of your life that actually fits you.',
    fix: 'You cannot keep swallowing this. In the Decoded Love Masterclass, Lily will show you how to resurface inside a relationship that has gone quiet — and whether what\'s there is worth coming back to.',
  },
  {
    id: 4,
    type: 'Projector',
    title: 'THE ENDLESS WAITING ROOM',
    subtitle: 'Full Investment / No Commitment',
    psychologicalProfile:
      'You\'ve given years. You know his family, shaped his life, built everything but a title. You call it patience. But underneath that patience is a quieter belief you\'ve been trying not to look at directly: that maybe you\'re simply not enough to be chosen.',
    pattern:
      'This is a sunk cost spiral, not a love story. The waiting room stays open because you won\'t walk out and he won\'t call your name. Every year you stay recalibrates your sense of what you deserve, and not upward.',
    fix: 'You cannot wait your way to being chosen. In the Decoded Love Masterclass, Lily will show you why he hasn\'t committed, whether he ever will, and what to do either way.',
  },
];

export const quizResultsFooter =
  "Lily's numerology system reads the mathematical patterns underneath your relationships — the ones that repeat regardless of the man, the situation, or how hard you try. What you just received is the surface. The Decoded Love Masterclass is where the full pattern gets decoded.";
