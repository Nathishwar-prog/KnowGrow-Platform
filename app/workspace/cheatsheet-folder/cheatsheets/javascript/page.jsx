"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../../@/components/ui/button'; // Adjust path as needed

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
        <code className="whitespace-pre-wrap">{children}</code>
      </pre>
    );
  }
  return (
    <code className="bg-gray-900/70 text-pink-400 p-1 px-2 rounded-md text-sm font-mono break-words border border-gray-700">
      {children}
    </code>
  );
};

// Reusable component for code/description tables
const CodeTable = ({ data }) => (
  <table className="w-full text-left text-sm mt-3 table-auto">
    <thead>
      <tr className="border-b-2 border-gray-700">
        <th className="py-2 pr-2 text-amber-300 font-semibold">Code / Concept</th>
        <th className="py-2 text-gray-400 font-semibold">Description</th>
      </tr>
    </thead>
    <tbody>
      {data.map(([code, desc]) => (
        <tr key={code} className="border-t border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
          <td className="py-2 pr-2 font-mono text-pink-400 break-words"><Code>{code}</Code></td>
          <td className="py-2 text-gray-300 break-words">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Your Cheatsheet Content Component ---
// (This is your JavascriptCheatsheet component, renamed to be the content)
const JavascriptCheatsheetContent = () => {
    return (
        <div className="max-w-7xl mx-auto md:columns-2 lg:columns-3 xl:columns-4 gap-4">
        
        {/* Getting Started */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
          <CheatItem title="Variables">
            <CodeTable data={[
                ['var', 'Function-scoped, can be redeclared & updated.'],
                ['let', 'Block-scoped, can be updated but not redeclared.'],
                ['const', 'Block-scoped, cannot be updated or redeclared.'],
            ]} />
            <Code block>{`let name = "QuickRef";\nconst PI = 3.14;`}</Code>
          </CheatItem>
          <CheatItem title="Data Types">
            <CodeTable data={[
                ['String', '"Hello"'],
                ['Number', '10, 3.14'],
                ['Boolean', 'true, false'],
                ['Object', '{key: "value"}'],
                ['Array', '[1, 2, 3]'],
                ['null', 'Intentional absence of value'],
                ['undefined', 'Variable not yet assigned'],
                ['Symbol', 'Unique identifier (ES6)'],
            ]} />
          </CheatItem>
          <CheatItem title="Operators">
            <CodeTable data={[
                ['Arithmetic', '+, -, *, /, %, ++, --'],
                ['Comparison', '==, ===, !=, !==, >, <, >=, <='],
                ['Logical', '&& (and), || (or), ! (not)'],
            ]} />
            <p className="text-sm text-gray-400 mt-2"><Code>===</Code> checks type and value (strict). <Code>==</Code> only checks value (coercion).</p>
          </CheatItem>
        </div>

        {/* Data Types */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Data Types</h2>
          <CheatItem title="String Methods">
            <CodeTable data={[
                ['.length', 'Returns the length.'],
                ['.slice(start, end)', 'Extracts part of a string.'],
                ['.replace("a", "b")', 'Replaces "a" with "b".'],
                ['.toUpperCase()', 'Converts to uppercase.'],
                ['.toLowerCase()', 'Converts to lowercase.'],
                ['.trim()', 'Removes whitespace from ends.'],
                ['.split(",")', 'Splits string into an array.'],
            ]} />
          </CheatItem>
          <CheatItem title="Number Methods">
            <CodeTable data={[
                ['.toString()', 'Converts number to string.'],
                ['.toFixed(2)', 'Formats to 2 decimal places.'],
                ['parseInt("10px")', 'Parses string to integer (10).'],
                ['parseFloat("3.14")', 'Parses string to float (3.14).'],
                ['isNaN(val)', 'Checks if value is Not-a-Number.'],
            ]} />
          </CheatItem>
          <CheatItem title="Arrays">
            <p>Ordered list of items.</p>
            <Code block>{`let arr = [1, "two", 3];\nconsole.log(arr[1]); // "two"\narr.push(4); // [1, "two", 3, 4]`}</Code>
          </CheatItem>
          <CheatItem title="Objects">
            <p>Collection of key-value pairs.</p>
            <Code block>{`let obj = {\n  name: "JS",\n  age: 25\n};\nconsole.log(obj.name); // "JS"\nconsole.log(obj["age"]); // 25`}</Code>
          </CheatItem>
        </div>

        {/* Arrays Methods */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Array Methods</h2>
          <CheatItem title="Array Mutating Methods">
            <CodeTable data={[
                ['.push(val)', 'Adds item to end.'],
                ['.pop()', 'Removes item from end.'],
                ['.shift()', 'Removes item from start.'],
                ['.unshift(val)', 'Adds item to start.'],
                ['.splice(idx, count)', 'Removes items at index.'],
                ['.sort()', 'Sorts the array (often needs compare fn).'],
                ['.reverse()', 'Reverses the array.'],
            ]} />
          </CheatItem>
          <CheatItem title="Array Iteration Methods">
            <CodeTable data={[
                ['.forEach(fn)', 'Calls function for each item.'],
                ['.map(fn)', 'Returns new array from function results.'],
                ['.filter(fn)', 'Returns new array of items that pass test.'],
                ['.reduce(fn, init)', 'Reduces array to single value.'],
                ['.find(fn)', 'Returns first item that passes test.'],
                ['.some(fn)', 'Checks if any item passes test.'],
                ['.every(fn)', 'Checks if all items pass test.'],
            ]} />
          </CheatItem>
        </div>

        {/* Flow Control & Loops */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Flow Control & Loops</h2>
          <CheatItem title="If / Else If / Else">
            <Code block>{`let num = 10;\nif (num > 10) {\n  console.log("Large");\n} else if (num < 10) {\n  console.log("Small");\n} else {\n  console.log("Equal");\n}`}</Code>
          </CheatItem>
          <CheatItem title="Switch Statement">
            <Code block>{`switch(day) {\n  case "Mon":\n    console.log("Monday");\n    break;\n  default:\n    console.log("Other");\n}`}</Code>
          </CheatItem>
          <CheatItem title="Ternary Operator">
            <Code block>{`let type = (age >= 18) ? "Adult" : "Minor";`}</Code>
          </CheatItem>
          <CheatItem title="Loops">
            <CodeTable data={[
                ['for', '`for (let i = 0; i < 5; i++) { ... }`'],
                ['while', '`while (condition) { ... }`'],
                ['for...of', 'Loops over iterable values (Arrays, Strings).'],
                ['for...in', 'Loops over object keys.'],
            ]} />
            <Code block>{`// for...of\nfor (let item of [1, 2]) {\n  console.log(item);\n}\n\n// for...in\nfor (let key in {a: 1}) {\n  console.log(key); // "a"\n}`}</Code>
          </CheatItem>
        </div>
        
        {/* Functions */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Functions</h2>
          <CheatItem title="Function Declaration">
            <Code block>{`function add(x, y) {\n  return x + y;\n}`}</Code>
          </CheatItem>
          <CheatItem title="Function Expression">
            <Code block>{`const add = function(x, y) {\n  return x + y;\n};`}</Code>
          </CheatItem>
          <CheatItem title="Arrow Function (ES6)">
            <Code block>{`const add = (x, y) => x + y;\n\n// With multiple lines\nconst greet = name => {\n  console.log(\`Hello, \${name}\`);\n};`}</Code>
          </CheatItem>
        </div>

        {/* DOM Manipulation */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">DOM Manipulation</h2>
          <CheatItem title="Selecting Elements">
            <CodeTable data={[
                ['getElementById("id")', 'Select by ID.'],
                ['querySelector(".class")', 'Select first match by CSS selector.'],
                ['querySelectorAll("p")', 'Select all matches (NodeList).'],
            ]} />
          </CheatItem>
          <CheatItem title="Modifying Elements">
            <CodeTable data={[
                ['el.innerHTML = "..."', 'Sets HTML content.'],
                ['el.textContent = "..."', 'Sets text content (better performance).'],
                ['el.style.color = "red"', 'Sets inline CSS style.'],
                ['el.setAttribute("href", ...)', 'Sets an attribute.'],
                ['el.classList.add("name")', 'Adds a CSS class.'],
                ['el.classList.remove("name")', 'Removes a CSS class.'],
                ['el.classList.toggle("name")', 'Toggles a CSS class.'],
            ]} />
          </CheatItem>
          <CheatItem title="Creating & Adding">
            <Code block>{`const newEl = document.createElement("div");\nnewEl.textContent = "New Element";\ndocument.body.appendChild(newEl);`}</Code>
          </CheatItem>
        </div>

        {/* Events */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Events</h2>
          <CheatItem title="Event Listeners">
            <Code block>{`const btn = document.querySelector("#myBtn");\n\nfunction handleClick() {\n  console.log("Button clicked!");\n}\n\nbtn.addEventListener("click", handleClick);\n\n// Remove listener\nbtn.removeEventListener("click", handleClick);`}</Code>
          </CheatItem>
          <CheatItem title="Common Events">
            <CodeTable data={[
                ['click', 'User clicks an element.'],
                ['keydown', 'User presses a key.'],
                ['keyup', 'User releases a key.'],
                ['submit', 'A form is submitted.'],
                ['load', 'Page or asset finishes loading.'],
                ['mouseover', 'Mouse moves over an element.'],
                ['change', 'Value of input, select, or textarea changes.'],
            ]} />
          </CheatItem>
        </div>

        {/* Async JavaScript */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Async JavaScript</h2>
          <CheatItem title="Promises">
            <Code block>{`myPromise\n  .then(result => {\n    console.log(result);\n  })\n  .catch(error => {\n    console.error(error);\n  })\n  .finally(() => {\n    console.log("Finished!");\n  });`}</Code>
          </CheatItem>
          <CheatItem title="Fetch API (Modern AJAX)">
            <Code block>{`fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));`}</Code>
          </CheatItem>
          <CheatItem title="Async / Await (ES8)">
            <p>Syntactic sugar for Promises.</p>
            <Code block>{`async function fetchData() {\n  try {\n    const response = await fetch(API_URL);\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error(error);\n  }\n}\n\nfetchData();`}</Code>
          </CheatItem>
        </div>

        {/* ES6+ Features */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">ES6+ Features</h2>
          <CheatItem title="Template Literals">
            <p>String interpolation with backticks.</p>
            <Code block>{`const name = "World";\nconst str = \`Hello, \${name}!\`;`}</Code>
          </CheatItem>
          <CheatItem title="Destructuring">
            <p>Unpack values from arrays or objects.</p>
            <Code block>{`// Object\nconst { name, age } = person;\n\n// Array\nconst [first, second] = [1, 2];`}</Code>
          </CheatItem>
          <CheatItem title="Spread & Rest Operators">
            <p>Uses \`...\` syntax.</p>
            <CodeTable data={[
                ['Spread', 'Expands an iterable (array, object).'],
                ['Rest', 'Collects function arguments into an array.'],
            ]} />
            <Code block>{`// Spread\nconst arr1 = [1, 2];\nconst arr2 = [...arr1, 3, 4];\n\n// Rest\nfunction sum(...args) {\n  return args.reduce((a, b) => a + b);\n}`}</Code>
          </CheatItem>
          <CheatItem title="Modules">
            <p>Import and export functionality.</p>
            <Code block>{`// file: utils.js
export const add = (x, y) => x + y;
export default function greet() { ... }

// file: main.js
import greet, { add } from "./utils.js";`}</Code>
          </CheatItem>
        </div>

      </div>
    );
};


// --- The Main Page Component ---
// This default export is what Next.js will render as the page.
export default function JavascriptCheatsheetPage() {
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

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        JavaScript Cheat Sheet
      </h1>
      <p className="text-center text-gray-400 mb-10">
        A quick reference for JavaScript syntax, methods, and concepts.
      </p>

      {/* Your Cheatsheet Content */}
      <JavascriptCheatsheetContent />
      
    </div>
  );
}