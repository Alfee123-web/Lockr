// Reads pasted rule text (e.g. "8-16 characters, one capital, one number")
export function parseRules(text) {
  const t = text.toLowerCase();
  const rules = {
    minLen: 8,
    maxLen: 32,
    upper: /upper|capital/.test(t),
    number: /number|digit|numeric/.test(t),
    special: /special|symbol|punctuation/.test(t),
    allowedSymbols: "!@#$%^&*()-_=+[]{};:,.?",
    startWithLetter: /(start|begin)[^.]*letter/.test(t),
  };

  // Length: "8-16 characters", "between 8 and 16", "at least 8", "max 20"
  let m = t.match(/(\d+)\s*(?:-|to|and)\s*(\d+)\s*(?:char|letter)/);
  if (m) {
    rules.minLen = +m[1];
    rules.maxLen = +m[2];
  } else {
    m = t.match(/(?:at least|minimum|min\.?|no fewer than)\s*(\d+)/);
    if (m) rules.minLen = +m[1];
    m = t.match(/(?:at most|maximum|max\.?|no more than|up to)\s*(\d+)/);
    if (m) rules.maxLen = +m[1];
  }
  if (rules.maxLen < rules.minLen) rules.maxLen = rules.minLen;

  // Allowed symbols: "such as !@#$" or "special characters: !@#"
  m = text.match(/(?:such as|like|e\.g\.,?|:)\s*([!-\/:-@\[-`{-~ ,]{2,})/);
  if (m) {
    const syms = [...new Set(m[1].replace(/[\s,]/g, ""))].join("");
    if (syms) rules.allowedSymbols = syms;
  }
  return rules;
}

// Secure, unbiased random integer in [0, n)
const rand = (n) => {
  const max = Math.floor(2 ** 32 / n) * n;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= max);
  return buf[0] % n;
};
const pick = (s) => s[rand(s.length)];

// Builds a password that follows the rules
export function generate(rules, preferredLen = 16, avoidLookalikes = true) {
  const strip = (s) => (avoidLookalikes ? s.replace(/[0OIl1o]/g, "") : s);

  const sets = [strip("abcdefghijklmnopqrstuvwxyz")];
  if (rules.upper) sets.push(strip("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
  if (rules.number) sets.push(strip("0123456789"));
  if (rules.special) sets.push(rules.allowedSymbols);

  const len = Math.min(Math.max(preferredLen, rules.minLen), rules.maxLen);
  const all = sets.join("");

  // One character from each required type, then fill the rest
  const chars = sets.map(pick);
  while (chars.length < len) chars.push(pick(all));

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  // Some sites require starting with a letter
  if (rules.startWithLetter && !/[a-z]/i.test(chars[0])) {
    const k = chars.findIndex((c) => /[a-z]/i.test(c));
    [chars[0], chars[k]] = [chars[k], chars[0]];
  }
  return chars.join("");
}