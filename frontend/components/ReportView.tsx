import { Fragment } from "react";

/**
 * Minimal markdown renderer — handles #/##/### headers, "- " bullet lists,
 * pipe-delimited tables, **bold** spans, and plain paragraphs. Deliberately
 * not a full markdown parser; the report generator produces a small,
 * predictable subset.
 */
export default function ReportView({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);

  return (
    <div className="glass-2 rounded-lg px-6 py-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
        <span className="font-mono text-[11px] tracking-wide text-text-dim uppercase">
          Synthesis Report
        </span>
      </div>
      <article className="max-w-none">
        {blocks.map((block, i) => (
          <Fragment key={i}>{renderBlock(block)}</Fragment>
        ))}
      </article>
    </div>
  );
}

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "p"; text: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let currentList: string[] = [];
  let currentParagraph: string[] = [];
  let i = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }
  };
  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: "p", text: currentParagraph.join(" ") });
      currentParagraph = [];
    }
  };
  const isTableRow = (l: string) => l.trim().startsWith("|") && l.trim().endsWith("|");
  const isSeparatorRow = (l: string) => /^\|[\s:|-]+\|$/.test(l.trim());
  const splitRow = (l: string) =>
    l.trim().slice(1, -1).split("|").map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === "") {
      flushList();
      flushParagraph();
      i++;
      continue;
    }
    if (
      isTableRow(line) &&
      lines[i + 1] &&
      isSeparatorRow(lines[i + 1])
    ) {
      flushList();
      flushParagraph();
      const header = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && isTableRow(lines[i].trim())) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flushList();
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      flushList();
      flushParagraph();
      blocks.push({ type: "h1", text: line.slice(2) });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      currentList.push(line.slice(2));
    } else {
      flushList();
      currentParagraph.push(line);
    }
    i++;
  }
  flushList();
  flushParagraph();

  return blocks;
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-text">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "h1":
      return (
        <h2 className="font-display text-2xl font-semibold text-text mt-8 mb-3 first:mt-0">
          {renderBold(block.text)}
        </h2>
      );
    case "h2":
      return (
        <h3 className="font-display text-xl font-semibold text-text mt-7 mb-2.5">
          {renderBold(block.text)}
        </h3>
      );
    case "h3":
      return (
        <h4 className="font-display text-base font-semibold text-text mt-5 mb-2">
          {renderBold(block.text)}
        </h4>
      );
    case "list":
      return (
        <ul className="mt-2 mb-4 space-y-1.5 list-disc pl-5 text-text-muted">
          {block.items.map((item, i) => (
            <li key={i}>{renderBold(item)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-4 mb-5 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-surface-1">
                {block.header.map((cell, i) => (
                  <th
                    key={i}
                    className="font-mono text-[11px] uppercase tracking-wide text-text-dim
                               text-left px-3 py-2 border-b border-border"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-text-muted align-top">
                      {renderBold(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "p":
      return (
        <p className="mt-3 leading-relaxed text-text-muted max-w-[70ch]">
          {renderBold(block.text)}
        </p>
      );
  }
}