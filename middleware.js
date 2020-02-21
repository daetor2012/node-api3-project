module.exports = (format) => {
	return (req, res, next) => {
		const { ip, method, url } = req
        const agent = req.get("User-Agent")
        const timestamp = Date.now()

		// we can use parameters defined by our HOF to
		// change the functionality of our middleware
		if (format === "short") {
			console.log(`${method} ${url}`)
		} else {
			console.log(`${ip} ${method} ${url} ${agent} ${timestamp}`)
		}
		
		next() // this middleware is done, move on to the next piece

		// ** you could also call other middleware instead of next
		// someOtherMiddleware()(req, res, next) 
	}
}