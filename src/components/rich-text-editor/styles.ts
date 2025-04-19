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
