const http = require("http");

// In-memory data store for users
let users = [];

// Create a server instance
const server = http.createServer((req, res) => {
    // Parse the request method and URL
    const { method, url } = req;

    const userId = parseInt(url.split("/")[2], 10);
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    // Handle different routes and HTTP methods
    switch (true) {
        case method === "GET" && url === "/users":
            // Get all users
            res.setHeader("Content-Type", "text/plain");
            res.write("Users:\n");
            users.forEach((user, index) => {
                res.write(`${index + 1}. ${user}\n`);
            });
            res.end();
            break;

        case method === "POST" && url === "/users":
            // Create a new user
            req.on("end", () => {
                users.push(body);
                res.statusCode = 201;
                res.end("User created\n");
            });
            break;

        case method === "PUT" && url.startsWith("/users/"):
            // Update an existing user
            req.on("end", () => {
                if (userId > 0 && userId <= users.length) {
                    users[userId - 1] = body;
                    res.end("User updated\n");
                } else {
                    res.statusCode = 404;
                    res.end("User not found\n");
                }
            });
            break;

        case method === "DELETE" && url.startsWith("/users/"):
            // Delete a user
            if (userId > 0 && userId <= users.length) {
                users.splice(userId - 1, 1);
                res.end("User deleted\n");
            } else {
                res.statusCode = 404;
                res.end("User not found\n");
            }
            break;

        default:
            res.statusCode = 404;
            res.end("Not found\n");
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
