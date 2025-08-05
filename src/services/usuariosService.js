import BaseService from './api/BaseService';

class UsuariosService extends BaseService {
  constructor() {
    super('/usuarios');
  }

  async getAll(params = {}) {
    try {
      return await this.client.get('/usuarios', { params }); // ✅ Usar `this.client`
    } catch (error) {
      console.error('Error en UsuariosService.getAll:', error);
      throw error;
    }
  }
  async getByIdUs(userData) {
    return this.client.get(`/usuarios${id}`, userData);
  }
  async create(userData) {
    return this.client.post('/usuarios', userData);
  }


  async update(id, userData) {
    return this.client.put(`/usuarios/${id}`, userData);
  }

  async delete(id) {
    return this.client.delete(`/usuarios/${id}`);
  }

  async getDepartamentos() {
    return this.client.get('/usuarios/departamentos');
  }
}

const usuariosService = new UsuariosService();
export default usuariosService;
