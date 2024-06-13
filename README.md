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
![chess_highlevel_design drawio (1)](https://github.com/minebreak28/1v1-Chess/assets/78050276/8140bf41-d5cd-42d6-9054-e0497c102dc3)

## Features
- **Real-time Multiplayer**: Allows players to play chess against each other in real-time
- **Chess Move Validation**: Validates moves including special moves like castling and promotions, using the chess.js library
- **Game State Management**: Maintains the current state of the game, including player moves, turn management, and game status (check, checkmate, stalemate)
- **Move History Log**: Keeps a detailed log of all moves made during the game, allowing players to analyze game history
- **Messaging Functionality**: Provides a real-time chat where players can communicate with each other during the game
- **PWA**: Installable as a progressive web app (PWA) on Chrome

## Technologies and Services Used

### Languages

**JavaScript**: JavaScript is the primary language used to validate game logic, allow socket connectivity, and enable interactive and dynamic user interfaces. It is extensively used in both the frontend and backend (in the form of Node.js) to ensure smooth and responsive gameplay.

**Node.js**: While technically not a language, Node.js is a runtime environment that allows the execution of JavaScript on the server side. It primarily manages WebSocket connections via Socket.io.

**HTML/CSS**: HTML and CSS were used to structure and create visually appealing designs for the user interface

### Libraries and Frameworks

**React**: React, the core of the frontend, is used to create dynamic, interactive, and aesthetic components of the chess game.
- **JSX**: React uses JSX to structure the component's UI, allowing HTML elements to be written with JavaScript.
- **State**: State management is crucial for handling dynamic data, variables, and functions in the UI and game logic.
- **Props**: Props are used extensively to pass data from parent to child components, which improves flow and modularity.
- **Event Handling**: React simplifies the process of handling events such as clicks, drags, and form submissions.
- **Hooks**: Hooks such as useState, useMemo, useCallback, and useEffect allows for managing state, memoizing values, creating performant functions, and handling side effects, respectively.

**Express**: Express is used to set up the backend server, handle routing, renders static files, and integrate with Socket.io for web socket connectivity.

**Chess.js**: Chess.js is a TypeScript chess library used for chess move generation/validation, piece placement/movement, and check/checkmate/stalemate detection. It ensures that all moves are legal according to the rules of chess and supports special moves like castling and promotions.

**Socket.io**: Socket.io is a library that enables low-latency, bidirectional and event-based communication between a web client and a server. In this application, it facilitates real-time updates for moves and chat functionality.

**Material UI**: Material UI, or MUI for short, is a React UI framework used for building responsive and aesthetically pleasing user interfaces. A variety of pre-built components are borrowed from MUI to create this application's UI elements, including Stack, Dialog, Box, and Card.

**React-Chessboard**: React-chessboard is a React component for rendering a chessboard. it is used to display the game board and pieces.

























