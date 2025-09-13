/**
 * Tayba Foundation - Exam Generator Script
 * @fileoverview Script to generate exams and answer keys from a question bank in Google Sheets
 * @author Muhammad Conn <muhammad.conn@icloud.com>, Tayba Foundation
 *
 * # Usage
 * 1. Set up a Google Sheet with the required metadata and question bank.
 * 2. Use the "Tayba" menu to generate an exam and answer key as Google Docs.
 */



/*------------------------------------------------------------------
  Initialize Menu
-------------------------------------------------------------------*/

/* Menu Function */
function onOpen() {
    let ui = SpreadsheetApp.getUi();
    ui.createMenu('Tayba')
        .addItem('Generate Exam & Answer Key', 'menuItem1')
        .addToUi();
}

/* Menu Item #1 Wrapper - Generate Exam */
function menuItem1() {
    generateExam()
}



/*------------------------------------------------------------------
  Main Function - Generate Exam
-------------------------------------------------------------------*/

/**
 * Convert rows into Question objects, randomize them, and generate an exam and answer key
 * based on the provided template and metadata in the sheet. Save the exam/answer key
 * as Google docs to the specified folder in Google Drive.
 * @returns {void}
 */
function generateExam() {

    // --Initialize Constants-- //

    const sheet = SpreadsheetApp.getActiveSheet();
    const startRow = 8;
    const startCol = 2; // Column B
    const numRows = sheet.getLastRow() - startRow + 1;
    const numCols = sheet.getLastColumn() - startCol + 1;
    const config = {
        courseName: sheet.getRange('D1').getValue(),
        term: Utilities.formatDate(sheet.getRange('D2').getValue(), "PST", "MMMM yyyy"),
        examSize: sheet.getRange('D3').getValue(),
        templateDocId: sheet.getRange('D4').getValue(),
        targetFolderId: sheet.getRange('D5').getValue()
    };

    if (numRows < 1 || numCols < 1) {
        Logger.log("No data found in the specified range.");
        return;
    }

    // --Data fetching + formatting-- //

    // We extract all the data in the relevant portion of the sheet, only reading the rows and columns that contain info
    const values = sheet.getRange(startRow, startCol, numRows, numCols).getValues();

    // Convert the raw data into Question objects for processing
    const questions = convertRowsToQuestions(values);

    // Randomization
    const randomizedQuestions = shuffleQuestions(questions);

    // --Exam Generation-- //

    // Create the exam and answer key documents from the template
    const examDoc = createNewDocument(config.templateDocId, `${config.courseName} ${config.term} Akindi EXAM`, config.targetFolderId);
    const answerKeyDoc = createNewDocument(config.templateDocId, `${config.courseName} ${config.term} ANSWER KEY`, config.targetFolderId);

    // Add metadata to both documents
    addMetadata(examDoc, config);
    addMetadata(answerKeyDoc, config);

    // Add questions to both documents
    addQuestions(examDoc, randomizedQuestions.slice(0, config.examSize), false);
    addQuestions(answerKeyDoc, randomizedQuestions.slice(0, config.examSize), true);

    Logger.log("Exam and answer key generated successfully.");
}

/*------------------------------------------------------------------
  Helper Methods
-------------------------------------------------------------------*/
/**
 * Transforms a 2D array of spreadsheet data into an array of Question objects.
 * @param {Array<Array<any>>} questionData The 2D array of rows from the sheet.
 * @returns {Question[]} An array of Question objects.
 */
function convertRowsToQuestions(questionData) {
    const questions = [];

    // Iterate through each row of data and create a Question object, then push it into the questions array
    for (const row of questionData) {
        const question = new Question(row);

        if (question.title !== "Default Prompt") {
            questions.push(question);
        }
    }
    return questions;
}

/**
 * Randomly shuffles the elements of an array in place using the Fisher-Yates algorithm.
 * @param arr The array to shuffle.
 * @returns {*} The shuffled array.
 */
function shuffleArray(arr) {
    let length = arr.length;
    for (let i = length - 1; i > 0; i--) {
        const randIndex = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[randIndex]] = [arr[randIndex], arr[i]];
    }
    return arr;
}

/**
 * Shuffles the order of questions and their choices while maintaining the correct answer mapping.
 * @param questions An array of Question objects to shuffle.
 * @returns {*} The array of shuffled Question objects.
 */
function shuffleQuestions(questions) {

    let tempArray = questions.slice(); // Create a shallow copy to avoid mutating the original array
    // Randomize the order of questions and their choices
    const randomizedQuestions = shuffleArray(tempArray);
    for (const question of randomizedQuestions) {
        question.shuffleChoices(); // Shuffle the choices within each question
    }
    return randomizedQuestions;
}

/**
 * Creates a new Google Document by copying a template and placing it in a specified folder.
 * @param templateID The ID of the template document to copy.
 * @param name The name for the new document.
 * @param folderID The ID of the folder to place the new document in.
 * @returns {Document} The newly created Google Document.
 */
function createNewDocument(templateID, name, folderID) {
    const folder = DriveApp.getFolderById(folderID);
    const templateFile = DriveApp.getFileById(templateID);
    const newFileId = templateFile.makeCopy(name, folder).getId();
    return DocumentApp.openById(newFileId);
}

/**
 * Replaces placeholders in the document with actual metadata values.
 * @param doc The Google Document to modify.
 * @param metadata An object containing metadata values.
 * @returns {void}
 */
function addMetadata(doc, metadata) {
    const body = doc.getBody();

    body.replaceText("#COURSE_NAME", metadata.courseName);
    body.replaceText("#TERM", metadata.term);
    body.replaceText("#NUM_OF_QUESTIONS", metadata.examSize);
}

/**
 * Adds questions and their choices to the document, highlighting correct answers if it's an answer key.
 * @param doc The Google Document to modify.
 * @param questions An array of Question objects to add.
 * @param isAnswerKey A boolean indicating if the document is an answer key.
 * @returns {void}
 */
function addQuestions(doc, questions, isAnswerKey) {
    const body = doc.getBody();
    const highlightColor = "#FFFF00"; // Yellow highlight color
    let text = body.editAsText();

    for (const question of questions) {

        // Add question prompt with numbering
        const questionItem = body.appendListItem(question.prompt);

        questionItem.setSpacingBefore(18); // Add spacing this way to preserve numbering

        // Add nested choices

        for (let i = 0; i < question.choices.length; i++) {
            const choiceText = String(question.choices[i]); // Typcasting to a string to avoid errors with true/false values

            const listItem = body.appendListItem(choiceText).setNestingLevel(1);

            // Highlight the correct answer if it's the answer key
            if (isAnswerKey && i === question.answer) {
                Logger.log(`Highlighting correct answer: ${choiceText}`);
                listItem.editAsText().setBackgroundColor(0, listItem.getText().length - 1, highlightColor);
            }
        }
        text.appendText("\r");
    }
}

/*------------------------------------------------------------------
  Debug Methods
-------------------------------------------------------------------*/

/**
 * Logs a sample question for debugging purposes.
 * @param questions An array of Question objects.
 */
function logTestQuestion(questions) {
    Logger.log("Sample Question:");
    Logger.log(`Prompt: ${questions[0].prompt}`);
    Logger.log(`Choices: ${questions[0].choices}`);
    Logger.log(`Answer Index: ${questions[0].answer}`);
    Logger.log(`Correct Answer: ${questions[0].choices[questions[0].answer]}`);
}

/**
 * Logs the state of a question before and after shuffling its choices for debugging purposes.
 * @param questions An array of Question objects.
 */
function logTestShuffleChoices(questions) {
    Logger.log("Before shuffling choices:");
    Logger.log(`Choices: ${questions[0].choices}`);
    Logger.log(`Answer Index: ${questions[0].answer}`);
    Logger.log(`Correct Answer: ${questions[0].choices[questions[0].answer]}`);

    questions[0].shuffleChoices();
    Logger.log("After shuffling choices:");
    Logger.log(`Choices: ${questions[0].choices}`);
    Logger.log(`Answer Index: ${questions[0].answer}`);
    Logger.log(`Correct Answer: ${questions[0].choices[questions[0].answer]}`);
}

/**
 * Logs the state of the questions before and after shuffling for debugging purposes.
 * @param questions An array of Question objects.
 */
function logTestShuffling(questions) {
    // Logging for debugging
    Logger.log("First question in the bank:")
    logTestQuestion(questions);
    Logger.log("--------------------------------");


    // Randomization
    const randomizedQuestions = shuffleQuestions(questions);

    // Logging for debugging
    Logger.log("First question after randomization:");
    logTestQuestion(randomizedQuestions);

    Logger.log("--------------------------------");

    // Logging to test randomization within one question object
    logTestShuffleChoices(questions);
}