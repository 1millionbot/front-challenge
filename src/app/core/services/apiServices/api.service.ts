import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TableDataService } from '../sharedData/table-data.service';
import { IAdaptacionesDua, IAno, ICiclo, IComment, IconcrecionCurricular, IEvaluacionProceso, Iidentificacion, ILibro, IMetodologia, IObjetivo, IProcedicimientosEvalucion, IProgramacionAulaProducto, IRegions, ISecuenciaDidactica, ITypology, } from '../../../../model/interface/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private tableDataService: TableDataService
  ) { }

  queryParams = new URLSearchParams();

  private apiUrl = environment.API_BASE_URL;

  headers = new HttpHeaders({
    Authorization: environment.TOKEN,
    'Content-Type': 'application/json'
  });

  getEtapas(): Observable<any> {
    return this.http.get(this.apiUrl + 'etapas', { headers: this.headers });
  }

  getDocumentsData(queryParams: any): Observable<any> {
    const url = queryParams
      ? `${this.apiUrl}documentos-oficiales/?${queryParams}`
      : `${this.apiUrl}documentos-oficiales/`;

    // Make the HTTP GET request and return the Observable
    const observable = this.http.get(url, { headers: this.headers });

    // Optionally, storing the data in the service
    observable.subscribe(
      (data) => this.tableDataService.setTableData(data),
      (error) => console.error('Error fetching documents data', error)
    );

    return observable;
  }

  // GET comunidades (regions)
  getRegionsData(): Observable<IRegions[]> {
    return this.http.get<IRegions[]>(this.apiUrl + 'comunidades', {
      headers: this.headers,
    });
  }

  //  GET tipología
  getTypologiesData(): Observable<ITypology[]> {
    return this.http.get<ITypology[]>(this.apiUrl + 'tipologias', {
      headers: this.headers,
    });
  }

  // GET Ano (year)
  getAno(): Observable<IAno[]> {
    return this.http.get<IAno[]>(this.apiUrl + 'annos-ley', {
      headers: this.headers,
    });
  }

  // GET Ciclos
  getCiclos(): Observable<ICiclo[]> {
    return this.http.get<ICiclo[]>(this.apiUrl + 'ciclos', {
      headers: this.headers,
    });
  }

  // ID of reference document 4
  getMateria(): Observable<string[]> {
    let params = new HttpParams().set('document_id', '4');
    return this.http.get<string[]>(
      this.apiUrl + `dropdowns-options-comparador-curricular/get-areas-options-by-document/`,
      {
        params: params,
        headers: this.headers,
      }
    );
  }

  // GET TABLE LIST COMPARISON
  getTableListComparison(referenceDocumentId: number, documentToCompareId: number): Observable<any> {
    let params = new HttpParams()
      .set('reference_document_id', referenceDocumentId.toString())
      .set('document_to_compare_id', documentToCompareId.toString());
    return this.http.get<any>(
      `${this.apiUrl}comparador-curricular/two-documents-comparison/`,
      {
        params: params,
        headers: this.headers,
      }
    );
  }  

  //GET TABLE LIST COMPARISON
  getTableListComparisonQuery(queryParams: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}comparador-curricular/two-documents-comparison/?${queryParams}`,
      {
        headers: this.headers,
      }
    );
  }
  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}usuario-login/`, payload,
      {
        headers: this.headers
      }
    );

  }

  getComments(userId?: number, document_id?: number): Observable<IComment[]> {
    const params = userId 
    ? new HttpParams()
        .set('user_id', userId.toString())
        .set('document_id', document_id ? document_id.toString() : '') 
    : undefined;
  
    return this.http.get<IComment[]>(this.apiUrl + 'comments', { headers: this.headers, params });
  }

  getCommentsById( id: number) : Observable<IComment[]> {
    const url = `${this.apiUrl}comments/${id}`;
    return this.http.get<IComment[]>(url, {headers: this.headers})
  }

  postComment(comment: any): Observable<IComment> {
    return this.http.post<IComment>(`${this.apiUrl}comments/`, comment, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error occurred while posting the comment:', error);
        return throwError(error);
      })
    );
  }
  
  deleteComment(id: number): Observable<void> {
    const url = `${this.apiUrl}comments/${id}/`;
    return this.http.delete<void>(url, { headers: this.headers }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.error('No Comment matches the given query:', error.error.detail);
        }
        return throwError(error);
      })
    );
  }

  updateComment(id: number, updatedComment: any): Observable<any> {
    const url = `${this.apiUrl}comments/${id}/`; 
    return this.http.put<any>(url, updatedComment, {
      headers: this.headers 
    }).pipe(
      catchError((error) => {
        console.error('Error occurred while updating the comment:', error);
        return throwError(error); 
      })
    );
  }

  getLibros(params?: { ccaa?: string; etapa?: number; curso?: number; materia?: string;}): Observable<any> {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          queryParams = queryParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(this.apiUrl + 'libros', {
      headers: this.headers,
      params: queryParams,
    });
  }

  getLibroByID(id: number): Observable<ILibro[]> {
    const url = `${this.apiUrl}libros/${id}`;
    return this.http.get<ILibro[]>(url, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error(`Error fetching the book against ${id}`, error);
        return throwError(error);
      })
    );
  }

  getCursoByID(id: number): Observable<any> {
    const url = `${this.apiUrl}cursos/${id}/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getAllCursos( curso?: number, etapa_name?: string, ciclo_name?: string): Observable<any> {
    const paramsObject = { curso, etapa_name, ciclo_name };

    let queryParams = new HttpParams();

    for (const [key, value] of Object.entries(paramsObject)) {
      if (value != null) {
        queryParams = queryParams.set(key, value.toString());
      }
    }

    const url = `${this.apiUrl}cursos/`;
    return this.http.get<any>(url, {
      headers: this.headers,
      params: queryParams,
    });
  }

  getIdentificacion(unidad_ids: string): Observable<Iidentificacion[]> {
    const params = new HttpParams().set('unidad_ids', unidad_ids);
    const url = `${this.apiUrl}create-programacion-aula-identificacion/programacion-aula-identificacion/`;
    return this.http.get<Iidentificacion[]>(url, {
      headers: this.headers,
      params: params
    })  
  }

  getObjetivo(unidad_ids: string, generate?: boolean): Observable<IObjetivo[]> {
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-objetivo/programacion-aula-objetivo/`;
    return this.http.get<IObjetivo[]>(url, {
      headers: this.headers,
      params: params
    })
  }
  
  getConcrecionCurricular(unidad_ids: string, generate?: boolean): Observable<IconcrecionCurricular[]> {
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-concrecion-curricular/programacion-aula-concrecion-curricular/`;
    return this.http.get<IconcrecionCurricular[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getSecuenciaDidactica(unidad_ids: string, generate?: boolean): Observable<ISecuenciaDidactica[]> {
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-secuencia-didactica/programacion-aula-secuencia-didactica/`;
    return this.http.get<ISecuenciaDidactica[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getMedidas(unidad_ids: string): Observable<any> {
    const params = new HttpParams().set('unidad_ids', unidad_ids);
    const url = `${this.apiUrl}create-programacion-aula-atencion-educativa/programacion-aula-atencion-educativa/`;
    return this.http.get<any>(url, {
      headers: this.headers,
      params: params
    })
  }
  getMetodologia(unidad_ids: string): Observable<IMetodologia[]>{
    const params = new HttpParams().set('unidad_ids', unidad_ids);
    const url = `${this.apiUrl}create-programacion-aula-metodologia/programacion-aula-metodologia/`;
    return this.http.get<IMetodologia[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getAdapdacionesDua(unidad_ids: string, generate?: boolean): Observable<IAdaptacionesDua[]>{
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-adaptaciones-dua/programacion-aula-adaptaciones-dua`;
    return this.http.get<IAdaptacionesDua[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getProgramacionAulaProdcucto(unidad_ids: string, generate?: boolean): Observable<IProgramacionAulaProducto[]>{ 
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-producto/programacion-aula-producto/`
    return this.http.get<IProgramacionAulaProducto[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getEvalucionProceso(unidad_ids: string, generate?: boolean): Observable<IEvaluacionProceso[]>{
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-evaluacion-proceso-aprendizaje/programacion-aula-evaluacion/`
    return this.http.get<IEvaluacionProceso[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getProcedicimientosEvaluacion(unidad_ids: string, generate?: boolean): Observable<IProcedicimientosEvalucion[]> {
    const params = new HttpParams().set('unidad_ids', unidad_ids).set('generate', generate ? 'true' : 'false');
    const url = `${this.apiUrl}create-programacion-aula-procedicimientos-evaluacion/programacion-aula-procedimientos-evaluacion/`
    return this.http.get<IProcedicimientosEvalucion[]>(url, {
      headers: this.headers,
      params: params
    })
  }

  getExcelFileComparison(reference_document_id: number, document_to_compare_id: number, ciclo_names?: string, area_names?: string): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
    .set('reference_document_id', reference_document_id)
    .set('document_to_compare_id',document_to_compare_id)
    .set('ciclo_names', ciclo_names ? ciclo_names : '')
    .set('area_names', area_names ? area_names  : '');
    const url = `${this.apiUrl}comparador-curricular/get-excel-file-comparison/`
    return this.http.get<Blob>(url, {
      headers: this.headers,
      params: params,
      responseType: 'blob' as 'json',
      observe: 'response'
    })
  }

  saveModifiedComparison( payload: any) {
    const url = `${this.apiUrl}comparador-curricular/save-modified-comparison/`;
    return this.http.post<any>(url, JSON.stringify(payload), {
      headers: this.headers,
    });
  }
  
 }

