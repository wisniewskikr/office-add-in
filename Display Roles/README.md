# Display Roles Add-in

## Description

Display Roles is an Office Excel Add-in that shows the account type of the currently logged-in user. When you click the **Display Roles** button in the task pane, the add-in reads `Office.context.userProfile.accountType` and displays the value (e.g., `"AAD"`, `"MSA"`, `"ADFS"`) directly in the task pane.

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm
- Microsoft Excel (desktop, Microsoft 365)

### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the add-in and sideload it into Excel:

   ```bash
   npm start
   ```

   This will build the project, start the webpack dev server, and automatically open Excel with the add-in sideloaded.

## Usage

1. Open Excel. The add-in is sideloaded automatically when you run `npm start`.
2. In the ribbon, navigate to the **Demo** tab.
3. Click the **Display Roles** button to open the task pane.
4. In the task pane, click the **Display Roles** button.
5. The account type (e.g., `"AAD"`) will appear below the button.
