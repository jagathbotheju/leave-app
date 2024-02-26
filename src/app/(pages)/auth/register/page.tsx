import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col p-4 shadow-lg w-4/12">
        <h1 className="font-bold text-3xl my-10 text-center">Log In</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
