// actions.ts
import supabase from '@/utils/supabase';

export async function login(formData: FormData, setUser: (user: any) => void) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: loginData, error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
    };
  }

  setUser(loginData.user);
  return {
    success: true,
  };
}

export async function signup(formData: FormData, setUser: (user: any) => void) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  try {
    const { data: signUpData, error } = await supabase.auth.signUp(data);
    if (error) {
      console.error("Signup error:", error.message, error);
      return {
        success: false,
        error: error.message || 'An unknown error occurred',
      };
    }

    setUser(signUpData.user);
    console.log("Signup successful:", signUpData.user);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during signup:", error);
    return {
      success: false,
      error: (error as Error).message || 'An unknown error occurred',
    };
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
    };
  }
  return {
    success: true,
  };
}