# 64Sqaures

## Description

64 Squares is a sophisticated online chess platform where players can connect with others globally, challenging opponents in real-time matches. This project provides an immersive and intuitive interface for a seamless chess experience.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Contribution](#contribution)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yash631/64Sqaures.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd BackEnd
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

## Usage

Once the development server is running:

1. **Start a New Game**

   - Open the platform in two browser windows or tabs by navigating to http://localhost:5500/FrontEnd/mainGame.html. This will allow two idle players to join the same game.
   - Type your name and click on the "Start a game" button to join a new chess match.

2. **Multiplayer Mode**

   - Once both players have joined the game, the match will begin automatically, with each player being assigned their respective color (white or black), simulating a real-time multiplayer experience on localhost.

3. **Move Pieces**

   - Drag and drop pieces to make your moves. The game will validate legal moves automatically
     in accordance with chess rules.

## Screenshots

### Main Game Screen

![Main Game Screen](Screenshots/homeScreen.png)

### Match Started

![White](Screenshots/gameJoin/white.png)
![Black](Screenshots/gameJoin/black.png)

### Abort Game

![White](Screenshots/abort/white.png)
![Black](Screenshots/abort/black.png)

### Resign Game

![White](Screenshots/resign/white.png)
![Black](Screenshots/resign/black.png)

### Offer Draw

![Black](Screenshots/drawOffer/black.png)
![White](Screenshots/drawOffer/white.png)

### Checkmate

![Black](Screenshots/checkMate/black.png)
![White](Screenshots/checkMate/white.png)

## Technologies Used

- **Frontend:**

  - [JavaScript](https://www.javascript.com/)
  - [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)

- **Backend:**

  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [cors](https://www.npmjs.com/package/cors)
  - [nodemon](https://www.npmjs.com/package/nodemon)
  - [socket.io](https://socket.io/)
  - [uuid](https://www.npmjs.com/package/uuid)

- **Other Tools:**
  - [Git](https://git-scm.com/)
  - [GitHub](https://github.com/)

## Contribution

To contribute, please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b your-new-branch-name
   ```

3. **Make your changes and commit them:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the branch:**

   ```bash
   git push -u origin your-new-branch-name
   ```

5. **Open a Pull Request.**

Please ensure your code adheres to the project's coding standards and includes relevant tests for new features or functionality.

## Contact

  - **Email:** yash80763@gmail.com
  - **GitHub:** [yash631](https://github.com/yash631)
  - **LinkedIn:** [Yash Kumar](https://www.linkedin.com/in/yash-kumar-65122620b/)

## Acknowledgements

  - [Chessboard.js](https://github.com/oakmac/chessboardjs) for Chessboard interface.
  - [Wikimedia](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces) for free chess piece images.
