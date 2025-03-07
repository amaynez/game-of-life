# Conway's Game of Life - Landing Page & Interactive Experience

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
<!-- Add any other badges you want here, e.g., build status, test coverage -->

## Overview

This repository contains a modern, slick landing page for Conway's Game of Life, a classic cellular automaton.  The landing page not only provides information about the Game of Life but also features an interactive, embedded version of the game itself, going beyond a simple demonstration.  The experience is designed to be visually appealing, engaging, and accessible to both those familiar with the game and newcomers.

## Features

*   **Embedded Interactive Game:**  Play Conway's Game of Life directly within the landing page.  No need to navigate to a separate page.
*   **Slick Modern UI/UX:** The design prioritizes a clean, visually appealing aesthetic with smooth animations and a user-friendly interface.
*   **Interactive Controls:**  Go beyond simple start/stop/reset. The game includes:
    *   **Pattern Presets:** Easily load classic Game of Life patterns like Gliders, Pulsars, Spaceships, and more.
    *   **Drawing Mode:** Click and drag to manually create and modify cells on the grid.
    *   **Speed Control:** Adjust the simulation speed to observe the evolution at your preferred pace.
    *   **Random Generation:**  Initialize the grid with a random configuration.
    * **Clear/Reset:** Return the grid to a blank state.
*   **Informative Content:** The landing page includes:
    *   A concise explanation of Conway's Game of Life and its rules.
*   **Responsive Design:** The landing page and game are fully responsive, adapting seamlessly to various screen sizes (desktops, tablets, and mobile phones).

## Tech Stack (Considerations & Options)

This project is built using a modern web development stack. Here's a breakdown of possible technologies and why they might be chosen:

*   **HTML5 & CSS3:**  Foundation for structure and styling.  Leverage CSS Grid or Flexbox for layout, and CSS animations for a polished look.
*   **JavaScript (Vanilla or Framework):**
    *   **Vanilla JavaScript:** For maximum control and performance, particularly for the core game logic, the game can be implemented directly in vanilla JS. This keeps dependencies minimal.
    *   **React/Vue/Svelte:**  If you prefer a component-based approach for managing the UI, these frameworks can simplify development, especially for interactive controls and state management.  React is a popular choice, but Vue and Svelte offer alternatives with potentially smaller bundle sizes.
    *   **p5.js:** A JavaScript library that makes it easy to work with the HTML Canvas, which is ideal for drawing the Game of Life grid and cells.  It simplifies many drawing and animation tasks. *Highly Recommended* for visualizing the game.
*   **Build Tools (Optional):**
    *   **Webpack/Parcel/Rollup:**  If using a framework or managing multiple JavaScript files, a bundler is essential for optimizing performance and creating a production-ready build.
*   **State Management (Optional, if using a framework):**
    *   **React Context API/Redux/Zustand:** If using React, these tools help manage the game state (grid, generation, etc.) efficiently.
    *   **Vuex (for Vue):**  Vue's official state management library.
    *   **Svelte Stores:** Svelte's built-in state management solution.
*   **Canvas API (Directly or via p5.js):**  Essential for rendering the Game of Life grid and cells.  The Canvas provides a performant way to draw graphics directly on the web page.

**Recommended Combination (for a balance of simplicity and features):**

*   HTML5 & CSS3
*   JavaScript (Vanilla JS for game logic, React/Vue/Svelte are optional, but recommended for complex UI)
*   p5.js (for rendering the game grid)
*   Webpack/Parcel (for bundling)

## Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/<your-username>/<your-repo-name>.git
    cd <your-repo-name>
    ```

2.  **Install dependencies (if applicable):**

    If you're using a package manager (like npm or yarn), navigate to the project directory and install the necessary dependencies:

    ```bash
    npm install  # Or: yarn install
    ```

3.  **Run the development server:**

    The specific command will depend on your chosen build tools.  For example, with a typical React setup, you might use:

    ```bash
    npm start  # Or: yarn start
    ```

    This will typically start a local development server (e.g., on `http://localhost:3000`) and automatically reload the page whenever you make changes to the code.

4. **Build for production:**

    ```bash
    npm run build  # Or: yarn build
    ```
    This will create an optimized production build of the project, usually in a `dist` or `build` folder.

## How to Play

1.  **Start/Pause:** Click the "Start" button to begin the simulation. Click "Pause" to halt it.
2.  **Step:** Click the "Step" button to advance the simulation by a single generation.
3.  **Reset:** Click the "Reset" button to clear the grid and return to the initial state.
4.  **Draw:** Click and drag on the grid to add or remove live cells (usually when the simulation is paused).
5.  **Presets:** Select a pattern from the "Presets" dropdown menu to load a pre-defined configuration.
6.  **Speed:** Use the speed slider/buttons to adjust the simulation speed.
7.  **Random:** Click the "Random" button to populate the grid with a random arrangement of live cells.

## Contributing

Contributions are welcome!  If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m "Add some feature"`
5.  **Push to the branch:** `git push origin feature/your-feature-name`
6.  **Create a pull request.**

Please follow good coding practices and include clear descriptions of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Armando Maynez - papyri-brushed-8n@icloud.com
Project Link: [https://github.com/amaynez/life-experience-hub](https://github.com/amaynez/life-experience-hub)

<!-- Add any other relevant sections, such as acknowledgments, future enhancements, etc. -->
## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
