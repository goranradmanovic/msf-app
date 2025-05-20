import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config() // Load .env variables

const PORT = process.env.PORT || 5000,
	// Adding the cross-origin access
	corsOptions = {
		origin: '*', 
		methods: ['GET', 'POST'], 
		allowedHeaders: ['Content-Type']
	},
	// Set the API URL and key
	apiUrl = process.env.API_URL,
	apiKey = process.env.API_KEY,
	collectionId = process.env.COLLECTION_ID,
	binName = process.env.BIN_NAME,
	binId = process.env.BIN_ID_FORM,
	app = express() // Init server

// Middleware
app.use(cors(corsOptions)) // Middleware for CORS
app.use(express.json()) // Middleware for sending JSON in the req. body 
app.use(express.urlencoded({ extended: false })) // Middleware for sending form data in the req. body

// Root endpoint
app.get('/', (req, res) => {
	res.send("Server is running....")
})

// Utils: Basic field validation
const validateUserFields = body => {
	const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone', 'country'],
		missingFields = requiredFields.filter(field => !body[field])
	return missingFields
}

// Route: Create new user
app.post('/users/new', async (req, res) => {
	const missingFields = validateUserFields(req.body || {})

	if (missingFields.length > 0) {
		return res.status(400).json({
			error: `Missing required field(s): ${missingFields.join(', ')}`
		})
	}

	try {
		const apiResponse = await fetch(`${apiUrl}`, {
			method: 'POST',
			headers: {
				"X-Master-Key": apiKey,
				"X-Collection-Id": collectionId,
				"X-Bin-Name": binName,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(req.body)
		})

		if (!apiResponse.ok) {
			const errorText = await apiResponse.text()
			return res.status(apiResponse.status).json({ error: errorText })
		}

		const data = await apiResponse.json()
		res.status(201).json({ message: 'User created successfully', data })
	} catch (error) {
		console.error('Error creating user:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)) // Start of the server