# Display Message Office Add-in

## Description

This is a Microsoft Office Add-in built with React and TypeScript. It provides a task pane interface that displays various components including a header, hero list, text insertion functionality, and a simple "Hello World!" message. The add-in is designed to integrate with Office applications such as Excel, Outlook, PowerPoint, and Word, allowing users to enhance their productivity with custom functionality.

The project uses modern web technologies including:
- React for the user interface
- TypeScript for type safety
- Fluent UI for consistent design
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
   cd "Display Message"
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
To debug the add-in in different Office applications:

- **Excel Desktop**: `npm run start -- desktop --app excel`
- **Outlook Desktop**: `npm run start -- desktop --app outlook`
- **PowerPoint Desktop**: `npm run start -- desktop --app powerpoint`
- **Word Desktop**: `npm run start -- desktop --app word`

### Deployment
1. Build the production version:
   ```
   npm run build
   ```

2. Sideload the add-in into your Office application using the generated manifest files (`manifest.xml` or `manifest.json`).

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