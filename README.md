# strictr

strictR - check for 'use strict'; statement

## optional config

You can change default configuration via ```.strictr.json``` file:

```
{
	"srcFolderName": "src",                 // default: "src"
	"filesExtension": "ts",                 // default detects: "ts" for typescript and "js" for javascript
	"testFolderName": "test",               // default: "test"
}
```

## help

```
strictr -h
```

Output:

```
C:\git\github\strictr> strictr -h
Usage: strictr [options]                                                                   
                                                                                           
Check for missing strict statement in files.                                               
Use .strictr.json config file to override default settings.                                
                                                                                           
Options:                                                                                   
  -V, --version          output the version number                                         
  -c, --config <config>  Alternative config file (must be .json) (default: ".strictr.json")
  -h, --help             display help for command        
```

## run strictr check

```
strictr
```

Output:

```
No source files are missing the strict statement.

Test files missing the strict statement:
┌───┬──────────────────────┬──────────────────────────────────────┐
│ # │ File                 │ Path                                 │
├───┼──────────────────────┼──────────────────────────────────────┤
│ 1 │ check.folder.spec.ts │ C:\git\github\strictr\test\functions │
└───┴──────────────────────┴──────────────────────────────────────┘
```
