interface Props {
  title: string;
}

const Header = ({ title }: Props) => {
  return (
    <div className="w-full bg-slate-50 p-8 my-2">
      <div className="container mx-auto max-w-7xl">
        <h1 className=" font-bold text-4xl">{title}</h1>
      </div>
    </div>
  );
};

export default Header;
