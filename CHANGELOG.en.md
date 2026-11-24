# What's new in ATS

## 0.1.5
- A CV you put in Download/ATS from a computer or over USB is now found automatically. The list is read again when you open the app or go to Documents, and the app looks by file extension instead of file type, so nothing is hidden.
- AI suggestions are steadier for long CVs: the text is split into smaller requests so the answer is not cut off, with a timeout and one automatic retry if the connection drops. This fixes "the answer could not be read" and "no connection".

## 0.1.4
- The API key field says clearly what goes in it: "Enter your Claude (Anthropic) API key here".

## 0.1.3
- The API key is explained in the app: what it is, what it costs and, step by step, how to get one. The guide shows right away under Settings › AI suggestions when no key is saved, and the manual has its own section.
- The app tells you when a pasted key does not look like a key from Anthropic.

## 0.1.2
- The app starts in English. Swedish can be chosen under Settings › Language.

## 0.1.1
- The Download/ATS folder is created right away when the app starts for the first time, with a short note (ATS.txt) in it. Before, the folder only appeared when the first CV was saved.

## 0.1.0
- First version of ATS: evaluate your CV in Word (.docx) or ODT and get an ATS score from 0 to 100.
- AI suggestions for every paragraph that can be improved, with an honesty lock: the AI never makes up facts, and if a number is missing it leaves a placeholder for you to fill in.
- Compare before and after, and save the improved document as a new file in Download/ATS. The original is never changed.
- My documents with the score in the corner, three demo CVs to try, dark and beige themes, Swedish and English, a manual and in-app updates.
