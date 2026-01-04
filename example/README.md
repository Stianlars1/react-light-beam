# LightBeam Example / Demo Site

This is the demo site for [@stianlarsen/react-light-beam](https://www.npmjs.com/package/@stianlarsen/react-light-beam).

## 🚀 Live Demo

[View Live Demo](https://react-light-beam.vercel.app) *(Deploy this to Vercel!)*

## 🛠️ Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📦 What's This?

This Next.js app serves two purposes:

1. **Testing Ground**: Test the LightBeam component with interactive controls
2. **Homepage**: Beautiful example site showcasing the component

## 🔗 Using Local Package

This example uses the local `@stianlarsen/react-light-beam` package from the parent directory via:

```json
"@stianlarsen/react-light-beam": "file:../"
```

When you make changes to the main package:
1. Run `npm run build` in the root directory
2. Changes automatically reflect here (restart dev server)

## 🌐 Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/stianalars1/react-light-beam/tree/main/example)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 Built With

- Next.js 15
- TypeScript
- Tailwind CSS
- GSAP (via LightBeam)

## 📄 License

MIT
