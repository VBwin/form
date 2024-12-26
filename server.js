const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data from form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML and CSS)
app.use(express.static(__dirname));

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const formData = req.body;

    // Ensure existing data is read and handled properly
    let existingData = [];
    try {
        if (fs.existsSync('data.json')) {
            const fileContent = fs.readFileSync('data.json', 'utf-8');
            existingData = JSON.parse(fileContent);

            // Ensure it's an array
            if (!Array.isArray(existingData)) {
                existingData = [];
            }
        }
    } catch (error) {
        console.error('Error reading or parsing data.json:', error);
        existingData = []; // Default to an empty array if any error occurs
    }

    // Add the new form data to the array
    existingData.push(formData);

    // Write the updated data back to the JSON file
    try {
        fs.writeFileSync('data.json', JSON.stringify(existingData, null, 2));
        res.send('Form data saved successfully!');
    } catch (error) {
        console.error('Error writing to data.json:', error);
        res.status(500).send('Failed to save form data.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
