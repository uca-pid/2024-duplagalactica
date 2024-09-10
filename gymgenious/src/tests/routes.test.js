import { getClasses } from '../firestoreService'; 


jest.mock('../firestoreService', () => ({
  getClasses: jest.fn()
}));

describe('getClasses', () => {
  it('should return a list of classes when called', async () => {
    const mockClasses = [
      { name: 'Math 101', date: '2024-09-15T10:00:00Z', permanent: 'Si' },
      { name: 'History 202', date: '2024-09-16T11:00:00Z', permanent: 'No' }
    ];
    getClasses.mockResolvedValue(mockClasses);
    const result = await getClasses();
    expect(result).toEqual(mockClasses);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('name', 'Math 101');
    expect(result[1]).toHaveProperty('date', '2024-09-16T11:00:00Z');
  });

  it('should handle empty response', async () => {
    getClasses.mockResolvedValue([]);
    const result = await getClasses();
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle errors thrown by the API', async () => {
    const errorMessage = 'No se pudo crear la clase';
    getClasses.mockRejectedValue(new Error(errorMessage));
    await expect(getClasses()).rejects.toThrow(errorMessage);
  });
  
});
