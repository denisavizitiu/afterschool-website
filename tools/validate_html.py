#!/usr/bin/env python3
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

VOID_ELEMENTS = {
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'
}


class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.mismatches = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID_ELEMENTS:
            return
        self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if not self.stack:
            self.mismatches.append(f"Unexpected closing </{tag}> at {self.getpos()}")
            return
        top, pos = self.stack[-1]
        if top == tag:
            self.stack.pop()
        else:
            self.mismatches.append(f"Mismatched closing </{tag}> at {self.getpos()}, expected </{top}> opened at {pos}")
            # try to recover: pop until matching tag or empty
            for i in range(len(self.stack)-1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break


def analyze_file(path: Path):
    text = path.read_text(encoding='utf-8')
    issues = []

    # Doctype
    if not re.match(r"^\s*<!doctype html", text, re.I):
        issues.append('Missing or non-HTML5 DOCTYPE')

    # html lang
    m = re.search(r"<html([^>]*)>", text, re.I)
    if m:
        attrs = m.group(1)
        if 'lang=' not in attrs.lower():
            issues.append('`<html>` tag missing `lang` attribute')
    else:
        issues.append('Missing <html> tag')

    # inline styles
    if re.search(r'style\s*=\s*"', text):
        issues.append('Contains inline `style` attributes')

    # <p> containing <ul>
    if re.search(r"<p[^>]*>\s*<ul", text, re.I | re.S):
        issues.append('Found <p> that contains a <ul> (invalid nesting)')

    # duplicate ids
    ids = re.findall(r'id\s*=\s*"([^"]+)"', text)
    dup = sorted([k for k,v in ((i, ids.count(i)) for i in set(ids)) if v>1])
    if dup:
        issues.append(f'Duplicate id values: {dup}')

    # tag matching
    parser = TagChecker()
    try:
        parser.feed(text)
        parser.close()
    except Exception as e:
        issues.append(f'HTML parser error: {e}')

    if parser.mismatches:
        issues.extend(parser.mismatches)
    if parser.stack:
        unclosed = [t for t,pos in parser.stack]
        issues.append(f'Unclosed tags at EOF: {unclosed}')

    return issues


def main():
    root = Path(__file__).resolve().parents[1]
    html_files = sorted(root.glob('*.html'))
    # include top-level only per workspace structure
    if not html_files:
        print('No HTML files found in workspace root.')
        return 1

    overall = {}
    for f in html_files:
        issues = analyze_file(f)
        overall[str(f.relative_to(root))] = issues

    # print report
    any_issues = False
    print('\nHTML Validation Report (basic checks)')
    print('==================================\n')
    for fname, issues in overall.items():
        print(f'File: {fname}')
        if not issues:
            print('  OK — no issues found')
        else:
            any_issues = True
            for it in issues:
                print('  -', it)
        print()

    if any_issues:
        print('Summary: Issues found. Review files above.')
        return 2
    else:
        print('Summary: No issues found by this basic validator.')
        return 0


if __name__ == '__main__':
    sys.exit(main())
