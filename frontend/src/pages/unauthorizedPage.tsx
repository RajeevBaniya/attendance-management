import { Card } from "../components/ui/card";

const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-5 sm:p-8">
        <h1 className="section-title">Unauthorized</h1>
        <p className="muted-text mt-2">
          We could not verify your backend access. Please sign in again or contact support.
        </p>
      </Card>
    </main>
  );
};

export { UnauthorizedPage };
