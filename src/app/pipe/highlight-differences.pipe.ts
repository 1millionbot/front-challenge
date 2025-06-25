
// highlight-differences.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightDifferences',
  standalone: true
})
export class HighlightDifferencesPipe implements PipeTransform {

 
  transform(currentText: string, referenceText: string): string {
    if (!referenceText) return currentText; // No reference, return text as is.
  
    const currentWords = currentText.split(/\s+/);
    const referenceWords = referenceText.split(/\s+/);
  
    const currentSet = new Set(currentWords);
    const referenceSet = new Set(referenceWords);
  
    let highlightedCurrentText = '';
    let highlightedReferenceText = '';
  
    // Highlight unique words in the current text
    currentWords.forEach(word => {
      if (!referenceSet.has(word)) {
        highlightedCurrentText += `<span class="highlight">${word}</span> `;
      } else {
        highlightedCurrentText += `${word} `;
      }
    });
  
    // Highlight unique words in the reference text
    referenceWords.forEach(word => {
      if (!currentSet.has(word)) {
        highlightedReferenceText += `<span class="highlight">${word}</span> `;
      } else {
        highlightedReferenceText += `${word} `;
      }
    });
  
    // Assuming you want to return the combination or have separate outputs
    return highlightedCurrentText.trim()
  }
  
}
