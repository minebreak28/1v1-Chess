# 1v1 Chess

1v1 Chess is a simple online chess application that allows players to compete against each other in real time. The game uses React for the frontend and Node.js with Express for the backend. 
The chess.js library handles the game logic, while the real-time communication is facilitated by socket.io. The application is deployed on AWS, utilizing services like Elastic Beanstalk, CloudFront, and Route 53.
Whether you're a grandmaster or beginner, 1v1 Chess provides an engaging way to play chess online with friends.

## How to deploy/test application
1. [https://chess.adamwu.dev](https://chess.adamwu.dev) on two separate tabs.

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

### Services

**AWS Elastic Beanstalk**: Elastic Beanstalk is a platform as a service (PaaS) which deploys and manages the backend Node.js server. It greatly simplifies the process of application deployment by handling infrastructure provisioning, load balancing, auto-scaling, and monitoring.

**AWS S3**: S3 provides object storage for the React frontend.

**AWS Cloudfront**: Cloudfront delivers contents to user with low latency and provides a secure HTTPS connection.

**AWS Route 53**: Route 53 manages the DNS and directs traffic to my custom domain name.

## Future Plans and Goals

While this application effectively showcases my technical skills, there are several improvements and features I plan to implement in the future:
- **User Profiles**: Players are able to create an account and play under a profile. Profiles will feature game statistics, such as win/loss and elo rating.
- **Authentication**: The next logical step in implementing user profiles is to implement an authentication system to attach persistent user IDs to client sockets. This way, a client’s WebSocket connection can be easily identified, ensuring secure and consistent user sessions throughout the application. This can be done with something like Amazon Cognito or Auth0.
- **Global Rooms**: Currently, active rooms are stored in a simple JavaScript Map. This is not ideal because it lacks persistence and scalability, meaning room data is lost when the server restarts. If deploying for production, the system cannot efficiently handle a large number of concurrent rooms and users. To combat this, I will make use of a database such as Redis or DynamoDB to store room data and game state. This way, rooms can be created and persist globally, allowing players to join rooms without needing an invite code if they choose. Empty rooms will close by themselves.
- **Spectators**: I was originally going to implement this, but couldn't due to complications in logistics. While each room can only have two players, there should be an option to join a room as a spectator to view an ongoing match.
- **Disconnection Improvements**: Currently, when a player disconnects, the other player wins by default and automatically gets sent back to the lobby. With this enhancement, disconnected clients will automatically rejoin a game room after they have connected. This can be done by also using a database, where room and game data can be retrieved from the backend.
- **Enhanced Gameplay Features and Mechanics**: There are a lot of gameplay features that I thought about and would have loved to add, but unfortunately did not have enough time. Such features include reversing a move, adding a game clock, integrating an open-source chess engine like Stockfish for single-player mode, providing hints mid-game and analyses post-game, and implementing timed chess such as bullet, blitz, and rapid. I hope I can implement some of these in the future as they seem very fun to code.
- **Docker**: I used Docker to containerize the frontend and backend, but was unable to deploy to Elastic Beanstalk, so I unfortunately had to scrap this. If I had more time and knowledge, I can use Docker to ensure consistent environments for development and testing. Docker containers are lightweight and portable, which makes them ideal for running in the cloud.
- **Mobile Optimization**: This application is not optimal on mobile devices. For production, this app will use Bootstrap or Tailwind CSS for mobile accessibility.
