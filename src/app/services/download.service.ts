


import { Injectable, ElementRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private triggerDownloadSubject = new ReplaySubject<void>(1); // ✅ Fix: Store last event
  triggerDownload$ = this.triggerDownloadSubject.asObservable();
  private contentRef!: ElementRef;  // Reference to HTML content

  setContentRef(contentRef: ElementRef) {
    this.contentRef = contentRef;
  }

  // Function to trigger download in Component B
  startDownload() {
    console.log("🚀 Triggering download in Component B...");
    this.triggerDownloadSubject.next();  // ✅ Component B will receive this event even if it's initialized late
  }
}
