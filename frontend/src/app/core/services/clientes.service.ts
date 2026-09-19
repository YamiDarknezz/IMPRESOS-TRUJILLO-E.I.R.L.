import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import { Cliente, RespuestaItem, ResumenCliente, TipoCliente } from '../models';

export interface DatosCliente {
  nombre: string;
  tipo: TipoCliente;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
  es_corporativo: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private api = inject(ApiService);
  private lista = new ListaRemota<Cliente>(this.api, '/api/clientes');

  readonly clientes = this.lista.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();

  nombreDe(id: number | null | undefined): string {
    if (!id) return '';
    return this.clientes().find(c => c.id === id)?.nombre ?? '';
  }

  async crear(datos: Partial<DatosCliente> & { nombre: string }): Promise<number> {
    const res = await this.api.post<RespuestaItem<Cliente>>('/api/clientes', datos);
    await this.lista.recargar();
    return res.data.id;
  }

  async actualizar(id: number, datos: DatosCliente): Promise<void> {
    await this.api.patch(`/api/clientes/${id}`, datos);
    await this.lista.recargar();
  }

  /** Marca el cliente como inactivo; sus órdenes se conservan. */
  async desactivar(id: number): Promise<void> {
    await this.api.delete(`/api/clientes/${id}`);
    await this.lista.recargar();
  }

  /** Ficha básica del cliente. */
  async obtenerFicha(id: number): Promise<Cliente> {
    const res = await this.api.get<RespuestaItem<Cliente>>(`/api/clientes/${id}`);
    return res.data;
  }

  /** Facturado y por cobrar del cliente, calculado en el servidor. */
  async obtenerResumen(id: number): Promise<ResumenCliente> {
    const res = await this.api.get<RespuestaItem<ResumenCliente>>(`/api/clientes/${id}/resumen`);
    return res.data;
  }
}

export function filtrarClientes(clientes: Cliente[], texto: string): Cliente[] {
  const termino = texto.toLowerCase().trim();
  if (!termino) return clientes;

  return clientes.filter(c =>
    c.nombre?.toLowerCase().includes(termino) ||
    c.documento?.toLowerCase().includes(termino) ||
    c.telefono?.toLowerCase().includes(termino)
  );
}
