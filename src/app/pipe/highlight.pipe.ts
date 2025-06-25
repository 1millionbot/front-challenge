// import { Pipe, PipeTransform, Renderer2, Inject, ElementRef } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';

// @Pipe({
//   name: 'highlight',
//   standalone: true
// })
// export class HighlightPipe implements PipeTransform {
  
//   constructor(private renderer: Renderer2, @Inject(ElementRef) private el: ElementRef, private sanitizer: DomSanitizer) {}

//   transform(text: any, searchTerm: any): any {
//     if (!searchTerm) return text;

//     const regex = new RegExp(`(${searchTerm})`, 'gi');
//     // Use Renderer2 to safely manipulate the DOM
//     let highlightedText = text.replace(regex, (match: string) => {
//       // Renderer2 will allow us to manipulate the DOM element's properties safely
//       const spanElement = this.renderer.createElement('span');
//       this.renderer.addClass(spanElement, 'highlighted');
//       this.renderer.appendChild(spanElement, this.renderer.createText(match));
//       return spanElement.outerHTML;
//     });

//     return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
//   }
// }


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, search: string): string {
    if (!search || !value) return value;

    // Escape special characters for regex
    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Replace searched term while avoiding existing <mark> tags
    return value.replace(new RegExp(escapedSearch, 'gi'), (match) =>
      `<mark class="searched-highlight">${match}</mark>`
    );
  }
}
