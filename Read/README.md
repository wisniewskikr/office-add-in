# Read Office Add-in

## Description

A Microsoft Excel Add-in built with React and TypeScript. It adds a custom **Demo** tab to the Excel ribbon with a **Read** button. Clicking the button opens a task pane with a **Read from A1 cell** button that reads the value from cell A1 of the active worksheet and displays it.

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
   cd Read
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

3. Click the **Read** button to open the task pane.

4. Type any value in cell **A1** of the active worksheet.

5. Click **Read from A1 cell** in the task pane — the value will appear below the button.

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
