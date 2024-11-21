const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const upload = multer();

// GET endpoint
app.get("/api/endpoint", (req, res) => {
    res.json({ operation_code: 12345 });
});

// POST endpoint
app.post("/api/endpoint", upload.single("file"), (req, res) => {
    const data = req.body;
    const file = req.file;

    // Extracting data
    const userId = data.user_id || "Unknown";
    const collegeEmail = data.college_email || "Unknown";
    const rollNumber = data.roll_number || "Unknown";
    const inputArray = JSON.parse(data.input_array || "[]");

    // Process input array
    const numbers = inputArray.filter((x) => typeof x === "number");
    const alphabets = inputArray.filter((x) => typeof x === "string" && /^[a-zA-Z]$/.test(x));
    const lowercase = alphabets.filter((x) => x === x.toLowerCase());
    const highestLowercase = lowercase.sort().pop() || null;
    const primeFound = numbers.some(isPrime);

    // Process file
    const fileValid = file && (file.mimetype.startsWith("text/") || file.mimetype.startsWith("image/"));
    const mimeType = file ? file.mimetype : null;
    const fileSize = file ? (file.size / 1024).toFixed(2) : null;

    res.json({
        status: "Success",
        user_id: userId,
        college_email_id: collegeEmail,
        college_roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase,
        prime_found: primeFound,
        file: {
            valid: fileValid,
            mime_type: mimeType,
            file_size_kb: fileSize,
        },
    });
});

// Prime number checker
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
