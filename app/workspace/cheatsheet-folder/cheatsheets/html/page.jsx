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
const Code = ({ children }) => (
  <code className="bg-gray-900/70 text-pink-400 p-1 px-2 rounded-md text-sm font-mono break-words border border-gray-700">
    {children}
  </code>
);

// Reusable component for attribute tables
const AttrTable = ({ data }) => (
  <table className="w-full text-left text-sm mt-3 table-auto">
    <thead>
      <tr className="border-b-2 border-gray-700">
        <th className="py-2 pr-2 text-amber-300 font-semibold">Attribute</th>
        <th className="py-2 text-gray-400 font-semibold">Description</th>
      </tr>
    </thead>
    <tbody>
      {data.map(([attr, desc]) => (
        <tr key={attr} className="border-t border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-200">
          <td className="py-2 pr-2 font-mono text-pink-400">{attr}</td>
          <td className="py-2 text-gray-300">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Your Main HTML Cheatsheet Content Component ---
const HtmlCheatsheetContent = () => {
  return (
    <div className="max-w-7xl mx-auto md:columns-2 lg:columns-3 xl:columns-4 gap-4">
      
      {/* Getting Started */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
        <CheatItem title="HTML5 Boilerplate">
          <pre className="bg-gray-900 text-pink-300 p-3 rounded-md text-sm font-mono overflow-auto border border-gray-700">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Hello world
</body>
</html>`}
          </pre>
        </CheatItem>
        <CheatItem title="Comment">
          <Code>{''}</Code>
          <p className="text-gray-400 mt-1">A comment in HTML.</p>
        </CheatItem>
        <CheatItem title="Paragraph">
          <Code>{'<p>Paragraph</p>'}</Code>
          <p className="text-gray-400 mt-1">Represents a paragraph of text.</p>
        </CheatItem>
      </div>

      {/* HTML Section */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML</h2>
        <CheatItem title="Link Tag">
          <Code>{'<a href="...">Link</a>'}</Code>
          <AttrTable data={[
            ['href', 'The URL the link points to.'],
            ['rel', 'Relationship of the linked URL.'],
            ['target', 'Link target location: _self, _blank, _top, _parent.'],
          ]} />
        </CheatItem>
        <CheatItem title="Image Tag">
          <Code>{'<img src="..." alt="...">'}</Code>
          <AttrTable data={[
            ['src', 'Required, Image location.'],
            ['alt', 'Description of the image.'],
            ['width', 'Width of the image.'],
            ['height', 'Height of the image.'],
            ['loading', 'How the browser should load (lazy, eager).'],
          ]} />
        </CheatItem>
        <CheatItem title="Text Formatting Tags">
          <p><Code>{'<b>'}</Code> - <span className="text-gray-400">Bold Text</span></p>
          <p><Code>{'<strong>'}</Code> - <span className="text-gray-400">Important Text</span></p>
          <p><Code>{'<i>'}</Code> - <span className="text-gray-400">Italic Text</span></p>
          <p><Code>{'<em>'}</Code> - <span className="text-gray-400">Emphasized Text</span></p>
          <p><Code>{'<u>'}</Code> - <span className="text-gray-400">Underline Text</span></p>
          <p><Code>{'<pre>'}</Code> - <span className="text-gray-400">Pre-Formatted Text</span></p>
          <p><Code>{'<s>'}</Code> - <span className="text-gray-400">Deleted text</span></p>
          <p><Code>{'<mark>'}</Code> - <span className="text-gray-400">Highlighted text (HTML5)</span></p>
          <p><Code>{'<ins>'}</Code> - <span className="text-gray-400">Inserted text</span></p>
          <p><Code>{'<sup>'}</Code> - <span className="text-gray-400">Superscripted text</span></p>
          <p><Code>{'<sub>'}</Code> - <span className="text-gray-400">Subscripted text</span></p>
          <p><Code>{'<small>'}</Code> - <span className="text-gray-400">Smaller text</span></p>
          <p><Code>{'<blockquote>'}</Code> - <span className="text-gray-400">Block Quote</span></p>
        </CheatItem>
        <CheatItem title="Headings">
          <p><Code>{'<h1>'}</Code> - <span className="text-gray-400">Heading 1</span></p>
          <p><Code>{'<h2>'}</Code> - <span className="text-gray-400">Heading 2</span></p>
          <p><Code>{'<h3>'}</Code> - <span className="text-gray-400">Heading 3</span></p>
          <p><Code>{'<h4>'}</Code> - <span className="text-gray-400">Heading 4</span></p>
          <p><Code>{'<h5>'}</Code> - <span className="text-gray-400">Heading 5</span></p>
          <p><Code>{'<h6>'}</Code> - <span className="text-gray-400">Heading 6</span></p>
          <p className="text-sm text-gray-500 mt-2">Only use one h1 per page.</p>
        </CheatItem>
        <CheatItem title="Section Divisions">
          <p><Code>{'<div>'}</Code> - <span className="text-gray-400">Division or Section of Page Content.</span></p>
          <p><Code>{'<span>'}</Code> - <span className="text-gray-400">Section of text within other content.</span></p>
          <p><Code>{'<p>'}</Code> - <span className="text-gray-400">Paragraph of Text.</span></p>
          <p><Code>{'<br>'}</Code> - <span className="text-gray-400">Line Break.</span></p>
          <p><Code>{'<hr>'}</Code> - <span className="text-gray-400">Basic Horizontal Line.</span></p>
        </CheatItem>
        <CheatItem title="JavaScript & CSS">
          <p className="text-gray-400">External JavaScript:</p>
          <Code>{'<script src="..."></script>'}</Code>
          <p className="mt-2 text-gray-400">External Stylesheet:</p>
          <Code>{'<link rel="stylesheet" href="...">'}</Code>
        </CheatItem>
        <CheatItem title="Inline Frame">
          <Code>{'<iframe src="..."></iframe>'}</Code>
          <p className="text-gray-400 mt-1">Embeds another HTML document.</p>
        </CheatItem>
      </div>

      {/* HTML5 Tags Section */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML5 Tags</h2>
        <CheatItem title="HTML5 Semantic Tags">
           <AttrTable data={[
             ['<article>', "Content that's independent."],
             ['<aside>', 'Secondary content.'],
             ['<audio>', 'Embeds a sound, or an audio stream.'],
             ['<bdi>', 'The Bidirectional Isolate element.'],
             ['<canvas>', 'Draw graphics via JavaScript.'],
             ['<data>', 'Machine readable content.'],
             ['<datalist>', 'A set of pre-defined options.'],
             ['<details>', 'Additional information.'],
             ['<dialog>', 'A dialog box or sub-window.'],
             ['<embed>', 'Embeds external application.'],
             ['<figcaption>', 'A caption or legend for a figure.'],
             ['<figure>', 'A figure illustrated.'],
             ['<footer>', 'Footer or least important.'],
             ['<header>', 'Masthead or important information.'],
             ['<main>', 'The main content of the document.'],
             ['<mark>', 'Text highlighted.'],
             ['<meter>', 'A scalar value within a known range.'],
             ['<nav>', 'A section of navigation links.'],
             ['<output>', 'The result of a calculation.'],
             ['<picture>', 'A container for multiple image sources.'],
             ['<progress>', 'The completion progress of a task.'],
             ['<rp>', 'Provides fall-back parenthesis.'],
             ['<rt>', 'Defines the pronunciation of character.'],
             ['<ruby>', 'Represents a ruby annotation.'],
             ['<section>', 'A group in a series of related content.'],
             ['<source>', 'Resources for the media elements.'],
             ['<summary>', 'A summary for the <details> element.'],
             ['<template>', 'Defines the fragments of HTML.'],
             ['<time>', 'A time or date.'],
             ['<track>', 'Text tracks for the media elements.'],
             ['<video>', 'Embeds video.'],
             ['<wbr>', 'A line break opportunity.'],
           ]} />
        </CheatItem>
      </div>
      
      {/* HTML Tables */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML Tables</h2>
        <CheatItem title="HTML Table Tags">
          <AttrTable data={[
            ['<table>', 'Defines a table.'],
            ['<th>', 'Defines a header cell in a table.'],
            ['<tr>', 'Defines a row in a table.'],
            ['<td>', 'Defines a cell in a table.'],
            ['<caption>', 'Defines a table caption.'],
            ['<colgroup>', 'Defines a group of columns.'],
            ['<col>', 'Defines a column within a table.'],
            ['<thead>', 'Groups the header content.'],
            ['<tbody>', 'Groups the body content.'],
            ['<tfoot>', 'Groups the footer content.'],
          ]} />
        </CheatItem>
         <CheatItem title="Table Attributes">
           <AttrTable data={[
             ['colspan', 'Number of columns a cell should span.'],
             ['rowspan', 'Number of rows a cell should span.'],
             ['headers', 'One or more header cells a cell is related to.'],
             ['scope', 'The header element relates to (col, row, colgroup, rowgroup).'],
           ]} />
        </CheatItem>
      </div>

      {/* HTML Lists */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML Lists</h2>
        <CheatItem title="Unordered List">
          <Code>{'<ul> <li>Item</li> </ul>'}</Code>
        </CheatItem>
        <CheatItem title="Ordered List">
          <Code>{'<ol> <li>Item</li> </ol>'}</Code>
        </CheatItem>
        <CheatItem title="Definition List">
          <Code>{'<dl> <dt>Term</dt> <dd>Definition</dd> </dl>'}</Code>
        </CheatItem>
      </div>
      
      {/* HTML Forms */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML Forms</h2>
        <CheatItem title="Form Tag">
          <Code>{'<form action="..." method="..."></form>'}</Code>
          <p className="text-sm text-gray-400 mt-2">Used to collect and send information.</p>
          <AttrTable data={[
            ['action', 'URL of form script.'],
            ['method', 'HTTP method, POST/GET.'],
            ['enctype', 'Media type. (e.g., multipart/form-data)'],
            ['onsubmit', 'Runs when the form was submit.'],
            ['onreset', 'Runs when the form was reset.'],
          ]} />
        </CheatItem>
        <CheatItem title="Form Element Tags">
          <p><Code>{'<label>'}</Code> - <span className="text-gray-400">Label for an input element.</span></p>
          <p><Code>{'<input>'}</Code> - <span className="text-gray-400">Input field.</span></p>
          <p><Code>{'<textarea>'}</Code> - <span className="text-gray-400">Multiple line text input control.</span></p>
          <p><Code>{'<select>'}</Code> - <span className="text-gray-400">A dropdown list of options.</span></p>
          <p><Code>{'<option>'}</Code> - <span className="text-gray-400">An option in a select box.</span></p>
          <p><Code>{'<fieldset>'}</Code> - <span className="text-gray-400">Groups related elements in a form.</span></p>
          <p><Code>{'<legend>'}</Code> - <span className="text-gray-400">Caption for a fieldset.</span></p>
          <p><Code>{'<button>'}</Code> - <span className="text-gray-400">A clickable button.</span></p>
          <p><Code>{'<datalist>'}</Code> - <span className="text-gray-400">Pre-defined options for an input.</span></p>
        </CheatItem>
        <CheatItem title="Label 'for' Attribute">
          <Code>{'<label for="name">Name:</label>'}</Code>
          <Code>{'<input id="name" type="text">'}</Code>
          <p className="text-sm text-gray-400 mt-2">'for' in a label references an input's 'id'.</p>
        </CheatItem>
      </div>

      {/* HTML Input Tags */}
      <div className="break-inside-avoid">
        <h2 className="text-2xl font-semibold text-white mb-4">HTML Input Tags</h2>
        <CheatItem title="Input Types">
          <p><Code>{'type="text"'}</Code></p>
          <p><Code>{'type="password"'}</Code></p>
          <p><Code>{'type="submit"'}</Code></p>
          <p><Code>{'type="reset"'}</Code></p>
          <p><Code>{'type="radio"'}</Code></p>
          <p><Code>{'type="checkbox"'}</Code></p>
          <p><Code>{'type="button"'}</Code></p>
          <p><Code>{'type="file"'}</Code></p>
          <p><Code>{'type="hidden"'}</Code></p>
        </CheatItem>
        <CheatItem title="New Input Types in HTML5">
          <p><Code>{'type="color"'}</Code></p>
          <p><Code>{'type="date"'}</Code></p>
          <p><Code>{'type="datetime-local"'}</Code></p>
          <p><Code>{'type="email"'}</Code></p>
          <p><Code>{'type="month"'}</Code></p>
          <p><Code>{'type="number"'}</Code></p>
          <p><Code>{'type="range"'}</Code></p>
          <p><Code>{'type="search"'}</Code></p>
          <p><Code>{'type="tel"'}</Code></p>
          <p><Code>{'type="time"'}</Code></p>
          <p><Code>{'type="url"'}</Code></p>
          <p><Code>{'type="week"'}</Code></p>
        </CheatItem>
        <CheatItem title="Input Attributes">
          <AttrTable data={[
            ['type', 'The type of data being input.'],
            ['value', 'Default value.'],
            ['name', 'Used to describe data in HTTP request.'],
            ['id', 'Unique identifier.'],
            ['readonly', 'Stops the user from modifying.'],
            ['disabled', 'Stops any interaction.'],
            ['checked', 'The radio or checkbox select or not.'],
            ['required', 'Being compulsory.'],
            ['placeholder', 'Adds a temporary hint.'],
            ['autocomplete', 'Disable auto completion (e.g., "off").'],
            ['autocapitalize', 'Disable auto capitalization (e.g., "none").'],
            ['inputmode', 'Display a specific keyboard.'],
            ['list', 'The id of an associated <datalist>.'],
            ['maxlength', 'Maximum number of characters.'],
            ['minlength', 'Minimum number of characters.'],
            ['min', 'Minimum numerical value.'],
            ['max', 'Maximum numerical value.'],
            ['step', 'How the number will increment.'],
            ['pattern', 'Specifies a regex pattern.'],
            ['autofocus', 'Be focused on page load.'],
            ['spellcheck', 'Perform spell checking (true/false).'],
            ['multiple', 'Whether to allow multiple values.'],
            ['accept', 'Expected file type in upload controls.'],
          ]} />
        </CheatItem>
      </div>

      {/* HTML Meta Tags */}
      <div className="break-inside-avoid">
         <h2 className="text-2xl font-semibold text-white mb-4">HTML Meta Tags</h2>
        <CheatItem title="Meta Tags">
          <p className="text-gray-400">Describes metadata within an HTML document.</p>
          <div className="flex flex-col space-y-2 mt-2">
            <Code>{'<meta charset="UTF-8">'}</Code>
            <Code>{'<meta name="viewport" ...>'}</Code>
            <Code>{'<meta name="description" ...>'}</Code>
            <Code>{'<meta http-equiv="X-UA-Compatible" ...>'}</Code>
          </div>
        </CheatItem>
        <CheatItem title="Open Graph (Facebook, etc.)">
          <p className="text-gray-400">Used by Facebook, Instagram, Pinterest, LinkedIn, etc.</p>
          <div className="flex flex-col space-y-2 mt-2">
            <Code>{'<meta property="og:title" ...>'}</Code>
            <Code>{'<meta property="og:type" ...>'}</Code>
            <Code>{'<meta property="og:image" ...>'}</Code>
            <Code>{'<meta property="og:url" ...>'}</Code>
          </div>
        </CheatItem>
        <CheatItem title="Twitter Cards">
          <p className="text-gray-400">See: Twitter Card Documentation</p>
          <div className="flex flex-col space-y-2 mt-2">
            <Code>{'<meta name="twitter:card" ...>'}</Code>
            <Code>{'<meta name="twitter:site" ...>'}</Code>
            <Code>{'<meta name="twitter:title" ...>'}</Code>
            <Code>{'<meta name="twitter:description" ...>'}</Code>
          </div>
        </CheatItem>
        <CheatItem title="Geotagging">
           <p className="text-gray-400">See: Geotagging</p>
          <div className="flex flex-col space-y-2 mt-2">
            <Code>{'<meta name="geo.region" ...>'}</Code>
            <Code>{'<meta name="geo.placename" ...>'}</Code>
            <Code>{'<meta name="geo.position" ...>'}</Code>
          </div>
        </CheatItem>
      </div>

    </div>
  );
};


// --- The Main Page Component ---
// This wraps your cheatsheet content and provides the navigation
export default function HtmlCheatsheetPage() {
  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8 font-sans">
      
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Button asChild variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
            <Link href="/workspace/cheatsheet-folder"> {/* Adjust this link to your main cheatsheet page */}
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cheatsheets
            </Link>
        </Button>
      </div>

      {/* Cheatsheet Title */}
      <h1 className="text-4xl font-bold text-white text-center mb-4">
        HTML Cheat Sheet
      </h1>
      <p className="text-center text-gray-400 mb-10">A quick reference for HTML tags and attributes.</p>

      {/* Your Cheatsheet Content */}
      <HtmlCheatsheetContent />
      
    </div>
  );
}