
const DEFAULT_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

const unique = (value) => [...new Set(value)].join("");

export function parseRules(text = "") {
  const original = String(text);
  const t = original.toLowerCase();

  const rules = {
    minLen: 8,
    maxLen: 32,
    upper: /\b(uppercase|upper case|capital|one uppercase|at least one uppercase)\b/.test(t),
    lower: /\b(lowercase|lower case|small letter)\b/.test(t),
    number: /\b(number|digit|numeric)\b/.test(t),
    special: /\b(special character|special characters|symbol|symbols|punctuation)\b/.test(t),
    allowedSymbols: DEFAULT_SYMBOLS,
    excludedCharacters: "",
    startWithLetter: /\b(start|begin)\b.{0,30}\bletter\b/.test(t),
    noSpaces: /\b(no spaces|without spaces|spaces not allowed)\b/.test(t),
    noRepeated: /\b(no repeated characters|no duplicate characters|characters must be unique)\b/.test(t),
    unsupported: [],
  };

  // Length ranges: 8-16, 8 to 16 characters
  let match = t.match(
    /\b(\d+)\s*(?:-|to)\s*(\d+)\s*(?:characters?|chars?)\b/
  );

  if (match) {
    rules.minLen = Number(match[1]);
    rules.maxLen = Number(match[2]);
  } else {
    // Exact length
    match = t.match(/\bexactly\s+(\d+)\s*(?:characters?|chars?)?\b/);

    if (match) {
      rules.minLen = Number(match[1]);
      rules.maxLen = Number(match[1]);
    } else {
      // Minimum length
      match = t.match(
        /\b(?:at least|minimum|min|no fewer than)\s+(\d+)\b/
      );

      if (match) rules.minLen = Number(match[1]);

      // Maximum length
      match = t.match(
        /\b(?:at most|maximum|max|no more than|up to)\s+(\d+)\b/
      );

      if (match) rules.maxLen = Number(match[1]);
    }
  }

  // Reject impossible or unreasonable lengths
  if (
    !Number.isInteger(rules.minLen) ||
    !Number.isInteger(rules.maxLen) ||
    rules.minLen < 1 ||
    rules.maxLen > 128 ||
    rules.maxLen < rules.minLen
  ) {
    throw new Error("Invalid password length requirements.");
  }

  // Detect explicitly allowed symbols
  const allowedMatch = original.match(
    /(?:such as|like|e\.g\.|for example|symbols?\s*:|special characters?\s*:)\s*([^\n]+)/i
  );

  if (allowedMatch) {
    const symbols = unique(
      [...allowedMatch[1]].filter((char) =>
        /[^a-zA-Z0-9\s]/.test(char)
      )
    );

    if (symbols.length) {
      rules.allowedSymbols = symbols;
    }
  }

  // Detect explicitly forbidden characters
  const excludedMatch = original.match(
    /(?:do not use|don't use|cannot contain|must not contain|excluding|except)\s+([^\n]+)/i
  );

  if (excludedMatch) {
    rules.excludedCharacters = unique(
      [...excludedMatch[1]].filter((char) =>
        !/[a-zA-Z0-9\s]/.test(char)
      )
    );
  }

  // Detect requirements this version cannot safely interpret
  const unsupportedPatterns = [
    /username|email address|website name|personal information/i,
    /consecutive|sequential|ascending|descending/i,
    /must contain exactly|exactly one/i,
    /first and last|end with|last character/i,
    /cannot start with|must not start with/i,
    /cannot end with|must not end with/i,
    /dictionary|common password|previous password/i,
    /at least \d+ (?:uppercase|lowercase|symbols?|digits?)/i,
    /no more than \d+ (?:uppercase|lowercase|symbols?|digits?)/i,
  ];

  for (const pattern of unsupportedPatterns) {
    if (pattern.test(original)) {
      rules.unsupported.push(
        `This requirement needs manual verification: ${pattern.source}`
      );
    }
  }

  // Avoid duplicate warnings
  rules.unsupported = unique(rules.unsupported);

  return rules;
}

// Secure, unbiased random integer in [0, n)
const rand = (n) => {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Invalid random range.");
  }

  if (!globalThis.crypto?.getRandomValues) {
    throw new Error(
      "Secure random generation is unavailable. Use a secure browser context."
    );
  }

  const max = Math.floor(2 ** 32 / n) * n;
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= max);

  return buffer[0] % n;
};

const pick = (characters) => {
  if (!characters.length) {
    throw new Error("No valid characters available.");
  }

  return characters[rand(characters.length)];
};

// Validate a generated password against supported rules
export function validatePassword(password, rules) {
  const errors = [];

  if (password.length < rules.minLen) {
    errors.push("Password is shorter than the minimum length.");
  }

  if (password.length > rules.maxLen) {
    errors.push("Password exceeds the maximum length.");
  }

  if (rules.upper && !/[A-Z]/.test(password)) {
    errors.push("An uppercase letter is required.");
  }

  if (rules.lower && !/[a-z]/.test(password)) {
    errors.push("A lowercase letter is required.");
  }

  if (rules.number && !/[0-9]/.test(password)) {
    errors.push("A number is required.");
  }

  if (
    rules.special &&
    ![...password].some((char) =>
      rules.allowedSymbols.includes(char)
    )
  ) {
    errors.push("An allowed special character is required.");
  }

  if (rules.startWithLetter && !/^[a-z]/i.test(password)) {
    errors.push("Password must start with a letter.");
  }

  if (rules.noSpaces && /\s/.test(password)) {
    errors.push("Spaces are not allowed.");
  }

  if (rules.noRepeated && new Set(password).size !== password.length) {
    errors.push("Repeated characters are not allowed.");
  }

  if (
    [...password].some((char) =>
      rules.excludedCharacters.includes(char)
    )
  ) {
    errors.push("Password contains a forbidden character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Generate a password that satisfies supported requirements
export function generate(rules, preferredLen = 16, avoidLookalikes = true) {
  const strip = (value) =>
    avoidLookalikes ? value.replace(/[0OIl1o]/g, "") : value;

  const removeExcluded = (value) =>
    [...value]
      .filter((char) => !rules.excludedCharacters.includes(char))
      .join("");

  const lower = removeExcluded(strip(LOWERCASE));
  const upper = removeExcluded(strip(UPPERCASE));
  const digits = removeExcluded(strip(DIGITS));
  const symbols = removeExcluded(rules.allowedSymbols || DEFAULT_SYMBOLS);

  const sets = [lower];

  if (rules.upper) sets.push(upper);
  if (rules.lower) sets.push(lower);
  if (rules.number) sets.push(digits);
  if (rules.special) sets.push(symbols);

  if (sets.some((set) => !set.length)) {
    throw new Error(
      "The selected rules leave an empty character group. Check allowed and excluded characters."
    );
  }

  const minLen = rules.minLen || 8;
  const maxLen = rules.maxLen || 32;

  const length = Math.min(
    Math.max(Number(preferredLen) || 16, minLen, sets.length),
    maxLen
  );

  if (sets.length > maxLen) {
    throw new Error("The required character groups exceed the maximum password length.");
  }

  const allCharacters = unique(sets.join(""));

  // Try multiple times to satisfy additional constraints
  for (let attempt = 0; attempt < 100; attempt++) {
    const chars = sets.map(pick);

    while (chars.length < length) {
      chars.push(pick(allCharacters));
    }

    // Fisher-Yates shuffle
    for (let i = chars.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    if (rules.startWithLetter && !/[a-z]/i.test(chars[0])) {
      const index = chars.findIndex((char) => /[a-z]/i.test(char));

      if (index !== -1) {
        [chars[0], chars[index]] = [chars[index], chars[0]];
      }
    }

    const password = chars.join("");
    const result = validatePassword(password, rules);

    if (result.valid) {
      return password;
    }
  }

  throw new Error(
    "Could not generate a password satisfying these rules. Please review the requirements."
  );
}
