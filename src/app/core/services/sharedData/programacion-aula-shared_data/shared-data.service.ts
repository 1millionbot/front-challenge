import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Iidentificacion, IObjetivo, IProgramacionAulaProducto, IconcrecionCurricular, IMetodologia, IAdaptacionesDua, IProcedicimientosEvalucion } from '../../../../../model/interface/types';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  // BehaviorSubjects to store data
  private identificacionDataSource = new BehaviorSubject<Iidentificacion[]>([]);
  identificacionData$ = this.identificacionDataSource.asObservable(); // Observable for subscription

  private objetivoDataSource = new BehaviorSubject<IObjetivo[]>([]);
  objetivoData$ = this.objetivoDataSource.asObservable();

  private programacionAulaProductoDataSource = new BehaviorSubject<IProgramacionAulaProducto[]>([]);
  programacionAulaProductoData$ = this.programacionAulaProductoDataSource.asObservable();

  private concrecionCurricularDataSource = new BehaviorSubject<IconcrecionCurricular[]>([]);
  concrecionCurricularData$ = this.concrecionCurricularDataSource.asObservable();

  private secuenciaDidacticaDataSource = new BehaviorSubject<any[]>([]);
  secuenciaDidacticaData$ = this.secuenciaDidacticaDataSource.asObservable();

  private metodologiaDatSource = new BehaviorSubject<IMetodologia[]>([]);
  metodologiaData$ = this.metodologiaDatSource.asObservable();

  private adaptacionesDuaDataSource = new BehaviorSubject<IAdaptacionesDua[]>([]);
  adaptacionesDuaData$ = this.adaptacionesDuaDataSource.asObservable();

  private medidasDataSource = new BehaviorSubject<any[]>([]);
  medidasData$ = this.medidasDataSource.asObservable();
  private medidasformattedContentSource = new BehaviorSubject<any[]>([]);
  medidasformattedContent$ = this.medidasformattedContentSource.asObservable();
  private medidasEspecificasSource = new BehaviorSubject<any[]>([]);
  medidasEspecificas$ = this.medidasEspecificasSource.asObservable();

  private evaluacionProcesoDataSource = new BehaviorSubject<any[]>([]);
  evaluacionProcesoData$ = this.evaluacionProcesoDataSource.asObservable();

  private procedicimientosEvaluacionDataSource = new BehaviorSubject<IProcedicimientosEvalucion[]>([]);
  procedicimientosEvaluacionData$ = this.procedicimientosEvaluacionDataSource.asObservable();

  constructor() { }

  // Method to update identificacionData
  updateIdentificacionData(data: Iidentificacion[]) {
    this.identificacionDataSource.next(data); // Push new value to all subscribers
  }

  // Method to update objetivoData
  updateObjetivoData(data: IObjetivo[]) {
    this.objetivoDataSource.next(data);
  }

  // Method to update programacionAulaProductoData
  updateProgramacionAulaProductoData(data: IProgramacionAulaProducto[]) {
    this.programacionAulaProductoDataSource.next(data);
  }

  // Method to update concrecionCurricularData
  updateConcrecionCurricularData(data: IconcrecionCurricular[]) {
    this.concrecionCurricularDataSource.next(data);
  }

  // Method to update secuenciaDidacticaData
  updateSecuenciaDidacticaData(data: any[]) {
    this.secuenciaDidacticaDataSource.next(data);
  }

  // Method to update metodologiaData
  updateMetodologiaData(data: IMetodologia[]) {
    this.metodologiaDatSource.next(data);
  }

  // Method to update adaptacionesDuaData
  updateAdaptacionesDuaData(data: IAdaptacionesDua[]) {
    this.adaptacionesDuaDataSource.next(data);
  }

  // Method to update medidasData
  updateMedidasData(data: any[]) {
    this.medidasDataSource.next(data);
  }
  updateMedidasformattedContent(data: any[]) {
    this.medidasformattedContentSource.next(data);
  }
  updateMedidasEspecificas(data: any[]) {
    this.medidasEspecificasSource.next(data);
  }

  // Method to update evaluacionProcesoData
  updateEvaluacionProcesoData(data: any[]) {
    this.evaluacionProcesoDataSource.next(data);
  }

  // Method to update procedicimientosEvaluacionData
  updateProcedicimientosEvaluacionData(data: IProcedicimientosEvalucion[]) {
    this.procedicimientosEvaluacionDataSource.next(data);
  }
}
