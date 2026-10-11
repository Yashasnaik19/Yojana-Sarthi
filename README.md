 Yojana Sarthi

Discover government schemes. Understand eligibility. Track your application journey.

Yojana Sarthi is a citizen-focused web app that helps people explore Indian central and state welfare schemes, find schemes relevant to their circumstances, understand benefits and eligibility in simple language, and keep track of application milestones in one place.

Important: Yojana Sarthi is an independent project, not an official government website. Scheme information, eligibility matches, deadlines, and application statuses are provided for guidance. Always confirm current rules and application status with the relevant government department or official portal.

✨ Features

Personalised scheme discovery — create a citizen profile and get scheme recommendations based on location, occupation, income range, and needs.

Search and filters — browse the scheme catalogue by keyword, central/state scope, citizen group, and saved schemes.

Scheme details — review benefits, eligibility summaries, required documents, application instructions, official links, and contact details where available.

Application journey tracker — record an application's progress through stages such as submission, verification, sanction, and payment.

Sanction and payment overview — view the status information recorded for each tracked application.

Bookmarks and notifications — save schemes and review in-app reminders, scheme updates, and application-related notifications.

Voice-assisted discovery — use the voice-search interface to help express a scheme-related query.

AI-assisted explanations — the Gemini integration can explain scheme information in simpler language, parse citizen queries, and summarise scheme updates. Fallback responses are provided for supported endpoints when Gemini is unavailable.

English, Hindi, and Kannada — switch the interface language between en, hi, and kn.

Privacy tools — the app includes controls for exporting and deleting locally stored user data.

Demo mode and responsive UI — explore the prototype with sample records on desktop or mobile-sized screens.

🧰 Tech stack

Area

Technology

Frontend

React 19, TypeScript, Vite

Styling

Tailwind CSS 4

Icons and animation

Lucide React, Motion

Server and API

Node.js, Express, TypeScript (tsx)

AI integration

Google Gemini via @google/genai

Development and production build

Vite

🚀 Run locally

Requirements

Node.js 20.19+ or 22.12+

npm (included with Node.js)

A Google Gemini API key for Gemini-powered features (optional; fallback behaviour is available for the API routes that support it)

1. Clone the repository

git clone https://github.com/Yashasnaik19/Yojana-Sarthi.git
cd Yojana-Sarthi

2. Install dependencies

npm install

3. Configure environment variables

Copy .env.example to .env.

Windows PowerShell:

Copy-Item .env.example .env

macOS / Linux:

cp .env.example .env

Open .env and replace the placeholder with your Gemini API key:

GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000

Get a key from Google AI Studio. Keep the key private. Never commit your .env file or paste API keys into source code, issues, screenshots, or public logs. The .env.example file is only a template; do not put a real secret in it.

If you do not configure GEMINI_API_KEY, the application can still run, but Gemini-powered responses will use the fallback behaviour implemented in the relevant API routes.

4. Start the development server

npm run dev

Open http://localhost:3000. The Express server uses Vite middleware during development; its default port is 3000 and can be changed with the PORT environment variable.

5. Build for production

npm run build

To serve the built app locally:

Windows PowerShell:

$env:NODE_ENV = "production"
npm start

macOS / Linux:

NODE_ENV=production npm start

The production server serves the generated dist/ directory. Set the environment variables in your hosting provider's secret/environment-variable settings when deploying; do not upload .env to your hosting service as a source file.

🧪 Available scripts

Command

Purpose

npm run dev

Starts the Express server with Vite development middleware.

npm run build

Builds the frontend into dist/.

npm start

Starts the server; set NODE_ENV=production to serve the production build.

npm run preview

Runs Vite's static preview server for the build.

npm run lint

Runs the TypeScript compiler without emitting files.

npm run clean

Removes the generated dist and server.js paths on environments supporting the script's shell command.

🗂️ Project structure

Yojana-Sarthi/
├── src/
│   ├── assets/          # Images and other frontend assets
│   ├── components/      # UI components, modals, cards, navigation and notices
│   ├── data/            # Translations and seeded demo scheme/application data
│   ├── services/        # Browser storage and scheme matching logic
│   ├── types/           # TypeScript domain types
│   ├── App.tsx          # Main application and views
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── .env.example        # Environment variable template
├── index.html          # HTML entry point and page metadata
├── metadata.json       # App metadata
├── package.json        # Dependencies and npm scripts
├── server.ts           # Express server and Gemini API routes
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite, React and Tailwind configuration

🔌 API routes

The Express server exposes the following routes:

Method

Route

Purpose

GET

/api/health

Returns server health and whether the Gemini client is available.

POST

/api/gemini/explain

Generates a plain-language explanation using the supplied scheme name, benefits, eligibility, and language.

POST

/api/gemini/voice-parse

Parses a citizen's free-text query into suggested profile filters.

POST

/api/gemini/summarize-update

Creates a short summary of a supplied scheme update.

Example health check:

curl http://localhost:3000/api/health

The AI routes use the GEMINI_API_KEY environment variable when available. Their fallback responses are intended to keep the prototype usable; a fallback response is not evidence that a live government source was checked.

🧭 Data and application-status notes

The current prototype seeds the interface with example scheme and application records.

User profile information, saved schemes, tracked applications, language preference, and related UI data are stored in the browser's local storage. They are not automatically synchronised between devices or users.

The application tracker displays the status information saved in the app. Unless a specific official integration is configured and verified, it does not automatically retrieve real-time sanction or payment status from a government system.

Matching scores are recommendations to help users explore schemes. They are not an official eligibility decision and do not guarantee approval or benefits.

Verify deadlines, eligibility, documents, and application instructions on the relevant official portal before taking action.

🔐 Security and privacy

Keep local .env files and API keys out of version control.

Do not enter Aadhaar numbers, bank details, passwords, or other sensitive information into a prototype unless the relevant secure collection and storage mechanisms have been implemented and reviewed.

Browser local storage is specific to a browser profile and is not a secure replacement for a production database or authenticated backend.

Review the privacy controls and data handling carefully before using this project with real citizens' personal information.

🤝 Contributing

Contributions and suggestions are welcome.

Fork the repository.

Create a branch for your change:

git checkout -b feature/your-change

Make your changes and run the available checks:

npm run lint
npm run build

Commit your changes and open a pull request describing what changed and how you tested it.

For scheme-data changes, prefer official government sources and include the source URL and the date the information was last verified.

📄 License

No LICENSE file is currently present in the repository. Until a license is added, do not assume that the project is licensed for unrestricted reuse. Add a license file if you intend to define reuse, modification, and distribution permissions.

Built to make public-benefit information easier to discover and understand. 🇮🇳
