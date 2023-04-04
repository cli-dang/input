npx babel --extensions ".ts" --out-dir ./ src
tsc
eslint . --fix --ext .ts --ext .js
npm run build:fix-chmod