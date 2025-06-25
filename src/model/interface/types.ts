export interface IEtapa {
    id: number
    name: string
}

export interface IRegions{
    id: number
    name: string
}
export interface ITypology {
    id: string;
    name: string;
}

export interface Legislacion {
    title: string;
    reference: boolean;
}

export interface IAno {
    id: number;
    name: number;
}

export interface Resultado {
    id: number; 
    comunidad_name: string;
    denominacion: string;
    etapa_name: string;
    tipologia: string;
}

export interface ICiclo {
    id: number,
    name: string,
    etapa: number
}
export interface IComment {
    id?: number;  
    user_id: number;
    selected_text: string;
    comment: string;
    document_id?: number;
    timestamp?: string;
    position: { x: number; y: number } | null;
    isDeleteVisible?: boolean;
}

export interface ICurso {
    id: number
    curso: string
    etapa_name: string
    ciclo_name: String
}

export interface Unidade {
    id: number
    libro: number
    order: number
    name: string
    text: string
}

export interface ILibro {
    id: number
    ccaa: number[]
    et: string
    isbn: string
    etapa: number
    etapa_name: string
    curso: number
    curso_value: number
    materia: string
    unidades: Unidade[]
    autores: string[]
    descripcion: string
    anno_publicacion: number
    serie: any
    idioma: string
    keywords: string[]
    image_url: string
}

  export interface Libro {
    id: number
    etapa: string
    curso: number
    materia: string
    numero_unidades: number
  }

  export interface Iidentificacion {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string
    identificacion: Identificacion
  }
  
  export interface Identificacion {
    titulo_area: string
    materia: string
    curso: number
    etapa: string
    trimestre: number
    sesiones: number
    semanas_vacaciones: number[]
    semanas_numero: number[]
  }
  
  export interface Libro {
    id: number
    etapa: string
    curso: number
    materia: string
    numero_unidades: number
  }
  
  export interface IObjetivo {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string
    objetivo: string
  }

  export interface IconcrecionCurricular {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string
    concrecion_curricular: ConcrecionCurricular
    unidad_text: string
    perfil_salida: PerfilSalida
  }

  interface PerfilSalida {
    rows_perfil_salida: Record<string, CompetenciaEspecifica>;
    descriptores_operativos_total: string;
    descriptores_operativos_description: string;
  }

  interface CompetenciaEspecifica {
    competencia_especifica_number: number;
    descriptores_operativos_ce: string;
  }

  interface ConcrecionCurricular {
    rows: {
      [key: string]: Row;
    };
  }

  interface Row {
    competencia_especifica: string;
    criterios_evaluacion: CriterioEvaluacion[];
    descriptores_operativos: string;
    saberes_basicos: SaberesBasicos;
    evidencias: string[];
  }
  
  interface CriterioEvaluacion {
    [index: number]: string;
  }

  export interface SaberesBasicos {
    [key: string]: {
      [subKey: string]: string[];
    };
  }
  
export interface IMotivacionActivacion {
  actividades: string;
  ejercicios: string; 
  cev: string; 
  cev_format: string; 
  recursos: string;
  metodologia: string;
}
export interface IExploracionEstructuracionAplicacion {
  [key: string]: {
    actividades: string;
    ejercicios: string[]; 
    cev: string; 
    cev_format: string; 
    recursos: string; 
    metodologia: string; 
  };
}

export interface IConclusion {
  actividades: string;
  ejercicios: string; 
  cev: string; 
  cev_format: string; 
  recursos: string; 
  metodologia: string;
}

  export interface IMetodologia {
    unindad_id: number,
    unidad_order: number,
    libro: Libro,
    name: string,
    metodologia: string
  }
  export interface IMedidas {
    medidas_generales: string,
    medidas_específicas: string
  }
  export interface TemporalidadData {
    temporalidad_motivacion_activacion: number;
    temporalidad_exploracion_estructuracion_aplicacion: number[];
    temporalidad_conclusion: number;
  }
  
  export interface SeccionBase {
    actividades: string;
    ejercicios?: string | string[];
    cev?: string;
    cev_format?: string;
    recursos?: string;
    metodologia?: string;
  }
  
  export interface MotivacionActivacion extends SeccionBase {
    ejercicios?: string;
  }
  
  export interface ExploracionEstructuracionAplicacion {
    actividades: string;
    ejercicios?: string[];
    cev?: string;
    cev_format?: string;
    recursos?: string;
    metodologia?: string;
  }
  
  export interface Conclusion  {
    actividades?: string;
    ejercicios?: string[];
    cev?: string;
    cev_format?: string;
    recursos?: string;
    metodologia?: string;
}
  
  export interface ISecuenciaDidactica {
    unidad_id: number;
    unidad_order: number;
    unidad_actividades: string,
    unidad_recursos: string,
    unidad_text: string,
    libro: Libro;
    name: string;
    motivacion_activacion: MotivacionActivacion;
    exploracion_estructuracion_aplicacion: {
      [key: string]: ExploracionEstructuracionAplicacion;
    };
    conclusion: {
      [key: string] : Conclusion
    };
    temporalidad: TemporalidadData;
  }


 
  
  export interface IProgramacionAulaProducto {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string,
    producto: string
  }

  export interface IEvaluacionProceso {
    unidad_id: number;
    unidad_order: number;
    libro: Libro;
    name: string;
    evaluacion_table: EvaluacionTable;
  }
  interface EvaluacionTable {
    [key: string]: {
      criterio_evaluacion: string;
      instrumentos_observacion: string;
      insuficiente: string;
      suficiente: string;
      bien: string;
      notable: string;
      sobresaliente: string;
    };
  }
  
  export interface IAdaptacionesDua {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string
    pautas: Pautas
  }

  interface Pautas {
    pauta_1: string
    pauta_2: string
    pauta_3: string
    pauta_4: string
    pauta_5: string
    pauta_6: string
    pauta_7: string
    pauta_8: string
    pauta_9: string
  }

  export interface IProcedicimientosEvalucion {
    unidad_id: number
    unidad_order: number
    libro: Libro
    name: string
    indicadores: Indicadores
    instrumentos: string
  }

  interface Indicadores {
    indicadores_planificacion: string
    indicadores_aprendizaje: string
    indicadores_evaluacion: string
  }