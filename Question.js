/**
 * @fileoverview Defines the Question class for building exams
 * @author Muhammad Conn <muhammad.conn@icloud.com>, Tayba Foundation
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
    this.prompt = rowData[0].trim() || "Default Prompt";

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

  /**
   * Randomizes the order of choices and updates the answer index accordingly.
   * @returns {void}
   */
  shuffleChoices() {
    // Handle blank answers/choices before shuffling
    if (this.answer === null || this.choices[this.answer] === undefined) {
      console.warn(`Could not shuffle choices for question "${this.title}" due to invalid answer index.`);
      return;
    }

    const correctAnswerText = this.choices[this.answer];

    // Shuffle the choices array using Fisher-Yates algorithm from Code.js
    shuffleArray(this.choices);

    // Update the answer index to the new position of the correct answer
    this.answer = this.choices.indexOf(correctAnswerText);

  }
}