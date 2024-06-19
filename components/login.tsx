import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { login, signup, logout } from "@/app/login/actions";
import { useAuth } from '@/utils/AuthContext';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function LoginDialog() {
  const { user, setUser } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [passwordMismatchError, setPasswordMismatchError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
      resetState();
      router.refresh();
    } else {
      console.error(result.error);
    }
  };

  const resetState = () => {
    setLoginError(null);
    setSignupError(null);
    setPasswordMismatchError(null);
  };

  return (
    <div>
      {user ? (
          <DropdownMenu.DropdownMenu modal={false}>
            <DropdownMenu.DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white bg-card hover:border-primary">{user.email}</Button>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent className="text-white bg-card hover:border-primary">
            <DropdownMenu.DropdownMenuItem>Settings</DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuSeparator />
              <DropdownMenu.DropdownMenuItem onSelect={handleLogout}> 
                Sign Out
              </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
          </DropdownMenu.DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-white bg-card hover:border-primary">
              Login/Signup
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 border-b">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const result = await login(formData, setUser);
                    if (!result.success) {
                      setLoginError(result.error || 'An unknown error occurred');
                    } else {
                      router.refresh();
                    }
                  }}
                  className="space-y-4 py-6"
                >
                  {loginError && <p className="text-red-500">{loginError}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="example@gmail.com" required type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" required type="password" />
                  </div>
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    // Get password and retype-password values
                    const password = formData.get('password') as string;
                    const retypePassword = formData.get('retype-password') as string;

                    // Check if passwords match
                    if (password !== retypePassword) {
                      setPasswordMismatchError("Passwords do not match");
                      return;
                    } else {
                      setPasswordMismatchError(null); // Clear the error message if passwords match
                    }

                    const result = await signup(formData, setUser);
                    if (!result.success) {
                      setSignupError(result.error || 'An unknown error occurred');
                    }
                  }}
                  className="space-y-4 py-6"
                >
                  {signupError && <p className="text-red-500">{signupError}</p>}
                  {passwordMismatchError && <p className="text-red-500">{passwordMismatchError}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="example@gmail.com" required type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" placeholder="" required type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retype-password">Retype Password</Label>
                    <Input id="retype-password" name="retype-password" required type="password" />
                  </div>
                  <Button className="w-full" type="submit">
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}