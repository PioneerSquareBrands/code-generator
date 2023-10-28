# PSB 2D Code Generator
An update to [the old QR code generator](https://onotype.github.io/psb-qrgen/).

**Instructions**:

- Input a comma-separated list of SKUs/Item Masters in the field
- Click on the generated Data Matrix/QR code to download them

**Notes**
- The page uses pattern-matching to match SKUs with brands. It does not have a list of valid Brenthaven/Gumdrop SKUs
  - **Brenthaven** is identified by two patterns: The first pattern matches SKUs with exactly 4 consecutive numbers. The second pattern matches SKUs with 6 consecutive numbers.
  - **Gumdrop Cases** is identified by two patterns as well: The first pattern matches SKUs with 2 numbers, an alphabet, and 3 numbers. The second pattern matches SKUs that follow the alphabet and 3 numbers with an optional "E" or "C," 2 numbers, a hyphen, and any single number. This accounts for variations in the SKU format that are associated with Gumdrop Cases products.
- All lower case characters in the SKUs are converted to uppercase to ensure consistency with the generated code.