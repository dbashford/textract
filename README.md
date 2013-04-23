textract
========

A node module that will extract text from (for now) documents of types: pdf, doc, docx.  In some cases textract proxies to binaries that need to be installed.  See Reqirements below.

Does textract not extract from files of the type you need?  Add an issue or submit a pull request.  It's super easy to add an extractor for a new type.

## Install

```
npm install textract
```

## Requirements

* `PDF` extraction requires `pdftotext` be installed
* `DOC` extraction requires `catdoc` be installed
* `DOCX` extraction requires `unzip` be available

## Import

```javascript
var textract = require('textract');
```

## Usage

If you do not know the mime type of the file

```javascript
textract(filePath, function( error, text ) {

})
```

If you know the mime type of the file

```
textract(type, filePath, function( error, text ) {

})
```

