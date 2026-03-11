# Menu Office Add-in

## Description

This is a Microsoft Excel Add-in built with React and TypeScript. It adds a custom **Demo** tab to the Excel ribbon with a **Hello World** button. Clicking the button opens a task pane built with Fluent UI React and inserts text into cell A1 of the active worksheet.

The project uses modern web technologies including:
- React for the user interface
- TypeScript for type safety
- Fluent UI (v9) for consistent design
- Webpack for bundling
- Office.js for Office integration

## Usage

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Microsoft Office (desktop or web version)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd "Menu"
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Development
1. Start the development server:
   ```
   npm start
   ```

2. Build the project for development:
   ```
   npm run build:dev
   ```

3. Build the project for production:
   ```
   npm run build
   ```

### Debugging
To debug the add-in in Excel:

- **Excel Desktop**: `npm run start -- desktop --app excel`

### Deployment
1. Build the production version:
   ```
   npm run build
   ```

2. Sideload the add-in into Excel using the generated `manifest.json`.

For more detailed instructions on sideloading Office Add-ins, refer to the [official Microsoft documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing).

### Available Scripts
- `npm run build`: Build for production
- `npm run build:dev`: Build for development
- `npm run dev-server`: Start development server
- `npm run lint`: Check for linting issues
- `npm run lint:fix`: Fix auto-fixable linting issues
- `npm run start`: Start the add-in
- `npm run stop`: Stop the add-in
- `npm run watch`: Watch for changes and rebuild