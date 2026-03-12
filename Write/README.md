# Write Office Add-in

## Description

A Microsoft Excel Add-in built with React and TypeScript. It adds a custom **Demo** tab to the Excel ribbon with a **Write** button. Clicking the button opens a task pane with a **Name** text field and a **Write to A1 cell** button that writes `Hello World <name>` to cell A1 of the active worksheet.

Technologies used:
- React for the user interface
- TypeScript for type safety
- Fluent UI (v9) for consistent design
- Webpack for bundling
- Office.js for Office integration

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm
- Microsoft Office desktop (Excel)

### Steps
1. Navigate to the project directory:
   ```
   cd Write
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the add-in (launches Excel with the add-in sideloaded):
   ```
   npm start
   ```

2. In Excel, click the **Demo** tab in the ribbon.

3. Click the **Write** button to open the task pane.

4. Type a name in the **Name** field (e.g. "Alice").

5. Click **Write to A1 cell** in the task pane — cell A1 will show `Hello World Alice`.

6. To stop the add-in:
   ```
   npm stop
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the add-in in Excel |
| `npm stop` | Stop the add-in |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run dev-server` | Start the development server only |
| `npm run watch` | Watch for changes and rebuild |
| `npm run lint` | Check for linting issues |
| `npm run lint:fix` | Fix auto-fixable linting issues |
| `npm run validate` | Validate the manifest file |
