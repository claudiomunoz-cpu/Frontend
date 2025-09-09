# 🔄 Cambios Frontend - Nuevos Endpoints Cursos y Documentos

## 📋 Resumen
El backend ha implementado nuevos endpoints para cursos y documentos. Este documento detalla los cambios necesarios en el frontend para adaptarse a la nueva estructura.

## 🎯 Cambios Principales

### 1. **Estructura de Cursos**
- **Antes**: Usaba `personal_id` 
- **Ahora**: Usa `rut_persona` directamente
- **Endpoints**: `/api/cursos` (sin cambios en URLs)

### 2. **Nuevos Endpoints de Documentos**
- **Base**: `/api/documentos`
- **Funcionalidades**: Subir, descargar, ver, eliminar documentos
- **Asociación**: Directa al RUT de la persona

## 🔧 Cambios Técnicos Requeridos

### **1. Tipos TypeScript** (`src/types/index.ts`)

```typescript
// Agregar después de línea 93
export interface Documento {
  id: number;
  rut_persona: string;
  nombre_archivo: string;
  tipo_documento: string;
  descripcion?: string;
  fecha_subida: string;
  fecha_vencimiento?: string;
  activo: boolean;
  personal?: {
    id: string;
    nombre: string;
    apellido: string;
    rut: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentoData {
  rut_persona: string;
  nombre_archivo: string;
  tipo_documento: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  archivo: File;
}

// Actualizar CreateCursoData
export interface CreateCursoData {
  rut_persona: string; // CAMBIO: era personal_id
  nombre_curso: string;
  fecha_obtencion: string;
  // ... resto igual
}
```

### **2. Servicios API** (`src/services/api.ts`)

```typescript
// Agregar métodos para documentos
async getDocumentos(filters?: { rut?: string; tipo?: string; limit?: number; offset?: number }): Promise<ApiResponse<Documento[]>>
async getDocumentosByRut(rut: string): Promise<ApiResponse<Documento[]>>
async uploadDocumento(rut: string, documentoData: FormData): Promise<ApiResponse<Documento>>
async downloadDocumento(id: number): Promise<Blob>
async deleteDocumento(id: number): Promise<ApiResponse<void>>

// Actualizar createCurso para usar rut_persona
async createCurso(cursoData: CreateCursoData): Promise<ApiResponse<Curso>>
```

### **3. Nuevos Hooks** (`src/hooks/useDocumentos.ts`)

```typescript
// Crear archivo nuevo
export const useDocumentos = (filters?) => useQuery(...)
export const useDocumentosByRut = (rut: string) => useQuery(...)
export const useUploadDocumento = () => useMutation(...)
export const useDeleteDocumento = () => useMutation(...)
```

### **4. Componentes**

#### **CursoModal.tsx** - Cambio menor
```typescript
// Línea ~80: Cambiar personal_id por rut_persona
const cursoData: CreateCursoData = {
  rut_persona: rutPersona, // ERA: personal_id: personalId
  // ... resto igual
};
```

#### **Nuevo: DocumentoModal.tsx**
```typescript
// Crear componente para subir documentos
// - Formulario con campos: nombre, tipo, descripción, fecha vencimiento
// - Upload de archivo (máx 50MB)
// - Validaciones
```

#### **PersonalDetailModal.tsx** - Agregar pestañas
```typescript
// Agregar estado para pestañas
const [activeTab, setActiveTab] = useState<'info' | 'cursos' | 'documentos'>('info');

// Agregar navegación por pestañas
// Agregar componentes: CursosTab, DocumentosTab
```

### **5. Nuevos Componentes Requeridos**

- **`DocumentoModal.tsx`** - Modal para subir documentos
- **`DocumentosTab.tsx`** - Pestaña de documentos en PersonalDetailModal
- **`DocumentoCard.tsx`** - Tarjeta para mostrar documento individual
- **`CursosTab.tsx`** - Pestaña de cursos (refactorizar existente)

## 📁 Archivos a Modificar

### **Modificar Existentes:**
- `src/types/index.ts` - Agregar tipos Documento
- `src/services/api.ts` - Agregar métodos documentos
- `src/hooks/useCursos.ts` - Actualizar para rut_persona
- `src/components/personal/CursoModal.tsx` - Cambiar personal_id por rut_persona
- `src/components/personal/PersonalDetailModal.tsx` - Agregar pestañas

### **Crear Nuevos:**
- `src/hooks/useDocumentos.ts`
- `src/components/personal/DocumentoModal.tsx`
- `src/components/personal/DocumentosTab.tsx`
- `src/components/personal/DocumentoCard.tsx`
- `src/components/personal/CursosTab.tsx`

## 🚀 Orden de Implementación

1. **Tipos** - Actualizar interfaces
2. **Servicios** - Agregar métodos API
3. **Hooks** - Crear useDocumentos
4. **Componentes** - Crear modales y pestañas
5. **Integración** - Conectar todo en PersonalDetailModal
6. **Testing** - Probar funcionalidades

## ⚠️ Consideraciones

- **Archivos**: Límite 50MB por documento
- **Tipos**: Categorizar documentos (certificado, licencia, etc.)
- **Eliminación**: Lógica (no física) en backend
- **Performance**: Índices optimizados en backend
- **UX**: Mostrar progreso de upload, validaciones en tiempo real

## 📊 Impacto

- **Bajo**: Cambios en cursos (solo personal_id → rut_persona)
- **Medio**: Nuevos componentes para documentos
- **Alto**: Nueva funcionalidad completa de gestión de documentos

---

**Tiempo estimado**: 4-6 horas de desarrollo
**Prioridad**: Media (funcionalidad nueva, no crítica)
