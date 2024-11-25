import { marked, TokensList, Tokens } from 'marked';

export function extractHeadings(markdown: string) {
    const tokens = marked.lexer(markdown);
    const headings = getHeadings(tokens);
    return buildHeadingTree(headings);
  }

  // Extrahiere die Überschriften aus den Markdown-Tokens
function getHeadings(tokens: TokensList): any[] {
    return tokens.filter(token => token.type === 'heading').map((token) => {
        const tokenHeading = token as Tokens.Heading;
        return {
            level: tokenHeading.depth,
            text: tokenHeading.text,
            id: slugify(tokenHeading.text),
            children: []
        }
    });
  }

  // Hilfsfunktion, um die Überschriften in eine Baumstruktur umzuwandeln
function buildHeadingTree(headings: any[]): any {
    const tree: any[] = [];
    const stack: any[] = [];

    headings.forEach(heading => {
      while (stack.length && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }
      if (stack.length) {
        stack[stack.length - 1].children.push(heading);
      } else {
        tree.push(heading);
      }
      stack.push(heading);
    });

    return tree;
  }

  // Hilfsfunktion, um einen Slug (eine ID) aus dem Text zu erzeugen
function slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
}