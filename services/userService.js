import { supabase } from "../lib/superbase";

/**
 * Fetches user data from the "users" table using the provided user ID.
 * @param {string} userId - The unique ID of the user to fetch.
 * @returns {Promise<{success: boolean, msg?: string, data?: object}>}
 * An object containing the operation's success status, an optional error message, and user data (if successful).
 */
export const getUserData = async (userId) => {
  try {
    // Query the "users" table in Supabase to fetch data for the given user ID
    const { data, error } = await supabase
      .from("users") // Target the "users" table
      .select() // Select all columns
      .eq("id", userId) // Match the "id" column with the provided userId
      .single(); // Ensure only a single record is returned

    // Check if there was an error in the query
    if (error) {
      return { success: false, msg: error?.message }; // Return the error message
    }

    // Return success and the retrieved data
    return { success: true, data };
  } catch (error) {
    // Handle unexpected errors during the fetch operation
    console.log(
      "[Whisper Error] Error getting user Data in userService.js",
      error
    );
    return { success: false, msg: error.message }; // Return the error message
  }
};
