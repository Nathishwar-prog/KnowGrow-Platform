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
        {/* Added whitespace-pre-wrap for better text wrapping in blocks */}
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
// This contains just the multi-column layout from your original component
const PythonCheatsheetContent = () => {
    return (
        <div className="max-w-7xl mx-auto md:columns-2 lg:columns-3 xl:columns-4 gap-4">
        
        {/* Getting Started */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
          <CheatItem title="Hello, World!">
            <Code block>{`print("Hello, World!")`}</Code>
          </CheatItem>
          <CheatItem title="Variables">
            <p>No declaration needed. Just assign a value.</p>
            <Code block>{`x = 5\nmsg = "Hello"\nmy_bool = True`}</Code>
          </CheatItem>
          <CheatItem title="Common Data Types">
            <CodeTable data={[
                ['Text', 'str'],
                ['Numeric', 'int, float, complex'],
                ['Sequence', 'list, tuple, range'],
                ['Mapping', 'dict'],
                ['Set', 'set, frozenset'],
                ['Boolean', 'bool'],
                ['Binary', 'bytes, bytearray'],
            ]} />
          </CheatItem>
           <CheatItem title="Arithmetic Operators">
            <CodeTable data={[
                ['+', 'Addition'],
                ['-', 'Subtraction'],
                ['*', 'Multiplication'],
                ['/', 'Division (float)'],
                ['//', 'Floor Division (int)'],
                ['%', 'Modulus (remainder)'],
                ['**', 'Exponent'],
            ]} />
          </CheatItem>
          <CheatItem title="F-Strings (Python 3.6+)">
            <p>Formatted string literals.</p>
            <Code block>{`name = "World"\nage = 25\nprint(f"Hello, {name}! You are {age}.")`}</Code>
          </CheatItem>
        </div>

        {/* Data Types */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Built-in Data Types</h2>
          <CheatItem title="Strings (str)">
            <Code block>{`s = "Hello"\ns_multi = """Multi-line\nstring"""`}</Code>
          </CheatItem>
          <CheatItem title="Numbers (int, float)">
            <Code block>{`x_int = 10\ny_float = 3.14`}</Code>
          </CheatItem>
          <CheatItem title="Lists (list)">
            <p>Mutable, ordered sequence.</p>
            <Code block>{`my_list = [1, "apple", True]\nmy_list.append(4)\nprint(my_list[1]) # 'apple'`}</Code>
          </CheatItem>
          <CheatItem title="Tuples (tuple)">
            <p>Immutable, ordered sequence.</p>
            <Code block>{`my_tuple = (1, "apple", True)\nprint(my_tuple[0]) # 1`}</Code>
          </CheatItem>
          <CheatItem title="Dictionaries (dict)">
            <p>Key-value pairs, unordered (ordered in 3.7+).</p>
            <Code block>{`my_dict = {"key": "value", "age": 25}\nprint(my_dict["age"]) # 25\nmy_dict["new_key"] = "New"`}</Code>
          </CheatItem>
          <CheatItem title="Sets (set)">
            <p>Unordered collection of unique items.</p>
            <Code block>{`my_set = {1, 2, 3, 3, 4}\n# my_set is {1, 2, 3, 4}\nmy_set.add(5)`}</Code>
          </CheatItem>
          <CheatItem title="Booleans (bool)">
            <p>True or False (case-sensitive).</p>
            <Code block>{`is_active = True\nhas_error = False`}</Code>
          </CheatItem>
          <CheatItem title="Type Casting">
             <Code block>{`x = int(3.14) # x is 3\ny = float(5)   # y is 5.0\nz = str(100)   # z is "100"`}</Code>
          </CheatItem>
        </div>
        
        {/* Advanced Data Types */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Advanced Data Types</h2>
          <CheatItem title="collections.deque">
            <p>Double-ended queue for fast appends/pops from both ends.</p>
            <Code block>{`from collections import deque\nq = deque([1, 2, 3])\nq.append(4)       # [1, 2, 3, 4]\nq.appendleft(0) # [0, 1, 2, 3, 4]\nq.pop()         # returns 4\nq.popleft()     # returns 0`}</Code>
          </CheatItem>
          <CheatItem title="heapq (Min Heap)">
            <p>Implements a min-heap. Access smallest item quickly.</p>
            <Code block>{`import heapq\nmy_list = [3, 1, 5, 2]\nheapq.heapify(my_list) # [1, 2, 5, 3]\nheapq.heappush(my_list, 0)\nsmallest = heapq.heappop(my_list) # 0`}</Code>
          </CheatItem>
        </div>

        {/* Strings */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Strings</h2>
          <CheatItem title="String Slicing">
            <p><Code>s = "Hello"</Code></p>
            <CodeTable data={[
                ['s[0]', 'Get char at position 0 ("H")'],
                ['s[-1]', 'Get last char ("o")'],
                ['s[1:4]', 'Slice from index 1 to 4 ("ell")'],
                ['s[2:]', 'Slice from index 2 to end ("llo")'],
                ['s[:3]', 'Slice from start to index 3 ("Hel")'],
                ['s[-3:]', 'Get last 3 chars ("llo")'],
            ]} />
          </CheatItem>
          <CheatItem title="String Methods">
             <CodeTable data={[
                ['len(s)', 'Get length of string'],
                ['s.upper()', 'Convert to uppercase'],
                ['s.lower()', 'Convert to lowercase'],
                ['s.strip()', 'Remove whitespace from ends'],
                ['s.startswith("He")', 'Check start (True)'],
                ['s.endswith("lo")', 'Check end (True)'],
                ['s.find("e")', 'Find substring index (1)'],
                ['s.replace("l", "p")', '"Heppo"'],
                ['",".join(["a", "b"])', '"a,b"'],
                ['"a,b".split(",")', '["a", "b"]'],
            ]} />
          </CheatItem>
           <CheatItem title="format() Method">
            <Code block>{`txt = "Name: {name}, Age: {age}"\nprint(txt.format(name="John", age=30))`}</Code>
          </CheatItem>
           <CheatItem title="Input">
            <Code block>{`name = input("Enter your name: ")\nprint(f"Hello, {name}")`}</Code>
          </CheatItem>
        </div>

        {/* Lists */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Lists</h2>
          <CheatItem title="List Methods">
            <p><Code>li = [1, 2, 3]</Code></p>
            <CodeTable data={[
                ['li.append(4)', '[1, 2, 3, 4]'],
                ['li.pop()', 'Removes & returns 4. li is [1, 2, 3]'],
                ['li.extend([4, 5])', '[1, 2, 3, 4, 5]'],
                ['li.insert(1, "new")', '[1, "new", 2, 3, 4, 5]'],
                ['li.remove(2)', '[1, "new", 3, 4, 5]'],
                ['li.sort()', 'Sorts the list (if homogenous)'],
                ['li.reverse()', 'Reverses the list'],
                ['li.count(3)', 'Counts occurrences of 3 (1)'],
            ]} />
          </CheatItem>
          <CheatItem title="List Slicing">
            <p><Code>a = [0, 1, 2, 3, 4, 5]</Code></p>
             <CodeTable data={[
                ['a[2:4]', '[2, 3]'],
                ['a[::2]', 'With a stride: [0, 2, 4]'],
                ['a[::-1]', 'Reverse the list: [5, 4, 3, 2, 1, 0]'],
            ]} />
          </CheatItem>
          <CheatItem title="List Comprehension">
            <p>Concise way to create lists.</p>
            <Code block>{`# [expression for item in iterable if condition]\nsquares = [x**2 for x in range(5)]\n# [0, 1, 4, 9, 16]`}</Code>
          </CheatItem>
        </div>
        
        {/* Flow Control & Loops */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Flow Control & Loops</h2>
          <CheatItem title="If / Elif / Else">
            <Code block>{`x = 10\nif x > 5:\n  print("x is large")\nelif x < 2:\n  print("x is small")\nelse:\n  print("x is medium")`}</Code>
          </CheatItem>
          <CheatItem title="For Loop">
            <Code block>{`primes = [2, 3, 5, 7]\nfor prime in primes:\n  print(prime)`}</Code>
          </CheatItem>
          <CheatItem title="While Loop">
            <Code block>{`count = 0\nwhile count < 3:\n  print(count)\n  count += 1`}</Code>
          </CheatItem>
          <CheatItem title="Break & Continue">
             <CodeTable data={[
                ['break', 'Exit the loop immediately.'],
                ['continue', 'Skip to the next iteration.'],
            ]} />
          </CheatItem>
          <CheatItem title="Looping Helpers">
            <CodeTable data={[
                ['range(5)', '0, 1, 2, 3, 4'],
                ['range(1, 4)', '1, 2, 3'],
                ['enumerate(arr)', 'Get (index, value) pairs'],
                ['zip(arr1, arr2)', 'Pair up items from iterables'],
            ]} />
            <Code block>{`# Enumerate\nanimals = ['dog', 'cat']\nfor i, val in enumerate(animals):\n  print(i, val)`}</Code>
          </CheatItem>
        </div>
        
        {/* Functions */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Functions</h2>
          <CheatItem title="Defining a Function">
            <Code block>{`def add(x, y):\n  return x + y\n\nresult = add(5, 3) # 8`}</Code>
          </CheatItem>
          <CheatItem title="Arguments">
            <CodeTable data={[
                ['Default', '`def func(x, y=10):`'],
                ['Keyword', '`func(x=5, y=20)`'],
                ['*args', '`def func(*args):` (tuple of positional)'],
                ['**kwargs', '`def func(**kwargs):` (dict of keyword)'],
            ]} />
          </CheatItem>
          <CheatItem title="Lambda Functions">
            <p>Small anonymous functions.</p>
            <Code block>{`# lambda arguments: expression\nadd = lambda x, y: x + y\nprint(add(10, 20)) # 30`}</Code>
          </CheatItem>
        </div>
        
        {/* Modules & Files */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Modules & Files</h2>
          <CheatItem title="Importing Modules">
            <CodeTable data={[
                ['import math', '`math.sqrt(16)`'],
                ['import math as m', '`m.sqrt(16)`'],
                ['from math import sqrt', '`sqrt(16)`'],
                ['from math import *', '`sqrt(16)` (not recommended)'],
            ]} />
          </CheatItem>
          <CheatItem title="File Handling (Read)">
            <p>Using `with` is recommended.</p>
            <Code block>{`try:\n  with open("file.txt", "r") as file:\n    contents = file.read()\n    print(contents)\nexcept FileNotFoundError:\n  print("File not found")`}</Code>
          </CheatItem>
          <CheatItem title="File Handling (Write)">
             <Code block>{`# "w" = write (overwrite)\n# "a" = append\nwith open("file.txt", "w") as file:\n  file.write("Hello\\n")\n  file.write("World")`}</Code>
          </CheatItem>
           <CheatItem title="File System (os module)">
            <Code block>{`import os\n\nif os.path.exists("file.txt"):\n  os.remove("file.txt")\nelse:\n  print("File does not exist")`}</Code>
          </CheatItem>
        </div>

        {/* Classes & Exceptions */}
        <div className="break-inside-avoid">
          <h2 className="text-2xl font-semibold text-white mb-4">Classes & Exceptions</h2>
          <CheatItem title="Classes & Inheritance">
            <Code block>{`class Animal:\n  def __init__(self, voice):\n    self.voice = voice\n\n  def sound(self):\n    print(self.voice)\n\nclass Dog(Animal): # Inheritance\n  def __init__(self, name):\n    super().__init__("Woof") # Call parent\n    self.name = name\n\n  def sound(self): # Override\n    print(f"{self.name} says Woof")\n\nmy_dog = Dog("Charlie")\nmy_dog.sound() # "Charlie says Woof"`}</Code>
          </CheatItem>
          <CheatItem title="Exception Handling">
            <Code block>{`try:\n  x = 10 / 0\nexcept ZeroDivisionError as e:\n  print(f"Error: {e}")\nexcept (TypeError, NameError):\n  print("A different error")\nfinally:\n  print("This always runs")`}</Code>
          </CheatItem>
          <CheatItem title="Generators">
            <p>Functions that `yield` values lazily.</p>
            <Code block>{`def count_up_to(n):\n  i = 0\n  while i < n:\n    yield i\n    i += 1\n\nfor num in count_up_to(3):\n  print(num) # 0, 1, 2`}</Code>
          </CheatItem>
        </div>

      </div>
    );
};


// --- The Main Page Component ---
// This default export is what Next.js will render as the page.
export default function PythonCheatsheetPage() {
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
        Python Cheat Sheet
      </h1>
      <p className="text-center text-gray-400 mb-10">A quick reference for Python syntax, data types, and concepts.</p>

      {/* Your Cheatsheet Content */}
      <PythonCheatsheetContent />
      
    </div>
  );
}