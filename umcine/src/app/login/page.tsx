import { AuthenticatedLayout } from "../../components/layout/authenticated-layout";
import { LoginPage } from "../../screens/auth/login-page";

export default function Page() {
  return <AuthenticatedLayout guestOnly><LoginPage /></AuthenticatedLayout>;
}
