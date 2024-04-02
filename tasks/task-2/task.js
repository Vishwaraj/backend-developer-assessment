import axios from "axios";

const PUBLIC_API_URL = "https://api.publicapis.org";

// Middleware to parse JSON requests
const fetchEntries = async (req, res) => {
  try {
    const { category, limit } = req.query;
    const apiUrl = category
      ? `${PUBLIC_API_URL}/entries?category=${category}`
      : `${PUBLIC_API_URL}/entries`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Apply result limit if provided
    if (limit && limit <= 0) {
      return res.status(400).json({ message: "Limit must be greater than 0" });
    }

    if (data?.entries?.length === 0 || !data.entries) {
      return res.status(404).json({ message: "No entries found" });
    }

    const result =
      limit > 0
        ? { ...data, entries: data?.entries?.slice(0, parseInt(limit)) }
        : data;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchCategories = async (req, res) => {
  try {
    const apiUrl = `${PUBLIC_API_URL}/categories`;

    const response = await axios.get(apiUrl);

    // Apply result limit if provided
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const initializeTask2Routes = (app) => {
  /**
   * @swagger
   * /task-2/fetchEntries:
   *   get:
   *     summary: Fetch entries from a public API with filtering options
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter entries by category
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Limit the number of results
   *     responses:
   *       200:
   *         description: OK. Returns entries from the public API.
   *       400:
   *         description: Bad request. Limit must be greater than 0.
   *       404:
   *         description: Not found. No entries found.
   *       500:
   *         description: Internal server error.
   */
  app.get("/task-2/fetchEntries", fetchEntries);

  /**
   * @swagger
   * /task-2/categories:
   *   get:
   *     summary: Fetch categories from a public API
   *     responses:
   *       200:
   *         description: OK. Returns categories from the public API.
   *       500:
   *         description: Internal server error.
   */
  app.get("/task-2/categories", fetchCategories);
};

export default { initializeTask2Routes };
