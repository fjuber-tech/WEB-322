/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Fairooz Juber  Student ID: 102907243 Date: 5/14/2025
*
********************************************************************************/ 

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Do you wish to process a File (f) or Directory (d): ', (choice) => {
    if (choice === 'f') {
        rl.question('File: ', (filePath) => {
            processFile(filePath);
            rl.close();
        });
    } else if (choice === 'd') {
        rl.question('Directory: ', (dirPath) => {
            processDirectory(dirPath);
            rl.close();
        });
    } else {
        console.log('Invalid Selection');
        rl.close();
    }
});

function processFile(filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const content = data.toString().replace(/\s+/g, ' ');
        const wordsArray = content.replace(/[^\w\s\']/g, '').split(' ').filter(Boolean);

        const charCount = content.length;
        const wordCount = wordsArray.length;

        // Find longest word
        let longestWord = '';
        wordsArray.forEach(word => {
            if (word.length > longestWord.length) {
                longestWord = word;
            }
        });

        // Count word frequencies
        const wordFrequency = {};
        wordsArray.forEach(word => {
            const lowerWord = word.toLowerCase();
            wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
        });

        // Find most repeated word
        let mostRepeatedWord = '';
        let mostRepeatedCount = 0;
        for (const word in wordFrequency) {
            if (wordFrequency[word] > mostRepeatedCount) {
                mostRepeatedCount = wordFrequency[word];
                mostRepeatedWord = word;
            }
        }

        // Display report
        console.log(`Number of Characters (including spaces): ${charCount}`);
        console.log(`Number of Words: ${wordCount}`);
        console.log(`Longest Word: ${longestWord}`);
        console.log(`Most Repeated Word: ${mostRepeatedWord} - ${mostRepeatedCount} times`);
    });
}

function processDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Sort files in reverse alphabetical order
        files.sort().reverse();

        console.log(`Files (reverse alphabetical order): ${files.join(', ')}`);

        // Optional part: Show size in bytes for each file
        files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            try {
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    console.log(`${file}: ${stats.size} bytes`);
                }
            } catch (err) {
                console.log(err.message);
            }
        });
    });
}
