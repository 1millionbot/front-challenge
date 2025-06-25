import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

   private tableDataSubject = new BehaviorSubject<any[]>([]);
  
   tableData$ = this.tableDataSubject.asObservable();
 
   constructor() {}
  
   setTableData(data: any): void {
     this.tableDataSubject.next(data);  
   }
 
   getTableDataSnapshot(): any[] {
     return this.tableDataSubject.getValue(); 
   }
}
