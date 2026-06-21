import type { Language } from '@/types'

export const LANGUAGES: Language[] = [
  {
    id: 71,
    name: 'Python',
    extension: 'py',
    monacoLang: 'python',
    template: `# Welcome to CodeItUp!
print("Hello, World!")
`,
  },
  {
    id: 63,
    name: 'JavaScript',
    extension: 'js',
    monacoLang: 'javascript',
    template: `// Welcome to CodeItUp!
console.log("Hello, World!");
`,
  },
  {
    id: 74,
    name: 'TypeScript',
    extension: 'ts',
    monacoLang: 'typescript',
    template: `// Welcome to CodeItUp!
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

console.log(greet("World"));
`,
  },
  {
    id: 60,
    name: 'Go',
    extension: 'go',
    monacoLang: 'go',
    template: `package main

import "fmt"

func main() {
\tfmt.Println("Hello, World!")
}
`,
  },
  {
    id: 54,
    name: 'C++',
    extension: 'cpp',
    monacoLang: 'cpp',
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
  },
  {
    id: 51,
    name: 'C#',
    extension: 'cs',
    monacoLang: 'csharp',
    template: `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
    }
}
`,
  },
  {
    id: 62,
    name: 'Java',
    extension: 'java',
    monacoLang: 'java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
  },
  {
    id: 78,
    name: 'Kotlin',
    extension: 'kt',
    monacoLang: 'kotlin',
    template: `fun main() {
    println("Hello, World!")
}
`,
  },
  {
    id: 83,
    name: 'Swift',
    extension: 'swift',
    monacoLang: 'swift',
    template: `import Foundation

print("Hello, World!")
`,
  },
  {
    id: 81,
    name: 'Scala',
    extension: 'scala',
    monacoLang: 'scala',
    template: `object Main extends App {
  println("Hello, World!")
}
`,
  },
  {
    id: 50,
    name: 'C',
    extension: 'c',
    monacoLang: 'c',
    template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  },
  {
    id: 73,
    name: 'Rust',
    extension: 'rs',
    monacoLang: 'rust',
    template: `fn main() {
    println!("Hello, World!");
}
`,
  },
  {
    id: 72,
    name: 'Ruby',
    extension: 'rb',
    monacoLang: 'ruby',
    template: `# Welcome to CodeItUp!
puts "Hello, World!"
`,
  },
  {
    id: 68,
    name: 'PHP',
    extension: 'php',
    monacoLang: 'php',
    template: `<?php
echo "Hello, World!\\n";
?>
`,
  },
  {
    id: 80,
    name: 'R',
    extension: 'r',
    monacoLang: 'r',
    template: `# Welcome to CodeItUp!
cat("Hello, World!\\n")
`,
  },
  {
    id: 46,
    name: 'Bash',
    extension: 'sh',
    monacoLang: 'shell',
    template: `#!/bin/bash
echo "Hello, World!"
`,
  },
]

export function getLanguageById(id: number) {
  return LANGUAGES.find(l => l.id === id) || LANGUAGES[0]
}

export function getLanguageByName(name: string) {
  return LANGUAGES.find(l => l.name === name) || LANGUAGES[0]
}
