function printCompactObjects(obj, indent = 2) {
    const formatValue = (value) => {
      if (Array.isArray(value)) {
        return `[${value.map(formatValue).join(', ')}]`;
      }
      if (typeof value === 'object') {
        return `{${Object.entries(value).map(([key, val]) => `"${key}": ${formatValue(val)}`).join(', ')}}`;
      }
      return JSON.stringify(value);
    };
  
    console.log(formatValue(obj));
  }

  function printTableWithSpacing(obj) {
    Object.keys(obj).forEach(color => {
      Object.keys(obj[color]).forEach(pieceType => {
        console.log(`Piece Type ${pieceType}:`);
        console.table(obj[color][pieceType]);
      });
    });
  }

module.exports = {printCompactObjects, printTableWithSpacing};
