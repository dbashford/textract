textract
========

A text extraction node module.

[![NPM](https://nodei.co/npm/textract.png?compact=true)](https://nodei.co/npm/textract/)
[![NPM](https://nodei.co/npm-dl/textract.png)](https://nodei.co/npm/textract/)

## Currently Extracts...

* HTML
* PDF
* DOC
* RTF
* DOCX
* XLS
* PPTX
* DXF
* PNG
* JPG
* GIF
* `application/javascript`
* All `text/*` mime-types.

In almost all cases above, what textract cares about is the mime type.  So `.html` and `.htm`, both possessing the same mime type, will be extracted.  Other extensions that share mime types with those above should also extract successfully. For example, `application/vnd.ms-excel` is the mime type for `.xls`, but also for 5 other mime types.

Does textract not extract from files of the type you need?  Add an issue or submit a pull request.  It's super easy to add an extractor for a new mime type.

## Install

```
npm install textract
```

## Requirements

* `PDF` extraction requires `pdftotext` be installed, [link](http://www.foolabs.com/xpdf/download.html)
* `DOC` extraction requires `catdoc` be installed, [link](http://www.wagner.pp.ru/~vitus/software/catdoc/), unless on OSX in which case textutil (installed by default) is used.
* `RTF` extraction requires `catdoc` be installed, unless on OSX in which case textutil (installed by default on OSX) is used.
* `DOCX` extraction requires `unzip` be available
* `PPTX` extraction requires `unzip` be available
* `PNG`, `JPG` and `GIF` require `tesseract` to be available, [link](http://code.google.com/p/tesseract-ocr/).  Images need to be pretty clear, high DPI and made almost entirely of just text for `tesseract` to be able to accurately extract the text.
* `DXF` extraction requires `drawingtotext` be available, [link](https://github.com/davidworkman9/drawingtotext)

## Configuration

Configuration can be passed into textract.  The following configuration options are available

* `preserveLineBreaks`: By default textract does NOT preserve line breaks. Pass this in as `true` and textract will not strip any line breaks.
* `disableCatdocWordWrap`: catdoc used to extract .doc/docx files by default formats output for console by breaking lines after 72 characters. Set this to `true` and with `preserveLineBreaks` you will get clean paragraphs.
* `exec`: Some extractors (xlsx, docx, dxf) use node's `exec` functionality. This setting allows for providing [config to `exec` execution](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback). One reason you might want to provide this config is if you are dealing with very large files. You might want to increase the `exec` `maxBuffer` setting.
* `[ext].exec`: Each extractor can take specific exec config.
* `tesseract.lang`: A pass-through to tesseract allowing for setting of language for extraction. ex: `{ tesseract: { lang:"chi_sim" } }`

## Usage

### Commmand Line

If textract is installed gloablly, via `npm install -g textract`, then the following command will write the extracted text to the console.

```
$ textract pathToFile
```

#### Flags

Configuration flags can be passed into textract via the command line.  

Parameters like `preserveLineBreaks` (defaults to `true`) can be passed in directly.

```
textract pathToFile --preserveLineBreaks false
```

Parameters like `exec.maxBuffer` can be passed as you'd expect.

```
textract pathToFile --exec.maxBuffer 500000
```

And multiple flags can be used together.

```
textract pathToFile --preserveLineBreaks false --exec.maxBuffer 500000
```

### Node

#### Import

```javascript
var textract = require('textract');
```

#### Execution

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

## Release Notes

### 0.20.0
* Pull Request [#39](https://github.com/dbashford/textract/pull/39) added support for not work wrapping with catdoc.

### 0.19.0
* [#30](https://github.com/dbashford/textract/issues/30), [#34](https://github.com/dbashford/textract/issues/34).  The command line has been improved, allowing for all the configuration options to be provided.

### 0.18.0
* [#36](https://github.com/dbashford/textract/issues/36) Fixed error with previous deploy.
* [#32](https://github.com/dbashford/textract/issues/32) Fixed `docx` line break issue.

### 0.17.0
* Updated character stripping regex to be more lenient.

### 0.16.0
* Added HTML extraction.
* Added ability for extractors to register for specific extensions (not yet used).  This handles cases where extensions (like `.webarchive`) do not have recognized mime types.

### 0.15.0
* Addressed some lingering regex issues from previous release.
* Added tests for RTF, more tests for DOC
* [#29](https://github.com/dbashford/textract/issues/29) Introduced new extractor for `.doc` and `.rtf` __for OSX only__.  All non-OSX operating systems will continue to use `catdoc`. Going forward, because of issues getting `catdoc` installed on OSX, on OSX only `textutil` will be used. `textutil` comes default installed with OSX.

### 0.14.0
* [#29](https://github.com/dbashford/textract/issues/29) which resulted in the following changes:
1. writing info messages to `stderr` when extractors taking awhile to get going
2. no longer removing …
3. centralized some cleansing regexes, also no longer removing multiple back to back spaces using `\s` as it was removing any back to back newlines.  Now scoping back to back replacing to `[\t\v\u00A0]`.

### 0.13.2
* [#27](https://github.com/dbashford/textract/issues/27), addressed issues with page ordering in `pptx` extraction.

### 0.13.1
* [#25](https://github.com/dbashford/textract/issues/25), added language support for tesseract, see `tesseract.lang` property.
* Updated regex that strips bad characters to not strip (some) chinese characters.  The regex will likely need updating by someonw more familiar with Chinese. =)

### 0.13.0
* [#26](https://github.com/dbashford/textract/issues/26), using `os.tmpdir()` rather than a temp dir inside textract.
* Upgraded to latest `j` (dependency)
* Removed `macProcessGif` option and tests as tesseract seems to work on Mac just fine now

### 0.12.0
* [#21](https://github.com/dbashford/textract/issues/21), [#22](https://github.com/dbashford/textract/issues/22), Now using [j](https://www.npmjs.org/package/j) via its binaries rather than using it via node. This makes XLS/X extraction slower, but reduces memory consumption of textract signifcantly.

### 0.11.2
* Updated pdf-text-extract to latest, fixes [#20](https://github.com/dbashford/textract/issues/20).

### 0.11.1
* Addressed path escaping issues with tesseract, fixes [#18] (https://github.com/dbashford/textract/issues/18)

### 0.11.0
* Using [j](https://github.com/SheetJS/j) to handle `xls` and `xlsx`, this removes the requirement on the `xls2csv` binary.
* j also supports `xlsb` and `xlsm`
