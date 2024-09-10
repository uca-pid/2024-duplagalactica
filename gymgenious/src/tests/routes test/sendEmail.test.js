import { sendEmail } from '../../firestoreService';

jest.mock('../../firestoreService', () => ({
    sendEmail: jest.fn()
}));

describe('sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when email is sent successfully', async () => {
    const mockEmail = 'test@example.com';
    sendEmail.mockResolvedValue(true);
    const result = await sendEmail(mockEmail);
    expect(result).toBe(true);
    });
});
