import { Suspense } from "react";
import RegistrationCompleteSection from "./registration-complete-section";

export default async function SignUpCompletePage() {
  return (
    <Suspense>
      <div>
        <RegistrationCompleteSection />
      </div>
    </Suspense>
  );
}
