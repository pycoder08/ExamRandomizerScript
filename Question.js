/**
 * @fileoverview Defines the Question class for building exams
 * @author Muhammad Conn <muhammad.conn@icloud.com>
 */

/**
 * Represents an exam question.
 * 
 * This class encapsulates information associated with each question on an exam, 
 * including a prompt, answer, and choices. It constructs a question object from
 * a row of data typically extracted from a spreadsheet.
 * 
 * @class Question
 * @example
 * // How to generate a Question instance
 * const question = 
 */
class Question {
  constructor(rowData) {
    /**
     * The prompt of the question
     * @type {string}
     * @public
     */
    this.prompt = rowData[0] || "Default Prompt";

    /**
     * The correct answer to the question as an index in the choices array.
     * @type {number|null}
     * @public
     */
    this.answer = this.mapAnswerChoiceToArrayIndex(rowData[1]);

    /**
     * The list of choices, taken from the rest of the row.
     * @type {string[]}
     */
    this.choices = rowData.slice(2).filter(choice => choice !== "");
  }


  /**
   * Converts a letter ('A', 'B') to a zero-based index (0, 1).
   * @param {string} letter The letter choice from the sheet.
   * @returns {number|null} The corresponding array index.
   */
  mapAnswerChoiceToArrayIndex(letter) {
    if (!letter || typeof letter !== 'string') return null;
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  }
  
}