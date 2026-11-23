import { useState } from "react";
import {
  parseRules,
  generate,
  validatePassword,
} from "../utils/passwordRules";

export default function PasswordGenerator({ onUse }) {
  const [text, setText] = useState("");
  const [rules, setRules] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(false);
  const [verified, setVerified] = useState(false);

  const run = () => {
    setError("");
    setResult("");
    setCopied(false);
    setUsed(false);
    setVerified(false);

    try {
      if (!text.trim()) {
        setError("Please enter the website's password requirements.");
        return;
      }

      const parsed = parseRules(text);
      setRules(parsed);

      const password = generate(parsed);
      const validation = validatePassword(password, parsed);

      if (!validation.valid) {
        setError(validation.errors.join(" "));
        return;
      }

      setResult(password);
    } catch (err) {
      setError(err.message || "Could not generate a valid password.");
    }
  };

  const regenerate = () => {
    run();
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy password. Check clipboard permissions.");
    }
  };

  const usePassword = () => {
    if (!result || !rules) return;

    if (rules.unsupported.length > 0 && !verified) {
      setError(
        "Please confirm that you manually checked the unsupported requirements first."
      );
      return;
    }

    const validation = validatePassword(result, rules);

    if (!validation.valid) {
      setError(validation.errors.join(" "));
      return;
    }

    onUse(result, text);
    setUsed(true);
    setTimeout(() => setUsed(false), 2500);
  };

  return (
    <div className="generator">
      <div className="generator-heading">
        <span className="generator-icon">✨</span>
        <div>
          <h3>Smart Password Generator</h3>
          <p>Let's create a password that fits your website.</p>
        </div>
      </div>

      <label className="generator-label">Website password requirements</label>

      <textarea
        placeholder="Example: 8-16 characters, one uppercase letter, one number and a symbol such as !@#"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setRules(null);
          setResult("");
          setError("");
          setUsed(false);
          setVerified(false);
        }}
        rows={4}
      />

      <button type="button" className="generator-button" onClick={run}>
        ✨ Generate password
      </button>

      {error && <div className="error generator-error">{error}</div>}

      {rules && (
        <div className="gen-result">
          <div className="generator-summary">
            <strong>Requirements understood</strong>

            <ul>
              <li>Length: {rules.minLen}–{rules.maxLen} chars</li>
              <li>Uppercase: {rules.upper ? "Required" : "Not required"}</li>
              <li>Lowercase: {rules.lower ? "Required" : "Included"}</li>
              <li>Numbers: {rules.number ? "Required" : "Not required"}</li>
              <li>Special: {rules.special ? "Required" : "Not required"}</li>
              <li>Starts w/ letter: {rules.startWithLetter ? "Yes" : "No"}</li>
            </ul>
          </div>

          {rules.unsupported.length > 0 && (
            <div className="generator-warning">
              <strong>⚠️ Manual verification required</strong>
              <p>
                Lockr could not fully interpret some requirements. Check them on
                the website before using this password.
              </p>

              <ul>
                {rules.unsupported.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <label className="verification-check">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                I have manually checked the unsupported requirements against the
                website's password policy.
              </label>
            </div>
          )}

          {result && (
            <>
              <div className="generated-password">
                <span>Your generated password</span>
                <code>{result}</code>
                <span className="password-valid">
                  ✓ Passed supported rule checks
                </span>
              </div>

              <div className="generator-actions">
                <div className="generator-actions-row">
                  <button
                    type="button"
                    className="ghost"
                    onClick={copyPassword}
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>

                  <button
                    type="button"
                    className="ghost"
                    onClick={regenerate}
                  >
                    ↻ Regenerate
                  </button>
                </div>

                <button
                  type="button"
                  className="generator-use-button"
                  onClick={usePassword}
                  disabled={rules.unsupported.length > 0 && !verified}
                >
                  {used ? "✓ Applied to password!" : "Use this password"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
