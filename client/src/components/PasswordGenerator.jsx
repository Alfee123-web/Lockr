import { useState } from "react";
import { parseRules, generate } from "../utils/passwordRules";

export default function PasswordGenerator({ onUse }) {
  const [text, setText] = useState("");
  const [rules, setRules] = useState(null);
  const [result, setResult] = useState("");

  const run = () => {
    const parsed = parseRules(text);
    setRules(parsed);
    setResult(generate(parsed));
  };

  // Plain-English summary, so you can check the parser understood the rules
  const summary =
    rules &&
    [
      `${rules.minLen}-${rules.maxLen} characters`,
      rules.upper && "uppercase",
      rules.number && "number",
      rules.special && `symbols: ${rules.allowedSymbols}`,
      rules.startWithLetter && "starts with a letter",
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <div className="generator">
      <h3>Smart password generator</h3>
      <textarea
        placeholder="Paste the site's password rules here (e.g. 8-16 characters, one capital letter, one number and a symbol such as !@#)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <button type="button" onClick={run}>
        Generate
      </button>

      {rules && (
        <div className="gen-result">
          <p className="gen-summary">Understood: {summary}</p>
          <code>{result}</code>
          <div className="actions">
            <button type="button" onClick={run}>
              Regenerate
            </button>
            <button type="button" onClick={() => onUse(result, text)}>
              Use this password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}