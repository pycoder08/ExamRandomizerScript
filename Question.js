/**
 * @fileoverview Defines the Question class for building exams
 * @author Muhammad Conn <muhammad.conn@icloud.com>
 */

/**
 * Represents an exam question.
 * 
 * This class encapsulates information associated with each question on an exam, 
 * including a prompt, answer, and choices.
 * 
 * @class Question
 * @example
 * // How to generate a Question instance
 * const question = 
 */
class Question {
  constructor(prompt, answer, choices) {
    /**
     * The prompt of the question
     * @type {string}
     * @public
     */
    this.prompt = "Default Question Prompt";

    /**
     * The correct answer to the question
     * @type {string}
     * @public
     */
    this.answer = "Default Question Answer";

    /**
     * The list of choices for answers
     * @type {array}
     * @public
     */
    this.choices = [];
  }

  /**
   * Checks if a given choice is the correct answer.
   * @param {string} choice - The choice to check
   * @returns {boolean} True if the choice is correct, false otherwise
   * @public
   */
  isCorrect(choice) {
    return choice === this.answer;
  }
  
}