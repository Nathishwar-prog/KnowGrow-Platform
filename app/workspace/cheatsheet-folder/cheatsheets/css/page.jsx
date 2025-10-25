"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../../@/components/ui/button'; // Adjust path as needed
 // Adjust path as needed

// --- Your Reusable Components ---

// Reusable component for a single cheat sheet item
const CheatItem = ({ title, children }) => (
  <div className="bg-gray-800 rounded-lg p-4 shadow-lg break-inside-avoid mb-4 transition-all duration-300 ease-in-out hover:shadow-cyan-400/30 hover:ring-1 hover:ring-cyan-400/50 hover:-translate-y-1">
    <h3 className="text-lg font-semibold text-cyan-400 mb-3">{title}</h3>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

// Reusable component for displaying code snippets
const Code = ({ children, block = false }) => {
  if (block) {
    return (
      <pre className="bg-gray-900 text-pink-300 p-3 rounded-md text-sm font-mono overflow-auto border border-gray-700">
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code className="bg-gray-900/70 text-pink-400 p-1 px-2 rounded-md text-sm font-mono break-words border border-gray-700">
      {children}
    </code>
  );
};

// Reusable component for CSS property tables
const PropTable = ({ data }) => (
  <table className="w-full text-left text-sm mt-3 table-auto">
    <thead>
      <tr className="border-b-2 border-gray-700">
        <th className="py-2 pr-2 text-amber-300 font-semibold">Property</th>
        <th className="py-2 text-gray-400 font-semibold">Description / Values</th>
      </tr>
    </thead>
    <tbody>
      {data.map(([prop, desc]) => (
        <tr key={prop} className="border-t border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
          <td className="py-2 pr-2 font-mono text-pink-400 break-words">{prop}</td>
          <td className="py-2 text-gray-300 break-words">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Reusable component for CSS selector tables
const SelectorTable = ({ data }) => (
  <table className="w-full text-left text-sm mt-3 table-auto">
    <thead>
      <tr className="border-b-2 border-gray-700">
        <th className="py-2 pr-2 text-amber-300 font-semibold">Selector</th>
        <th className="py-2 text-gray-400 font-semibold">Description</th>
      </tr>
    </thead>
    <tbody>
      {data.map(([selector, desc]) => (
        <tr key={selector} className="border-t border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
          <td className="py-2 pr-2 font-mono text-pink-400 break-words">{selector}</td>
          <td className="py-2 text-gray-300 break-words">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


// --- Your Cheatsheet Content Component ---
// (This is your 'CssCheatsheet' component, unchanged)
const CssCheatsheetContent = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        CSS Cheat Sheet
      </h1>
      <p className="text-center text-gray-400 mb-10">A quick reference for CSS selectors, properties, and concepts.</p>

      <div className="max-w-7xl mx-auto md:columns-2 lg:columns-3 xl:columns-4 gap-4">
        
        {/* CSS Basics */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">CSS Basics</h2>
          <CheatItem title="Ways to use CSS">
            <p className="text-gray-400"><strong>External:</strong></p>
            <Code>{'<link rel="stylesheet" href="style.css">'}</Code>
            <p className="text-gray-400 mt-2"><strong>Internal:</strong></p>
            <Code block>{`<style>\n  body { background-color: #000; }\n</style>`}</Code>
            <p className="text-gray-400 mt-2"><strong>Inline:</strong></p>
            <Code>{'<p style="color: red;">Text</p>'}</Code>
          </CheatItem>
          <CheatItem title="CSS Comment">
            <Code block>{`/* This is a CSS comment */`}</Code>
          </CheatItem>
          <CheatItem title="Units">
            <PropTable data={[
              ['px', 'Pixels (absolute)'],
              ['%', 'Percentage (relative)'],
              ['em', 'Relative to parent font size'],
              ['rem', 'Relative to root font size'],
              ['vw', 'Relative to 1% of viewport width'],
              ['vh', 'Relative to 1% of viewport height'],
            ]} />
          </CheatItem>
        </div>

        {/* Selectors */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Selectors</h2>
          <CheatItem title="Basic Selectors">
            <SelectorTable data={[
              ['*', 'Universal selector'],
              ['.class', 'Selects by class name'],
              ['#id', 'Selects by ID'],
              ['element', 'Selects all <element> elements'],
              ['A, B', 'Selects all A and B elements'],
            ]} />
          </CheatItem>
          <CheatItem title="Combinators">
            <SelectorTable data={[
              ['A B', 'Descendant (B inside A)'],
              ['A > B', 'Direct Child (B direct child of A)'],
              ['A + B', 'Adjacent Sibling (B right after A)'],
              ['A ~ B', 'General Sibling (B after A)'],
            ]} />
          </CheatItem>
          <CheatItem title="Pseudo-Classes">
             <SelectorTable data={[
              [':hover', 'On mouse over'],
              [':focus', 'When element has focus'],
              [':active', 'When element is active (clicked)'],
              [':first-child', 'First child element'],
              [':last-child', 'Last child element'],
              [':nth-child(n)', 'nth child element (e.g., 2n, odd)'],
              [':not(selector)', 'Selects elements that do NOT match'],
            ]} />
          </CheatItem>
          <CheatItem title="Pseudo-Elements">
             <SelectorTable data={[
              ['::before', 'Insert content before the element'],
              ['::after', 'Insert content after the element'],
              ['::first-line', 'Style the first line of text'],
              ['::first-letter', 'Style the first letter of text'],
              ['::selection', 'Style the highlighted text'],
            ]} />
          </CheatItem>
          <CheatItem title="Attribute Selectors">
             <SelectorTable data={[
              ['[attr]', 'Elements with `attr` attribute'],
              ['[attr="val"]', '`attr` attribute equals `val`'],
              ['[attr~="val"]', '`attr` contains `val` (word)'],
              ['[attr|="val"]', '`attr` starts with `val` (hyphen)'],
              ['[attr^="val"]', '`attr` starts with `val` (string)'],
              ['[attr$="val"]', '`attr` ends with `val` (string)'],
              ['[attr*="val"]', '`attr` contains `val` (substring)'],
            ]} />
          </CheatItem>
        </div>

        {/* Box Model & Borders */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Box Model</h2>
          <CheatItem title="Box Model">
            <PropTable data={[
              ['margin', 'Outer spacing (e.g., 10px, 5px 10px)'],
              ['padding', 'Inner spacing (e.g., 10px)'],
              ['width', 'Width of the content'],
              ['height', 'Height of the content'],
              ['max-width', 'Maximum width'],
              ['min-width', 'Minimum width'],
              ['box-sizing', '`content-box` (default) or `border-box`'],
            ]} />
          </CheatItem>
          <CheatItem title="Borders">
            <PropTable data={[
              ['border', 'Shorthand (e.g., 1px solid red)'],
              ['border-width', 'Thickness of the border'],
              ['border-style', '`solid`, `dashed`, `dotted`, etc.'],
              ['border-color', 'Color of the border'],
              ['border-radius', 'Rounded corners (e.g., 5px)'],
            ]} />
          </CheatItem>
        </div>
        
        {/* Colors & Backgrounds */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Colors & Backgrounds</h2>
          <CheatItem title="Colors">
            <PropTable data={[
              ['color', 'Sets the text color'],
              ['opacity', 'Transparency (0.0 to 1.0)'],
            ]} />
            <p className="text-gray-400 mt-2">Formats:</p>
            <Code block>{`Hex: #FF0000
RGB: rgb(255, 0, 0)
RGBA: rgba(255, 0, 0, 0.5)
HSL: hsl(0, 100%, 50%)
HSLA: hsla(0, 100%, 50%, 0.5)`}</Code>
          </CheatItem>
          <CheatItem title="Backgrounds">
            <PropTable data={[
              ['background', 'Shorthand property'],
              ['background-color', 'Background color'],
              ['background-image', '`url("image.jpg")`'],
              ['background-repeat', '`no-repeat`, `repeat-x`, `repeat-y`'],
              ['background-position', '`center`, `top left`, `50% 50%`'],
              ['background-size', '`auto`, `cover`, `contain`'],
              ['background-attachment', '`scroll`, `fixed`, `local`'],
            ]} />
          </CheatItem>
        </div>

        {/* Typography */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Typography</h2>
          <CheatItem title="Fonts">
            <PropTable data={[
              ['font-family', '"Arial", sans-serif'],
              ['font-size', '`16px`, `1.2rem`, `120%`'],
              ['font-weight', '`normal`, `bold`, `400`, `700`'],
              ['font-style', '`normal`, `italic`, `oblique`'],
              ['line-height', '`1.5`, `24px`'],
              ['font', 'Shorthand property'],
            ]} />
          </CheatItem>
          <CheatItem title="Text">
            <PropTable data={[
              ['text-align', '`left`, `right`, `center`, `justify`'],
              ['text-decoration', '`none`, `underline`, `overline`'],
              ['text-transform', '`uppercase`, `lowercase`, `capitalize`'],
              ['text-shadow', '`2px 2px 5px red`'],
              ['letter-spacing', '`1.2px`'],
              ['word-spacing', '`4px`'],
              ['white-space', '`nowrap`, `pre`, `pre-wrap`'],
            ]} />
          </CheatItem>
        </div>

        {/* Layout & Positioning */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Layout</h2>
           <CheatItem title="Positioning">
            <PropTable data={[
              ['position', '`static`, `relative`, `absolute`, `fixed`, `sticky`'],
              ['top / right / bottom / left', 'Offset (e.g., `10px`)'],
              ['z-index', 'Stack order (e.g., `10`, `-1`)'],
              ['overflow', '`visible`, `hidden`, `scroll`, `auto`'],
              ['overflow-x', 'Overflow on x-axis'],
              ['overflow-y', 'Overflow on y-axis'],
            ]} />
          </CheatItem>
          <CheatItem title="Display & Visibility">
            <PropTable data={[
              ['display', '`block`, `inline`, `inline-block`, `none`, `flex`, `grid`'],
              ['visibility', '`visible`, `hidden`, `collapse`'],
              ['opacity', '`0` (transparent) to `1` (opaque)'],
              ['cursor', '`pointer`, `default`, `wait`'],
              ['box-shadow', '`10px 5px 5px black`'],
            ]} />
          </CheatItem>
        </div>

        {/* Flexbox */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Flexbox</h2>
          <CheatItem title="Flex Container">
            <p><Code>{'display: flex;'}</Code></p>
            <PropTable data={[
              ['flex-direction', '`row`, `column`, `row-reverse`'],
              ['justify-content', '`flex-start`, `center`, `flex-end`, `space-between`, `space-around`'],
              ['align-items', '`stretch`, `flex-start`, `center`, `flex-end`, `baseline`'],
              ['align-content', '`flex-start`, `center`, `space-between`'],
              ['flex-wrap', '`nowrap`, `wrap`, `wrap-reverse`'],
            ]} />
          </CheatItem>
          <CheatItem title="Flex Items">
            <PropTable data={[
              ['flex', 'Shorthand: `flex-grow flex-shrink flex-basis`'],
              ['flex-grow', 'Grow factor (e.g., `1`)'],
              ['flex-shrink', 'Shrink factor (e.g., `1`)'],
              ['flex-basis', 'Initial size (e.g., `auto`, `100px`)'],
              ['align-self', 'Overrides container `align-items`'],
              ['order', 'Order of item (e.g., `1`, `-1`)'],
            ]} />
          </CheatItem>
        </div>

        {/* Grid */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Grid</h2>
          <CheatItem title="Grid Container">
            <p><Code>{'display: grid;'}</Code></p>
            <PropTable data={[
              ['grid-template-columns', '`1fr 1fr`, `100px auto`'],
              ['grid-template-rows', '`auto`, `minmax(100px, auto)`'],
              ['grid-gap', 'Shorthand for row and column gap'],
              ['grid-column-gap', 'Gap between columns'],
              ['grid-row-gap', 'Gap between rows'],
              ['justify-items', 'Align items along row axis'],
              ['align-items', 'Align items along column axis'],
            ]} />
          </CheatItem>
          <CheatItem title="Grid Items">
            <PropTable data={[
              ['grid-column', 'Shorthand: `start / end` (e.g., `1 / 3`)'],
              ['grid-row', 'Shorthand: `start / end`'],
              ['grid-area', 'Set name for grid area'],
              ['justify-self', 'Align self along row axis'],
              ['align-self', 'Align self along column axis'],
            ]} />
          </CheatItem>
        </div>
        
        {/* Transforms & Transitions */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Effects</h2>
          <CheatItem title="Transforms">
            <PropTable data={[
              ['transform', '`rotate(45deg)`, `scale(1.5)`, `translate(10px, 5px)`, `skew(10deg)`'],
              ['transform-origin', '`center`, `top left`, `50% 50%`'],
            ]} />
          </CheatItem>
          <CheatItem title="Transitions">
            <PropTable data={[
              ['transition', 'Shorthand (e.g., `all 0.3s ease-in-out`)'],
              ['transition-property', '`width`, `color`, `all`'],
              ['transition-duration', '`0.5s`, `300ms`'],
              ['transition-timing-function', '`ease`, `linear`, `ease-in-out`'],
              ['transition-delay', '`0.1s`'],
            ]} />
          </CheatItem>
          <CheatItem title="Animations">
            <Code block>{`@keyframes myAnimation {
  from { background-color: red; }
  to { background-color: blue; }
}`}</Code>
            <PropTable data={[
              ['animation', 'Shorthand property'],
              ['animation-name', '`myAnimation`'],
              ['animation-duration', '`3s`'],
              ['animation-timing-function', '`linear`, `ease`'],
              ['animation-delay', '`1s`'],
              ['animation-iteration-count', '`infinite`, `3`'],
              ['animation-direction', '`normal`, `alternate`'],
            ]} />
          </CheatItem>
        </div>

        {/* Responsive */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Responsive</h2>
          <CheatItem title="Media Queries">
            <p>Applies styles based on viewport conditions.</p>
            <Code block>{`/* On screens 600px or less */
@media (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}`}</Code>
            <Code block>{`/* On screens 768px or more */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}`}</Code>
            <Code block>{`/* Landscape orientation */
@media (orientation: landscape) {
  /* ... */
}`}</Code>
          </CheatItem>
        </div>


      </div>
    </>
  );
};


// --- The Main Page Component ---
// This default export is what Next.js will render as the page.
export default function CssCheatsheetPage() {
  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8 font-sans">
      
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Button asChild variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white hover:text-white">
            <Link href="/workspace/cheatsheet-folder"> {/* Adjust this link to your main cheatsheet page */}
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cheatsheets
            </Link>
        </Button>
      </div>

      {/* Your Cheatsheet Content */}
      <CssCheatsheetContent />
      
    </div>
  );
}