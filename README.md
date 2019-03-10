textract
========

A text extraction node module.

[![NPM](https://nodei.co/npm/textract.png?compact=true)](https://nodei.co/npm/textract/)
[![NPM](https://nodei.co/npm-dl/textract.png)](https://nodei.co/npm/textract/)

## Currently Extracts...

* HTML, HTM
* ATOM, RSS
* Markdown
* EPUB
* XML, XSL
* PDF
* DOC, DOCX
* ODT, OTT (experimental, feedback needed!)
* RTF
* XLS, XLSX, XLSB, XLSM, XLTX
* CSV
* ODS, OTS
* PPTX, POTX
* ODP, OTP
* ODG, OTG
* PNG, JPG, GIF
* DXF
* `application/javascript`
* All `text/*` mime-types.

In almost all cases above, what textract cares about is the mime type.  So `.html` and `.htm`, both possessing the same mime type, will be extracted.  Other extensions that share mime types with those above should also extract successfully. For example, `application/vnd.ms-excel` is the mime type for `.xls`, but also for 5 other file types.

_Does textract not extract from files of the type you need?_  Add an issue or submit a pull request. It many cases textract is already capable, it is just not paying attention to the mime type you may be interested in.

## Install

```
npm install textract
```

## Extraction Requirements

Note, if any of the requirements below are missing, textract will run and extract all files for types it is capable.  Not having these items installed does not prevent you from using textract, it just prevents you from extracting those specific files.

* `PDF` extraction requires `pdftotext` be installed, [link](http://www.foolabs.com/xpdf/download.html)
* `DOC` extraction requires `antiword` be installed, [link](http://www.winfield.demon.nl/), unless on OSX in which case textutil (installed by default) is used.
* `RTF` extraction requires `unrtf` be installed, [link](https://www.gnu.org/software/unrtf/), unless on OSX in which case textutil (installed by default) is used.
* `PNG`, `JPG` and `GIF` require `tesseract` to be available, [link](http://code.google.com/p/tesseract-ocr/).  Images need to be pretty clear, high DPI and made almost entirely of just text for `tesseract` to be able to accurately extract the text.
* `DXF` extraction requires `drawingtotext` be available, [link](https://github.com/davidworkman9/drawingtotext)

## Configuration

Configuration can be passed into textract.  The following configuration options are available

* `preserveLineBreaks`: When using the command line this is set to `true` to preserve stdout readability. When using the library via node this is set to `false`. Pass this in as `true` and textract will not strip any line breaks.
* `preserveOnlyMultipleLineBreaks`: Some extractors, like PDF, insert line breaks at the end of every line, even if the middle of a sentence. If this option (default `false`) is set to `true`, then any instances of a single line break are removed but multiple line breaks are preserved. Check your output with this option, though, this doesn't preserve paragraphs unless there are multiple breaks.
* `exec`: Some extractors (dxf) use node's `exec` functionality. This setting allows for providing [config to `exec` execution](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback). One reason you might want to provide this config is if you are dealing with very large files. You might want to increase the `exec` `maxBuffer` setting.
* `[ext].exec`: Each extractor can take specific exec config. Keep in mind many extractors are responsible for extracting multiple types, so, for instance, the `odt` extractor is what you would configure for `odt` and `odg`/`odt` etc.  Check [the extractors](https://github.com/dbashford/textract/tree/master/lib/extractors) to see which you want to specifically configure. At the bottom of each is a list of `types` for which the extractor is responsible.
* `tesseract.lang`: A pass-through to tesseract allowing for setting of language for extraction. ex: `{ tesseract: { lang:"chi_sim" } }`
* `tesseract.cmd`: `tesseract.lang` allows a quick means to provide the most popular tesseract option, but if you need to configure more options, you can simply pass `cmd`. `cmd` is the string that matches the command-line options you want to pass to tesseract. For instance, to provide language and `psm`, you would pass `{ tesseract: { cmd:"-l chi_sim -psm 10" } }`
* `pdftotextOptions`: This is a proxy options object to the library textract uses for pdf extraction: [pdf-text-extract](https://github.com/nisaacson/pdf-text-extract). Options include `ownerPassword`, `userPassword` if you are extracting text from password protected PDFs. IMPORTANT: textract modifies the pdf-text-extract `layout` default so that, instead of `layout: layout`, it uses `layout:raw`. It is not suggested you modify this without understanding what trouble that might get you in. See [this GH issue](https://github.com/dbashford/textract/issues/75) for why textract overrides that library's default.
* `typeOverride`: Used with `fromUrl`, if set, rather than using the `content-type` from the URL request, will use the provided `typeOverride`.
* `includeAltText`: When extracting HTML, whether or not to include `alt` text with the extracted text. By default this is `false`.

To use this configuration at the command line, prefix each open with a `--`.

Ex: `textract image.png --tesseract.lang=deu`

## Usage

### Commmand Line

If textract is installed gloablly, via `npm install -g textract`, then the following command will write the extracted text to the console for a file on the file system.

```
$ textract pathToFile
```

#### Flags

Configuration flags can be passed into textract via the command line.

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

#### APIs

There are several ways to extract text.  For all methods, the extracted text and an error object are passed to a callback.

`error` will contain informative text about why the extraction failed. If textract does not currently extract files of the type provided, a `typeNotFound` flag will be tossed on the error object.

##### File

```javascript
textract.fromFileWithPath(filePath, function( error, text ) {})
```

```javascript
textract.fromFileWithPath(filePath, config, function( error, text ) {})
```
##### File + mime type

```javascript
textract.fromFileWithMimeAndPath(type, filePath, function( error, text ) {})
```

```javascript
textract.fromFileWithMimeAndPath(type, filePath, config, function( error, text ) {})
```

##### Buffer + mime type

```javascript
textract.fromBufferWithMime(type, buffer, function( error, text ) {})
```

```javascript
textract.fromBufferWithMime(type, buffer, config, function( error, text ) {})
```

##### Buffer + file name/path

```javascript
textract.fromBufferWithName(name, buffer, function( error, text ) {})
```

```javascript
textract.fromBufferWithName(name, buffer, config, function( error, text ) {})
```

##### URL

When passing a URL, the URL can either be a string, or a [node.js URL object](https://nodejs.org/api/url.html). Using the URL object allows fine grained control over the URL being used.

```javascript
textract.fromUrl(url, function( error, text ) {})
```

```javascript
textract.fromUrl(url, config, function( error, text ) {})
```

## Testing Notes

### Running Tests on a Mac?
- `sudo port install tesseract-chi-sim`
- `sudo port install tesseract-eng`
- You will also want to disable textract's usage of textutil as the tests are based on output from antiword.
  - Go into `/lib/extractors/{doc|doc-osx|rtf}` and modify the code under `if ( os.platform() === 'darwin' ) {`. Uncommented the commented lines in these sections.