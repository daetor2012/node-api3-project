const express = require("express")
const server = express()
server.use(express.json())
const port = 4000
const logger = require("./middleware")
const userRouter = require("./users/userRouter")

server.use(logger())
server.use("/", userRouter)
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})