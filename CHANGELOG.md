### 2.5.0
* [#188](https://github.com/dbashford/textract/pull/188). PR updated `marked` depedency.
* [#179](https://github.com/dbashford/textract/pull/179). PR added ability to capture powerpoint speaker notes.
* [#175](https://github.com/dbashford/textract/pull/175). PR captured cases where `text` mime types files couldn't have their encoding detected

### 2.4.0
* [#164](https://github.com/dbashford/textract/issues/164). Fixed issue with extra text nodes in odt/ott extraction.
* [#156](https://github.com/dbashford/textract/issues/156). Introduced `preserveOnlyMultipleLineBreaks` feature.
* [#149](https://github.com/dbashford/textract/issues/149). RTF extraction error error fixed by [#166](https://github.com/dbashford/textract/pull/166).
* [#145](https://github.com/dbashford/textract/issues/145). Handling Japanese full-width characters.
* [#106](https://github.com/dbashford/textract/issues/106). Now extracting `.epub`

### 2.3.0
* [#149](https://github.com/dbashford/textract/issues/149). Fixed a few text errors that had cropped up with previous PRs/library updates
* [#139](https://github.com/dbashford/textract/issues/139). Updated mime and marked libraries because of GitHub vulnerability warnings
* [#137](https://github.com/dbashford/textract/issues/137). Added ability to capture HTML `alt` text via `includeAltText` option.

### 2.2.0
* [#118](https://github.com/dbashford/textract/issues/118). Properly extracting horizontal bar character
* [#119](https://github.com/dbashford/textract/pull/119). Passing exec options into RTF extraction.
* [#119](https://github.com/dbashford/textract/pull/119). Preserving № character.
* [#122](https://github.com/dbashford/textract/pull/122). Passing exec options into DOC extraction.
* [#123](https://github.com/dbashford/textract/pull/123). Adding ATOM and RSS extraction.
* [#128](https://github.com/dbashford/textract/pull/128). Handle line break preservation properly in `.docx` extractor

### 2.1.2
* [#114](https://github.com/dbashford/textract/pull/114). Not stripping Microsoft dashes.
* [#116](https://github.com/dbashford/textract/pull/116). Better handling image binary check.

### 2.1.1
* [#111](https://github.com/dbashford/textract/issues/111). Callback was being called two times when URL errored out.
* [#112](https://github.com/dbashford/textract/pull/112). PR added handling errors returned by decoding text files.

### 2.1.0
* Updated all dependencies to latest, except for [got](https://github.com/sindresorhus/got), which was updated, but not to the latest because of lack of support for older node versions.
* [#93](https://github.com/dbashford/textract/pull/93). PR added better error handling for `fromUrl` requests.
* [#95](https://github.com/dbashford/textract/pull/95). PR added support for monetary symbols.
* [#96](https://github.com/dbashford/textract/issues/96). Fixed various issues with doc handling on Windows.
* [#97](https://github.com/dbashford/textract/issues/97), [#102](https://github.com/dbashford/textract/pull/102). Added ability to provide raw [node.js URL object](https://nodejs.org/api/url.html) to the `fromUrl` call which bypasses URL parsing/mangling.
* [#98](https://github.com/dbashford/textract/pull/98). PR shortened needlessly long file paths for temp files.
* [#99](https://github.com/dbashford/textract/issues/99). Now handling Chinese comma.
* [#101](https://github.com/dbashford/textract/pull/101). PR added UTF-8 support for antiword requests.
* [#105](https://github.com/dbashford/textract/issues/105). Added `tesseract.cmd` option which allows for providing an exact tesseract command-line string.
* [#109](https://github.com/dbashford/textract/issues/109). Properly handle RTF files with spaces in the name on OSX

### 2.0.0
* Codebase is now properly eslinted.
* Fixed testing issue, `.csv` was `.gitignore`d preventing `.csv` test file from making into repo.
* [#57](https://github.com/dbashford/textract/issues/57), [#75](https://github.com/dbashford/textract/issues/75). Added a `pdftotextOptions` in textract options. This is a proxy to the [pdf-text-extract](https://github.com/nisaacson/pdf-text-extract) options.
* [#69](https://github.com/dbashford/textract/issues/69). Escaping paths for all `exec` and `spawn`.
* [#74](https://github.com/dbashford/textract/pull/74). PR fixing fancy double quotes -> “.
* [#77](https://github.com/dbashford/textract/pull/77). PR fixes decoding of non-utf8 encoded files.
* [#78](https://github.com/dbashford/textract/issues/78). Force all mime types to lowercase for comparison.
* [#81](https://github.com/dbashford/textract/issues/81). Moved `.doc` (old MSWord) extraction to [antiword](http://www.winfield.demon.nl/) from catdoc. catdoc is no longer supported on OSX making it extremely difficult for me to support updates that require testing of `.doc` files.  One major difference that'll be seen with `.doc`s of certain types is [explained here](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=307657). If "I'm afraid the text stream of this file is too small to handle." is an error message you see, see that post.
* [#82](https://github.com/dbashford/textract/issues/82), [#83](https://github.com/dbashford/textract/pull/83). PR updated cheerio to fix a cheerio regression.
* Fixed regression issue with above two PRs in combination. Pure `text/*` extraction left encoded characters for stylized quotes and true elipsis in the text.
* [#88](https://github.com/dbashford/textract/pull/88). PR fixed detection/messaging of missing binaries for `.doc`, images and `.pdf`.
* [#89](https://github.com/dbashford/textract/pull/89). PR returned textract to using j as a module rather than a binary.
* [#90](https://github.com/dbashford/textract/pull/90). PR improved content type detection when extracting from URLs. Also updated tests to pull test files using proper content-type.

### 1.2.1
* [#68](https://github.com/dbashford/textract/pull/68). PR captured unzip errors.

### 1.2.0
* [#66](https://github.com/dbashford/textract/issues/66). textract will no longer put the info text to stdout about the extractors not being available or installed correctly.  Instead, if you attempt to use a supported extractor that did not initialize correctly, you will get an updated error message indicating that the type is supported by textract but that external dependencies were not located. As part of this update, error messages were updated a bit to list both the type and the file.
* [#65](https://github.com/dbashford/textract/issues/65). Fixed issue where for `.odt` and `.docx` files with varying non-Latin characters (ex: cyrillic) were being stripped entirely of their content.

### 1.1.2
* [#63](https://github.com/dbashford/textract/pull/63). PR added support for CSV.

### 1.1.1
* [#58](https://github.com/dbashford/textract/pull/58)/[#59](https://github.com/dbashford/textract/issues/59). PR fixed issue with removing line breaks when more than 1 break present.

### 1.1.0
* [#53](https://github.com/dbashford/textract/pull/53). Cleared up documentation around CLI and line breaks.
* [#54](https://github.com/dbashford/textract/pull/54). PR removed `disableCatdocWordWrap` as an option, instead always disabling catdoc's word wrapping.
* [#55](https://github.com/dbashford/textract/pull/55). PR removed clobbering of non-boolean flags on CLI.

### 1.0.4
* [#52](https://github.com/dbashford/textract/issues/52). PR fixed CLI post big API changes.

### 1.0.3
* [#51](https://github.com/dbashford/textract/issues/51).  Fixed issue with large files using unzip returning blank string.

### 1.0.1/1.0.2
* [#49](https://github.com/dbashford/textract/issues/49) Updated messages when extractors are not available to be purely informational, since textract will work just fine without some of its extractors.
* [#50](https://github.com/dbashford/textract/issues/50). Updated way in which catdoc was detected to not rely on file being test extracted.

### 1.0.0
* Overhaul of interface. To simplify the code, the original `textract` function was broken into `textract.fromFileWithPath` and `textract.fromFileWithMimeAndPath`.
* [#41](https://github.com/dbashford/textract/issues/41). Added support for pulling files from a URL.
* [#40](https://github.com/dbashford/textract/issues/40).  Added support for extracting text from a node `Buffer`.  This prevents you from having to write the file to disk first.  textract does have to write the file to disk itself, but because it is a textract requirement that files be on disk textract should be able to take care of that for you. Two new functions, `textract.fromBufferWithName` and `textract.fromBufferWithMime` have been added.  textract needs to either know the file name or the mime type to extract a buffer.
* Added entity decoding, so encoded items like `&lt;`, `&gt;`, `&quot;`, `&apos;`, and `&amp;` will show up appropriately in the text.
* Removed external dependency on `unzip`
* [#38](https://github.com/dbashford/textract/issues/38).  Added markdown support.
* [#31](https://github.com/dbashford/textract/issues/31).  Added initial ODT support.  Feedback needed if there is any trouble.  Also added OTT support.
* Added support for ODS, OTS.
* Added support for XML, XSL.
* Added support for POTX.
* Added support for XLTX, XLTS.
* Added support for ODG, OTG.
* Added support for ODP, OTP.

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
