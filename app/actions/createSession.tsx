'use server';

interface SessionState {
  isAuthenticated: boolean;
}

async function createSession(previousState: SessionState, formData: FormData) {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  console.log(email, password);
}

export default createSession;
