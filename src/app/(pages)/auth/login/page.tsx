import LoginForm from "@/components/LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = ({ searchParams }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col p-4 shadow-lg w-4/12">
        <h1 className="font-bold text-3xl my-10 text-center">Log In</h1>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
};

export default LoginPage;
