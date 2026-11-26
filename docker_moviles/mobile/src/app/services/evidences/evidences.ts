import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';

export const EVIDENCE_FORMATS = ["jpeg", "jpg", "png", "heic", "heif"] as const;


export interface Evidence {
  id: number;
  workorder_id: number;
  path: string;
  format: string;
  size: string
  created_at: string;
}

export interface EvidenceCreate {
  workorder_id: number;
  path: string;
  format: string;
  size:string
}

@Injectable({ providedIn: 'root' })
export class EvidenceServices {
  private url = environment.apiUrl + '/evidence';

  constructor(private authService:AuthService){}
  private getAuthConfig() {
    const token = this.authService.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private filter(search: string): Record<string, string> {
    const text = search.trim();
    return text ? { filter: JSON.stringify({ _or: [
      { path: { _icontains: text } },
      { format: { _icontains: text } },
    ] }) } : {};
  }

  list(page = 1, perPage = 3, search = ''): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url, {...this.getAuthConfig(),
      params: { page: page, limit: perPage, sort: 'id', ...this.filter(search) }
    })).pipe(map(response => response.data.data));
  }

  listWithOutFilters(): Observable<Evidence[]> {
    return defer(() => axios.get<{ data: Evidence[] }>(this.url,this.getAuthConfig())).pipe(map(response => response.data.data));
  }

  detail(id: number): Observable<Evidence> {
    return defer(() => axios.get<{ data: Evidence }>(this.url + '/' + id,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  create(evidence: EvidenceCreate): Observable<Evidence> {
    return defer(() => axios.post<{ data: Evidence }>(this.url, evidence,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  update(id: number, evidence: EvidenceCreate): Observable<Evidence> {
    return defer(() => axios.patch<{ data: Evidence }>(this.url + '/' + id, evidence,this.getAuthConfig()))
      .pipe(map(response => response.data.data));
  }

  delete(id: number): Observable<void> {
    return defer(() => axios.delete(this.url + '/' + id,this.getAuthConfig())).pipe(map(() => undefined));
  }

  total(search = ''): Observable<number> {
    return defer(() => axios.get<{ data: { count: string | number }[] }>(this.url, {...this.getAuthConfig(),
      params: { 'aggregate[count]': '*', ...this.filter(search) }
    })).pipe(map(response => Number(response.data.data[0]?.count ?? 0)));
  }

  ofWorkorder(id:number): Observable<Evidence[]>{
      return defer(() => axios.get<{ data: Evidence[] }>(`${this.url}?filter[workorder_id][_eq]=${id}`,this.getAuthConfig()))
        .pipe(map(response => response.data.data));
    }

  // Sube la imagen a Directus (/files) y la asocia a la orden como evidencia.
  // `path` guarda el UUID del archivo; el nombre original no se persiste
  // porque la colección no tiene columna para ello.
  //
  // Si la fila de evidencia no se puede crear despues de subir el archivo, se
  // borra SOLO el archivo creado por esta misma operacion para no dejar un
  // huerfano. Nunca se toca un archivo anterior; si el borrado no esta
  // permitido, el mensaje de error incluye el UUID para poder limpiarlo.
  upload(workorderId: number, file: File): Observable<Evidence> {
    const format = EvidenceServices.resolveFormat(file);

    if (!format) {
      return defer(() => {
        throw new Error("Formato no permitido. Usa JPEG, JPG, PNG, HEIC o HEIF.");
      });
    }

    if (!workorderId) {
      return defer(() => {
        throw new Error("La orden de trabajo es requerida.");
      });
    }

    const token = this.authService.getAccessToken();

    if (!token) {
      return defer(() => {
        throw new Error("La sesión expiró. Vuelve a iniciar sesión.");
      });
    }

    return defer(async () => {
      const body = new FormData();

      body.append("file", file);

      const uploaded = await axios.post<{ data: { id: string } }>(
        environment.authUrl + "/files",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fileId = uploaded.data.data.id;

      try {
        const evidence = await axios.post<{ data: Evidence }>(
          this.url,
          {
            workorder_id: workorderId,
            path: fileId,
            format: format,
            size: file.size,
          },
          this.getAuthConfig(),
        );

        return evidence.data.data;
      } catch (error: any) {
        // Solo se limpia cuando Directus respondio rechazando la fila. Ante un
        // error de red la evidencia pudo haberse creado y borrar el archivo
        // dejaria una evidencia sin imagen.
        if (error?.response) {
          await this.removeUploadedFile(fileId, token);
        }

        const detail =
          error?.response?.data?.errors?.[0]?.message ??
          "No se pudo registrar la evidencia.";

        throw new Error(
          `La imagen se subió, pero no se pudo registrar como evidencia ` +
          `(archivo ${fileId}). ${detail}`,
        );
      }
    });
  }

  // Borra unicamente el archivo creado por esta misma operacion fallida.
  // Nunca se llama con ids anteriores. Es best-effort: si el rol no tiene
  // permiso de borrado, el archivo queda identificado en el mensaje de error.
  private async removeUploadedFile(fileId: string, token: string): Promise<void> {
    try {
      await axios.delete(environment.authUrl + "/files/" + fileId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Sin permiso de borrado o sin conexion: se conserva el error original.
    }
  }

  // URL del archivo original almacenado en Directus.
  assetUrl(fileId: string): string {
    return `${environment.authUrl}/assets/${fileId}`;
  }

  // Descarga el archivo como blob autenticado y devuelve un object URL
  // utilizable en <img src>.
  assetObjectUrl(fileId: string): Observable<string> {
    return defer(async () => {
      const response = await axios.get(this.assetUrl(fileId), {
        ...this.getAuthConfig(),
        responseType: "blob",
      });

      return URL.createObjectURL(response.data as Blob);
    });
  }

  static isFileReference(path: string | null | undefined): boolean {
    return !!path && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path);
  }

  static resolveFormat(file: File): string | null {
    const extension = (file.name.split(".").pop() ?? "").toLowerCase();

    if (EVIDENCE_FORMATS.includes(extension as (typeof EVIDENCE_FORMATS)[number])) {
      return extension;
    }

    return null;
  }
}