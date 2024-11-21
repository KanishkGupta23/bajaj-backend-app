const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const upload = multer();

// GET endpoint (you can keep this if needed)
app.get("/api/endpoint", (req, res) => {
    res.json({ operation_code: 12345 });
});

// POST endpoint
app.post("/api/endpoint", upload.single("file"), (req, res) => {
    const data = req.body;
    const file = req.file;

    // Extracting data
    const userId = data.user_id || "1234";
    const email = data.college_email || "kanishkgupta210906@acropolis.in";
    const rollNumber = data.roll_number || "0827IT211055";
    let inputArray;

    try {
        inputArray = JSON.parse(data.inputArray || "[]");
    } catch (e) {
        return res.status(400).json({ error: "Invalid JSON input array" });
    }

    // Process input array
    const numbers = inputArray.filter((x) => !isNaN(x));
    const alphabets = inputArray.filter((x) => typeof x === "string" && /^[a-zA-Z]$/.test(x));
    const lowercase = alphabets.filter((x) => x === x.toLowerCase());
    const highestLowercase = lowercase.sort().pop() || null;
    const primeFound = numbers.some(isPrime);

    // Process file
    const fileValid = file && (file.mimetype.startsWith("text/") || file.mimetype.startsWith("image/"));
    const mimeType = file ? file.mimetype : null;
    const fileSize = file ? (file.size / 1024).toFixed(2) : null;

    // Respond with the desired structure
    res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : null, // Always return as array
        is_prime_found: primeFound,
        file_valid: fileValid,
        file_mime_type: mimeType || null, // Null if no file is uploaded
        file_size_kb: fileSize || null, // Null if no file size is available
    });
});

// Prime number checker function
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
