# 1v1 Chess

1v1 Chess is a simple online chess application that allows players to compete against each other in real time. The game uses React for the frontend and Node.js with Express for the backend. 
The chess.js library handles the game logic, while the real-time communication is facilitated by socket.io. The application is deployed on AWS, utilizing services like Elastic Beanstalk, CloudFront, and Route 53.
Whether you're a grandmaster or beginner, 1v1 Chess provides an engaging way to play chess online with friends.

## How to deploy/test application
i. Go to this website: [https://chess.adamwu.dev/](https://chess.adamwu.dev/) on two separate tabs.

ii. On tab 1, enter a name, and click "Create Room".

iii. Click "Copy Room ID"

iv. On tab 2, enter another name, click "Join Room", and paste the room ID.

v. Voila! You can now play chess with your friend, chat with them, and view the move history. When the game is over, players will be redirected back to the lobby.

## High-level Architecture
![chess_highlevel_design drawio](https://github.com/minebreak28/1v1-Chess/assets/78050276/0ea0fbb8-d58d-4428-b8d6-b84571d4adf4)
