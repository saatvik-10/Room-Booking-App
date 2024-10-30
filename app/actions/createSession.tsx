'use server';

interface SessionState {
  isAuthenticated: boolean;
}

async function createSession(previousState: SessionState, formData: FormData) {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password) {
    return {
      error: 'Please fill in all fields',
    };
  }

  console.log(email, password);
}

export default createSession;
