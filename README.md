# Card and photo generator

## Getting started

### Installation

```
npm ci
```

Copy the example environment file from:

```
.env.example
```

and add your Unsplash access key:

```
VITE_UNSPLASH_ACCESS_KEY=your_access_key
```

Start the dev server:

```
npm run dev
```

Then open the local URL from the terminal

Run tests with:

```
npm run test
```

## Technical decisions

### React, TypeScript, and Vite

I chose a simple dev set-up with React, TypeScript and Vite; the latter with mostly default settings. TypeScript is used in app state and the data used by the API.

### App State

I used React Context with a reducer for udpates. I chose Context over a library simply due to the size of the project and I wanted to avoid prop drilling + shared global state without adding an additional dependency. In the state, I include any information entered by the user, the current photo shown to the user, the photo that has been accepted by the user and an array of previously displayed photos from unsplash. If the user changes the topic, the selected photo will revert but the array of previously-seen photos is preserved.

### React hook form with zod

React hook form manages all the form interactions and feedback whilst zod is used to define the form validation. The same form schema is used for tests as well.

### React Router

I chose a router-based step progress so that the user can control the browser forward/back controls to get to a previous step. It also allows the use of redirects when a step is visited prematurely. As the user details are store in the state, when the user refreshes th epage a new session is started.

### Image searches

I used Unsplash based on the suggestion from the AC. I created an isolated request wrapper that is called via a custom hook. The custom hook handles the lifecycle of any requests, including request state, retries, errors and rate limits.

### Tests

Tests used VItest with React Testing Library and jsdom for component tests. Coverage is based on a mix of sensible defaults and the acceptance criteria.

### If I had more time...

- I would have introduced consistent, re-usable UI in the form of a design system and component library.
- Introduced more comprehensive tests across the board in unit, integration and e2e testing
- Implemented import aliases + automated dependency sorting by type
- Added quality gates with Husky for pre-push checks such as linting and tests.
- More comprehensive status states and more graceful loading of images to avoid cumultive layout shift
- Persist previous journeys in localStorage so they can be viewed again.
- Persist current journey info so that users don't have to keep entering their details on refresh
- Better user input santisation
- Performance improvements and scalability such as dynamic loading of components
- Offline states
- Image alt text depends on the unsplash metadata, with a very basic fallback
