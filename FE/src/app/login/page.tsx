import { GuestOnly } from "../../components/auth/guest-only";
import { LoginPage } from "../../screens/login-page";

export default function Page() {
  return (
    <GuestOnly>
      <LoginPage />
    </GuestOnly>
  );
}
