/**
 * Tayba Foundation - Exam Generator Script 2.0
 *
 *  # Overview
 *
 *  # Usage
 */

function main() {
  generateExam();
}

/*------------------------------------------------------------------
  Initialize Menu
-------------------------------------------------------------------*/

function onOpen(e) {

}

/*------------------------------------------------------------------
  Generate Exam
-------------------------------------------------------------------*/

function generateExam() {

  // Initialize Constants

  const sheet = SpreadsheetApp.getActiveSheet();
  const startRow = 8;
  const startCol = 2; // Column B
  const numRows = sheet.getLastRow() - startRow + 1;
  const numCols = sheet.getLastColumn() - startCol + 1;

  if (numRows < 1 || numCols < 1) {
    Logger.log("No data found in the specified range.");
    return;
  }

  // Data fetching + formatting

  // We extract all the data in the relevant portion of the sheet, only reading the rows and columns that contain info
  const values = sheet.getRange(startRow, startCol, numRows, numCols).getValues();

  // Convert the raw data into Question objects for processing
  const questions = convertRowsToQuestions(values);

  // Randomization
  const randomizedQuestions = shuffleQuestions(questions);
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