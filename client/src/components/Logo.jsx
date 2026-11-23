export default function Logo({ size = 46, className = "" }) {
  return (
    <img
      src="/lockr-logo.png"
      alt="Lockr logo"
      width={size}
      height={size}
      className={`lockr-logo-img ${className}`.trim()}
    />
  );
}