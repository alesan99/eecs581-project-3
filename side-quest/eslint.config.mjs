import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Resolve __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat allows extending configs in ESM
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

// ESLint configuration array
const eslintConfig = [
	...compat.extends("next/core-web-vitals"),
	{
		ignores: [  // File folders to ignore
			"node_modules/**",
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
		],
	},
];

export default eslintConfig;
