/**
 * Tayba Foundation - Exam Generator Script 2.0
 * 
 *  # Overview
 * 
 *  # Usage
 */


/*------------------------------------------------------------------
  Initialize Menu
-------------------------------------------------------------------*/

function onOpen(e) {
  
}


function main() {

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

  const questions = convertRowsToQuestions(values);


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

  for (const row of questionData) {
    const question = new Question();
  }

}