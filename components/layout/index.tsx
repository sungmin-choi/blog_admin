import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import React, { ComponentPropsWithoutRef } from 'react';
import SEO from '../sections/seo';

interface IMainLayout extends ComponentPropsWithoutRef<'div'> {}

const MainLayout: React.FC<IMainLayout> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-grow w-[100%] justify-center ">
          <SEO />
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
