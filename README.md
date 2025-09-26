# RESTRUCTURE-FRONTEND

A modern frontend project built with React, TypeScript, Vite, and Tailwind CSS.

## Project Structure

```
components.json
eslint.config.js
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
universal.css
vite.config.ts
src/
  App.css
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
  assets/
  hooks/
  layouts/
  lib/
  pages/
  store/
  utils/
  views/
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Sarveshmhc/RESTRUCTURE-FRONTEND.git
   cd RESTRUCTURE-FRONTEND
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```sh
npm run build
# or
yarn build
```

### Linting

```sh
npm run lint
# or
yarn lint
```

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Folder Overview

- `src/` - Main source code
  - `assets/` - Static assets (images, etc.)
  - `hooks/` - Custom React hooks
  - `layouts/` - Layout components
  - `lib/` - Utility libraries
  - `pages/` - Page components
  - `store/` - State management
  - `utils/` - Utility functions
  - `views/` - UI components and views

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
