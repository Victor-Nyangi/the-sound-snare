import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next 16 ships a native flat config, so it is spread directly
// rather than wrapped in FlatCompat.
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
