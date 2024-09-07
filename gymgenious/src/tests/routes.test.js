/* import { getUniqueUserByEmail } from '../firestoreService'; 

jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(() => ({
        currentUser: { uid: 'fake-user-id' }
      }))
    };
});


jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn()
}));

test('debería lanzar un error si el correo no está registrado', async () => {
  getDocs.mockResolvedValueOnce({
    docs: []
  });

  await expect(getUniqueUserByEmail('pepepepe@gmail.com')).rejects.toThrow('No existen usuarios con ese mail');
});
 */