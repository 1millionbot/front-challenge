import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../core/services/apiServices/api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import {
  IAno,
  IRegions,
  ITypology,
  Resultado,
} from '../../../model/interface/types';
import { copyArrayItem, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { TableDataService } from '../../core/services/sharedData/table-data.service';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { debounceTime } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comparacion-curricular',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    HeaderComponent,
    CdkDrag,
    CdkDropList,
    DragDropModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './comparacion-curricular.component.html',
  styleUrl: './comparacion-curricular.component.css',
})
export class ComparacionCurricularComponent implements OnInit {
  regionsList: IRegions[] = [];
  etapaList: any;
  anoList: IAno[] = [];
  typologiesList: ITypology[] = [];
  toppings = new FormControl<IRegions[]>([]);
  stages = new FormControl<string[]>([]);
  years = new FormControl<IAno[]>([]);
  typologies = new FormControl<ITypology[]>([]);
  fileName: string | undefined;
  private apiService = inject(ApiService);
  isModalOpen = false;
  tableData: Resultado[] = [];
  referencias: any[] = []; 
  comparaciones: any[] = [];
  isLoading: boolean = true;
  isErrorMessage: boolean = false;

  constructor(
    private tableDataService: TableDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.apiService.getEtapas().subscribe(
      (res) => (this.etapaList = res),
      (error) => console.error('Error fetching Etapas:', error)
    );

    this.apiService.getRegionsData().subscribe(
      (res) => (this.regionsList = res),
      (error) => console.error('Error Fetching Regions', error)
    );

    this.apiService.getAno().subscribe(
      (res) => (this.anoList = res),
      (error) => console.error('Error Fetching Anos', error)
    );

    // GET documentos-oficiales
    const queryParams = this.getQueryParams();
    this.apiService.getDocumentsData(queryParams);

    this.apiService.getTypologiesData().subscribe(
      (res) => (this.typologiesList = res),
      (error) => console.error('Error Fetching Typologies', error)
    );

    this.fetchTableData();
  }

  fetchTableData() {
    this.isErrorMessage = false;
    this.isLoading = true;
    this.tableDataService.tableData$.pipe(debounceTime(400)).subscribe(
      (data) => {
        this.tableData = data || [];
        this.isLoading = false;
        this.isErrorMessage = false;
      },
      (error) => {
        console.error('Error fetching table data', error);
        this.isLoading = false;
        this.isErrorMessage = true;
      }
    );
  }

  getQueryParams(): string {
    const params: { [key: string]: any } = {
      comunidad: this.toppings.value?.map((val)=> val.id),
      etapa: this.stages.value,
      año: this.years.value,
      tipologia: this.typologies.value?.map((val) => val.name).join(','),
    };

    const filteredParams = Object.keys(params)
      .filter((key) => params[key])
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    return filteredParams || '';
  }

  onHandleSearch(): void {
    const queryParams = this.getQueryParams();
    this.tableData = [];
    this.isErrorMessage = false;
    this.isLoading = true;
    this.apiService.getDocumentsData(queryParams).pipe(debounceTime(400)).subscribe({
      next: (res) => {
        this.isErrorMessage = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.isErrorMessage = true;
        this.isLoading = false;
      }
    });
  }

  onDrop(event: CdkDragDrop<any[]>, targetZone: string) {
    const draggedItem = event.previousContainer.data[event.previousIndex];
  
    // Check if the drop is within the same list (for reordering)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between different lists
      if (targetZone === 'referencia') {
        // Ensure only one item can be in "Referencia"
        if (this.referencias.length > 0) {
          this.snackBar.open('Solo se permite un documento en la sección "Referencia".', 'Cancelar', { duration: 3000 });
          return;
        }
  
        // Ensure the dropped item is "Enseñanzas mínimas"
        if (draggedItem.comunidad_name !== 'Enseñanzas mínimas') {
          this.snackBar.open('El documento de referencia debe ser "Enseñanzas mínimas".', 'Cancelar', {duration: 3000});
          return;
        }
      } else if (targetZone === 'comparacion') {
        // Ensure only one item can be in "Comparación"
        if (this.comparaciones.length > 0) {
          this.snackBar.open('Solo se permite un documento en la sección "Comparación".', 'Cancelar', {duration: 3000});
          return;
        }
  
        // Ensure the dropped item is either "Cantabria" or "Castilla-La Mancha"
        if (!['Cantabria', 'Castilla-La Mancha'].includes(draggedItem.comunidad_name)) {
          this.snackBar.open('Solo se permiten los documentos "Cantabria" o "Castilla-La Mancha" en la sección "Comparación".', 'Cancelar', {duration: 3000});
          return;
        }
      }
  
      // Perform the drop operation
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }
  
  removeFromReferencia(index: number) {
    const removedItem = this.referencias.splice(index, 1)[0];
    this.tableData.push({
      id: removedItem.resultID,
      comunidad_name: removedItem.comunidad_name,
      denominacion: removedItem.denominacion,
      etapa_name: removedItem.etapa_name,
      tipologia: removedItem.tipologia,
    });
  }
  
  removeFromComparacion(index: number) {
    const removedItem = this.comparaciones.splice(index, 1)[0];
    this.tableData.push({
      id: removedItem.resultID,
      comunidad_name: removedItem.comunidad_name,
      denominacion: removedItem.denominacion,
      etapa_name: removedItem.etapa_name,
      tipologia: removedItem.tipologia,
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    }
  }

  cancelUpload() {
    this.fileName = undefined;
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  
  onCompare() {
     // Validate "Referencia" section
     if (this.referencias.length === 0 || this.referencias[0].comunidad_name !== 'Enseñanzas mínimas') {
      this.snackBar.open('El documento de referencia debe ser "Enseñanzas mínimas".', 'Cancelar', {duration: 3000});
      return;
    }
  
    // Validate "Comparación" section
    if (
      this.comparaciones.length === 0 ||
      !['Cantabria', 'Castilla-La Mancha'].includes(this.comparaciones[0].comunidad_name)
    ) {
      this.snackBar.open('El documento de comparación debe ser "Cantabria" o "Castilla-La Mancha".', 'Cancelar', { duration: 3000});
      return;
    }

    const referenciaIds = this.referencias.map(
      (referencia) => referencia.id
    );
    const comparacionIds = this.comparaciones.map(
      (comparacion) => comparacion.id
    );

    this.router.navigate(['/comparison-difference'], {
      state: { referenciaIds: referenciaIds, comparacionIds: comparacionIds },
    });
  }
}
