import { AfterViewInit, ViewChild, ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { ICiclo, IComment, IEtapa } from '../../../model/interface/types';
import { ApiService } from '../../core/services/apiServices/api.service';
import { HighlightPipe } from '../../pipe/highlight.pipe';
import { HighlightDifferencesPipe } from '../../pipe/highlight-differences.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-comparison-difference',
  standalone: true,
  imports: [
    CommonModule,
    HighlightDifferencesPipe,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    HeaderComponent,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    TabsModule,
    ReactiveFormsModule,
    AccordionComponent,
    AccordionPanelComponent,
    HighlightPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comparison-difference.component.html',
  styleUrls: [
    './comparison-difference.component.css',
  ],
})
export class ComparisonDifferenceComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  @ViewChild('comparisonContainer', { static: false }) 
  comparisonContainer!: ElementRef;

  etapaList: IEtapa[] = [];
  cicloList: ICiclo[] = [];
  containerScrollTop: number = 0;
  materiaList: any[] = [];
  etapaFC = new FormControl<IEtapa[]>([]);
  cicloFC = new FormControl<ICiclo[]>([]);
  materiaFC = new FormControl<any[]>([]);
  comparisonDiffData: any[] = [];
  leftComparisonDiffData: any[] = [];
  isVisible: boolean = true;
  isCommentboxVisible: number | null = null; // Store clicked icon index
  // isCommentboxVisible: { [key: number]: boolean } = {};
  selectedIconPosition: { top: number; left: number } | null = null;
  isLeftHeaderVisible: boolean = true;
  isRightHeaderVisible: boolean = true;
  isCol1Header2: boolean = true;
  // allowComment: boolean = false;
  selectedDataBox: unknown = '';
  referenciasIds: number[] = [];
  comparacionIds: number[] = [];
  @ViewChildren('highlighted') highlightedElements!: QueryList<ElementRef>;
  searchTerm: string = '';
  currentIndex = 0;
  currentCountElement = -1;
  currentCountElementsearched = -1;
  totalElements = 0;
  highlightCount = 0;
  isGuardarModalOpen: boolean = false;
  isPinVisible: boolean = false;
  isDescargarModalOpen: boolean = false;
  boxDirection: string = '';
  accordionState: boolean[] = [];
  accordionCompetenciasState: boolean[] = [];
  accordionStateRight: boolean[] = [];
  highlightedElementsDiff: HTMLElement[] = [];
  currentIndexDiff: number = 0;
  accordionSaberesBasicosState: boolean[] = [];
  commentPositions: any[] = []; // Holds position of each comment
  isNotInVersionModal: boolean = false;
  isNotInVersionModalTab: boolean = true;
  isComparisonDocumentsLoading: boolean = false;

  showCommentBox = false;
  showCommentMessage = false;
  commentBoxPosition: { x: number; y: number } = { x: 0, y: 0 };
  selectedText = '';
  newComment = '';
  comments: IComment[] = [];
  isEditMode = false;
  commentToEdit: IComment | null = null;
  isCommentsVisible: boolean = false;
  showAllComments: boolean = false;
  storedUserId: number | undefined;
  porValidar: number = 0;
  showParagrahOptions: boolean = true;

  heights1: any = {};
  heights2: any = {};

  constructor(private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // UserID from localstorage
    this.storedUserId = Number(localStorage.getItem('user_id'));

    this.apiService.getEtapas().subscribe(
      (res) => (this.etapaList = res),
      (error) => console.error('Error fetching Etapas')
    );

    this.apiService.getCiclos().subscribe(
      (res) => (this.cicloList = this.sortByName(res)),
      (error) => console.error('Error fetching Ciclos', error)
    );

    this.apiService.getMateria().subscribe(
      (res) => {
        this.materiaList = res;
      },
      (error) => console.error('Error fetching Materia', error)
    );
    const state = history.state;
    if (state && state.referenciaIds && state.comparacionIds) {
      this.referenciasIds = state.referenciaIds;
      this.comparacionIds = state.comparacionIds;
    } else {
      console.log('No state found or state is missing some data.');
    }
    // reference ID: 4 & document to compare ID: 14
    // Fetch documents first, THEN calculate heights
    this.fetchTwoDocumentsComparisonData(this.referenciasIds[0], this.comparacionIds[0]).subscribe(
      () => {
        this.calculateHeights(); 
        console.log(this.heights1);
        console.log(this.heights2);
      }
    );

    this.fetchComments();
  
    setTimeout(() => {
      this.detectHighlightedElements();
    }, 3000);
    this.currentIndexDiff = 0;
  }

  ngAfterViewInit() {

    this.highlightedElements.changes.subscribe(() => {
      //this.updateHighlightCount();
      this.currentIndex = 0;
    });

    this.detectHighlightedElements();
    this.comparisonContainer?.nativeElement.addEventListener('scroll', () => {
      this.containerScrollTop = this.comparisonContainer?.nativeElement.scrollTop;
      this.calculateCommentPositions
  });
   
  }

  /*-------------------------------------------------------------------------------------------------*/
  /*                             A L I G N         C O N T E N T S                                   */
  /*-------------------------------------------------------------------------------------------------*/
  // Calculate heights for the documents contents
  calculateHeights_texts(text1: string, text2: string, index?: string) {
    const scaleFactor = 0.48;

    // Ensure text1 and text2 are strings (default to empty string)
    text1 = text1 || '';
    text2 = text2 || '';

    const length1 = text1.length;
    const length2 = text2.length;
    const maxLength = Math.max(length1, length2);
    const computedHeight = Math.ceil(maxLength * scaleFactor);

    return { heights1: {[`${index} - ${text1}`]: computedHeight},
             heights2: {[`${index} - ${text2}`]: computedHeight} };
  }

  calculateHeights_lists(list1: string[], list2: string[], index?: string) {
    let heights1: { [key: string]: number } = {};
    let heights2: { [key: string]: number } = {};

    for (let i = 0; i < Math.max(list1.length, list2.length); i++) {
      let str1 = list1[i]; // Default empty string if list1 is shorter
      let str2 = list2[i]; // Default empty string if list2 is shorter

      const heights = this.calculateHeights_texts(str1, str2, `${index}${i}`);
      heights1 = { ...heights1, ...heights.heights1 };
      heights2 = { ...heights2, ...heights.heights2 };
    }

    return {heights1: heights1, 
            heights2: heights2};
  }

  calculateHeights_objects(obj1: any, obj2: any, index?: string) {
    let heights1: { [key: string]: number | object } = {};
    let heights2: { [key: string]: number | object } = {};


    // Get all unique keys from both objects
    const keys = Object.keys(obj1).map((key, i) => [key, Object.keys(obj2)[i] || key]);

    keys.forEach(([key1, key2], i) => {
      const val1 = obj1?.[key1];
      const val2 = obj2?.[key2];

      // Compute height for the key itself
      const keyHeights = this.calculateHeights_texts(key1, key2, `${index}`);
      heights1 = { ...heights1, ...keyHeights.heights1 };
      heights2 = { ...heights2, ...keyHeights.heights2 };

      // If both values are strings, calculate height for their values
      if (typeof val1 === "string" && typeof val2 === "string") {
          const textHeights = this.calculateHeights_texts(val1, val2, `${index}${i}`);
          heights1 = { ...heights1, ...textHeights.heights1 };
          heights2 = { ...heights2, ...textHeights.heights2 };
      }

      // If both values are lists, apply calculateHeights_lists()
      else if (Array.isArray(val1) && Array.isArray(val2)) {
          const listHeights = this.calculateHeights_lists(val1, val2, `${index}${i}`);
          heights1 = { ...heights1, ...listHeights.heights1 };
          heights2 = { ...heights2, ...listHeights.heights2 };
      }

      // If both values are objects, apply recursion
      else if (typeof val1 === "object" && typeof val2 === "object") {
          const nestedHeights = this.calculateHeights_objects(val1, val2, `${index}${i}`);
          heights1 = { ...heights1, ...nestedHeights.heights1 };
          heights2 = { ...heights2, ...nestedHeights.heights2 };
      }
    })

    return {heights1: heights1,
            heights2: heights2};
  }

  calculateHeights() {
    let heights1: { [key: string]: number | object } = {};
    let heights2: { [key: string]: number | object } = {};

    const heightsDescr = this.calculateHeights_texts(
      this.comparisonDiffData[0]?.documento_descripcion, 
      this.comparisonDiffData[1]?.documento_descripcion,
      '0'
    );
    heights1 = { ...heights1, ...heightsDescr.heights1 };
    heights2 = { ...heights2, ...heightsDescr.heights2 };

    // Get areas from both objects
    const keys = Object.keys(this.comparisonDiffData[0]?.area_dicts).map((key, i) => [key, Object.keys(this.comparisonDiffData[1]?.area_dicts)[i] || key]);

    keys.forEach(([key1, key2], i) => {
      const cev1 = this.comparisonDiffData[0]?.area_dicts?.[key1]?.["competencias especificas"];
      const cev2 = this.comparisonDiffData[1]?.area_dicts?.[key2]?.["competencias especificas"];

      const cevHeights = this.calculateHeights_objects(cev1, cev2, `${i}0`);
      heights1 = { ...heights1, ...cevHeights.heights1 };
      heights2 = { ...heights2, ...cevHeights.heights2 };

      const saberes1 = this.comparisonDiffData[0]?.area_dicts?.[key1]["saberes basicos"];
      const saberes2 = this.comparisonDiffData[1]?.area_dicts?.[key2]["saberes basicos"];

      const saberesHeights = this.calculateHeights_objects(saberes1, saberes2, `${i}1`);
      heights1 = { ...heights1, ...saberesHeights.heights1 };
      heights2 = { ...heights2, ...saberesHeights.heights2 };
    });

    this.heights1 = heights1;
    this.heights2 = heights2;
  }
  /*-------------------------------------------------------------------------------------------------*/

  updateCommentPositions() {
    if (!this.comparisonContainer) return;

    const containerRect = this.comparisonContainer.nativeElement.getBoundingClientRect();

    this.commentPositions = this.comments.map(comment => {
        const foundElement = this.findTextInDOM(comment.selected_text);
        
        if (foundElement) {
            const elementRect = foundElement.getBoundingClientRect();
            const containerScrollTop = this.comparisonContainer.nativeElement.scrollTop;

            return {
               
                id: comment.id,
                // ✅ Position relative to `#comparisonContainer`
                top: foundElement.offsetTop - containerScrollTop,
                left: foundElement.offsetLeft + foundElement.offsetWidth + 10,  // ✅ Place next to text
                text: comment.selected_text,
                comment: comment.comment
            };
        }
        return null;
    }).filter(c => c !== null);
  }

  private countMarkedElements(obj: any): number {
    let count = 0;

    if (typeof obj === 'string') {
      // Check if the string is wrapped in <mark> tags
      if (obj.startsWith('<mark>') && obj.endsWith('</mark>')) {
        return 1;
      }
      return 0;
    } else if (Array.isArray(obj)) {
      // Iterate through array elements
      for (const item of obj) {
        count += this.countMarkedElements(item);
      }
    } else if (typeof obj === 'object' && obj !== null) {
      // Iterate through object properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          count += this.countMarkedElements(obj[key]);
        }
      }
    }

    return count;
  }

  onAccordionToggle(index: number, isOpen: boolean): void {
    this.accordionState[index] = isOpen;
    this.accordionStateRight[index] = isOpen;
    if (isOpen) {
      this.cdr.detectChanges();
      this.detectHighlightedElements();
    }
  }

  onAccordionToggleRight(index: number, isOpen: boolean): void {
    //   Object.keys(this.accordionStateRight).forEach(key => {

    //     this.accordionStateRight[+key] = false; // Close all
    // });

    // Open only the clicked accordion
    this.accordionStateRight[index] = isOpen;

    if (isOpen) {
      this.cdr.detectChanges();
      this.detectHighlightedElements();
    }
  }
  onCompetenciasToggle(index: number, isOpen: boolean) {
    this.accordionCompetenciasState[index] = isOpen;


  }
  onSaberesToggle(index: number, isOpen: boolean) {
    this.accordionSaberesBasicosState[index] = isOpen;
  }
  // Detect and update the highlighted elements
  detectHighlightedElements() {
    setTimeout(() => {
      this.highlightedElementsDiff = Array.from(document.querySelectorAll('.highlight')) as HTMLElement[];

      if (this.highlightedElementsDiff.length === 0) {
        console.log('No highlighted elements to scroll to');
      } else {
        console.log(`Found ${this.highlightedElementsDiff.length} highlighted elements`);
      }
    }, 100);
  }


  scrollToNextDiff() {
    if (this.highlightedElementsDiff.length === 0) {
      console.log('No highlighted elements to scroll to');
      return;
    }

    // Remove the 'selected-highlight' class from all elements before scrolling to the next one
    this.removeSelectedHighlight();

    // Move to the next element
    this.currentIndexDiff = (this.currentIndexDiff + 1) % this.highlightedElementsDiff.length;
    const element = this.highlightedElementsDiff[this.currentIndexDiff];

    // Add the 'selected-highlight' class to the currently selected element
    this.addSelectedHighlight(element);

    // Scroll to the next highlighted element
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.log('Element not found for scrolling');
    }
  }

  scrollToPreviousDiff() {
    if (this.highlightedElementsDiff.length === 0) {
      console.log('No highlighted elements to scroll to');
      return;
    }

    this.removeSelectedHighlight();

    this.currentIndexDiff = (this.currentIndexDiff - 1 + this.highlightedElementsDiff.length) % this.highlightedElementsDiff.length;
    const element = this.highlightedElementsDiff[this.currentIndexDiff];

    this.addSelectedHighlight(element);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.log('Element not found for scrolling');
    }
  }

  addSelectedHighlight(element: HTMLElement) {
    if (element) {
      element.classList.add('selected-highlight');
    }
  }

  removeSelectedHighlight() {
    this.highlightedElementsDiff.forEach((element) => {
      element.classList.remove('selected-highlight');
    });
  }

  // Fetch data for both left and right comparisons
  fetchTwoDocumentsComparisonData(documentRefID: number, documentCompareID: number): Observable<any> {
    this.isComparisonDocumentsLoading = true;
    return this.apiService.getTableListComparison(documentRefID, documentCompareID).pipe(
      tap((res) => {
        this.comparisonDiffData = res;
        this.isComparisonDocumentsLoading = false;
        this.porValidar = this.countMarkedElements(res);
      }),
      catchError((err) => {
        this.isComparisonDocumentsLoading = false;
        console.error('Error fetching comparison data:', err);
        return throwError(() => err); // Ensure error is still thrown
      })
    );
  }

  clearSearchIndex() {
    this.currentCountElementsearched = -1;
  }

  // ✅ Update the count of highlights
  updateHighlightCount() {
    setTimeout(() => {
      let highlights = Array.from(
        this.comparisonContainer.nativeElement.querySelectorAll('mark.searched-highlight')
      ) as HTMLElement[];


      this.totalElements = highlights.length;
      console.log("🔎 Found highlights:", this.totalElements);

    }, 100);
    this.scrollToSearchedText('down');
  }


  openallowComment() {
    this.closeParagrahOptions();
    // this.allowComment = true;
    this.isCommentsVisible = true;
    this.showCommentBox = true;
  }
  clearSearchTerm() {
    this.searchTerm = '';
    this.currentIndex = 0;
    this.totalElements = 0;
    this.currentCountElementsearched=-1;
  }


  scrollToNext(arrowBtn: string) {

    // ✅ Step 1: Open ALL Required Accordions (Parents & Children)
    this.openAllAccordions().then(() => {

      // ✅ Step 2: Delay Search Until UI is Fully Ready
      setTimeout(() => {
        let highlights = Array.from(this.comparisonContainer.nativeElement.querySelectorAll('mark')) as HTMLElement[];

        if (highlights.length === 0) return;

        // ✅ Step 3: Sort Highlights by Position in Document
        highlights.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        if (arrowBtn === 'arrowUp') {
          this.currentCountElement = Math.max(0, this.currentCountElement - 1);
        } else if (arrowBtn === 'arrowDown') {
          this.currentCountElement = Math.min(highlights.length - 1, this.currentCountElement + 1);
        }

        const element = highlights[this.currentCountElement];

        // ✅ Step 4: Scroll to Next Element Smoothly
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      }, 100); // ✅ Slight delay ensures UI updates before searching
    });
  }

  scrollToNextSiguiente(arrowBtn: string, event?: MouseEvent) {
    this.closeParagrahOptions();
    console.log("🔎 Searching highlights...");
    this.openAllAccordions().then(() => {
    // Get container reference
    const container = this.comparisonContainer.nativeElement;

    // ✅ Get All Highlighted Elements Inside the Scrollable Container
    let highlights = Array.from(container.querySelectorAll('mark')) as HTMLElement[];

    console.log("✅ Highlights found:", highlights.length, highlights);
    if (highlights.length === 0) return;

    // ✅ Step 1: Sort Highlights By Their Position in the Document
    highlights.sort((a, b) => 
        (a.getBoundingClientRect().top + container.scrollTop) - 
        (b.getBoundingClientRect().top + container.scrollTop)
    );

    // ✅ Step 2: Determine Starting Position Based on Scroll
    let currentScrollPos = container.scrollTop;
    let closestIndex = this.currentCountElement;

    if (event) {
        // If triggered by click, find the nearest mark to click position
        const clickedElement = event.target as HTMLElement;
        const elementRect = clickedElement.getBoundingClientRect();
        const clickedPos = elementRect.top + container.scrollTop;

        closestIndex = highlights.findIndex(h => 
            (h.getBoundingClientRect().top + container.scrollTop) >= clickedPos
        );
    } else {
        // If triggered by arrow navigation, continue from the last known position
        let nextIndex = this.currentCountElement;
        if (arrowBtn === 'arrowUp') {
            nextIndex = Math.max(0, this.currentCountElement - 1);
        } else if (arrowBtn === 'arrowDown') {
            nextIndex = Math.min(highlights.length - 1, this.currentCountElement + 1);
        }

        closestIndex = nextIndex;
    }

    this.currentCountElement = closestIndex;

    // ✅ Step 3: Scroll to the Closest Highlighted Element
    const element = highlights[this.currentCountElement];

    if (element) {
        requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // ✅ Update position after scrolling
            setTimeout(() => {
                this.currentCountElement = highlights.indexOf(element);
            }, 100);
        });
    }})
}

  scrollToSearchedText(direction: string) {
    this.openAllAccordions().then(() => {
      setTimeout(() => {
        // ✅ Select only the searched highlights (ignore API ones)
        let highlights = Array.from(
          this.comparisonContainer.nativeElement.querySelectorAll('mark.searched-highlight')
        ) as HTMLElement[];

        if (highlights.length === 0) return;

        // Sort highlights by position
        highlights.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        if (direction === 'down') {
          this.currentCountElementsearched = Math.min(this.totalElements - 1, this.currentCountElementsearched + 1);
        } else if (direction === 'up') {
          this.currentCountElementsearched = Math.max(0, this.currentCountElementsearched - 1);
        }

        const element = highlights[this.currentCountElementsearched];

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    });
  }

  openAllAccordions(): Promise<void> {
    console.log("🔓 Opening all accordions...");
    return new Promise((resolve) => {
      let index = 0; // Start from first accordion

      const openNext = () => {
        if (index < this.accordionStateRight.length) {
          this.accordionStateRight[index] = true; // ✅ Open Parent
          this.accordionCompetenciasState[index] = true; // ✅ Open Child
          this.cdr.detectChanges(); // ✅ Update UI after every change
          index++; // Move to the next accordion

          setTimeout(openNext, 100); // ✅ Delay to prevent freezing
        } else {
          resolve();
          console.log("✅ All accordions are now open.");
        }
      };

      openNext(); // ✅ Start the **smooth opening process**
    });
  }

  // ✅ Open Both Parent & Child Accordions (Ensures All Levels Open)
  openRequiredAccordion(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.accordionStateRight = this.accordionStateRight.map(() => true);  // ✅ Open Parent Accordions
        this.accordionCompetenciasState = this.accordionCompetenciasState.map(() => true);  // ✅ Open Child Accordions
        this.cdr.detectChanges();  // ✅ Force UI update after state changes

        console.log("✅ All Parent & Child Accordions Opened!");
        resolve();  // ✅ Continue after UI updates
      }, 100);
    });
  }

  openParentAccordion(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      let parentAccordion = this.findParentAccordion(element);

      if (!parentAccordion) {
        console.warn("❌ No parent accordion found for element:", element);
        return resolve();
      }

      let accordionIndex = this.findAccordionIndex(parentAccordion);

      if (accordionIndex === -1) {
        console.warn("❌ Accordion index not found for element:", element);
        return resolve();
      }

      console.log("📂 Opening accordion at index:", accordionIndex);

      // ✅ Open accordion only if it's closed
      if (!this.accordionStateRight[accordionIndex]) {
        this.accordionStateRight[accordionIndex] = true;
        this.accordionCompetenciasState[accordionIndex] = true;
        this.cdr.detectChanges(); // ✅ Force UI update
      }

      // ✅ Ensure UI updates before scrolling
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  ensureAccordionIsOpen(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      let parentAccordion = this.findParentAccordion(element);
      if (!parentAccordion) {
        console.warn("❌ No accordion found for this highlight:", element);
        return resolve();
      }

      // ✅ Find the index of the accordion that needs to be opened
      let accordionIndex = this.findAccordionIndex(parentAccordion);
      if (accordionIndex === -1) {
        console.warn("❌ Accordion index not found for element:", element);
        return resolve();
      }
      console.log("📂 Opening accordion at index:", accordionIndex);

      // ✅ Open the accordion **ONLY IF IT'S CLOSED**
      if (!this.accordionStateRight[accordionIndex]) {
        this.accordionStateRight[accordionIndex] = true;
        this.accordionCompetenciasState[accordionIndex] = true;
        this.cdr.detectChanges();
      }

      // ✅ Ensure UI is updated before proceeding
      setTimeout(() => {
        resolve();
      }, 250); // ⏳ Small delay to allow animation/rendering
    });
  }

  findParentAccordion(element: HTMLElement): HTMLElement | null {
    return element.closest('.accordion-group') as HTMLElement | null;
  }

  findAccordionIndex(accordion: HTMLElement): number {
    return Array.from(document.querySelectorAll('.accordion-group')).indexOf(accordion);
  }
  sortData(leftArray: any[], rightArray: any[]): void {
    const sortedLeft = this.sortAlphabetically(leftArray);
    const sortedRight = this.sortAlphabetically(rightArray);

    const commonAreas = sortedLeft.filter((leftItem) =>
      sortedRight.some((rightItem) => rightItem.area === leftItem.area)
    );

    const uniqueLeftAreas = sortedLeft.filter(
      (leftItem) =>
        !sortedRight.some((rightItem) => rightItem.area === leftItem.area)
    );

    const uniqueRightAreas = sortedRight.filter(
      (rightItem) =>
        !sortedLeft.some((leftItem) => leftItem.area === rightItem.area)
    );

    this.leftComparisonDiffData = [...commonAreas, ...uniqueLeftAreas];

  }

  sortByName(array: any[]): any[] {
    return array.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';
      return nameA.localeCompare(nameB);
    });
  }

  sortAlphabetically(array: any[]): any[] {
    return array.sort((a, b) => {
      const areaA = a.area ? a.area.toUpperCase() : '';
      const areaB = b.area ? b.area.toUpperCase() : '';
      return areaA.localeCompare(areaB);
    });
  }
  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  isArray(value: any): value is string[] {
    return Array.isArray(value);
  }

  getQueryParams(documentRefID: number, documentCompareID: number): string {
    const params: { [key: string]: any } = {
      reference_document_id: documentRefID,
      document_to_compare_id: documentCompareID,
      ciclo_names: this.cicloFC.value?.length ? this.cicloFC.value.join(',') : '',
      area_names: this.materiaFC.value?.length ? JSON.stringify(this.materiaFC.value) : '',
    };
    const queryParams = Object.keys(params)
      .filter((key) => params[key])
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&');

    return queryParams;
  }

  onHandleSearch(): void {
    const referenciaQueryParams = this.getQueryParams(this.referenciasIds[0], this.comparacionIds[0]);

    this.apiService.getTableListComparisonQuery(referenciaQueryParams).subscribe({
      next: (res) => {
        this.comparisonDiffData = this.sortAlphabetically(res)  
        this.porValidar = this.countMarkedElements(res);
      },
      error: (err) => {
        console.error('Error onHandleSearch Failed to get Document Comparison:', err);
      }
  });
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
  getValue(obj: any, key: string): any {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    }
    return null;
  }

  getKeysobj(obj: object): string[] {
    return Object.keys(obj);
  }

  zipKeys(obj1: any, obj2: any): { key1: string, key2: string }[] {
    let keys1: string[];
    let keys2: string[];

    if (Array.isArray(obj1)) {
        keys1 = obj1.map((_, i) => i.toString()); // Convert list indexes to string keys
    } else {
        keys1 = Object.keys(obj1 || {});
    }

    if (Array.isArray(obj2)) {
        keys2 = obj2.map((_, i) => i.toString());
    } else {
        keys2 = Object.keys(obj2 || {});
    }

    const maxLength = Math.max(keys1.length, keys2.length);

    return Array.from({ length: maxLength }, (_, i) => ({
        key1: keys1[i] || '',
        key2: keys2[i] || ''
    }));
  }

  getKeys(obj: any): string[] {
    if (obj === null || obj === undefined) {
      return [];
    }
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj);
  }

  getAsRecord(value: any): Record<string, any> {
    return value as Record<string, any>;
  }

  toggleVisibility(section: string) {
    if (section === 'leftHeader') {
      this.isLeftHeaderVisible = !this.isLeftHeaderVisible;
    } else if (section === 'rightHeader') {
      this.isRightHeaderVisible = !this.isRightHeaderVisible;
    } else if (section === 'col-1-2nd-Header') {
      this.isVisible = !this.isVisible;
    } else if (section === 'col-2-2nd-Header') {
      this.isCol1Header2 = !this.isCol1Header2;
    }
  }

  closeParagrahOptions() {
    this.isCommentboxVisible = null;
    this.showParagrahOptions = false;
  }

  openGuardarModal() {
    this.isGuardarModalOpen = true;
  }
  closeGuardarModal() {
    this.isGuardarModalOpen = false;
  }

  openDescargarModal() {
    this.isDescargarModalOpen = true;
  }

  closeDescargarModal() {
    this.isDescargarModalOpen = false;
  }

  togglePin() {
    this.isPinVisible = !this.isPinVisible;
  }

  isMarkedText(value: unknown): boolean {
    return typeof value === 'string' && value.includes('<mark>');
  }

  toggleCommentbox(index: number, direction: string, event: MouseEvent, item: unknown) {
    this.showParagrahOptions = true;
    this.selectedDataBox = item;
    this.showCommentBox = false;

    this.isCommentsVisible = false;
    this.boxDirection = direction;
    if (this.isCommentboxVisible === index) {
      // Close the comment box if clicked again
      this.isCommentboxVisible = null;
      this.selectedIconPosition = null;
    } else {
      this.isCommentboxVisible = index;

      // Get the clicked icon position
      const iconRect = (event.target as HTMLElement).getBoundingClientRect();
      // Get scrollable container offset
      const containerRect =
        this.comparisonContainer.nativeElement.getBoundingClientRect();
      const scrollTop = this.comparisonContainer.nativeElement.scrollTop;
      const scrollLeft = this.comparisonContainer.nativeElement.scrollLeft;

      // Calculate correct position **inside the scrollable container**
      this.selectedIconPosition = {
        top: iconRect.top - containerRect.top + scrollTop - 300, // Adjust Y position
        left: iconRect.left - containerRect.left + scrollLeft, // Adjust X position
      };
    }
  }
  getStringValue(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  fetchComments(): void {

    if (this.storedUserId === undefined || isNaN(this.storedUserId)) {
      console.warn('fetchComments called without a valid user_id.');
      return;
    }
  
    // Fetch comments for both documents
    const documentIds = [this.referenciasIds[0], this.comparacionIds[0]];
    
    documentIds.forEach((docId) => {
      this.apiService.getComments(this.storedUserId, docId).subscribe(
        (response) => {
          const newComments = response.map((comment) => ({
            ...comment,
            position: comment.position || { x: 0, y: 0 },
            isDeleteVisible: false,
          }));
          
          // Merge new comments with existing ones
          this.comments = [...this.comments, ...newComments];
          this.calculateCommentPositions();
        },
        (error) => {
          console.error(`Error fetching comments for document ${docId}:`, error);
        }
      );
    });
  }

  calculateCommentPositions() {
    if (!this.comparisonContainer || !this.comparisonContainer.nativeElement) {
      console.error('Error: Container not found');
      return;
    }

    const container = this.comparisonContainer.nativeElement;
    const containerRect = container.getBoundingClientRect();

    this.commentPositions = [];

    this.comments.forEach((comment) => {
      const foundElement = this.findTextInDOM(comment.selected_text);

      if (foundElement) {
        const elementRect = foundElement.getBoundingClientRect();
        const topPosition =
          elementRect.top - containerRect.top + container.scrollTop;
        const leftPosition = elementRect.left - containerRect.left;

        this.commentPositions.push({
          id: comment.id,
          top: (comment?.position?.y || 0) + 150,
          left: (comment?.position?.x || 0) + 300,
          text: comment.selected_text,
          comment: comment.comment,
        });
      } else {
        console.warn(`⚠️ Could not find position for comment:`, comment);
      }
    });
  }

findTextInDOM(selectedText: string): HTMLElement | null {
  console.log("🔎 Searching for text:", selectedText);

  const allElements = Array.from(document.querySelectorAll('*')); // Get all elements
  let bestMatch: HTMLElement | null = null;

  for (let element of allElements) {
      if (!element.textContent) continue; // Ignore empty elements

      if (element.textContent.trim().includes(selectedText.trim())) {
          // Ensure it's not a large container by checking children count
          if (element.children.length === 0) {
              bestMatch = element as HTMLElement;
              console.log("✅ Exact match found:", element);
              break;
          }
      }
  }

  if (!bestMatch) {
      console.warn("⚠️ Text not found in DOM:", selectedText);
  }
  return bestMatch;
}


addComment(): void {
  if (this.newComment.trim()) {
    const newCommentPayload = {
      user_id: this.storedUserId,
      selected_text: this.selectedDataBox,
      document_id:
        this.boxDirection === 'left'
          ? this.referenciasIds[0]
          : this.comparacionIds[0],
      comment: this.newComment,
      position: {
        x: this.selectedIconPosition?.left,
        y: this.selectedIconPosition?.top,
      },
    };

    this.apiService.postComment(newCommentPayload).subscribe(
      (response) => {
        this.commentPositions.push({
          id: response.id,
          user_id: response.user_id,
          text: response.selected_text,
          comment: response.comment,
          timestamp: response.timestamp,
          position: response.position,
          isDeleteVisible: false,
        });
        
        this.comments.push({
          ...response,
          isDeleteVisible: false,
        });

        this.calculateCommentPositions();
        this.cdr.detectChanges();
        this.isCommentsVisible;

        this.showAllComments = true;
        this.resetCommentBox();
      },
      (error) => {
        console.error('Error creating comment:', error);
      }
    );
  }
}

editComment(index: number): void {
  const commentToEdit = this.comments[index];
  if (commentToEdit) {
    this.commentToEdit = { ...commentToEdit };
    this.newComment = commentToEdit.comment;
    this.showCommentBox = true;
    this.isEditMode = true;

    // Preserve the position
    if (commentToEdit.position) {
      this.selectedIconPosition = {
        top: commentToEdit.position.y,
        left: commentToEdit.position.x,
      };
    }
  }
}

  saveEditedComment(): void {
    if (this.newComment.trim() && this.commentToEdit?.id) {
      const updatePayload = {
        user_id: this.commentToEdit.user_id,
        selected_text: this.commentToEdit.selected_text,
        comment: this.newComment.trim(),
        position: this.selectedIconPosition ? {
          x: this.selectedIconPosition.left,
          y: this.selectedIconPosition.top
        } : this.commentToEdit.position
      };
  
      this.apiService.updateComment(this.commentToEdit.id, updatePayload).subscribe(
        (response) => {
          const index = this.comments.findIndex(c => c.id === this.commentToEdit?.id);
          if (index !== -1) {
            this.comments[index] = {
              ...response,
              isDeleteVisible: false
            };
            this.calculateCommentPositions();
          }
          this.resetCommentBox();
          this.showCommentBox = false;
        },
        (error) => {
          console.error('Error updating comment:', error);
        }
      );
    }
  }

  cancelComment(): void {
    this.resetCommentBox();
  }

  resetCommentBox(): void {
    this.showCommentBox = false;
    this.newComment = '';
    this.selectedText = '';
    this.isEditMode = false;
    this.commentToEdit = null;
  }

  toggleDeleteButton(index: number): void {
    this.commentPositions = this.commentPositions.map((comment, i) =>
      i === index
        ? { ...comment, isDeleteVisible: !comment.isDeleteVisible }
        : { ...comment, isDeleteVisible: false }
    );
  }

  removeCommentUI(index: number): void {
    const commentToRemove = this.comments[index];
    if (!commentToRemove?.id) {
      console.error('Comment ID is missing or invalid.');
      return;
    }

    this.apiService.deleteComment(commentToRemove.id).subscribe(
      () => {
        this.comments.splice(index, 1);
        this.commentPositions.splice(index, 1);

        this.calculateCommentPositions();
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  toggleComments() {
    this.calculateCommentPositions();
    this.isCommentsVisible = !this.isCommentsVisible;
    this.showAllComments = !this.showAllComments;
  }

  openNotInVersionModal() {
    this.isNotInVersionModal = true;
  }

  closeNotInVersionModal() {
    this.isNotInVersionModal = false;
  }

  closeNotInVersionModalTab() {
    this.isNotInVersionModalTab = false;
  }

  onHandleDescargar() {
    this.isDescargarModalOpen = false;

    const ciclo_names = this.cicloFC.value?.length
      ? this.cicloFC.value.join(',')
      : '';
    const area_names = this.materiaFC.value?.length
      ? JSON.stringify(this.materiaFC.value)
      : '';
    this.apiService
      .getExcelFileComparison(
        this.referenciasIds[0],
        this.comparacionIds[0],
        ciclo_names,
        area_names
      )
      .subscribe({
        next: (response) => {
          if (!response.body) {
            console.error('Received null Blob from the server');
            return;
          }

          const blob = response.body;
          const contentDisposition = response.headers.get(
            'content-disposition'
          );
          let filename = 'comparison.xlsx'; // Default filename

          // Extract filename from headers
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (filenameMatch?.[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '').trim();
            }
          }

          // Create and trigger the download
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading Excel file:', err);
          if (err.status === 404) {
            this.snackBar.open('Comparación no encontrada', 'Cerrar', {
              duration: 3000,
            });
          }
        },
      });
  }

  updateJson(obj: any, markedText: any, unmarkedText: any) {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(markedText, unmarkedText);
        } else {
          this.updateJson(obj[key], markedText, unmarkedText);
        }
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item) => this.updateJson(item, markedText, unmarkedText));
    }
    return obj;
  }

  onHandleGuardar() {
    this.isGuardarModalOpen = false;
    this.onHandleOmitirDiferencia();
    this.snackBar.open('La comparación se ha guardado', 'Cerrar', { duration: 2000 });
  }

  onHandleOmitirDiferencia() {
    if (typeof this.selectedDataBox === 'string') {
      let cleanedItem = this.selectedDataBox.replace(/<\/?mark>/g, '');
      let data = this.updateJson(
        this.comparisonDiffData,
        this.selectedDataBox,
        cleanedItem
      );

      this.porValidar = this.countMarkedElements(data);

      const payload = {
        reference_document_id: this.referenciasIds[0],
        document_to_compare_id: this.comparacionIds[0],
        comparacion: JSON.stringify(data),
        ciclo_names: this.cicloFC.value?.length
          ? this.cicloFC.value.join(',')
          : '',
        area_names: this.materiaFC.value?.length
          ? JSON.stringify(this.materiaFC.value)
          : '',
      };

      this.apiService.saveModifiedComparison(payload).subscribe({
        next: (response) => {
          console.log('response--->>>', response);
        },
        error: (err) => {
          console.error('Failed to save Modified File Comparison', err);
          this.snackBar.open(
            'No se pudo guardar la comparación de archivos modificados',
            'Cerrar',
            { duration: 2000 }
          );
          if (err.error) {
            console.error('Error response body:', err.error);
          }
        },
      });
    }
  }

  onHandleAnadirDiferencia() {
    this.closeParagrahOptions();
    if (typeof this.selectedDataBox === 'string') {
      const unmarkedText = this.selectedDataBox;
      const markedItem = `<mark>${unmarkedText}</mark>`;
      
      const data = this.updateJson(
        this.comparisonDiffData,
        unmarkedText,
        markedItem
      );
  
      this.porValidar = this.countMarkedElements(data);
  
      const payload = {
        reference_document_id: this.referenciasIds[0],
        document_to_compare_id: this.comparacionIds[0],
        comparacion: JSON.stringify(data),
        ciclo_names: this.cicloFC.value?.length
          ? this.cicloFC.value.join(',')
          : '',
        area_names: this.materiaFC.value?.length
          ? JSON.stringify(this.materiaFC.value)
          : '',
      };
  
      this.apiService.saveModifiedComparison(payload).subscribe({
        next: (response) => {
          console.log('response--->>>', response);
        },
        error: (err) => {
          console.error('Failed to save Modified File Comparison', err);
          this.snackBar.open(
            'No se pudo guardar la comparación de archivos modificados',
            'Cerrar',
            { duration: 2000 }
          );
          if (err.error) {
            console.error('Error response body:', err.error);
          }
        },
      });
    }
  }

}