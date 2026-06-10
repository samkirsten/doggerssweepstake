# Specification Document

## Project Goal
Build a small, front-end only website to manage and display a WhatsApp group's football sweepstake.

## Key Requirements
1.  **Parse Initial Data:** The initial state is a JSON file mapping participants (Matt S, Matt J, Chris, Luke, Higgins, Danny, Sam) to their drawn teams.
2.  **Display Allocations:** Visually present each participant and their allocated teams using a premium, dark-mode aesthetic.
3.  **External API Integration:** Use the openfootball API (`https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json` or similar) to fetch real-world data. For the "basic" MVP, this will be used to enhance the display (e.g., fetching matches, verifying teams).
4.  **Future Enhancements:**
    *   Add scoring mechanisms and points based on real-world progression.
    *   Calculate and display leaderboards.

## Tech Stack
*   HTML5
*   Vanilla CSS3 (Custom design system based on `brand.md`)
*   Vanilla JavaScript (ES6+ for fetching data and DOM manipulation)

## File Structure
*   `data.json`: Local static mapping of participants to teams.
*   `index.html`: Main layout.
*   `style.css`: Styling rules.
*   `app.js`: Logic to merge local data with the API data and render the UI.
