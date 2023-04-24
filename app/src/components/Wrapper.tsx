import HeaderSection from "./Header";

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderSection />
      <div className="mt-3 flex w-full flex-col items-center justify-center gap-10 p-2">
        {children}
      </div>
    </div>
  );
};
