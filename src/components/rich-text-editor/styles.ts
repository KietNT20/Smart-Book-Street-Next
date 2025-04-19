export const customStyles = `
  .ProseMirror {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    overflow-x: hidden;

    > * + * {
      margin-top: 0.75em;
    }

    ul, ol {
      padding: 0 1rem;
      margin-left: 1rem;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    li {
      margin-bottom: 0.5em;
    }
    
    p {
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;
      margin-bottom: 1em;
    }

    table td, table th {
      border: 2px solid #ced4da;
      box-sizing: border-box;
      min-width: 1em;
      padding: 0.5em;
      position: relative;
      vertical-align: top;
    }

    table th {
      background-color: #f8f9fa;
      font-weight: bold;
      text-align: left;
    }

    table p {
      margin: 0;
    }
  }
  .ProseMirror-focused {
    outline: none;
  }
`;

export const COLOR_PRESETS = [
  '#09090b',
  '#dc2626',
  '#22c55e',
  '#1d4ed8',
  '#facc15',
  '#c026d3',
  '#38bdf8',
  '#f97316',
  '#6b7280',
];
