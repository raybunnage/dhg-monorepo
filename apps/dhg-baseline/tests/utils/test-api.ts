export type User = {
  id: number;
  name: string;
  email: string;
};

export class TestApi {
  async getUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      { id: 1, name: 'Test User', email: 'test@example.com' },
      { id: 2, name: 'Another User', email: 'another@example.com' }
    ];
  }
}

export const testApi = new TestApi(); 