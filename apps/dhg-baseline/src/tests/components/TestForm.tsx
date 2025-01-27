type FormData = {
  username: string;
  email: string;
};

type TestFormProps = {
  onSubmit: (data: FormData) => void;
  initialValues?: Partial<FormData>;
};

export const TestForm = ({ onSubmit, initialValues = {} }: TestFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    
    // Validate required fields
    if (!username || !email) {
      return;
    }
    
    onSubmit({
      username,
      email
    });
  };

  return (
    <form onSubmit={handleSubmit} role="form">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={initialValues.username}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={initialValues.email}
          required
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}; 