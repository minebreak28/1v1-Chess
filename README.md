# 1v1 Chess

1v1 Chess is a simple online chess application that allows players to compete against each other in real time. The game uses React for the frontend and Node.js with Express for the backend. 
The chess.js library handles the game logic, while the real-time communication is facilitated by socket.io. The application is deployed on AWS, utilizing services like Elastic Beanstalk, CloudFront, and Route 53.
Whether you're a grandmaster or beginner, 1v1 Chess provides an engaging way to play chess online with friends.

## How to deploy/test application
1. Go to this website: [https://chess.adamwu.dev](https://chess.adamwu.dev) on two separate tabs.

2. On tab 1, enter a name, and click "Create Room".

3. Click "Copy Room ID"

4. On tab 2, enter another name, click "Join Room", and paste the room ID.

5. Voila! You can now play chess with your friend, chat with them, and view the move history. When the game is over, players will be redirected back to the lobby.

## High-level Architecture
![chess_highlevel_design drawio](https://github.com/minebreak28/1v1-Chess/assets/78050276/0ea0fbb8-d58d-4428-b8d6-b84571d4adf4)

## Features
- **Real-time Multiplayer**: Allows players to play chess against each other in real-time
- **Chess Move Validation**: Validates moves including special moves like castling and promotions, using the chess.js library
- **Game State Management**: Maintains the current state of the game, including player moves, turn management, and game status (check, checkmate, stalemate)
- **Move History Log**: Keeps a detailed log of all moves made during the game, allowing players to analyze game history
- **Messaging Functionality**: Provides a real-time chat where players can communicate with each other during the game
- **PWA**: Installable as a progressive web app (PWA) on Chrome

## Technologies and Services Used

### Languages

**JavaScript**: Used extensively in the frontend and backend

**Node.js**: While technically not a language, Node.js

**HTML/CSS**:
