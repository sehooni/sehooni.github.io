# Scripts for Blog Post Creation

This directory contains shell scripts to help automate the creation of blog posts for the Jekyll/GitHub Pages site.

## `create_post.sh`

This script automates the creation of a new blog post file with the correct front matter and filename format.

### Usage

1.  Open your terminal.
2.  Navigate to the project root directory.
3.  Run the script:
    ```bash
    ./scripts/create_post.sh
    ```
4.  Follow the prompts:
    -   **Enter Post Title**: Type the title of your post (e.g., "My New Proteomics Study").
    -   **Enter Category**: Type the category name (e.g., "Proteomics", "PaperReview"). Defaults to "ETC" if left blank.

### Features
-   **Automatic Filename Generation**: Creates a file named `YYYY-MM-DD-slugified-title.md`.
-   **Front Matter Template**: Automatically fills in the title, category, date, and sets `use_math: true`.
-   **Math Rule Reminders**: Includes a comment block in the generated file reminding you of the math rendering rules.

## Math Rendering Rules ⚠️

To ensure mathematical formulas and chemical notations render correctly on the site, please follow these rules:

1.  **Do NOT wrap math in backticks (` `)**.
    -   ❌ Incorrect: `` `$E=mc^2$` ``
    -   ✅ Correct: `$E=mc^2$`
    -   *Why?* Backticks create a code block, which prevents the math engine (KaTeX) from processing the formula.

2.  **Do NOT wrap math delimiters (`$`) in bold (`**`) or italics (`*`)**.
    -   ❌ Incorrect: `**$x$**`
    -   ✅ Correct: `$x$` or `$\mathbf{x}$` (use LaTeX for styling inside the math)
    -   *Why?* Markdown parsers can get confused by the asterisk syntax immediately surrounding the dollar sign, causing artifacts or rendering failures.

3.  **Format exponents using math mode**.
    -   ❌ Incorrect: `2^n`
    -   ✅ Correct: `$2^n$`
    -   *Why?* The caret `^` is treated as a regular character in Markdown tekst unless inside math delimiters.

4.  **Use `$` for Inline Math**.
    -   Example: "The variable `$x$` is defined as..."

5.  **Use `$$` for Block Math**.
    -   Example:
        ```latex
        $$
        \sum_{i=1}^{n} x_i
        $$
        ```
