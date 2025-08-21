const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

const publicDirectory = path.join(__dirname, '../../public/snapshots'); // Adjust path as necessary

// Ensure the public directory exists
if (!fs.existsSync(publicDirectory)){
    fs.mkdirSync(publicDirectory);
}

/**
 * Generates a CSV file from JSON data and saves it to a public directory.
 * @param {Array} data - Array of JSON objects to be converted into CSV.
 * @param {String} filename - The filename for the CSV file without the address.
 * @param {String} address - The specific address to include in the filename.
 * @returns {String} The URL to access the CSV file.
 */
async function uploadCSV(data, address) {
    try {
        // Specify the fields to include in the CSV
        const fields = ['address', 'balance']; // Adjust the fields based on your actual data structure
        const opts = { fields };
        
        // Check if data is empty and handle it appropriately
        if(data.length === 0) {
            throw new Error("No data available to write to CSV");
        }

        const filenameWithAddress = `snapshot_for_${address}`;
        const csv = parse(data, opts);
        const filepath = path.join(publicDirectory, filenameWithAddress);
        fs.writeFileSync(filepath, csv);
        return `/${filenameWithAddress}`; // URL path to access the file
    } catch (error) {
        console.error('Failed to create CSV file:', error);
        throw error;
    }
}

module.exports = uploadCSV;
