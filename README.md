# Can I AMS This?

"Can I AMS This?" is a web application designed for World of Warcraft players, specifically Death Knights. It provides a quick and easy way to check which spells in dungeons and raids can be immuned using the Anti-Magic Shell (AMS) ability.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - React framework for server-rendered applications.
    *   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
    *   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
    *   [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable components built using Radix UI and Tailwind CSS.
    *   [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [pnpm](https://pnpm.io/installation)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your_username/caniamsthis.git
    cd caniamsthis
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Start the development server:**

    ```bash
    pnpm dev
    ```

4.  **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

## Usage

*   The homepage displays a list of all dungeons and raids.
*   You can click on a dungeon or raid to see a detailed view of all the NPCs and their spells.
*   The application indicates which spells can be immuned with Anti-Magic Shell.
*   There is a search bar to search for specific spells.

## Scripts

The `scripts` directory contains Python scripts for scraping and processing data from World of Warcraft data sources.

*   `scraper.py`: This script scrapes data from a WoW data source and saves it to `instances.json`.
*   `refine.py`: This script processes the `instances.json` file to add the `can_immune` flag to spells based on certain heuristics.

To run the scripts, you will need to set up a Python virtual environment and install the dependencies in `scripts/requirements.txt`.
```bash
cd scripts
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then you can run the scripts:
```bash
python scraper.py
python refine.py
```
