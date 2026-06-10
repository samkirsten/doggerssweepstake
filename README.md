# 🏆 Doggers Sweepstake 2026

A premium, lightweight, fully client-side web application built to manage and track our WhatsApp group's football sweepstake for the 2026 World Cup.

## 🌟 Features

*   **Live Scoring Engine**: Automatically fetches match results from the open-source [openfootball World Cup API](https://github.com/openfootball/worldcup.json).
*   **Dynamic Leaderboard**: Calculates points in real-time based on group stage performance and knockout progression, automatically sorting participants from 1st to last.
*   **Team Status Tracking**:
    *   `Next: vs [Team]`: Displays the next scheduled fixture for an active team.
    *   `Eliminated ❌`: Automatically marks teams when they lose a knockout match or fail to progress past the group stage.
    *   `Winner 🏆`: Highlights the team that wins the tournament.
*   **Premium UI**: Custom "glassmorphism" design system with deep dark mode aesthetics, glowing orbs, and fluid micro-animations.
*   **Test Mode**: Includes a dedicated testing environment (`/test`) loaded with mock matches to verify scoring and elimination logic without needing live data.

## 🛠 Tech Stack

Built entirely with standard web technologies for maximum performance and zero-config deployment:
*   **HTML5**
*   **Vanilla CSS3**
*   **Vanilla JavaScript (ES6+)**

## 🚀 How to Run Locally

You don't need any complex build tools or `npm` installations. 

1. Clone the repository:
   ```bash
   git clone https://github.com/samkirsten/doggerssweepstake.git
   ```
2. Navigate into the directory and start a local web server (e.g., using Python):
   ```bash
   cd doggerssweepstake
   python3 -m http.server 8080
   ```
3. Open your browser and go to `http://localhost:8080`.
4. To view the test mode, navigate to `http://localhost:8080/test`.

## 🌐 Hosting on GitHub Pages

Because the application is 100% frontend code, it can be hosted directly via GitHub Pages for free:
1. Go to your repository settings on GitHub.
2. Navigate to **Pages** in the left sidebar.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` directory, then click **Save**.
5. Your live sweepstake URL will be generated within a few minutes!

## 📊 Scoring Rules

Points are accumulated dynamically as the API updates with match results:
*   **Group Stage Win:** 3 pts
*   **Group Stage Draw:** 1 pt
*   **Reach Round of 32:** 5 pts
*   **Reach Round of 16:** 10 pts
*   **Reach Quarter Finals:** 20 pts
*   **Reach Semi Finals:** 30 pts
*   **Reach Final:** 50 pts
*   **Win the World Cup:** 75 pts
