import { getUniqueUserByEmail } from '../../firestoreService';

jest.mock('../../firestoreService', () => ({
    getUniqueUserByEmail: jest.fn(),
}));

describe('getUniqueUserByEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a user when email matches', async () => {
        const mockEmail = 'test@example.com';
        const mockUser = { id: '123', Mail: mockEmail, name: 'Test User' };
        getUniqueUserByEmail.mockResolvedValue(mockUser);
        const result = await getUniqueUserByEmail(mockEmail);
        expect(result).toEqual(mockUser);
        expect(getUniqueUserByEmail).toHaveBeenCalledWith(mockEmail);
        expect(getUniqueUserByEmail).toHaveBeenCalledTimes(1);
    });
});
