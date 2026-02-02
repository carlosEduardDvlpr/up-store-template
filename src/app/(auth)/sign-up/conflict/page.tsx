import { Suspense } from "react";
import AccountExistsSection from "./sign-up-conflict-section";

export default async function SignUpConflictPage() {
  return (
    <div>
      <Suspense>
        <AccountExistsSection />
      </Suspense>
    </div>
  );
}
