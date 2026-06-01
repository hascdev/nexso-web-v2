export type CompraAgilEstado = {
  id_estado: number;
  codigo: string;
  glosa: string;
};

export type CompraAgilItem = {
  codigo: string;
  nombre: string;
  estado: CompraAgilEstado;
  fechas: {
    fecha_publicacion: string;
    fecha_cierre: string;
    fecha_ultimo_cambio: string;
    fecha_cierre_primer_llamado: string | null;
    fecha_cierre_segundo_llamado: string | null;
  };
  montos: {
    moneda: string;
    monto_disponible: number;
    monto_disponible_clp: number;
  };
  institucion: {
    organismo_comprador: string;
    rut: string;
    unidad_compra: string;
    region: number;
    nombre_region: string;
  };
  links: {
    detalle: string;
  };
};

export type CompraAgilPaginacion = {
  total_paginas: number;
  numero_pagina: number;
  tamano_pagina: number;
  total_resultados: number;
};

export type CompraAgilApiResponse = {
  success: string;
  trace: unknown;
  payload: {
    items: CompraAgilItem[];
    paginacion: CompraAgilPaginacion;
  } | null;
  errors: unknown;
};
