textract
========

A text extraction node module.

## Currently Extracts...

* PDF
* DOC
* XLS
* DOCX
* `application/javascript`
* All `text/*` mime-types.

Does textract not extract from files of the type you need?  Add an issue or submit a pull request.  It's super easy to add an extractor for a new mime type.

## Install

```
npm install textract
```

## Requirements

* `PDF` extraction requires `pdftotext` be installed [link](http://www.foolabs.com/xpdf/download.html)
* `DOC` extraction requires `catdoc` be installed [link](http://www.wagner.pp.ru/~vitus/software/catdoc/)
* `XLS` extraction requires `xls2csv` be installed (it comes with `catdoc`) [link](http://www.wagner.pp.ru/~vitus/software/catdoc/)
* `DOCX` extraction requires `unzip` be available

## Import

```javascript
var textract = require('textract');
```

## Usage

If you do not know the mime type of the file

```javascript
textract(filePath, function( error, text ) {})
```

If you know the mime type of the file

```javascript
textract(type, filePath, function( error, text ) {})
```

If you wish to pass some config...and know the mime type...

```javascript
textract(type, filePath, config, function( error, text ) {})
```

If you wish to pass some config, but do not know the mime type

```javascript
textract(filePath, config, function( error, text ) {})
```

Error will contain informative text about why the extraction failed. If textract does not currently extract files of the type provided, a `typeNotFound` flag will be tossed on the error object.


