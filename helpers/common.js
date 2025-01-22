import { Dimensions } from "react-native";

// Get the width and height of the device's screen
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Calculate a percentage-based height of the screen
 * @param {number} percentage - The percentage of the screen height to calculate
 * @returns {number} The calculated height in pixels
 */
export const getHeightPercentage = (percentage) => {
  return (percentage * screenHeight) / 100;
};

/**
 * Calculate a percentage-based width of the screen
 * @param {number} percentage - The percentage of the screen width to calculate
 * @returns {number} The calculated width in pixels
 */
export const getWidthPercentage = (percentage) => {
  return (percentage * screenWidth) / 100;
};
