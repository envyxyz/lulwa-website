// Minimal CSV reader with quoted fields. Returns the data rows (header dropped) as arrays of strings.
export const parseCsv = (text) =>
  text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const cells = [];
      let cell = '';
      let quoted = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quoted) {
          if (ch === '"' && line[i + 1] === '"') (cell += '"'), i++;
          else if (ch === '"') quoted = false;
          else cell += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ',') cells.push(cell), (cell = '');
        else cell += ch;
      }
      cells.push(cell);
      return cells;
    });
