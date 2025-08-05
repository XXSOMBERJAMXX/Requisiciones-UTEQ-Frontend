import BaseService from './api/BaseService';

class DepartamentosService extends BaseService {
  constructor() {
    super('/departamentos');
  }

  async getAll(params = {}) {
    try {
      return await this.client.get('departamentos', { params });
    } catch (error) {
      console.error('Error en DepartamentosService.getAll:', error);
      throw error;
    }
  }
}

const departamentosService = new DepartamentosService();
export default departamentosService;
